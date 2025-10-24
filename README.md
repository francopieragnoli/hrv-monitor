# HRV Monitor - Real-time Heart Rate Variability Analysis

A modern, responsive web application for monitoring Heart Rate Variability (HRV) in real-time using Bluetooth heart rate monitors. Built with Next.js, React, TypeScript, and the Web Bluetooth API.

![HRV Monitor](https://img.shields.io/badge/Next.js-14-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8)

## Features

### Bluetooth Connectivity
- **Web Bluetooth API Integration**: Seamlessly connect to BLE heart rate monitors
- **Auto-discovery**: Automatically finds compatible devices with Heart Rate Service (0x180D)
- **Connection Management**: Easy connect/disconnect with visual status indicators
- **Real-time Data Streaming**: Continuous RR interval capture from your heart rate monitor

### HRV Metrics Calculation
- **RMSSD (Root Mean Square of Successive Differences)**: Measures short-term HRV
- **SDNN (Standard Deviation of NN Intervals)**: Reflects overall HRV
- **Heart Rate (BPM)**: Real-time heart rate monitoring
- **Outlier Filtering**: Automatic detection and removal of measurement artifacts

### 🎯 Combined Interpretation (NEW!)
- **Intelligent Pattern Recognition**: Analyzes RMSSD, SDNN, and HR together for comprehensive health insights
- **Six Health Statuses**: Optimal, Good, Fair, Stressed, Fatigued, Overtraining
- **Trend Detection**: Tracks metric history to identify improving, declining, or stable patterns
- **Actionable Recommendations**: Personalized advice for training, recovery, and stress management
- **Early Warning System**: Detects overtraining before physical symptoms appear
- **Severity Indicators**: Visual 1-5 scale showing concern level

**Key Pattern Detection:**
- Low RMSSD + High HR + Low SDNN = **High Stress** - Rest needed
- High RMSSD + Normal/Low HR + High SDNN = **Optimal Recovery** - Ready for training
- Progressive RMSSD decline = **Overtraining Warning** - Early intervention required

### Visual Interface
- **Large, Readable Fonts**: Metrics displayed with 48px-96px font sizes for easy viewing
- **High Contrast Design**: Dark theme optimized for visibility
- **Real-time Visualization**: Live graph showing RR interval variability
- **Animated Metrics**: Smooth transitions for value updates
- **Status Indicators**: Visual feedback for connection status

### Responsive Design
- **Mobile-First**: Optimized for smartphones and tablets
- **Desktop Support**: Scales beautifully on larger screens
- **Adaptive Layout**: Maintains readability across all device sizes

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **API**: Web Bluetooth API
- **Rendering**: Canvas API for graphs

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Bluetooth Low Energy (BLE) heart rate monitor compatible with Heart Rate Service (0x180D)
- A compatible browser (Chrome 56+, Edge 79+, Opera 43+)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/hrv-monitor.git
cd hrv-monitor
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## Usage

1. **Turn on your heart rate monitor** and ensure it's in pairing mode
2. **Click "Connect Heart Rate Monitor"** button
3. **Select your device** from the browser's Bluetooth pairing dialog
4. **Wait for connection** - metrics will start appearing once data flows
5. **Monitor your HRV** - watch real-time updates of RMSSD, SDNN, and heart rate

## Browser Compatibility

| Browser | Version | Support |
|---------|---------|---------|
| Chrome  | 56+     | ✅ Full Support |
| Edge    | 79+     | ✅ Full Support |
| Opera   | 43+     | ✅ Full Support |
| Safari  | All     | ❌ No Web Bluetooth |
| Firefox | All     | ❌ No Web Bluetooth |

**Important**: The application must be served over HTTPS (except on localhost) for Web Bluetooth to work.

## Understanding HRV Metrics

### RMSSD (Root Mean Square of Successive Differences)
- **What it measures**: Short-term heart rate variability
- **Normal range**: 20-80 ms
- **Higher values indicate**: Better cardiovascular fitness and recovery
- **Best for**: Tracking daily recovery and stress levels

### SDNN (Standard Deviation of NN Intervals)
- **What it measures**: Overall heart rate variability
- **Normal range**: 40-100 ms
- **Higher values indicate**: Better adaptability to stress
- **Best for**: Long-term health monitoring

### Heart Rate (BPM)
- **What it measures**: Current heart rate in beats per minute
- **Resting range**: 60-100 BPM
- **Athlete range**: 40-60 BPM

## Project Structure

```
hrv-monitor/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main HRV monitoring page
│   └── globals.css         # Global styles
├── components/
│   ├── ConnectionButton.tsx       # Bluetooth connection control
│   ├── ErrorAlert.tsx             # Error display component
│   ├── HeartRateGraph.tsx         # Real-time graph visualization
│   ├── HelpSection.tsx            # Help and instructions
│   ├── InterpretationPanel.tsx    # Combined HRV interpretation (NEW!)
│   ├── MetricCard.tsx             # Individual metric display
│   ├── StatusIndicator.tsx        # Connection status display
│   └── TrendIndicator.tsx         # Metric trend arrows (NEW!)
├── hooks/
│   └── useHeartRate.ts            # Custom hook for Bluetooth connection
├── utils/
│   ├── hrvCalculations.ts         # HRV metric calculations
│   └── hrvInterpretation.ts       # Combined interpretation logic (NEW!)
└── README.md
```

## API Reference

### `useHeartRate` Hook

Custom React hook for managing Bluetooth heart rate monitor connections.

```typescript
const {
  isConnected,      // boolean - Connection status
  isConnecting,     // boolean - Connection in progress
  heartRateData,    // HeartRateData | null - Latest heart rate data
  error,            // string | null - Error message
  connect,          // () => Promise<void> - Connect to device
  disconnect,       // () => void - Disconnect from device
  deviceName        // string | null - Connected device name
} = useHeartRate();
```

### HRV Calculation Functions

```typescript
// Calculate all HRV metrics at once
calculateHRVMetrics(rrIntervals: number[]): HRVMetrics

// Individual metric calculations
calculateSDNN(rrIntervals: number[]): number
calculateRMSSD(rrIntervals: number[]): number
calculateMeanHR(rrIntervals: number[]): number

// Data filtering
filterOutliers(rrIntervals: number[]): number[]
keepRecentIntervals(intervals: Array<{value: number, timestamp: number}>, maxAgeMs?: number)
```

## Troubleshooting

### Device Not Found
- Ensure Bluetooth is enabled on your computer/phone
- Make sure your heart rate monitor is turned on and in pairing mode
- Try moving the device closer to your computer

### Connection Fails
- Check that your browser supports Web Bluetooth
- Ensure you're using HTTPS (required for Web Bluetooth)
- Try unpairing the device from your OS Bluetooth settings first

### No Data Appearing
- Verify your device supports Heart Rate Service (0x180D)
- Check that the device is properly worn and detecting your heart rate
- Try disconnecting and reconnecting

### Graph Not Updating
- Ensure your heart rate monitor is transmitting RR intervals (not all devices do)
- Check browser console for errors
- Refresh the page and try reconnecting

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Uses [Web Bluetooth API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Disclaimer

This application is for educational and informational purposes only. It is not a medical device and should not be used for medical diagnosis or treatment. Always consult with healthcare professionals for medical advice.
