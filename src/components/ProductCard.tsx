"use client";

import { useMemo, useRef, useState, useEffect, useCallback, memo } from "react";
import Image from "next/image";
import Badge3D from "./Badge3D";
import type { Product } from "../types/product";

// Base dimensions (used only for aspect ratio and scale calculation for badges/font)
const BASE_WIDTH = 600;
const BASE_HEIGHT = 850;

/**
 * Auto-fitting text that shrinks (via CSS scale) when the text is wider
 * than its container. Never grows beyond 1× — only shrinks to fit.
 * Uses a hidden measurement span so layout is not affected.
 */
function AutoFitText({
  children,
  className,
  style,
}: {
  children: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [scaleX, setScaleX] = useState(1);

  const measure = useCallback(() => {
    const container = containerRef.current;
    const text = textRef.current;
    if (!container || !text) return;
    // Subtract padding to get the actual available space for text
    const cs = getComputedStyle(container);
    const availableW = container.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    const textW = text.scrollWidth;
    if (textW > 0 && availableW > 0) {
      setScaleX(Math.min(1, availableW / textW));
    }
  }, []);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [measure, children]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        ...style,
        overflow: 'hidden',
      }}
    >
      <span
        ref={textRef}
        style={{
          display: 'inline-block',
          transform: `scaleX(${scaleX})`,
          transformOrigin: 'center',
          whiteSpace: 'nowrap',
        }}
      >
        {children}
      </span>
    </div>
  );
}

function InfoDisplayButton({
  label,
  infoButtonSrc,
  leftPercent,
  topPercent,
  widthPercent,
  heightPercent,
  scale,
}: {
  label: string;
  infoButtonSrc: string;
  leftPercent: number;
  topPercent: number;
  widthPercent: number;
  heightPercent: number;
  scale: number;
}) {
  return (
    <div
      className="absolute cursor-default hover:opacity-80 transition-opacity overflow-hidden"
      style={{
        left: `${leftPercent}%`,
        top: `${topPercent}%`,
        width: `${widthPercent}%`,
        height: `${heightPercent}%`,
        borderRadius: '15%',
        zIndex: 31,
      }}
    >
      <Image src={infoButtonSrc} alt={label} fill priority className="object-contain" />
      <AutoFitText
        className="absolute inset-0 flex items-center justify-center font-montserrat font-bold text-white"
        style={{ fontSize: `clamp(7px, ${2 * scale}vw, 14px)`, padding: '0 6%' }}
      >
        {label}
      </AutoFitText>
    </div>
  );
}

function InfoAmazonButton({
  label,
  infoButtonSrc,
  leftPercent,
  topPercent,
  widthPercent,
  heightPercent,
  scale,
  onClick,
  clickDivLeft,
}: {
  label: string;
  infoButtonSrc: string;
  leftPercent: number;
  topPercent: number;
  widthPercent: number;
  heightPercent: number;
  scale: number;
  onClick?: () => void;
  clickDivLeft: string;
}) {
  return (
    <button
      type="button"
      className="absolute hover:opacity-80 transition-all outline-none active:scale-95 overflow-hidden"
      style={{
        left: `${leftPercent}%`,
        top: `${topPercent}%`,
        width: `${widthPercent}%`,
        height: `${heightPercent}%`,
        borderRadius: '15%',
        zIndex: 31,
        pointerEvents: 'none',
      }}
      aria-label={label}
    >
      <div
        onClick={onClick}
        className="absolute cursor-pointer"
        style={{ left: clickDivLeft, top: 0, width: '50%', height: '100%', pointerEvents: 'auto', zIndex: 2 }}
      />
      <Image src={infoButtonSrc} alt={label} fill priority className="object-contain" style={{ pointerEvents: 'none' }} />
      <AutoFitText
        className="absolute inset-0 flex items-center justify-center font-montserrat font-bold text-white"
        style={{ fontSize: `clamp(7px, ${2 * scale}vw, 14px)`, padding: '0 6%', pointerEvents: 'none' }}
      >
        {label}
      </AutoFitText>
    </button>
  );
}

