'use client';

import { useEffect, useRef } from 'react';

interface HeartRateGraphProps {
  rrIntervals: Array<{ value: number; timestamp: number }>;
  maxPoints?: number;
}

export default function HeartRateGraph({ rrIntervals, maxPoints = 60 }: HeartRateGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size based on container
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const width = rect.width;
    const height = rect.height;

    // Clear canvas
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    if (rrIntervals.length < 2) {
      // Draw "No Data" message
      ctx.fillStyle = '#64748b';
      ctx.font = '16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Waiting for heart rate data...', width / 2, height / 2);
      return;
    }

    // Get last N points
    const dataPoints = rrIntervals.slice(-maxPoints);

    // Find min and max for scaling
    const values = dataPoints.map(d => d.value);
    const minRR = Math.min(...values) * 0.9; // Add 10% margin
    const maxRR = Math.max(...values) * 1.1;
    const range = maxRR - minRR;

    // Draw grid lines
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = (height / 5) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw y-axis labels
    ctx.fillStyle = '#64748b';
    ctx.font = '12px monospace';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const value = maxRR - (range / 5) * i;
      const y = (height / 5) * i;
      ctx.fillText(`${value.toFixed(0)}ms`, width - 10, y + 4);
    }

    // Draw the line graph
    const xStep = width / (maxPoints - 1);

    if (dataPoints.length > 1) {

      // Draw area under the curve
      ctx.beginPath();
      ctx.moveTo(0, height);

      dataPoints.forEach((point, index) => {
        const x = index * xStep;
        const normalizedValue = (point.value - minRR) / range;
        const y = height - normalizedValue * height;
        if (index === 0) {
          ctx.lineTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.lineTo((dataPoints.length - 1) * xStep, height);
      ctx.closePath();

      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, 'rgba(59, 130, 246, 0.3)');
      gradient.addColorStop(1, 'rgba(59, 130, 246, 0.05)');
      ctx.fillStyle = gradient;
      ctx.fill();

      // Draw the line
      ctx.beginPath();
      dataPoints.forEach((point, index) => {
        const x = index * xStep;
        const normalizedValue = (point.value - minRR) / range;
        const y = height - normalizedValue * height;

        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw points
      dataPoints.forEach((point, index) => {
        const x = index * xStep;
        const normalizedValue = (point.value - minRR) / range;
        const y = height - normalizedValue * height;

        ctx.beginPath();
        ctx.arc(x, y, 3, 0, 2 * Math.PI);
        ctx.fillStyle = '#60a5fa';
        ctx.fill();
        ctx.strokeStyle = '#1e40af';
        ctx.lineWidth = 1;
        ctx.stroke();
      });
    }

    // Draw current value indicator
    if (dataPoints.length > 0) {
      const lastPoint = dataPoints[dataPoints.length - 1];
      const x = (dataPoints.length - 1) * xStep;
      const normalizedValue = (lastPoint.value - minRR) / range;
      const y = height - normalizedValue * height;

      // Pulsing circle
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, 2 * Math.PI);
      ctx.fillStyle = '#3b82f6';
      ctx.fill();
      ctx.strokeStyle = '#60a5fa';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }, [rrIntervals, maxPoints]);

  return (
    <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-2 border-slate-700/30
                    rounded-2xl p-6 md:p-8 backdrop-blur-sm">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-gray-400 text-sm md:text-base lg:text-lg font-semibold uppercase tracking-wider">
            RR Interval Variability
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
            <span>Live</span>
          </div>
        </div>
        <div className="relative w-full" style={{ height: '300px' }}>
          <canvas
            ref={canvasRef}
            className="w-full h-full"
            style={{ width: '100%', height: '300px' }}
          />
        </div>
        <div className="text-xs text-gray-500 text-center">
          Showing last {maxPoints} heartbeats • RR intervals in milliseconds
        </div>
      </div>
    </div>
  );
}
