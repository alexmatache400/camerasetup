"use client";

import { useCallback, useEffect, useState, useMemo, memo } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Badge3D from "./Badge3D";
import type { Product } from "../types/product";

// Configurable viewport coordinates - adjust these if alignment is off
const VIEWPORT = {
  // Outer screen bezel
  screen: {
    left: 186,
    top: 44,
    width: 308,
    height: 228,
    radius: 12,
  },
  // Active carousel viewport (inner visible area)
  active: {
    left: 146,
    top: 125,
    width: 385,
    height: 200,
    radius: 10,
  },
  // Bezel inset (distance between screen outer and active viewport)
  inset: 6,
};

// Base dimensions
const BASE_WIDTH = 600;
const BASE_HEIGHT = 850;

// Configurable text and button positioning - adjust these as needed
const TEXT_CONFIG = {
  cameraName: {
    topMarginFromCarousel: 60, // 50 + 10px adjustment
  },
  button: {
    topMarginFromCameraName: 180, // margin from camera name text
    width: 340, // default button width for scaling
    height: 90, // default button height for scaling
  },
  infoButtons: {
    width: 330, // width of each info button
    height: 70, // height of each info button
    gap: -120, // horizontal gap between the two buttons in each row (negative = visual overlap)
    topMargin: 30, // margin from main button (for top row)
    bottomMargin: 30, // margin from main button (for bottom row)
    fontSize: 20, // font size for button text
  },
};

/**
 * ProductCard Props Interface
 *
 * NOTE: The Product type (imported from ../types/product) contains additional filtering traits
 * that are not yet displayed in the ProductCard UI:
 * - compatibleCameras: string[] - Compatible camera models
 * - compatibleBrands: string[] - Compatible brands
 * - budget: "low" | "medium" | "high" - Price category
 * - isWaterproof: "yes" | "no" - Waterproof capability
 * - isShockproof: "yes" | "no" - Shockproof capability
 * - isCinemaOnly: "yes" | "no" - Cinema-only designation
 * - isFastShutterSpeed: "yes" | "no" - Fast shutter speed capability
 * - hasLens: "yes" | "no" - Whether the product includes a lens
 * - isOptional: "yes" | "no" - Whether the product is optional in a setup
 * - isKit: "yes" | "no" - Whether the product is sold as a kit/bundle
 *
 * These traits are available in the product data for future filtering/search functionality.
 * ProductCardProps only includes fields that are currently rendered in the UI.
 */
interface ProductCardProps {
  baseSrc?: string;
  slides?: string[];
  viewport?: typeof VIEWPORT;
  className?: string;
  cameraName?: string;
  textConfig?: typeof TEXT_CONFIG;
  buttonSrc?: string;
  onButtonClick?: () => void;
  infoButtonSrc?: string;
  infoButtonMain?: string; // top left - display only
  infoButtonSecondary?: string; // top right - display only, optional
  infoButtonAmazonUK?: string; // bottom left - clickable, optional
  infoButtonAmazonUS?: string; // bottom right - clickable, optional
  onAmazonUKClick?: () => void;
  onAmazonUSClick?: () => void;
  // Modal data fields
  modalDescription?: string;
  modalSpecs?: { label: string; value: string }[];
  modalFeatures?: string[];
  // 3D Badge fields
  badgeBrand?: string;
  badgeType?: string;
  badgePrice?: string;
  // New product indicator
  isNew?: boolean;
  // Container width control (prevents layout shift)
  containerWidth?: number;
}

