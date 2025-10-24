import { HRVInterpretation, getStatusColorClasses } from '@/utils/hrvInterpretation';

interface InterpretationPanelProps {
  interpretation: HRVInterpretation;
}

export default function InterpretationPanel({ interpretation }: InterpretationPanelProps) {
  const colors = getStatusColorClasses(interpretation.status);

  // Severity indicator
  const getSeverityBars = (severity: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <div
        key={i}
        className={`h-2 w-full rounded-full transition-all duration-300 ${
          i < severity
            ? interpretation.severity >= 4
              ? 'bg-red-500'
              : interpretation.severity >= 3
              ? 'bg-orange-500'
              : 'bg-green-500'
            : 'bg-gray-700'
        }`}
      />
    ));
  };

  return (
    <div
      className={`bg-gradient-to-br ${colors.bg} border-2 ${colors.border} rounded-2xl p-6 md:p-8
                  backdrop-blur-sm transition-all duration-500 animate-in slide-in-from-bottom`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="text-5xl md:text-6xl">{interpretation.emoji}</div>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h3 className={`text-2xl md:text-3xl font-bold ${colors.text}`}>
                {interpretation.title}
              </h3>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${colors.badge}`}>
                {interpretation.status}
              </span>
            </div>
            {/* Severity Indicator */}
            <div className="flex gap-1 w-32 mb-2">
              {getSeverityBars(interpretation.severity)}
            </div>
            <p className="text-xs text-gray-500">
              {interpretation.severity === 1 && 'Excellent condition'}
              {interpretation.severity === 2 && 'Good condition'}
              {interpretation.severity === 3 && 'Caution advised'}
              {interpretation.severity === 4 && 'Action required'}
              {interpretation.severity === 5 && 'Immediate attention needed'}
            </p>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mb-6">
        <p className="text-gray-300 text-base md:text-lg leading-relaxed">
          {interpretation.description}
        </p>
      </div>

      {/* Recommendations */}
      <div>
        <h4 className="text-lg font-semibold text-gray-200 mb-3 flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Recommendations
        </h4>
        <ul className="space-y-2">
          {interpretation.recommendations.map((recommendation, index) => (
            <li
              key={index}
              className="flex items-start gap-3 text-gray-400 text-sm md:text-base"
            >
              <span className={`${colors.text} mt-1 flex-shrink-0`}>•</span>
              <span>{recommendation}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Additional Info Banner */}
      {interpretation.severity >= 4 && (
        <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
          <div className="flex items-start gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
            <div>
              <p className="text-red-300 font-semibold mb-1">Important Notice</p>
              <p className="text-red-400 text-sm">
                These metrics suggest you need immediate attention to your recovery. Consider
                consulting with a healthcare provider or coach if symptoms persist or worsen.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
