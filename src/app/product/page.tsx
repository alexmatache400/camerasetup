"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useTheme } from "next-themes";
import { LayoutGrid, Layers, Grid3x3, ChevronDown } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import InfiniteCarousel3D, { InfiniteCarousel3DHandle } from "@/components/InfiniteCarousel3D";
import GradientBackground from "@/components/GradientBackground";
import BackgroundSelector, { BackgroundMedia } from "@/components/BackgroundSelector";
import BrandSelector, { Brand } from "@/components/BrandSelector";
import TypeSelector, { ProductType } from "@/components/TypeSelector";
import BottomSheet from "@/components/BottomSheet";
import ProductModal, { ModalData } from "@/components/ProductModal";
import CategorySelector, { Category } from "@/components/CategorySelector";
import productsData from "@/data/products.json";
import { extractColorPalettes } from "@/utils/colorExtractor";
import type { Product, ProductsData } from "@/types/product";

// Define all available categories
const CATEGORIES: Category[] = [
  { name: "Digital Camera", emoji: "📷" },
  { name: "Film Camera", emoji: "🎞️" },
  { name: "Lenses", emoji: "🔭" },
  { name: "Lens Filters", emoji: "🌈" },
  { name: "Flash", emoji: "⚡" },
  { name: "Tripod", emoji: "🦵" },
  { name: "Mounts/Supports", emoji: "🔧" },
  { name: "Microphones", emoji: "🎙️" },
  { name: "SD Card", emoji: "💾" },
  { name: "Drone", emoji: "🚁" },
  { name: "Digital Accessories", emoji: "🔌" },
  { name: "Film Accessories", emoji: "📦" },
];

// Color palette cache to avoid re-extracting colors
const colorPaletteCache = new Map<string, string[]>();

// Extract unique brands from products
const getAllBrands = (products: Product[]): Brand[] => {
  const brandSet = new Set<string>();

  products.forEach(product => {
    if (product.compatibleBrands && Array.isArray(product.compatibleBrands)) {
      product.compatibleBrands.forEach(brand => {
        const normalized = brand.trim();
        if (normalized) brandSet.add(normalized);
      });
    }
  });

  return ["--All brands--", ...Array.from(brandSet).sort()];
};

// Define all available product types
const PRODUCT_TYPES: ProductType[] = [
  "--All types--",
  "Body Mirrorless",
  "Body DSLR",
  "Kit Mirrorless",
  "Kit DSLR",
  "All in one"
];