function ProductCard({
  baseSrc = "/productCardComponents/backgroundWhiteTheme/baseed.png",
  slides = [
    "/productCardComponents/backgroundWhiteTheme/s2.png",
    "/productCardComponents/backgroundWhiteTheme/slide-1.png"
  ],
  viewport = VIEWPORT,
  className = "",
  cameraName = "Sony A6400",
  textConfig = TEXT_CONFIG,
  buttonSrc = "/productCardComponents/backgroundWhiteTheme/see-full-description-button.png",
  onButtonClick,
  infoButtonSrc = "/productCardComponents/backgroundWhiteTheme/button-for-details.png",
  infoButtonMain,
  infoButtonSecondary,
  infoButtonAmazonUK,
  infoButtonAmazonUS,
  onAmazonUKClick,
  onAmazonUSClick,
  badgeBrand,
  badgeType,
  badgePrice,
  isNew,
  containerWidth: controlledWidth,
}: ProductCardProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [measuredWidth, setMeasuredWidth] = useState(BASE_WIDTH);
  const [isMeasured, setIsMeasured] = useState(!!controlledWidth);

  // Use controlled width if provided, otherwise use measured width
  const containerWidth = controlledWidth ?? measuredWidth;

  // Calculate scale factor for responsive sizing with minimum threshold
  // Prevents text from becoming illegible on very small screens
  const scale = useMemo(() => Math.max(0.6, containerWidth / BASE_WIDTH), [containerWidth]);

  // Scaled viewport dimensions (memoized)
  const scaledViewport = useMemo(() => ({
    left: viewport.active.left * scale,
    top: viewport.active.top * scale,
    width: viewport.active.width * scale,
    height: viewport.active.height * scale,
    radius: viewport.active.radius * scale,
  }), [scale, viewport]);

  // Carousel navigation
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  // Update scroll button states
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    // Defer initial call to avoid synchronous setState in effect
    const timer = setTimeout(() => onSelect(), 0);

    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      clearTimeout(timer);
    };
  }, [emblaApi, onSelect]);

  // Keyboard navigation - Disabled in 3D carousel context
  // The parent 3D carousel handles arrow keys for navigation
  // Individual card carousel navigation can be done via click/touch only

  // Responsive container width tracking with debouncing
  // Only runs if not in controlled mode (no prop provided)
  useEffect(() => {
    // Skip measurement if controlled width is provided
    if (controlledWidth) return;

    const updateWidth = () => {
      const container = document.getElementById("product-card-container");
      if (container) {
        setMeasuredWidth(Math.min(container.offsetWidth, BASE_WIDTH));
        setIsMeasured(true);
      }
    };

    updateWidth();

    // Debounce resize events to prevent excessive re-renders
    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updateWidth, 150);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimer);
    };
  }, [controlledWidth]);

  return (
    <div
      id="product-card-container"
      className={`relative w-full max-w-[640px] mx-auto ${className}`}
      style={{
        aspectRatio: `${BASE_WIDTH} / ${BASE_HEIGHT}`,
        transformStyle: 'preserve-3d',
        backfaceVisibility: 'hidden',
        opacity: isMeasured ? 1 : 0,
        transition: 'opacity 0.15s ease-in',
      }}
    >
      {/* Layer 0: 3D Badges (z-40) */}
      {(badgeBrand || badgeType || badgePrice) && (
        <div
          className="absolute flex items-center justify-center"
          style={{
            top: `${(viewport.active.top - 160) * scale}px`,
            left: `${(viewport.active.left + viewport.active.width / 2) * scale}px`,
            transform: 'translateX(-50%)',
            gap: `${35 * scale}px`,
            zIndex: 40,
          }}
        >
          {badgeBrand && <Badge3D text={badgeBrand} variant="brand" scale={scale * 1.4} />}
          {badgeType && <Badge3D text={badgeType} variant="type" scale={scale * 1.4} />}
          {badgePrice && <Badge3D text={badgePrice} variant="price" scale={scale * 1.4} />}
        </div>
      )}

      {/* Layer 0.5: NEW Badge (z-45) */}
      {/* Temporarily disabled */}
      {/* {isNew && (
        <div
          className="absolute"
          style={{
            left: `${-20 * scale}px`,
            top: `${1.7 * (viewport.active.top + viewport.active.height / 2) * scale}px`,
            transform: 'translateY(-50%)',
            height: `${50 * scale}px`,
            zIndex: 45,
          }}
        >
          <Badge3D text="NEW" variant="new" scale={scale * 1.4} vertical />
        </div>
      )} */}

      {/* Layer 1: Base camera image (z-0) */}
      <div className="absolute inset-0">
        <Image
          src={baseSrc}
          alt="Camera product"
          fill
          className="object-contain"
          priority
        />
      </div>

      {/* Layer 2: Carousel viewport (z-10) */}
      <div
        className="absolute overflow-hidden"
        style={{
          left: `${scaledViewport.left}px`,
          top: `${scaledViewport.top}px`,
          width: `${scaledViewport.width}px`,
          height: `${scaledViewport.height}px`,
          borderRadius: `${scaledViewport.radius}px`,
          zIndex: 10,
        }}
      >
        {/* Embla carousel container */}
        <div ref={emblaRef} className="overflow-hidden h-full">
          <div className="flex h-full">
            {slides.map((slide, index) => (
              <div
                key={index}
                className="flex-[0_0_100%] min-w-0 relative"
                style={{ height: "100%" }}
              >
                <Image
                  src={slide}
                  alt={`Product slide ${index + 1}`}
                  fill
                  priority
                  className="object-contain"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Layer 3: Arrow navigation (z-20) */}
        <div
          className="absolute inset-0 flex items-center justify-between px-3 pointer-events-none"
          style={{ zIndex: 20 }}
        >
          {/* Previous button */}
          <button
            type="button"
            onClick={scrollPrev}
            aria-label="Previous image"
            disabled={!canScrollPrev && slides.length <= 1}
            className="pointer-events-auto w-11 h-11 rounded-full border border-border flex items-center justify-center transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            style={{
              fontSize: `${14 * scale}px`,
              background: 'color-mix(in srgb, var(--surface) 80%, transparent)',
              backdropFilter: 'blur(4px)'
            }}
          >
            <ChevronLeft size={20} className="text-text-primary" />
          </button>

          {/* Next button */}
          <button
            type="button"
            onClick={scrollNext}
            aria-label="Next image"
            disabled={!canScrollNext && slides.length <= 1}
            className="pointer-events-auto w-11 h-11 rounded-full border border-border flex items-center justify-center transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            style={{
              fontSize: `${14 * scale}px`,
              background: 'color-mix(in srgb, var(--surface) 80%, transparent)',
              backdropFilter: 'blur(4px)'
            }}
          >
            <ChevronRight size={20} className="text-text-primary" />
          </button>
        </div>
      </div>

      {/* Layer 4: Camera name text */}
      <div
        className="absolute font-montserrat font-bold text-white"
        style={{
          left: `${scaledViewport.left}px`,
          top: `${scaledViewport.top + scaledViewport.height + textConfig.cameraName.topMarginFromCarousel * scale}px`,
          width: `${scaledViewport.width}px`,
          textAlign: 'center',
          zIndex: 30,
        }}
      >
        {cameraName}
      </div>

      {/* Layer 5: Main button image */}
      <button
        type="button"
        onClick={onButtonClick}
        className="absolute cursor-pointer hover:opacity-80 transition-all outline-none active:scale-95"
        style={{
          left: `${scaledViewport.left + scaledViewport.width / 2 - (textConfig.button.width * scale / 2)}px`,
          top: `${
            scaledViewport.top +
            scaledViewport.height +
            textConfig.cameraName.topMarginFromCarousel * scale +
            textConfig.button.topMarginFromCameraName * scale
          }px`,
          width: `${textConfig.button.width * scale}px`,
          height: `${textConfig.button.height * scale}px`,
          transformOrigin: "center",
          zIndex: 30,
        }}
        aria-label="See full description"
      >
        <Image
          src={buttonSrc}
          alt="See full description"
          fill
          priority
          className="object-contain pointer-events-none"
        />
      </button>

      {/* Layer 6: Info buttons */}
      {/* Top Left Info Button (Main) - Always displayed */}
      {infoButtonMain && (
        <div
          className="absolute cursor-default hover:opacity-80 transition-opacity"
          style={{
            left: `${
              scaledViewport.left +
              scaledViewport.width / 2 -
              textConfig.infoButtons.width * scale -
              (textConfig.infoButtons.gap * scale) / 2
            }px`,
            top: `${
              scaledViewport.top +
              scaledViewport.height +
              textConfig.cameraName.topMarginFromCarousel * scale +
              textConfig.button.topMarginFromCameraName * scale -
              textConfig.infoButtons.height * scale -
              textConfig.infoButtons.topMargin * scale
            }px`,
            width: `${textConfig.infoButtons.width * scale}px`,
            height: `${textConfig.infoButtons.height * scale}px`,
            transformOrigin: "center",
            zIndex: 31,
          }}
        >
          <Image
            src={infoButtonSrc}
            alt={infoButtonMain}
            fill
            priority
            className="object-contain"
          />
          <div
            className="absolute inset-0 flex items-center justify-center font-montserrat font-bold text-white"
            style={{
              fontSize: `${textConfig.infoButtons.fontSize * scale}px`,
            }}
          >
            {infoButtonMain}
          </div>
        </div>
      )}

      {/* Top Right Info Button (Secondary) - Optional */}
      {infoButtonSecondary && (
        <div
          className="absolute cursor-default hover:opacity-80 transition-opacity"
          style={{
            left: `${
              scaledViewport.left +
              scaledViewport.width / 2 +
              (textConfig.infoButtons.gap * scale) / 2
            }px`,
            top: `${
              scaledViewport.top +
              scaledViewport.height +
              textConfig.cameraName.topMarginFromCarousel * scale +
              textConfig.button.topMarginFromCameraName * scale -
              textConfig.infoButtons.height * scale -
              textConfig.infoButtons.topMargin * scale
            }px`,
            width: `${textConfig.infoButtons.width * scale}px`,
            height: `${textConfig.infoButtons.height * scale}px`,
            transformOrigin: "center",
            zIndex: 31,
          }}
        >
          <Image
            src={infoButtonSrc}
            alt={infoButtonSecondary}
            fill
            priority
            className="object-contain"
          />
          <div
            className="absolute inset-0 flex items-center justify-center font-montserrat font-bold text-white"
            style={{
              fontSize: `${textConfig.infoButtons.fontSize * scale}px`,
            }}
          >
            {infoButtonSecondary}
          </div>
        </div>
      )}

      {/* Bottom Left Info Button (Amazon UK) - Optional, Clickable */}
      {infoButtonAmazonUK && (
        <button
          type="button"
          className="absolute hover:opacity-80 transition-all outline-none active:scale-95"
          style={{
            left: `${
              scaledViewport.left +
              scaledViewport.width / 2 -
              textConfig.infoButtons.width * scale -
              (textConfig.infoButtons.gap * scale) / 2
            }px`,
            top: `${
              scaledViewport.top +
              scaledViewport.height +
              textConfig.cameraName.topMarginFromCarousel * scale +
              textConfig.button.topMarginFromCameraName * scale +
              textConfig.button.height * scale +
              textConfig.infoButtons.bottomMargin * scale
            }px`,
            width: `${textConfig.infoButtons.width * scale}px`,
            height: `${textConfig.infoButtons.height * scale}px`,
            transformOrigin: "center",
            zIndex: 31,
            pointerEvents: 'none',
          }}
          aria-label={infoButtonAmazonUK}
        >
          {/* Hit area overlay - LEFT HALF ONLY */}
          <div
            onClick={onAmazonUKClick}
            className="absolute cursor-pointer"
            style={{
              left: 0,
              top: 0,
              width: '50%',
              height: '100%',
              pointerEvents: 'auto',
              zIndex: 2,
            }}
          />
          <Image
            src={infoButtonSrc}
            alt={infoButtonAmazonUK}
            fill
            priority
            className="object-contain"
            style={{ pointerEvents: 'none' }}
          />
          <div
            className="absolute inset-0 flex items-center justify-center font-montserrat font-bold text-white"
            style={{
              fontSize: `${textConfig.infoButtons.fontSize * scale}px`,
              pointerEvents: 'none',
            }}
          >
            {infoButtonAmazonUK}
          </div>
        </button>
      )}

      {/* Bottom Right Info Button (Amazon US) - Optional, Clickable */}
      {infoButtonAmazonUS && (
        <button
          type="button"
          className="absolute hover:opacity-80 transition-all outline-none active:scale-95"
          style={{
            left: `${
              scaledViewport.left +
              scaledViewport.width / 2 +
              (textConfig.infoButtons.gap * scale) / 2
            }px`,
            top: `${
              scaledViewport.top +
              scaledViewport.height +
              textConfig.cameraName.topMarginFromCarousel * scale +
              textConfig.button.topMarginFromCameraName * scale +
              textConfig.button.height * scale +
              textConfig.infoButtons.bottomMargin * scale
            }px`,
            width: `${textConfig.infoButtons.width * scale}px`,
            height: `${textConfig.infoButtons.height * scale}px`,
            transformOrigin: "center",
            zIndex: 31,
            pointerEvents: 'none',
          }}
          aria-label={infoButtonAmazonUS}
        >
          {/* Hit area overlay - RIGHT HALF ONLY */}
          <div
            onClick={onAmazonUSClick}
            className="absolute cursor-pointer"
            style={{
              left: '50%',
              top: 0,
              width: '50%',
              height: '100%',
              pointerEvents: 'auto',
              zIndex: 2,
            }}
          />
          <Image
            src={infoButtonSrc}
            alt={infoButtonAmazonUS}
            fill
            priority
            className="object-contain"
            style={{ pointerEvents: 'none' }}
          />
          <div
            className="absolute inset-0 flex items-center justify-center font-montserrat font-bold text-white"
            style={{
              fontSize: `${textConfig.infoButtons.fontSize * scale}px`,
              pointerEvents: 'none',
            }}
          >
            {infoButtonAmazonUS}
          </div>
        </button>
      )}
    </div>
  );
}

// Memoize component to prevent unnecessary re-renders
export default memo(ProductCard);

// Export viewport and text config constants for reuse
export { VIEWPORT, BASE_WIDTH, BASE_HEIGHT, TEXT_CONFIG };
