export type HRVStatus = 'optimal' | 'good' | 'fair' | 'stressed' | 'fatigued' | 'overtraining';

export interface HRVInterpretation {
  status: HRVStatus;
  title: string;
  description: string;
  recommendations: string[];
  color: string;
  emoji: string;
  severity: number; // 1-5, where 5 is most concerning
}

export interface MetricThresholds {
  rmssd: { low: number; normal: number; high: number };
  sdnn: { low: number; normal: number; high: number };
  hr: { low: number; normal: number; high: number };
}

// Standard thresholds based on research
const DEFAULT_THRESHOLDS: MetricThresholds = {
  rmssd: { low: 20, normal: 40, high: 80 },
  sdnn: { low: 40, normal: 60, high: 100 },
  hr: { low: 50, normal: 70, high: 90 },
};

/**
 * Categorize a metric value as low, normal, or high
 */
function categorizeMetric(
  value: number,
  thresholds: { low: number; normal: number; high: number }
): 'low' | 'normal' | 'high' {
  if (value < thresholds.low) return 'low';
  if (value > thresholds.high) return 'high';
  return 'normal';
}

/**
 * Detect trend in a series of values
 * Returns 'declining', 'stable', or 'improving'
 */
export function detectTrend(values: number[], windowSize: number = 5): 'declining' | 'stable' | 'improving' {
  if (values.length < windowSize) return 'stable';

  const recentValues = values.slice(-windowSize);
  const midpoint = Math.floor(windowSize / 2);

  const firstHalf = recentValues.slice(0, midpoint);
  const secondHalf = recentValues.slice(midpoint);

  const firstAvg = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;

  const changePercent = ((secondAvg - firstAvg) / firstAvg) * 100;

  if (changePercent < -10) return 'declining';
  if (changePercent > 10) return 'improving';
  return 'stable';
}

/**
 * Analyze combined HRV metrics and provide interpretation
 */
