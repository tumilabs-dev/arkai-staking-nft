import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generates a CSS background-image data URI for the spiral pad pattern
 * @param color - Hex color code (e.g., "#A46A37") or CSS color name (default: "#A46A37")
 * @param size - Size of each tile in pixels (default: 20)
 * @returns CSS background-image value
 */
export function getSpiralPadPattern(
  color: string = "#A46A37",
  size: number = 20
): string {
  // Square spiral pattern matching the design
  // Clockwise spiral: starts top-left, goes right → down → left → up, spiraling inward
  // Uniform stroke width, sharp mitered corners, seamless tiling
  const uniformStrokeWidth = "2";

  // Create a single continuous path for the clockwise spiral
  // This ensures proper corner joins and seamless tiling
  const spiralPath = ["M 20 20", "L 0 20", "L 0 0", "L 20 0", "Z"].join(" ");

  // Build the SVG with a single continuous path for seamless rendering
  const svg = `<svg width="${size}" height="${size}" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="${spiralPath}" stroke="${color}" stroke-width="${uniformStrokeWidth}" stroke-linecap="butt" stroke-linejoin="miter"/></svg>`;

  // Encode the entire SVG for use in data URI
  const encodedSvg = encodeURIComponent(svg);
  return `url("data:image/svg+xml,${encodedSvg}")`;
}
