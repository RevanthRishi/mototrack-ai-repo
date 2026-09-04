import Decimal from 'decimal.js';
import { addDays, differenceInDays } from 'date-fns';

export interface ServiceIntervalConfig {
  serviceType: string;
  recommendedKm: number;
  recommendedDays: number;
}

export const DEFAULT_SERVICE_INTERVALS: ServiceIntervalConfig[] = [
  { serviceType: 'Engine Oil Change', recommendedKm: 3000, recommendedDays: 90 },
  { serviceType: 'Chain Cleaning & Lube', recommendedKm: 500, recommendedDays: 14 },
  { serviceType: 'Air Filter Cleaning/Replacement', recommendedKm: 6000, recommendedDays: 180 },
  { serviceType: 'Spark Plug Inspection/Replacement', recommendedKm: 10000, recommendedDays: 365 },
  { serviceType: 'Brake Fluid Replacement', recommendedKm: 15000, recommendedDays: 730 },
  { serviceType: 'Brake Pads Inspection/Replacement', recommendedKm: 8000, recommendedDays: 180 },
  { serviceType: 'Fork Oil Change', recommendedKm: 20000, recommendedDays: 730 },
  { serviceType: 'Tyre Replacement', recommendedKm: 25000, recommendedDays: 1095 },
  { serviceType: 'Battery Check/Replacement', recommendedKm: 20000, recommendedDays: 730 },
];

/**
 * Estimate daily distance based on odometer readings over time
 * @param firstReading - First odometer reading & date
 * @param latestReading - Latest odometer reading & date
 * @returns Average daily distance in km/miles
 */
export function estimateDailyDistance(
  firstReading: { odometer: number; date: Date },
  latestReading: { odometer: number; date: Date }
): Decimal {
  const daysDiff = differenceInDays(latestReading.date, firstReading.date);

  if (daysDiff <= 0) {
    return new Decimal(20); // Default estimate: 20km/day
  }

  const distanceDiff = new Decimal(latestReading.odometer).minus(firstReading.odometer);

  if (distanceDiff.isNegative() || distanceDiff.isZero()) {
    return new Decimal(20);
  }

  return distanceDiff.div(daysDiff).toDecimalPlaces(2);
}

/**
 * Predict next service due date based on current odometer and daily average
 * @param currentOdometer - Current odometer reading
 * @param lastServiceOdometer - Odometer reading at last service
 * @param serviceIntervalKm - Recommended service interval in km
 * @param dailyAverageKm - Average daily distance
 * @param lastServiceDate - Date of last service
 * @returns Predicted next service date and due odometer
 */
export function predictNextService(
  currentOdometer: number,
  lastServiceOdometer: number,
  serviceIntervalKm: number,
  dailyAverageKm: number,
  _lastServiceDate: Date
): {
  dueOdometer: number;
  remainingKm: number;
  estimatedDueDate: Date;
  isOverdue: boolean;
} {
  const dueOdometer = new Decimal(lastServiceOdometer).add(serviceIntervalKm).toNumber();
  const remainingKm = new Decimal(dueOdometer).minus(currentOdometer).toNumber();
  const isOverdue = remainingKm <= 0;

  let estimatedDays = 0;
  if (!isOverdue && dailyAverageKm > 0) {
    estimatedDays = Math.max(1, Math.round(remainingKm / dailyAverageKm));
  }

  const estimatedDueDate = isOverdue
    ? new Date()
    : addDays(new Date(), estimatedDays);

  return {
    dueOdometer,
    remainingKm: Math.max(0, remainingKm),
    estimatedDueDate,
    isOverdue,
  };
}

/**
 * Calculate service health score (0 to 100) based on overdue maintenance
 * @param overdueItemsCount - Number of overdue service items
 * @param totalItemsCount - Total monitored service items
 * @returns Health score (0-100)
 */
export function calculateHealthScore(overdueItemsCount: number, totalItemsCount: number): number {
  if (totalItemsCount <= 0) return 100;

  const deductionPerItem = new Decimal(100).div(totalItemsCount);
  const totalDeduction = deductionPerItem.mul(overdueItemsCount);

  const score = new Decimal(100).minus(totalDeduction);
  return Math.max(0, Math.min(100, Math.round(score.toNumber())));
}
