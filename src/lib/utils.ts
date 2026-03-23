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
