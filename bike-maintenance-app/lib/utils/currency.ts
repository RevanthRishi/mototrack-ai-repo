import Decimal from 'decimal.js';

/**
 * Format currency amount with symbol
 * @param amount - Monetary value
 * @param currencyCode - ISO 4217 currency code (default: INR)
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number | string | Decimal, currencyCode = 'INR'): string {
  const numericAmount = new Decimal(amount).toNumber();

  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currencyCode,
      maximumFractionDigits: 2,
    }).format(numericAmount);
  } catch {
    return `${currencyCode} ${numericAmount.toFixed(2)}`;
  }
}

/**
 * Format distance with unit
 * @param distance - Distance value
 * @param unit - Unit (km or miles)
 * @returns Formatted distance string
 */
export function formatDistance(distance: number | Decimal, unit = 'km'): string {
  const value = new Decimal(distance).toNumber();
  return `${value.toLocaleString()} ${unit}`;
}

/**
 * Format fuel economy / mileage with unit
 * @param mileage - Mileage value
 * @param unit - Distance unit (km/l or MPG)
 * @returns Formatted mileage string
 */
export function formatMileage(mileage: number | Decimal | null, unit = 'km/l'): string {
  if (mileage === null || mileage === undefined) {
    return '--';
  }
  const value = new Decimal(mileage).toNumber();
  return `${value.toFixed(1)} ${unit}`;
}
