// Swiss grid (CH1903+) to WGS84 conversion
// Source: https://www.swisstopo.admin.ch/en/maps-data-online/calculation-services.html
export function swissToWGS84(
  x: number,
  y: number
): { lat: number; lon: number } {
  // Convert to Bern origin
  const y_ = (y - 2600000) / 1000000;
  const x_ = (x - 1200000) / 1000000;
  // WGS84 latitude
  const lat =
    16.9023892 +
    3.238272 * x_ -
    0.270978 * y_ * y_ -
    0.002528 * x_ * x_ -
    0.0447 * y_ * x_ -
    0.014 * x_ * x_ * y_;
  // WGS84 longitude
  const lon =
    2.6779094 +
    4.728982 * y_ +
    0.791484 * y_ * x_ +
    0.1306 * x_ * x_ -
    0.0436 * y_ * y_;
  return {
    lat: (lat * 100) / 36,
    lon: (lon * 100) / 36,
  };
}