export default function Page() {
  const { products } = productsData as ProductsData;
  const carouselRef = useRef<InfiniteCarousel3DHandle>(null);

  // Theme detection (SSR-safe)
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const [activeIndex, setActiveIndex] = useState(0);
  const [colorPalettes, setColorPalettes] = useState<string[][]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [backgroundMedia, setBackgroundMedia] = useState<BackgroundMedia>('none');
  const [backgroundOverlayColor, setBackgroundOverlayColor] = useState<string>('rgba(0, 0, 0, 0.3)');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductData, setSelectedProductData] = useState<ModalData | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("Digital Camera");
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel');
  const [selectedBrand, setSelectedBrand] = useState<Brand>("--All brands--");
  const [selectedType, setSelectedType] = useState<ProductType>("--All types--");
  const [showAllBrandProducts, setShowAllBrandProducts] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileCategoryOpen, setIsMobileCategoryOpen] = useState(false);

  // Responsive carousel dimensions
  const [cardWidth, setCardWidth] = useState(378);
  const [cardGap, setCardGap] = useState(72);

  // Set mounted state on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Mobile detection and auto-switch to grid mode
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Auto-switch to grid on mobile
      if (mobile && viewMode === 'carousel') {
        setViewMode('grid');
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [viewMode]);

  // Calculate responsive carousel dimensions based on viewport width
  useEffect(() => {
    const calculateDimensions = () => {
      const width = window.innerWidth;

      // Responsive breakpoints for card width
      if (width < 480) {
        // Phone: Card takes 85% of viewport
        setCardWidth(Math.floor(width * 0.85));
        setCardGap(Math.floor(width * 0.08)); // Proportional gap
      } else if (width < 768) {
        // Large phone: Card takes 80% of viewport
        setCardWidth(Math.floor(width * 0.8));
        setCardGap(Math.floor(width * 0.1));
      } else if (width < 1024) {
        // Tablet: Slightly smaller cards
        setCardWidth(Math.floor(Math.min(350, width * 0.7)));
        setCardGap(Math.floor(width * 0.08));
      } else if (width < 1280) {
        // Small laptop: Medium cards
        setCardWidth(340);
        setCardGap(64);
      } else {
        // Desktop: Original design dimensions
        setCardWidth(378);
        setCardGap(72);
      }
    };

    // Calculate on mount
    calculateDimensions();

    // Recalculate on window resize
    window.addEventListener('resize', calculateDimensions);
    return () => window.removeEventListener('resize', calculateDimensions);
  }, []);

  // Extract available brands from all products
  const availableBrands = useMemo(() => getAllBrands(products), []);

  // Filter products based on selected category, brand, and type
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Apply category filter (skip if showing all brand products)
    if (!showAllBrandProducts) {
      filtered = filtered.filter(product => product.badgeType === selectedCategory);
    }

    // Apply brand filter
    if (selectedBrand !== "--All brands--") {
      filtered = filtered.filter(product =>
        product.compatibleBrands &&
        Array.isArray(product.compatibleBrands) &&
        product.compatibleBrands.includes(selectedBrand)
      );
    }

    // Apply type filter
    if (selectedType !== "--All types--") {
      filtered = filtered.filter(product => {
        switch (selectedType) {
          case "Body Mirrorless":
            return product.hasLens === "no" && product.isKit === "no" && product.isDSLR === "no";
          case "Body DSLR":
            return product.hasLens === "no" && product.isKit === "no" && product.isDSLR === "yes";
          case "Kit Mirrorless":
            return product.hasLens === "yes" && product.isKit === "yes" && product.isDSLR === "no";
          case "Kit DSLR":
            return product.hasLens === "yes" && product.isKit === "yes" && product.isDSLR === "yes";
          case "All in one":
            return product.hasLens === "yes" && product.isKit === "no";
          default:
            return true; // Fallback for unknown types
        }
      });
    }

    return filtered;
  }, [selectedCategory, selectedBrand, selectedType, showAllBrandProducts]); // products is from JSON import, never changes

  // Extract color palettes from filtered product images (with caching)
  useEffect(() => {
    const loadColorPalettes = async () => {
      // Skip color extraction on mobile for performance
      if (isMobile) {
        setIsLoading(false);
        return;
      }

      try {
        const imageSources = filteredProducts.map((product) => product.baseSrc);

        // Check which images are not cached
        const uncachedSources = imageSources.filter(src => !colorPaletteCache.has(src));

        // Only extract colors for uncached images
        if (uncachedSources.length > 0) {
          const palettes = await extractColorPalettes(uncachedSources);
          palettes.forEach((palette) => {
            colorPaletteCache.set(palette.imageUrl, palette.colors);
          });
        }

        // Get all colors from cache
        const cachedColors = imageSources.map(src =>
          colorPaletteCache.get(src) || [
            "rgba(100, 120, 180, 0.7)",
            "rgba(150, 100, 180, 0.7)",
            "rgba(180, 120, 100, 0.7)",
            "rgba(120, 180, 150, 0.7)",
          ]
        );

        setColorPalettes(cachedColors);
      } catch (error) {
        console.error("Failed to extract color palettes:", error);
        // Set fallback colors
        setColorPalettes(
          filteredProducts.map(() => [
            "rgba(100, 120, 180, 0.7)",
            "rgba(150, 100, 180, 0.7)",
            "rgba(180, 120, 100, 0.7)",
            "rgba(120, 180, 150, 0.7)",
          ])
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadColorPalettes();
  }, [filteredProducts, isMobile]);

  // Reset active index when filters change
  useEffect(() => {
    setActiveIndex(0);
  }, [selectedCategory, selectedBrand, showAllBrandProducts]);

  // Pause/resume carousel based on view mode
  useEffect(() => {
    if (viewMode === 'grid') {
      carouselRef.current?.pause();
    } else {
      carouselRef.current?.resume();
    }
  }, [viewMode]);

  const handleAmazonUK = useCallback((productId: number) => {
    console.log(`Amazon UK clicked for product ${productId}`);
    // Add your Amazon UK link logic here
  }, []);

  const handleAmazonUS = useCallback((productId: number) => {
    console.log(`Amazon US clicked for product ${productId}`);
    // Add your Amazon US link logic here
  }, []);

  const handleActiveIndexChange = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  const handleOpenModal = useCallback((product: Product) => {
    const modalData: ModalData = {
      cameraName: product.cameraName,
      description: product.modalDescription,
      features: product.modalFeatures,
      specs: product.modalSpecs,
      amazonUKLink: product.amazonUKLink,
      amazonUSLink: product.amazonUSLink,
      amazonDELink: product.amazonDELink,
    };
    setSelectedProductData(modalData);
    setIsModalOpen(true);
    carouselRef.current?.pause();
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedProductData(null);
    carouselRef.current?.resume();
  }, []);

  const handleShowAllBrandProducts = useCallback(() => {
    setShowAllBrandProducts(true);
    setViewMode('grid');
    setActiveIndex(0);
  }, []);

  const handleBackToCarousel = useCallback(() => {
    setShowAllBrandProducts(false);
    setViewMode('carousel');
    setActiveIndex(0);
  }, []);

  const handleResetFilters = useCallback(() => {
    setSelectedBrand("--All brands--");
    setSelectedType("--All types--");
    setSelectedCategory("Digital Camera");
    setShowAllBrandProducts(false);
    setViewMode('grid');
    setActiveIndex(0);
  }, []);

  // Get current theme (SSR-safe: use 'light' as fallback during SSR)
  const currentTheme = mounted ? resolvedTheme : 'light';
  const isDarkTheme = currentTheme === 'dark';

  // Helper to get background media source
  const getBackgroundMediaSrc = () => {
    switch (backgroundMedia) {
      case 'sparkers':
        return '/productBackgroundImages/sparkers.jpg';
      case 'magical-tree':
        return '/videoBackground/Magical_Tree.mp4';
      case 'rainbow-nebula':
        return '/videoBackground/Rainbow_Nebula.mp4';
      case 'none':
        // Show theme-appropriate background image
        return isDarkTheme ? '/imageBackground/dark.png' : '/imageBackground/light.png';
      default:
        return null;
    }
  };

  const isVideo = backgroundMedia === 'magical-tree' || backgroundMedia === 'rainbow-nebula';
  const mediaSrc = getBackgroundMediaSrc();

  // Extract colors from background images for dynamic overlay
  useEffect(() => {
    // Skip color extraction for 'none' background (no overlay needed)
    if (backgroundMedia === 'none') {
      return;
    }

    if (!mounted || !mediaSrc || isVideo) {
      // Use default overlay for videos or when not mounted
      setBackgroundOverlayColor('rgba(0, 0, 0, 0.3)');
      return;
    }

    const extractBackgroundColors = async () => {
      try {
        // Check if colors are already cached
        if (colorPaletteCache.has(mediaSrc)) {
          const colors = colorPaletteCache.get(mediaSrc)!;
          // Use the first dominant color with adjusted opacity
          const firstColor = colors[0];
          // Extract RGB values and create a semi-transparent overlay
          const overlayColor = firstColor.replace(/[\d.]+\)$/, '0.35)'); // Set opacity to 0.35
          setBackgroundOverlayColor(overlayColor);
          return;
        }

        // Extract colors from the background image
        const palettes = await extractColorPalettes([mediaSrc]);
        if (palettes.length > 0) {
          const colors = palettes[0].colors;
          colorPaletteCache.set(mediaSrc, colors);

          // Use the first dominant color with adjusted opacity
          const firstColor = colors[0];
          const overlayColor = firstColor.replace(/[\d.]+\)$/, '0.35)');
          setBackgroundOverlayColor(overlayColor);
        }
      } catch (error) {
        console.error('Failed to extract background colors:', error);
        // Fallback to default overlay
        setBackgroundOverlayColor('rgba(0, 0, 0, 0.3)');
      }
    };

    extractBackgroundColors();
  }, [mediaSrc, mounted, isVideo]);

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Background Media Layer (behind everything) */}
      {mediaSrc && (
        <div className="fixed inset-0 w-full h-full" style={{ zIndex: -2 }}>
          {isVideo ? (
            <video
              key={mediaSrc}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            >
              <source src={mediaSrc} type="video/mp4" />
            </video>
          ) : (
            <img
              src={mediaSrc}
              alt="Background"
              className="w-full h-full object-cover"
            />
          )}
          {/* Dynamic overlay - only for backgrounds that need visibility enhancement */}
          {backgroundMedia !== 'none' && (
            <div
              className="absolute inset-0 transition-colors duration-300"
              style={{ backgroundColor: backgroundOverlayColor }}
            />
          )}
        </div>
      )}

      {/* Reactive Gradient Background */}
      {!isMobile && !isLoading && colorPalettes.length > 0 && (
        <GradientBackground
          colorPalettes={colorPalettes}
          activeIndex={activeIndex}
        />
      )}

      {/* Brand Selector Dropdown (Left) */}
      <BrandSelector
        brands={availableBrands}
        selectedBrand={selectedBrand}
        onBrandSelect={setSelectedBrand}
      />

      {/* Type Selector Dropdown (Right) */}
      <TypeSelector
        types={PRODUCT_TYPES}
        selectedType={selectedType}
        onTypeSelect={setSelectedType}
      />

      {/* Background Selector Dropdown (Right) */}
      <BackgroundSelector value={backgroundMedia} onChange={setBackgroundMedia} />

      {/* Header Section */}
      <div className="relative z-10 pt-16 md:pt-24 pb-4 px-4 text-center">
        <h1 className="text-fluid-4xl font-semibold text-text-primary drop-shadow-lg">
          3D Camera Showcase
        </h1>
        <p className="mt-2 text-fluid-base text-text-secondary drop-shadow">
          Select a category and explore • Press Shift to scroll faster between products
        </p>
      </div>

      {/* Mobile Category Button */}
      <div className="md:hidden relative z-10 flex justify-center pb-4">
        <button
          onClick={() => setIsMobileCategoryOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 backdrop-blur-sm rounded-lg shadow-lg transition-all text-text-primary hover:shadow-xl min-h-[44px]"
          style={{
            background: 'color-mix(in srgb, var(--surface) 90%, transparent)',
            border: '1px solid var(--border)'
          }}
        >
          <span className="text-sm font-medium">
            {CATEGORIES.find(cat => cat.name === selectedCategory)?.emoji} {selectedCategory}
          </span>
          <ChevronDown className="w-4 h-4 text-text-secondary flex-shrink-0" />
        </button>
      </div>

      {/* Main Content: Sidebar + Carousel/Grid */}
      <div className="relative z-0 px-4">
        {/* Category Sidebar - Fixed Overlay (Only in Carousel Mode, Hidden on Mobile) */}
        {viewMode === 'carousel' && (
          <div className="hidden lg:block fixed left-4 top-[200px] w-30 h-[calc(100vh-240px)] z-20 glass rounded-xl shadow-2xl overflow-hidden transition-opacity duration-300" style={{
            background: 'color-mix(in srgb, var(--surface) 85%, transparent)',
            backdropFilter: 'blur(16px)',
            border: '1px solid var(--border)'
          }}>
            <CategorySelector
              categories={CATEGORIES}
              selectedCategory={selectedCategory}
              onCategorySelect={setSelectedCategory}
            />
          </div>
        )}

        {/* Carousel or Grid View */}
        {viewMode === 'carousel' && !isMobile ? (
          <div className="w-full h-[calc(100vh-180px)] relative mt-5">
            {filteredProducts.length > 0 ? (
              <InfiniteCarousel3D
                key={selectedCategory}
                ref={carouselRef}
                onActiveIndexChange={handleActiveIndexChange}
                cardWidth={cardWidth}
                cardGap={cardGap}
                autoPlayDelay={100}
              >
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    baseSrc={product.baseSrc}
                    slides={product.slides}
                    cameraName={product.cameraName}
                    buttonSrc={product.buttonSrc}
                    infoButtonSrc={product.infoButtonSrc}
                    infoButtonMain={product.infoButtonMain}
                    infoButtonSecondary={product.infoButtonSecondary}
                    infoButtonAmazonUK={product.infoButtonAmazonUK}
                    infoButtonAmazonUS={product.infoButtonAmazonUS}
                    onAmazonUKClick={() => handleAmazonUK(product.id)}
                    onAmazonUSClick={() => handleAmazonUS(product.id)}
                    onButtonClick={() => handleOpenModal(product)}
                    modalDescription={product.modalDescription}
                    modalFeatures={product.modalFeatures}
                    modalSpecs={product.modalSpecs}
                    badgeBrand={product.badgeBrand}
                    badgeType={product.badgeType}
                    badgePrice={product.badgePrice}
                    isNew={product.isNew}
                  />
                ))}
              </InfiniteCarousel3D>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-semibold text-text-primary mb-2">
                  No Products Found
                </h3>
                <p className="text-text-secondary mb-4">
                  No {selectedBrand !== "--All brands--" ? selectedBrand : ""} products found
                  {!showAllBrandProducts && ` in the "${selectedCategory}" category`}.
                  {selectedBrand !== "--All brands--" && !showAllBrandProducts && (
                    <span className="block mt-2">
                      Try clicking &quot;See all {selectedBrand} products&quot; to view all {selectedBrand} items.
                    </span>
                  )}
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 bg-accent text-white rounded-lg hover:opacity-80 transition-opacity"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="mx-auto max-w-7xl py-8 px-2 md:px-0 min-h-[calc(100vh-180px)]">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[50px]">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    className="mx-auto"
                    baseSrc={product.baseSrc}
                    slides={product.slides}
                    cameraName={product.cameraName}
                    buttonSrc={product.buttonSrc}
                    infoButtonSrc={product.infoButtonSrc}
                    infoButtonMain={product.infoButtonMain}
                    infoButtonSecondary={product.infoButtonSecondary}
                    infoButtonAmazonUK={product.infoButtonAmazonUK}
                    infoButtonAmazonUS={product.infoButtonAmazonUS}
                    onAmazonUKClick={() => handleAmazonUK(product.id)}
                    onAmazonUSClick={() => handleAmazonUS(product.id)}
                    onButtonClick={() => handleOpenModal(product)}
                    modalDescription={product.modalDescription}
                    modalFeatures={product.modalFeatures}
                    modalSpecs={product.modalSpecs}
                    badgeBrand={product.badgeBrand}
                    badgeType={product.badgeType}
                    badgePrice={product.badgePrice}
                    isNew={product.isNew}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[calc(100vh-300px)] text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-semibold text-text-primary mb-2">
                  No Products Found
                </h3>
                <p className="text-text-secondary mb-4">
                  No {selectedBrand !== "--All brands--" ? selectedBrand : ""} products found
                  {!showAllBrandProducts && ` in the "${selectedCategory}" category`}.
                  {selectedBrand !== "--All brands--" && !showAllBrandProducts && (
                    <span className="block mt-2">
                      Try clicking &quot;See all {selectedBrand} products&quot; to view all {selectedBrand} items.
                    </span>
                  )}
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 bg-accent text-white rounded-lg hover:opacity-80 transition-opacity"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer: Toggle Button + Counter */}
      {filteredProducts.length > 0 && (
        <div className="relative z-10 pb-4 pt-5 hidden md:flex flex-col items-center gap-4">
          {/* Conditional Buttons: Brand-specific OR Standard Toggle */}
          {selectedBrand !== "--All brands--" && !showAllBrandProducts ? (
            // Show TWO buttons when brand is selected
            <div className="flex flex-row gap-4 items-center">
              {/* Button 1: See all [Brand] products */}
              <button
                onClick={handleShowAllBrandProducts}
                className="px-6 py-3 glass rounded-lg shadow-lg
                           hover:shadow-xl transition-all duration-200
                           font-medium text-text-primary hover:bg-accent hover:text-white
                           flex items-center gap-2"
                style={{
                  background: 'color-mix(in srgb, var(--surface) 90%, transparent)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid var(--border)'
                }}
              >
                <LayoutGrid size={20} />
                <span>See all {selectedBrand} products</span>
              </button>

              {/* Button 2: See all products */}
              <button
                onClick={handleResetFilters}
                className="px-6 py-3 glass rounded-lg shadow-lg
                           hover:shadow-xl transition-all duration-200
                           font-medium text-text-primary hover:bg-accent hover:text-white
                           flex items-center gap-2"
                style={{
                  background: 'color-mix(in srgb, var(--surface) 90%, transparent)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid var(--border)'
                }}
              >
                <Grid3x3 size={20} />
                <span>See all products</span>
              </button>
            </div>
          ) : showAllBrandProducts ? (
            // Show "Back to Carousel View" button when showing all brand products
            <button
              onClick={handleBackToCarousel}
              className="px-6 py-3 glass rounded-lg shadow-lg
                         hover:shadow-xl transition-all duration-200
                         font-medium text-text-primary hover:bg-accent hover:text-white
                         flex items-center gap-2"
              style={{
                background: 'color-mix(in srgb, var(--surface) 90%, transparent)',
                backdropFilter: 'blur(12px)',
                border: '1px solid var(--border)'
              }}
            >
              <Layers size={20} />
              <span>Back to Carousel View</span>
            </button>
          ) : (
            // Standard view mode toggle button
            <button
              onClick={() => setViewMode(viewMode === 'carousel' ? 'grid' : 'carousel')}
              className="px-6 py-3 glass rounded-lg shadow-lg
                         hover:shadow-xl transition-all duration-200
                         font-medium text-text-primary hover:bg-accent hover:text-white
                         flex items-center gap-2"
              style={{
                background: 'color-mix(in srgb, var(--surface) 90%, transparent)',
                backdropFilter: 'blur(12px)',
                border: '1px solid var(--border)'
              }}
            >
              {viewMode === 'carousel' ? (
                <>
                  <LayoutGrid size={20} />
                  <span>See All Products</span>
                </>
              ) : (
                <>
                  <Layers size={20} />
                  <span>Carousel View</span>
                </>
              )}
            </button>
          )}

          {/* Counter (only in carousel mode) */}
          {viewMode === 'carousel' && (
            <p className="text-sm text-text-secondary drop-shadow">
              Viewing {activeIndex + 1} of {filteredProducts.length}
            </p>
          )}
        </div>
      )}

      {/* Product Modal */}
      {selectedProductData && (
        <ProductModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          data={selectedProductData}
        />
      )}

      {/* Mobile Category Bottom Sheet */}
      <div className="md:hidden">
        <BottomSheet
          isOpen={isMobileCategoryOpen}
          onClose={() => setIsMobileCategoryOpen(false)}
          title="Select Category"
        >
          <div className="flex flex-col gap-2">
            {CATEGORIES.map((category) => (
              <button
                key={category.name}
                onClick={() => {
                  setSelectedCategory(category.name);
                  setIsMobileCategoryOpen(false);
                }}
                className="w-full px-4 py-3 text-left rounded-lg transition-all min-h-[44px] flex items-center gap-3"
                style={{
                  background: selectedCategory === category.name
                    ? 'color-mix(in srgb, var(--accent) 15%, var(--surface))'
                    : 'transparent',
                  color: selectedCategory === category.name
                    ? 'var(--accent)'
                    : 'var(--text-secondary)',
                  fontWeight: selectedCategory === category.name ? 600 : 400,
                  border: selectedCategory === category.name
                    ? '2px solid var(--accent)'
                    : '1px solid var(--border)'
                }}
              >
                <span className="text-2xl">{category.emoji}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </BottomSheet>
      </div>
    </main>
  );
}
