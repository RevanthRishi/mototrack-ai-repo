import { format, formatDistanceToNow, parseISO } from 'date-fns';

/**
 * Format date in standard readable format
 * @param date - Date object or ISO string
 * @param formatStr - Format string (default: 'dd MMM yyyy')
 * @returns Formatted date string
 */
export function formatDate(date: Date | string, formatStr = 'dd MMM yyyy'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr);
}

/**
 * Format relative time (e.g. '2 days ago', 'in 3 weeks')
 * @param date - Date object or ISO string
 * @returns Relative time string
 */
export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true });
}
