'use client';

import { useState, useEffect, useCallback } from 'react';
import { useHeartRate } from '@/hooks/useHeartRate';
import { calculateHRVMetrics, filterOutliers, keepRecentIntervals } from '@/utils/hrvCalculations';
import { interpretHRVMetrics, detectTrend } from '@/utils/hrvInterpretation';
import MetricCard from '@/components/MetricCard';
import ConnectionButton from '@/components/ConnectionButton';
import HeartRateGraph from '@/components/HeartRateGraph';
import StatusIndicator from '@/components/StatusIndicator';
import ErrorAlert from '@/components/ErrorAlert';
import HelpSection from '@/components/HelpSection';
import InterpretationPanel from '@/components/InterpretationPanel';

export default function Home() {
  const { isConnected, isConnecting, heartRateData, error, connect, disconnect, deviceName } =
    useHeartRate();

  const [rrIntervalHistory, setRRIntervalHistory] = useState<
    Array<{ value: number; timestamp: number }>
  >([]);
  const [currentHR, setCurrentHR] = useState<number>(0);
  const [sdnn, setSDNN] = useState<number>(0);
  const [rmssd, setRMSSD] = useState<number>(0);

  // Track metric history for trend detection (store last 10 readings)
  const [rmssdHistory, setRMSSDHistory] = useState<number[]>([]);
  const [sdnnHistory, setSDNNHistory] = useState<number[]>([]);
  const [hrHistory, setHRHistory] = useState<number[]>([]);

  // Process incoming heart rate data
  useEffect(() => {
    if (!heartRateData) return;

    // Update current heart rate
    setCurrentHR(heartRateData.heartRate);

    // Add new RR intervals to history
    if (heartRateData.rrIntervals.length > 0) {
      setRRIntervalHistory((prev) => {
        const newIntervals = heartRateData.rrIntervals.map((value) => ({
          value,
          timestamp: heartRateData.timestamp,
        }));

        const updated = [...prev, ...newIntervals];
        // Keep only last 60 seconds of data
        return keepRecentIntervals(updated, 60000);
      });
    }
  }, [heartRateData]);

  // Calculate HRV metrics whenever interval history changes
  useEffect(() => {
    if (rrIntervalHistory.length < 2) {
      setSDNN(0);
      setRMSSD(0);
      return;
    }

    // Extract values and filter outliers
    const values = rrIntervalHistory.map((item) => item.value);
    const filteredValues = filterOutliers(values);

    if (filteredValues.length >= 2) {
      const metrics = calculateHRVMetrics(filteredValues);
      setSDNN(metrics.sdnn);
      setRMSSD(metrics.rmssd);

      // Update history for trend tracking (keep last 10 readings)
      if (metrics.rmssd > 0) {
        setRMSSDHistory((prev) => [...prev, metrics.rmssd].slice(-10));
      }
      if (metrics.sdnn > 0) {
        setSDNNHistory((prev) => [...prev, metrics.sdnn].slice(-10));
      }
    }
  }, [rrIntervalHistory]);

  // Update heart rate history
  useEffect(() => {
    if (currentHR > 0) {
      setHRHistory((prev) => [...prev, currentHR].slice(-10));
    }
  }, [currentHR]);

  const handleConnect = useCallback(async () => {
    // Clear previous data when connecting
    setRRIntervalHistory([]);
    setCurrentHR(0);
    setSDNN(0);
    setRMSSD(0);
    setRMSSDHistory([]);
    setSDNNHistory([]);
    setHRHistory([]);
    await connect();
  }, [connect]);

  const handleDisconnect = useCallback(() => {
    disconnect();
    // Optionally clear data on disconnect
    // setRRIntervalHistory([]);
    // setCurrentHR(0);
    // setSDNN(0);
    // setRMSSD(0);
  }, [disconnect]);

  // Calculate trends
  const rmssdTrend = detectTrend(rmssdHistory);
  const sdnnTrend = detectTrend(sdnnHistory);
  const hrTrend = detectTrend(hrHistory);

  // Get combined interpretation
  const interpretation = interpretHRVMetrics(rmssd, sdnn, currentHR, rmssdHistory);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
                HRV Monitor
              </h1>
              <p className="text-gray-400 text-sm md:text-base">
                Real-time Heart Rate Variability Analysis
              </p>
            </div>
            <StatusIndicator isConnected={isConnected} deviceName={deviceName} />
          </div>

          {/* Connection Button */}
          <div className="flex justify-center md:justify-start">
            <ConnectionButton
              isConnected={isConnected}
              isConnecting={isConnecting}
              onConnect={handleConnect}
              onDisconnect={handleDisconnect}
              deviceName={deviceName}
            />
          </div>
        </div>

        {/* Error Alert */}
        {error && <div className="mb-6"><ErrorAlert error={error} /></div>}

        {/* Combined Interpretation Panel */}
        {isConnected && (
          <div className="mb-8">
            <InterpretationPanel interpretation={interpretation} />
          </div>
        )}

        {/* Main Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <MetricCard
            label="HRV (RMSSD)"
            value={rmssd}
            unit="ms"
            size="large"
            color="green"
            description="Short-term heart rate variability"
            trend={rmssdHistory.length >= 5 ? rmssdTrend : undefined}
          />
          <MetricCard
            label="Heart Rate"
            value={currentHR}
            unit="BPM"
            size="large"
            color="red"
            description="Current heart rate"
            trend={hrHistory.length >= 5 ? hrTrend : undefined}
          />
          <MetricCard
            label="SDNN"
            value={sdnn}
            unit="ms"
            size="medium"
            color="purple"
            description="Overall HRV measure"
            trend={sdnnHistory.length >= 5 ? sdnnTrend : undefined}
          />
        </div>

        {/* Graph Section */}
        <div className="mb-8">
          <HeartRateGraph rrIntervals={rrIntervalHistory} maxPoints={60} />
        </div>

        {/* Additional Stats */}
        {isConnected && rrIntervalHistory.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-gray-400 text-xs uppercase mb-1">Data Points</p>
              <p className="text-2xl font-bold text-blue-400">{rrIntervalHistory.length}</p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-gray-400 text-xs uppercase mb-1">Recording Time</p>
              <p className="text-2xl font-bold text-blue-400">
                {Math.floor((Date.now() - (rrIntervalHistory[0]?.timestamp || Date.now())) / 1000)}s
              </p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-gray-400 text-xs uppercase mb-1">Min RR</p>
              <p className="text-2xl font-bold text-green-400">
                {Math.min(...rrIntervalHistory.map((r) => r.value)).toFixed(0)}ms
              </p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-gray-400 text-xs uppercase mb-1">Max RR</p>
              <p className="text-2xl font-bold text-purple-400">
                {Math.max(...rrIntervalHistory.map((r) => r.value)).toFixed(0)}ms
              </p>
            </div>
          </div>
        )}

        {/* Help Section */}
        <HelpSection />

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-slate-800">
          <div className="text-center text-gray-500 text-sm">
            <p className="mb-2">
              Built with Next.js, React, and Web Bluetooth API
            </p>
            <p className="text-xs">
              This app requires a Bluetooth heart rate monitor compatible with the Heart Rate Service (0x180D)
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}
