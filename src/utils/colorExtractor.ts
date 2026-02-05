/**
 * Color Extraction Utility
 * Extracts dominant colors from images for reactive gradient backgrounds
 */

export interface ColorPalette {
  colors: string[];
  imageUrl: string;
}

/**
 * Extracts dominant colors from an image
 * @param imageSrc - Image URL or path
 * @param maxColors - Maximum number of colors to extract (default: 4)
 * @returns Promise with array of rgba color strings
 */
export async function extractColors(
  imageSrc: string,
  maxColors: number = 4
): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = async () => {
      try {
        // Pre-decode image for GPU optimization
        await img.decode();

        // Create offscreen canvas for pixel analysis
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        // Scale down image for performance (max 48px on longest dimension)
        const maxSize = 48;
        const scale = maxSize / Math.max(img.width, img.height);
        canvas.width = Math.floor(img.width * scale);
        canvas.height = Math.floor(img.height * scale);

        // Draw scaled image
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Extract pixel data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;

        // Analyze colors
        const colors = analyzeColors(pixels, maxColors);

        resolve(colors);
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error(`Failed to load image: ${imageSrc}`));
    };

    img.src = imageSrc;
  });
}

/**
 * Analyzes pixel data to find dominant colors
 */
function analyzeColors(pixels: Uint8ClampedArray, maxColors: number): string[] {
  const colorMap = new Map<string, number>();

  // Sample pixels (skip every 4th pixel for performance)
  for (let i = 0; i < pixels.length; i += 16) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const a = pixels[i + 3];

    // Skip transparent or near-transparent pixels
    if (a < 128) continue;

    // Skip very dark or very light pixels (likely background)
    const brightness = (r + g + b) / 3;
    if (brightness < 30 || brightness > 240) continue;

    // Quantize colors to reduce variations (group similar colors)
    const quantized = quantizeColor(r, g, b);
    const key = `${quantized.r},${quantized.g},${quantized.b}`;

    colorMap.set(key, (colorMap.get(key) || 0) + 1);
  }

  // Sort by frequency and get top colors
  const sortedColors = Array.from(colorMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxColors)
    .map(([key]) => {
      const [r, g, b] = key.split(',').map(Number);
      return `rgba(${r}, ${g}, ${b}, 0.8)`;
    });

  // If not enough colors found, add some defaults
  while (sortedColors.length < maxColors) {
    sortedColors.push('rgba(100, 100, 150, 0.6)');
  }

  return sortedColors;
}

/**
 * Quantizes RGB values to reduce color variations
 */
function quantizeColor(r: number, g: number, b: number): { r: number; g: number; b: number } {
  const quantum = 32; // Group colors into 32-unit buckets
  return {
    r: Math.floor(r / quantum) * quantum,
    g: Math.floor(g / quantum) * quantum,
    b: Math.floor(b / quantum) * quantum,
  };
}

/**
 * Extracts color palettes from multiple images
 * @param imageSrcs - Array of image URLs/paths
 * @returns Promise with array of color palettes
 */
export async function extractColorPalettes(
  imageSrcs: string[]
): Promise<ColorPalette[]> {
  const promises = imageSrcs.map(async (imageSrc) => {
    try {
      const colors = await extractColors(imageSrc);
      return { colors, imageUrl: imageSrc };
    } catch (error) {
      console.error(`Failed to extract colors from ${imageSrc}:`, error);
      // Return fallback colors
      return {
        colors: [
          'rgba(100, 120, 180, 0.7)',
          'rgba(150, 100, 180, 0.7)',
          'rgba(180, 120, 100, 0.7)',
          'rgba(120, 180, 150, 0.7)',
        ],
        imageUrl: imageSrc,
      };
    }
  });

  return Promise.allSettled(promises).then((results) =>
    results
      .filter((result): result is PromiseFulfilledResult<ColorPalette> =>
        result.status === 'fulfilled'
      )
      .map((result) => result.value)
  );
}

/**
 * Linear interpolation between two colors
 */
export function lerpColor(
  color1: string,
  color2: string,
  progress: number
): string {
  const rgba1 = parseRgba(color1);
  const rgba2 = parseRgba(color2);

  if (!rgba1 || !rgba2) return color1;

  const r = Math.round(rgba1.r + (rgba2.r - rgba1.r) * progress);
  const g = Math.round(rgba1.g + (rgba2.g - rgba1.g) * progress);
  const b = Math.round(rgba1.b + (rgba2.b - rgba1.b) * progress);
  const a = rgba1.a + (rgba2.a - rgba1.a) * progress;

  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

/**
 * Parses rgba string to component values
 */
function parseRgba(rgba: string): { r: number; g: number; b: number; a: number } | null {
  const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (!match) return null;

  return {
    r: parseInt(match[1]),
    g: parseInt(match[2]),
    b: parseInt(match[3]),
    a: match[4] ? parseFloat(match[4]) : 1,
  };
}