// All positions as percentages of the container (which has aspectRatio 600/850).
// Derived from the base image (450×640): embossed slot edges detected via
// row-brightness-difference analysis at the following y-positions:
//   Info slots:   55.2% – 60.2%   (centre ≈ 57.7%)
//   Main slot:    65.2% – 70.2%   (centre ≈ 67.7%)
//   Amazon slots: 75.2% – 80.2%   (centre ≈ 77.7%)
// Screen cutout:  x 24.2% – 88.7%,  y 12.5% – 41.4%
const LAYOUT = {
  // Product image viewport (the transparent screen cutout)
  viewport: {
    left: 24.2,      // % of width
    top: 12.5,       // % of height
    width: 64.5,     // % of width  (88.7 − 24.2)
    height: 28.9,    // % of height (41.4 − 12.5)
    borderRadius: 1.67, // % of width
  },
  // Camera name text
  cameraName: {
    top: 44.5,       // % of height – just below cutout bottom (41.4%) with small gap
  },
  // Info buttons row (top pair: "23 mpx" / "CMOS 1/24")
  // Button image: 333×115 (AR 2.9:1). Container sized to match image AR so
  // object-contain fills the box fully: 27%w → 6.55%h at card AR 600/850.
  infoButtons: {
    top: 50,       // % of height – vertically centered on embossed slot (55.2–60.2)
    width: 30,       // % of width (each button)
    height: 15,    // % of height – matches button image AR at this width
    leftOffset: 25,  // % of width (left edge of left button, inside card face)
    rightOffset: 60, // % of width (left edge of right button)
  },
  // "See full description" button
  // Button image: 477×118 (AR 4.04:1). 55%w → 9.6%h at card AR.
  mainButton: {
    top: 65,       // % of height – vertically centered on embossed slot (65.2–70.2)
    width: 55,       // % of width
    height: 9.6,     // % of height – matches button image AR at this width
  },
  // Amazon buttons row (bottom pair)
  amazonButtons: {
    top: 74.4,       // % of height – vertically centered on embossed slot (75.2–80.2)
    width: 30,       // % of width (each button)
    height: 15,    // % of height – matches button image AR at this width
    leftOffset: 25,  // % of width (left edge of left button, inside card face)
    rightOffset: 60, // % of width (left edge of right button)
  },
  // Badges row (above the card viewport)
  badges: {
    top: -1,        // % of height (kept inside card)
    centerX: 51,   // % of width (center of badge row)
  },
};

interface ProductCardProps {
  /** Pass a full Product object to auto-fill all product fields. Individual props override it. */
  product?: Product;
  baseSrc?: string;
  slides?: string[];
  className?: string;
  cameraName?: string;
  buttonSrc?: string;
  onButtonClick?: () => void;
  infoButtonSrc?: string;
  infoButtonMain?: string;
  infoButtonSecondary?: string;
  infoButtonAmazonUK?: string;
  infoButtonAmazonUS?: string;
  onAmazonUKClick?: () => void;
  onAmazonUSClick?: () => void;
  modalDescription?: string;
  modalSpecs?: { label: string; value: string }[];
  modalFeatures?: string[];
  badgeBrand?: string;
  badgeType?: string;
  badgePrice?: string;
  isNew?: boolean;
  containerWidth?: number;
}

