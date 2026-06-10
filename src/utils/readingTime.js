/**
 * Menghitung estimasi waktu baca artikel
 * @param {string} text - Konten artikel
 * @param {number} wordsPerMinute - Kecepatan baca rata-rata (default: 200 kata/menit untuk Bahasa Indonesia)
 * @returns {number} Estimasi waktu baca dalam menit
 */
export function calculateReadingTime(text, wordsPerMinute = 200) {
  if (!text) return 1;
  const wordCount = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return Math.max(1, minutes);
}

/**
 * Format waktu baca ke string yang mudah dibaca
 * @param {number} minutes - Waktu baca dalam menit
 * @returns {string} String format waktu baca
 */
export function formatReadingTime(minutes) {
  if (minutes <= 1) return '1 menit baca';
  return `${minutes} menit baca`;
}
