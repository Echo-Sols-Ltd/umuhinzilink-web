/**
 * Formats a number as Rwandan Francs (RWF)
 * Example: 4000 -> "RWF 4,000"
 */
export const formatCurrency = (amount: number): string => {
  return `RWF ${amount.toLocaleString('en-RW', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
};

/**
 * Calculates the percentage proximity between two prices
 * for the progress bar.
 */
export const getPriceProximity = (original: number, current: number): number => {
  if (original === 0) return 100;
  const diff = Math.abs(original - current);
  const percent = (1 - diff / original) * 100;
  return Math.max(0, Math.min(100, percent));
};
