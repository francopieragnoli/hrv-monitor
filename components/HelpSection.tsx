'use client';

import { useState } from 'react';

export default function HelpSection() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-2 border-slate-700/30
                    rounded-2xl p-6 md:p-8 backdrop-blur-sm">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6 text-blue-400"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
            />
          </svg>
          <h3 className="text-gray-300 font-semibold text-lg">
            How to Use & HRV Information
          </h3>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
            isExpanded ? 'rotate-180' : ''
          }`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {isExpanded && (
        <div className="mt-6 space-y-6 text-gray-300 animate-in slide-in-from-top duration-300">
          <div>
            <h4 className="font-semibold text-blue-400 mb-2">Getting Started</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Turn on your Bluetooth heart rate monitor and ensure it's in pairing mode</li>
              <li>Click the "Connect Heart Rate Monitor" button above</li>
              <li>Select your device from the browser's Bluetooth pairing dialog</li>
              <li>Wait for the connection to establish - metrics will start appearing</li>
            </ol>
          </div>

          <div>
            <h4 className="font-semibold text-blue-400 mb-2">Understanding HRV Metrics</h4>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-medium text-green-400">RMSSD (Root Mean Square of Successive Differences)</p>
                <p className="text-gray-400 mt-1">
                  Measures short-term heart rate variability. Higher values typically indicate better cardiovascular fitness
                  and recovery. Normal range: 20-80 ms.
                </p>
              </div>

              <div>
                <p className="font-medium text-purple-400">SDNN (Standard Deviation of NN Intervals)</p>
                <p className="text-gray-400 mt-1">
                  Reflects overall heart rate variability. Higher values suggest better adaptability to stress.
                  Normal range: 40-100 ms.
                </p>
              </div>

              <div>
                <p className="font-medium text-red-400">Heart Rate (BPM)</p>
                <p className="text-gray-400 mt-1">
                  Current heart rate in beats per minute. Resting heart rate typically ranges from 60-100 BPM.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-blue-400 mb-2">Browser Compatibility</h4>
            <p className="text-sm text-gray-400">
              This application requires Web Bluetooth API support. Compatible browsers include:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-400 mt-2">
              <li>Chrome 56+ (desktop and Android)</li>
              <li>Edge 79+</li>
              <li>Opera 43+</li>
            </ul>
            <p className="text-sm text-gray-400 mt-2">
              Note: Safari and Firefox do not currently support Web Bluetooth.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-blue-400 mb-2">Troubleshooting</h4>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-400">
              <li>Ensure your device's Bluetooth is enabled</li>
              <li>Check that your heart rate monitor is charged and turned on</li>
              <li>Make sure you're accessing the site via HTTPS (required for Web Bluetooth)</li>
              <li>Try refreshing the page and reconnecting</li>
              <li>Some devices may need to be unpaired from your OS settings first</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
