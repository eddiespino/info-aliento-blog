import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a number with commas as thousands separators
 * @param num Number to format
 * @returns Formatted string with commas
 */
export function formatNumberWithCommas(num: number): string {
  return num.toLocaleString('en-US');
}

/**
 * Format large numbers into a more readable format (PeakD style)
 * @param num Number to format
 * @param decimals Number of decimal places
 * @returns Formatted string (e.g., 17.9m - lowercase for PeakD style)
 */
export function formatLargeNumber(num: number, decimals: number = 1): string {
  if (num >= 1000000000) {
    return `${(num / 1000000000).toFixed(decimals)}b`;
  } else if (num >= 1000000) {
    return `${(num / 1000000).toFixed(decimals)}m`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(decimals)}k`;
  }
  return num.toFixed(decimals);
}

/**
 * Format Hive Power value (PeakD style)
 * @param hiveAmount Amount in Hive
 * @returns Formatted string (e.g., 17.9m)
 */
export function formatHivePower(hiveAmount: number): string {
  return formatLargeNumber(hiveAmount);
}
