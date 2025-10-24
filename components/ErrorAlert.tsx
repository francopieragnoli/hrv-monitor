interface ErrorAlertProps {
  error: string | null;
  onDismiss?: () => void;
}

export default function ErrorAlert({ error, onDismiss }: ErrorAlertProps) {
  if (!error) return null;

  return (
    <div className="bg-red-500/10 border-2 border-red-500/30 rounded-xl p-4 md:p-6 backdrop-blur-sm
                    animate-in slide-in-from-top duration-300">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6 text-red-400"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-red-400 font-semibold mb-1">Connection Error</h3>
          <p className="text-red-300 text-sm">{error}</p>
          <div className="mt-3 text-xs text-red-400/70">
            <p>Make sure:</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Your device has Bluetooth enabled</li>
              <li>Your heart rate monitor is turned on and in pairing mode</li>
              <li>You're using a browser that supports Web Bluetooth (Chrome, Edge)</li>
              <li>The website is accessed via HTTPS</li>
            </ul>
          </div>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="flex-shrink-0 text-red-400 hover:text-red-300 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
