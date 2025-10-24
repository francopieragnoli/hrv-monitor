interface ConnectionButtonProps {
  isConnected: boolean;
  isConnecting: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  deviceName?: string | null;
}

export default function ConnectionButton({
  isConnected,
  isConnecting,
  onConnect,
  onDisconnect,
  deviceName,
}: ConnectionButtonProps) {
  const getButtonText = () => {
    if (isConnecting) return 'Connecting...';
    if (isConnected) return deviceName ? `Connected to ${deviceName}` : 'Connected';
    return 'Connect Heart Rate Monitor';
  };

  const getButtonColor = () => {
    if (isConnected) return 'bg-green-600 hover:bg-green-700';
    if (isConnecting) return 'bg-yellow-600 hover:bg-yellow-700';
    return 'bg-blue-600 hover:bg-blue-700';
  };

  return (
    <button
      onClick={isConnected ? onDisconnect : onConnect}
      disabled={isConnecting}
      className={`${getButtonColor()} text-white font-bold py-4 px-8 rounded-xl
                  transition-all duration-300 transform hover:scale-105 hover:shadow-lg
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                  flex items-center gap-3 text-lg md:text-xl`}
    >
      {isConnecting && (
        <svg
          className="animate-spin h-6 w-6 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {isConnected && !isConnecting && (
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
          </span>
        </div>
      )}
      {!isConnected && !isConnecting && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
          />
        </svg>
      )}
      <span>{getButtonText()}</span>
    </button>
  );
}
