interface StatusIndicatorProps {
  isConnected: boolean;
  deviceName?: string | null;
}

export default function StatusIndicator({ isConnected, deviceName }: StatusIndicatorProps) {
  return (
    <div
      className={`flex items-center gap-3 px-6 py-3 rounded-xl border-2 transition-all duration-300 ${
        isConnected
          ? 'bg-green-500/10 border-green-500/30 text-green-400'
          : 'bg-red-500/10 border-red-500/30 text-red-400'
      }`}
    >
      <div className="relative flex items-center justify-center">
        {isConnected && (
          <span className="animate-ping absolute inline-flex h-4 w-4 rounded-full bg-green-400 opacity-75" />
        )}
        <span
          className={`relative inline-flex rounded-full h-4 w-4 ${
            isConnected ? 'bg-green-500' : 'bg-red-500'
          }`}
        />
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-semibold">
          {isConnected ? 'Connected' : 'Disconnected'}
        </span>
        {deviceName && isConnected && (
          <span className="text-xs opacity-70">{deviceName}</span>
        )}
      </div>
    </div>
  );
}
