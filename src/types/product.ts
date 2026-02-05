/**
 * Product Type Definitions
 *
 * This interface defines the complete structure for product data used throughout
 * the camera setup website. It includes both display properties and filtering traits.
 */

export interface Product {
  // Core Identification
  id: number;

  // Visual Assets
  baseSrc: string;
  slides: string[];
  buttonSrc: string;
  infoButtonSrc: string;

  // Display Information
  cameraName: string;
  infoButtonMain: string;
  infoButtonSecondary?: string;
  infoButtonAmazonUK?: string;
  infoButtonAmazonUS?: string;

  // Modal Content (Optional - not all products have full details)
  modalDescription?: string;
  modalSpecs?: Array<{
    label: string;
    value: string;
  }>;
  modalFeatures?: string[];

  // External Links
  amazonUKLink?: string;
  amazonUSLink?: string;
  amazonDELink?: string;

  // 3D Badge Information
  badgeBrand?: string;
  badgeType?: string;
  badgePrice?: string;

  // Status Flags
  isNew?: boolean;

  // ============================================
  // NEW FILTERING TRAITS (Added for future use)
  // ============================================

  /**
   * Compatible camera models
   * Empty array [] means not compatible with any specific camera or compatibility doesn't matter
   * Example: ["Sony A6400", "Sony A7III", "Canon EOS R5"]
   */
  compatibleCameras: string[];

  /**
   * Compatible brands
   * Empty array [] means not compatible with any specific brand or compatibility doesn't matter
   * Example: ["Sony", "Canon", "Nikon"]
   */
  compatibleBrands: string[];

  /**
   * Budget category for price filtering
   * - "low": Budget-friendly option
   * - "medium": Mid-range pricing
   * - "high": Premium/professional pricing
   */
  budget: "low" | "medium" | "high";

  /**
   * Waterproof/water-resistant capability
   * "yes" or "no" - strict binary choice
   */
  isWaterproof: "yes" | "no";

  /**
   * Shockproof/impact-resistant capability
   * "yes" or "no" - strict binary choice
   */
  isShockproof: "yes" | "no";

  /**
   * Cinema-only designation (specialized for video/cinema production)
   * "yes" or "no" - strict binary choice
   */
  isCinemaOnly: "yes" | "no";

  /**
   * Fast shutter speed capability (for action/sports photography)
   * "yes" or "no" - strict binary choice
   */
  isFastShutterSpeed: "yes" | "no";

  /**
   * Whether the camera/product includes a lens
   * "yes" or "no" - strict binary choice
   */
  hasLens: "yes" | "no";

  /**
   * Whether the product is optional in a setup
   * "yes" or "no" - strict binary choice
   */
  isOptional: "yes" | "no";

  /**
   * Whether the product is sold as a kit/bundle
   * "yes" or "no" - strict binary choice
   */
  isKit: "yes" | "no";

  /**
   * Whether the product is a DSLR camera
   * "yes" or "no" - strict binary choice
   */
  isDSLR: "yes" | "no";

  /**
   * Camera type designation for cinema/photography setup wizards
   * - "mirrorless": Mirrorless camera system
   * - "dslr": DSLR camera system
   * - "both": Compatible with both types or type doesn't apply (e.g., lenses, accessories)
   */
  cameraType?: "mirrorless" | "dslr" | "both";
}

/**
 * Type for the products.json file structure
 */
export interface ProductsData {
  products: Product[];
}
