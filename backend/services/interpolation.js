/**
 * Linear interpolation for prices
 * @param {Number} ts_q - Query timestamp
 * @param {Number} ts_before - Timestamp before query time
 * @param {Number} price_before - Price at ts_before
 * @param {Number} ts_after - Timestamp after query time
 * @param {Number} price_after - Price at ts_after
 * @returns {Number} Interpolated price
 */
export function interpolate(
  ts_q,
  ts_before,
  price_before,
  ts_after,
  price_after
) {
  if (ts_after === ts_before) {
    // Avoid divide by zero
    return price_before;
  }

  const ratio = (ts_q - ts_before) / (ts_after - ts_before);
  const interpolatedPrice = price_before + (price_after - price_before) * ratio;

  return interpolatedPrice;
}
