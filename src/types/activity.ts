/**
 * Activity type definition for the Activity Setup page
 * Represents a predefined camera/equipment setup category
 */
export interface Activity {
  /** Unique identifier for the activity */
  id: number;

  /** Display name of the activity (e.g., "CINEMA", "WILD LIFE") */
  name: string;

  /** URL-friendly slug for routing (e.g., "cinema", "wild-life") */
  slug: string;

  /** Path to the activity image in public directory (with text overlay for cards) */
  imagePath: string;

  /** Path to the background image without text overlay (for detail page and selected state) */
  backgroundImagePath?: string;

  /** Initial 3D position [x, y, z] for the floating card */
  initialPosition: [number, number, number];

  /** Accent color for the activity (hex format) */
  color: string;

  /** Optional description for the detail page */
  description?: string;
}