function ProductCard({
  product,
  baseSrc = product?.baseSrc ?? "/productCardComponents/backgroundWhiteTheme/baseed.png",
  slides = product?.slides ?? [
    "/productCardComponents/backgroundWhiteTheme/s2.png",
    "/productCardComponents/backgroundWhiteTheme/slide-1.png"
  ],
  className = "",
  cameraName = product?.cameraName ?? "Sony A6400",
  buttonSrc = product?.buttonSrc ?? "/productCardComponents/backgroundWhiteTheme/see-full-description-button.png",
  onButtonClick,
  infoButtonSrc = product?.infoButtonSrc ?? "/productCardComponents/backgroundWhiteTheme/button-for-details.png",
  infoButtonMain = product?.infoButtonMain,
  infoButtonSecondary = product?.infoButtonSecondary,
  infoButtonAmazonUK = product?.infoButtonAmazonUK,
  infoButtonAmazonUS = product?.infoButtonAmazonUS,
  onAmazonUKClick,
  onAmazonUSClick,
  modalDescription = product?.modalDescription,
  modalSpecs = product?.modalSpecs,
  modalFeatures = product?.modalFeatures,
  badgeBrand = product?.badgeBrand,
  badgeType = product?.badgeType,
  badgePrice = product?.badgePrice,
  isNew = product?.isNew,
  containerWidth: controlledWidth,
}: ProductCardProps) {
  // Self-measuring: track the card's actual rendered width so badges
  // scale proportionally with the card, exactly like the %-based buttons.
  const cardRef = useRef<HTMLDivElement>(null);
  const [measuredWidth, setMeasuredWidth] = useState<number>(0);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentBoxSize?.[0]?.inlineSize ?? entry.contentRect.width;
        setMeasuredWidth(w);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Scale factor derived from the card's actual width on screen.
  // controlledWidth overrides the self-measured value when provided.
  const scale = useMemo(() => {
    const w = controlledWidth || measuredWidth || BASE_WIDTH;
    return Math.max(0.4, w / BASE_WIDTH);
  }, [controlledWidth, measuredWidth]);

  return (
    <div
      ref={cardRef}
      className={`relative w-full max-w-[640px] mx-auto ${className}`}
      style={{
        aspectRatio: `${BASE_WIDTH} / ${BASE_HEIGHT}`,
        transformStyle: 'preserve-3d',
        backfaceVisibility: 'hidden',
      }}
    >
      {/* Layer 0: 3D Badges */}
      {(badgeBrand || badgeType || badgePrice) && (
        <div
          className="absolute flex items-center justify-center"
          style={{
            top: `${LAYOUT.badges.top}%`,
            left: `${LAYOUT.badges.centerX}%`,
            transform: 'translateX(-50%)',
            gap: `${Math.max(4, Math.round(20 * scale))}px`,
            zIndex: 40,
          }}
        >
          {badgeBrand && <Badge3D text={badgeBrand} variant="brand" scale={scale * 1.9} />}
          {badgeType && <Badge3D text={badgeType} variant="type" scale={scale * 1.9} />}
          {badgePrice && <Badge3D text={badgePrice} variant="price" scale={scale * 1.9} />}
        </div>
      )}

      {/* Layer 1: Base camera image */}
      <div className="absolute inset-0">
        <Image
          src={baseSrc}
          alt="Camera product"
          fill
          className="object-contain"
          priority
        />
      </div>

      {/* Layer 2: Product image (inside the screen cutout) */}
      <div
        className="absolute overflow-hidden"
        style={{
          left: `${LAYOUT.viewport.left}%`,
          top: `${LAYOUT.viewport.top}%`,
          width: `${LAYOUT.viewport.width}%`,
          height: `${LAYOUT.viewport.height}%`,
          borderRadius: `${LAYOUT.viewport.borderRadius}%`,
          zIndex: 10,
        }}
      >
        <Image
          src={slides[0]}
          alt="Product image"
          fill
          priority
          className="object-contain"
        />
      </div>

      {/* Layer 4: Camera name text */}
      <div
        className="absolute font-montserrat font-bold text-white"
        style={{
          left: `${LAYOUT.viewport.left}%`,
          top: `${LAYOUT.cameraName.top}%`,
          width: `${LAYOUT.viewport.width}%`,
          textAlign: 'center',
          zIndex: 30,
        }}
      >
        {cameraName}
      </div>

      {/* Layer 5: Top Left Info Button (Main) */}
      {infoButtonMain && (
        <InfoDisplayButton
          label={infoButtonMain}
          infoButtonSrc={infoButtonSrc}
          leftPercent={LAYOUT.infoButtons.leftOffset}
          topPercent={LAYOUT.infoButtons.top}
          widthPercent={LAYOUT.infoButtons.width}
          heightPercent={LAYOUT.infoButtons.height}
          scale={scale}
        />
      )}

      {/* Layer 5: Top Right Info Button (Secondary) */}
      {infoButtonSecondary && (
        <InfoDisplayButton
          label={infoButtonSecondary}
          infoButtonSrc={infoButtonSrc}
          leftPercent={LAYOUT.infoButtons.rightOffset}
          topPercent={LAYOUT.infoButtons.top}
          widthPercent={LAYOUT.infoButtons.width}
          heightPercent={LAYOUT.infoButtons.height}
          scale={scale}
        />
      )}

      {/* Layer 6: Main "See full description" button */}
      <button
        type="button"
        onClick={onButtonClick}
        className="absolute cursor-pointer hover:opacity-80 transition-all outline-none active:scale-95"
        style={{
          left: `${(114 - LAYOUT.mainButton.width) / 2}%`,
          top: `${LAYOUT.mainButton.top}%`,
          width: `${LAYOUT.mainButton.width}%`,
          height: `${LAYOUT.mainButton.height}%`,
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

      {/* Layer 7: Bottom Left Info Button (Amazon UK) */}
      {infoButtonAmazonUK && (
        <InfoAmazonButton
          label={infoButtonAmazonUK}
          infoButtonSrc={infoButtonSrc}
          leftPercent={LAYOUT.amazonButtons.leftOffset}
          topPercent={LAYOUT.amazonButtons.top}
          widthPercent={LAYOUT.amazonButtons.width}
          heightPercent={LAYOUT.amazonButtons.height}
          scale={scale}
          onClick={onAmazonUKClick}
          clickDivLeft="0"
        />
      )}

      {/* Layer 7: Bottom Right Info Button (Amazon US) */}
      {infoButtonAmazonUS && (
        <InfoAmazonButton
          label={infoButtonAmazonUS}
          infoButtonSrc={infoButtonSrc}
          leftPercent={LAYOUT.amazonButtons.rightOffset}
          topPercent={LAYOUT.amazonButtons.top}
          widthPercent={LAYOUT.amazonButtons.width}
          heightPercent={LAYOUT.amazonButtons.height}
          scale={scale}
          onClick={onAmazonUSClick}
          clickDivLeft="50%"
        />
      )}
    </div>
  );
}

export default memo(ProductCard);

// Export constants for reuse by other components
export { BASE_WIDTH, BASE_HEIGHT, LAYOUT };
