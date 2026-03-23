import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Convert MM-YYYY format to "Mon Year" format
 * @param dateStr - Date string in MM-YYYY format (e.g., "11-2025")
 * @returns Formatted date string (e.g., "Nov 2025")
 */
export function formatMonthYear(dateStr?: string): string {
  if (!dateStr) return "";

  const [month, year] = dateStr.split("-");
  if (!month || !year) return dateStr;

  const monthIndex = parseInt(month, 10) - 1;
  if (monthIndex < 0 || monthIndex > 11) return dateStr;

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${months[monthIndex]} ${year}`;
}

/**
 * Convert YYYY-MM-DD format to "D MMM YYYY" format
 * @param dateStr - Date string in YYYY-MM-DD format (e.g., "2025-11-27")
 * @returns Formatted date string (e.g., "27 Nov 2025")
 */
export function formatDate(dateStr?: string): string {
  if (!dateStr) return "";

  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;

    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${day} ${months[month]} ${year}`;
  } catch {
    return dateStr;
  }
}
