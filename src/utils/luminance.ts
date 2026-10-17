/**
 * Calculates the relative luminance of a hex color.
 * @param hex - Hex color string (3 or 6 digits, with or without '#')
 * @returns Luminance value between 0 (black) and 1 (white)
 */
export function getRelativeLuminance(hex: string): number {
  // Remove '#' prefix if present
  const cleaned = hex.replace(/^#/, "");

  // Expand 3-digit hex to 6-digit
  const expanded =
    cleaned.length === 3 ? cleaned[0] + cleaned[0] + cleaned[1] + cleaned[1] + cleaned[2] + cleaned[2] : cleaned;

  // Parse RGB components
  const r = parseInt(expanded.substring(0, 2), 16) / 255;
  const g = parseInt(expanded.substring(2, 4), 16) / 255;
  const b = parseInt(expanded.substring(4, 6), 16) / 255;

  // Apply sRGB linearization (inverse companding)
  const linearize = (c: number) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));

  const rLin = linearize(r);
  const gLin = linearize(g);
  const bLin = linearize(b);

  // Calculate relative luminance using WCAG formula
  return 0.2126 * rLin + 0.7152 * gLin + 0.0722 * bLin;
}

/**
 * Returns a text color that provides sufficient contrast against a semi-transparent
 * background of the same hue. For light colors (luminance > 0.4), returns a darker
 * version by mixing with black. For dark colors, returns the original color.
 * @param hex - Hex color string (3 or 6 digits, with or without '#')
 * @param isDarkMode - Whether the current theme is dark mode
 * @returns Hex color string suitable for text color
 */
export function getContrastTextColor(hex: string, isDarkMode = false): string {
  const luminance = getRelativeLuminance(hex);
  const cleaned = hex.replace(/^#/, "");
  const expanded =
    cleaned.length === 3 ? cleaned[0] + cleaned[0] + cleaned[1] + cleaned[1] + cleaned[2] + cleaned[2] : cleaned;

  const r = parseInt(expanded.substring(0, 2), 16);
  const g = parseInt(expanded.substring(2, 4), 16);
  const b = parseInt(expanded.substring(4, 6), 16);

  if (isDarkMode) {
    // In dark mode: brighten colors with low-medium luminance so they stand out
    // against the dark background
    if (luminance < 0.6) {
      // Mix with white at 60% (brighten towards white)
      const brighten = (c: number) => Math.round(c + (255 - c) * 0.6);

      const rBright = brighten(r).toString(16).padStart(2, "0");
      const gBright = brighten(g).toString(16).padStart(2, "0");
      const bBright = brighten(b).toString(16).padStart(2, "0");

      return `#${rBright}${gBright}${bBright}`;
    }
    // Already bright enough in dark mode
    return `#${expanded}`;
  }

  // Light mode: darken light colors for contrast
  if (luminance > 0.4) {
    // Mix with black at 70% (darken to 30% of original)
    const darken = (c: number) => Math.round(c * 0.3);

    const rDark = darken(r).toString(16).padStart(2, "0");
    const gDark = darken(g).toString(16).padStart(2, "0");
    const bDark = darken(b).toString(16).padStart(2, "0");

    return `#${rDark}${gDark}${bDark}`;
  }

  // Dark colors are fine as-is in light mode
  return `#${expanded}`;
}
