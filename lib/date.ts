// dateHelpers.js
import { format, formatDistanceToNow } from 'date-fns';
import { id as locale } from 'date-fns/locale';

/**
 * Format tanggal menjadi string dengan pattern tertentu
 * @param {string|Date} date
 * @param {string} pattern contoh: "dd/MM/yyyy"
 * @returns {string}
 */
export const formatDate = (date: string | Date, pattern = 'dd/MM/yyyy') => {
  if (!date) return '-';
  try {
    return format(new Date(date), pattern);
  } catch (error) {
    console.error('formatDate error:', error);
    return '-';
  }
};

/**
 * Tampilkan tanggal dalam format relative time, misal "3 days ago"
 * @param {string|Date} date
 * @returns {string}
 */
export const formatRelativeToNow = (date: string | Date) => {
  if (!date) return '-';
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale });
  } catch (error) {
    console.error('formatRelative error:', error);
    return '-';
  }
};
