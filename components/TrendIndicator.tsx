interface TrendIndicatorProps {
  trend: 'declining' | 'stable' | 'improving';
  size?: 'small' | 'medium';
}

export default function TrendIndicator({ trend, size = 'small' }: TrendIndicatorProps) {
  const sizeClass = size === 'small' ? 'w-4 h-4' : 'w-6 h-6';

  if (trend === 'stable') {
    return (
      <div className="flex items-center gap-1 text-gray-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className={sizeClass}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
        </svg>
        <span className="text-xs">Stable</span>
      </div>
    );
  }

  if (trend === 'improving') {
    return (
      <div className="flex items-center gap-1 text-green-400 animate-pulse">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className={sizeClass}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
        </svg>
        <span className="text-xs font-semibold">Improving</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 text-red-400 animate-pulse">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className={sizeClass}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
      </svg>
      <span className="text-xs font-semibold">Declining</span>
    </div>
  );
}