export function interpretHRVMetrics(
  rmssd: number,
  sdnn: number,
  heartRate: number,
  rmssdHistory?: number[],
  thresholds: MetricThresholds = DEFAULT_THRESHOLDS
): HRVInterpretation {
  // Skip interpretation if no data
  if (rmssd === 0 && sdnn === 0 && heartRate === 0) {
    return {
      status: 'good',
      title: 'Waiting for Data',
      description: 'Connect your heart rate monitor to start analyzing your HRV metrics.',
      recommendations: ['Ensure your device is properly connected', 'Make sure you are sitting or lying still'],
      color: 'gray',
      emoji: '⏳',
      severity: 0,
    };
  }

  const rmssdCategory = categorizeMetric(rmssd, thresholds.rmssd);
  const sdnnCategory = categorizeMetric(sdnn, thresholds.sdnn);
  const hrCategory = categorizeMetric(heartRate, thresholds.hr);

  // Detect RMSSD trend if history is available
  let rmssdTrend: 'declining' | 'stable' | 'improving' = 'stable';
  if (rmssdHistory && rmssdHistory.length >= 5) {
    rmssdTrend = detectTrend(rmssdHistory);
  }

  // Pattern 1: Low RMSSD + High HR + Low SDNN = Stress/Fatigue
  if (rmssdCategory === 'low' && hrCategory === 'high' && sdnnCategory === 'low') {
    return {
      status: 'stressed',
      title: 'High Stress Detected',
      description: 'Your low HRV combined with elevated heart rate indicates significant stress or fatigue. Your body is showing signs of sympathetic dominance.',
      recommendations: [
        'Prioritize rest and recovery today',
        'Avoid intense training or stressful activities',
        'Practice deep breathing or meditation',
        'Ensure adequate sleep (7-9 hours)',
        'Stay hydrated and eat nutritious meals',
      ],
      color: 'red',
      emoji: '⚠️',
      severity: 4,
    };
  }

  // Pattern 2: High RMSSD + Normal/Low HR + High SDNN = Optimal
  if (
    (rmssdCategory === 'high' || rmssdCategory === 'normal') &&
    (hrCategory === 'normal' || hrCategory === 'low') &&
    (sdnnCategory === 'high' || sdnnCategory === 'normal')
  ) {
    return {
      status: 'optimal',
      title: 'Excellent Recovery',
      description: 'Your metrics indicate optimal recovery and readiness. Your parasympathetic nervous system is well-balanced, and you are in great shape for performance.',
      recommendations: [
        'Good time for challenging workouts or training',
        'Maintain your current sleep and recovery routines',
        'Continue healthy nutrition habits',
        'Stay consistent with stress management practices',
      ],
      color: 'green',
      emoji: '💪',
      severity: 1,
    };
  }

  // Pattern 3: Progressive RMSSD decline = Overtraining warning
  if (rmssdTrend === 'declining' && rmssdCategory === 'low') {
    return {
      status: 'overtraining',
      title: 'Overtraining Warning',
      description: 'Your RMSSD has been progressively declining, which is an early warning sign of overtraining. This can occur even before you feel physical symptoms.',
      recommendations: [
        'Take 1-3 days of complete rest or active recovery',
        'Reduce training volume and intensity by 50%',
        'Focus on sleep quality and duration',
        'Consider stress management techniques',
        'Monitor your metrics daily for improvement',
        'Consult a coach or healthcare provider if symptoms persist',
      ],
      color: 'orange',
      emoji: '🚨',
      severity: 5,
    };
  }

  // Pattern 4: Low RMSSD but normal HR and SDNN = Mild stress
  if (rmssdCategory === 'low' && hrCategory === 'normal' && sdnnCategory === 'normal') {
    return {
      status: 'fair',
      title: 'Reduced Recovery',
      description: 'Your short-term HRV is lower than optimal, suggesting incomplete recovery. However, your other metrics are stable.',
      recommendations: [
        'Opt for lighter training today',
        'Focus on recovery activities (stretching, yoga, walking)',
        'Ensure quality sleep tonight',
        'Monitor trends over the next few days',
      ],
      color: 'yellow',
      emoji: '⚡',
      severity: 3,
    };
  }

  // Pattern 5: Elevated HR with normal HRV = Possible fatigue
  if (hrCategory === 'high' && (rmssdCategory === 'normal' || sdnnCategory === 'normal')) {
    return {
      status: 'fatigued',
      title: 'Elevated Heart Rate',
      description: 'Your resting heart rate is elevated despite normal HRV. This could indicate physical fatigue, dehydration, or illness.',
      recommendations: [
        'Check for signs of illness or infection',
        'Ensure proper hydration',
        'Reduce training intensity',
        'Get extra sleep if possible',
        'Monitor body temperature and other symptoms',
      ],
      color: 'orange',
      emoji: '🌡️',
      severity: 3,
    };
  }

  // Pattern 6: Improving trend
  if (rmssdTrend === 'improving' && rmssdCategory !== 'low') {
    return {
      status: 'good',
      title: 'Recovery Improving',
      description: 'Your HRV metrics are trending upward, indicating improving recovery and adaptation. Keep up your current routine.',
      recommendations: [
        'Continue current training and recovery balance',
        'Gradually increase training load if desired',
        'Maintain good sleep and nutrition habits',
        'Monitor for any sudden changes',
      ],
      color: 'blue',
      emoji: '📈',
      severity: 2,
    };
  }

  // Default: Good recovery
  return {
    status: 'good',
    title: 'Good Recovery State',
    description: 'Your HRV metrics are within healthy ranges. You appear to be recovering well and ready for moderate activity.',
    recommendations: [
      'Proceed with planned training',
      'Maintain consistent sleep schedule',
      'Stay hydrated and eat well',
      'Continue monitoring your metrics',
    ],
    color: 'blue',
    emoji: '✅',
    severity: 2,
  };
}

/**
 * Get color classes for Tailwind based on status
 */
export function getStatusColorClasses(status: HRVStatus): {
  bg: string;
  border: string;
  text: string;
  badge: string;
} {
  switch (status) {
    case 'optimal':
      return {
        bg: 'from-green-500/20 to-green-600/20',
        border: 'border-green-500/30',
        text: 'text-green-400',
        badge: 'bg-green-500/20 text-green-400',
      };
    case 'good':
      return {
        bg: 'from-blue-500/20 to-blue-600/20',
        border: 'border-blue-500/30',
        text: 'text-blue-400',
        badge: 'bg-blue-500/20 text-blue-400',
      };
    case 'fair':
      return {
        bg: 'from-yellow-500/20 to-yellow-600/20',
        border: 'border-yellow-500/30',
        text: 'text-yellow-400',
        badge: 'bg-yellow-500/20 text-yellow-400',
      };
    case 'stressed':
      return {
        bg: 'from-red-500/20 to-red-600/20',
        border: 'border-red-500/30',
        text: 'text-red-400',
        badge: 'bg-red-500/20 text-red-400',
      };
    case 'fatigued':
      return {
        bg: 'from-orange-500/20 to-orange-600/20',
        border: 'border-orange-500/30',
        text: 'text-orange-400',
        badge: 'bg-orange-500/20 text-orange-400',
      };
    case 'overtraining':
      return {
        bg: 'from-red-600/20 to-orange-600/20',
        border: 'border-red-600/30',
        text: 'text-red-400',
        badge: 'bg-red-600/20 text-red-400',
      };
    default:
      return {
        bg: 'from-gray-500/20 to-gray-600/20',
        border: 'border-gray-500/30',
        text: 'text-gray-400',
        badge: 'bg-gray-500/20 text-gray-400',
      };
  }
}
