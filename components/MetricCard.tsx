interface MetricCardProps {
  label: string;
  value: number | string;
  unit: string;
  description?: string;
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

export default function MetricCard({
  label,
  value,
  unit,
  description,
  size = 'medium',
  color = 'blue',
}: MetricCardProps) {
  const getSizeClasses = () => {
    switch (size) {
      case 'large':
        return 'text-7xl md:text-8xl lg:text-9xl';
      case 'medium':
        return 'text-5xl md:text-6xl lg:text-7xl';
      case 'small':
        return 'text-4xl md:text-5xl lg:text-6xl';
    }
  };

  const getColorClasses = () => {
    switch (color) {
      case 'blue':
        return 'from-blue-500/20 to-blue-600/20 border-blue-500/30';
      case 'green':
        return 'from-green-500/20 to-green-600/20 border-green-500/30';
      case 'purple':
        return 'from-purple-500/20 to-purple-600/20 border-purple-500/30';
      case 'red':
        return 'from-red-500/20 to-red-600/20 border-red-500/30';
      default:
        return 'from-blue-500/20 to-blue-600/20 border-blue-500/30';
    }
  };

  const getTextColor = () => {
    switch (color) {
      case 'blue':
        return 'text-blue-400';
      case 'green':
        return 'text-green-400';
      case 'purple':
        return 'text-purple-400';
      case 'red':
        return 'text-red-400';
      default:
        return 'text-blue-400';
    }
  };

  const displayValue = typeof value === 'number' ? value.toFixed(1) : value;

  return (
    <div
      className={`bg-gradient-to-br ${getColorClasses()} border-2 rounded-2xl p-6 md:p-8 lg:p-10
                  backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl`}
    >
      <div className="flex flex-col items-center justify-center space-y-2">
        <h3 className="text-gray-400 text-sm md:text-base lg:text-lg font-semibold uppercase tracking-wider">
          {label}
        </h3>
        <div className="flex items-baseline justify-center gap-2">
          <span className={`${getSizeClasses()} font-bold ${getTextColor()} tabular-nums transition-all duration-500`}>
            {displayValue}
          </span>
          <span className="text-2xl md:text-3xl lg:text-4xl text-gray-400 font-medium">
            {unit}
          </span>
        </div>
        {description && (
          <p className="text-gray-500 text-xs md:text-sm text-center mt-2">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
