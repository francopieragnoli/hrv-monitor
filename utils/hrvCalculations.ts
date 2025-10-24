export interface HRVMetrics {
  sdnn: number;
  rmssd: number;
  meanRR: number;
  meanHR: number;
}

/**
 * Calculate the standard deviation of NN intervals (SDNN)
 * SDNN reflects all the cyclic components responsible for variability
 */
export function calculateSDNN(rrIntervals: number[]): number {
  if (rrIntervals.length < 2) return 0;

  const mean = rrIntervals.reduce((sum, val) => sum + val, 0) / rrIntervals.length;
  const squaredDiffs = rrIntervals.map(val => Math.pow(val - mean, 2));
  const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / rrIntervals.length;

  return Math.sqrt(variance);
}

/**
 * Calculate the root mean square of successive differences (RMSSD)
 * RMSSD reflects short-term heart rate variability
 */
export function calculateRMSSD(rrIntervals: number[]): number {
  if (rrIntervals.length < 2) return 0;

  const successiveDiffs: number[] = [];
  for (let i = 1; i < rrIntervals.length; i++) {
    const diff = rrIntervals[i] - rrIntervals[i - 1];
    successiveDiffs.push(Math.pow(diff, 2));
  }

  const meanSquaredDiff = successiveDiffs.reduce((sum, val) => sum + val, 0) / successiveDiffs.length;
  return Math.sqrt(meanSquaredDiff);
}

/**
 * Calculate mean RR interval
 */
export function calculateMeanRR(rrIntervals: number[]): number {
  if (rrIntervals.length === 0) return 0;
  return rrIntervals.reduce((sum, val) => sum + val, 0) / rrIntervals.length;
}

/**
 * Calculate mean heart rate from RR intervals
 */
export function calculateMeanHR(rrIntervals: number[]): number {
  if (rrIntervals.length === 0) return 0;
  const meanRR = calculateMeanRR(rrIntervals);
  if (meanRR === 0) return 0;
  // Convert RR interval (ms) to heart rate (BPM)
  return 60000 / meanRR;
}

/**
 * Calculate all HRV metrics at once
 */
export function calculateHRVMetrics(rrIntervals: number[]): HRVMetrics {
  return {
    sdnn: calculateSDNN(rrIntervals),
    rmssd: calculateRMSSD(rrIntervals),
    meanRR: calculateMeanRR(rrIntervals),
    meanHR: calculateMeanHR(rrIntervals),
  };
}

/**
 * Filter out outliers from RR intervals
 * Removes values that differ by more than 20% from the previous value
 */
export function filterOutliers(rrIntervals: number[]): number[] {
  if (rrIntervals.length === 0) return [];

  const filtered: number[] = [rrIntervals[0]];
  const threshold = 0.20; // 20% threshold

  for (let i = 1; i < rrIntervals.length; i++) {
    const prevValue = filtered[filtered.length - 1];
    const currentValue = rrIntervals[i];
    const percentChange = Math.abs(currentValue - prevValue) / prevValue;

    if (percentChange <= threshold) {
      filtered.push(currentValue);
    }
  }

  return filtered;
}

/**
 * Keep only the most recent N seconds of RR intervals
 */
export function keepRecentIntervals(
  intervals: Array<{ value: number; timestamp: number }>,
  maxAgeMs: number = 60000 // Default 60 seconds
): Array<{ value: number; timestamp: number }> {
  const now = Date.now();
  return intervals.filter(interval => now - interval.timestamp <= maxAgeMs);
}
