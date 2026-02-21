"use client";

import { useState, useEffect, useRef, useMemo, useCallback, ReactNode } from "react";
import { useTheme } from "next-themes";
import { LayoutGrid, Layers, Grid3x3, ChevronDown, SlidersHorizontal } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import InfiniteCarousel3D, { InfiniteCarousel3DHandle } from "@/components/InfiniteCarousel3D";
import GradientBackground from "@/components/GradientBackground";
import BackgroundSelector from "@/components/BackgroundSelector";
import type { Background, LookupItem, Category } from "@/lib/supabase/queries";
import BottomSheet from "@/components/BottomSheet";
import ProductModal, { ModalData } from "@/components/ProductModal";
import FilterModal, { PRICE_RANGES } from "@/components/FilterModal";
import CategorySelector from "@/components/CategorySelector";
import { getCategoryIcon } from "@/components/CategoryIcons";
import { extractColorPalettes, FALLBACK_COLORS } from "@/utils/colorExtractor";
import type { Product } from "@/types/product";
import { useSidebarOffset } from "@/contexts/SidebarOffsetContext";

// Color palette cache to avoid re-extracting colors
const colorPaletteCache = new Map<string, string[]>();

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function NoProductsFound({
  selectedCategory,
  showAllBrandProducts,
  hasActiveFilters,
  onReset,
  className,
}: {
  selectedCategory: string;
  showAllBrandProducts: boolean;
  hasActiveFilters: boolean;
  onReset: () => void;
  className?: string;
}) {
  return (
    <div className={`flex flex-col items-center justify-center text-center ${className ?? ""}`}>
      <div className="text-6xl mb-4">🔍</div>
      <h3 className="text-2xl font-semibold text-text-primary mb-2">No Products Found</h3>
      <p className="text-text-secondary mb-4">
        No products found
        {!showAllBrandProducts && ` in the "${selectedCategory}" category`}.
        {hasActiveFilters && (
          <span className="block mt-2">Try clearing filters to see more results.</span>
        )}
      </p>
      <button onClick={onReset} className="px-4 py-2 bg-accent text-white rounded-lg hover:opacity-80 transition-opacity">
        Reset Filters
      </button>
    </div>
  );
}

function GlassButton({
  icon,
  onClick,
  children,
}: {
  icon: ReactNode;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="px-6 py-3 glass rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 font-medium text-text-primary hover:bg-accent hover:text-white flex items-center gap-2 border border-border"
      style={{
        background: 'color-mix(in srgb, var(--surface) 90%, transparent)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {icon}
      <span>{children}</span>
    </button>
  );
}

// Extract unique brands from products
interface ProductPageClientProps {
  products: Product[];
  categories: Category[];
  brands: LookupItem[];
  productTypes: LookupItem[];
  backgrounds: Background[];
}

export default function ProductPageClient({ products, categories, brands, productTypes, backgrounds }: ProductPageClientProps) {
  const carouselRef = useRef<InfiniteCarousel3DHandle>(null);
  const { setSidebarOffset } = useSidebarOffset();

  // Theme detection (SSR-safe)
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const [activeIndex, setActiveIndex] = useState(0);
  const [colorPalettes, setColorPalettes] = useState<string[][]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [backgroundMedia, setBackgroundMedia] = useState<string>('none');
  const [backgroundOverlayColor, setBackgroundOverlayColor] = useState<string>('rgba(0, 0, 0, 0.3)');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductData, setSelectedProductData] = useState<ModalData | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("Digital Camera");
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [showAllBrandProducts, setShowAllBrandProducts] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileCategoryOpen, setIsMobileCategoryOpen] = useState(false);
  const [footerTop, setFooterTop] = useState(Infinity);

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

  // Track footer position to prevent fixed elements from overlapping it
  useEffect(() => {
    const updateFooterTop = () => {
      const footer = document.querySelector('footer');
      if (footer) {
        setFooterTop(footer.getBoundingClientRect().top);
      }
    };
    updateFooterTop();
    window.addEventListener('scroll', updateFooterTop, { passive: true });
    window.addEventListener('resize', updateFooterTop);
    return () => {
      window.removeEventListener('scroll', updateFooterTop);
      window.removeEventListener('resize', updateFooterTop);
    };
  }, []);

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
  const availableBrands = useMemo(() => brands.map(b => b.name), [brands]);
  const availableTypes = useMemo(() => productTypes.map(t => t.name), [productTypes]);

  // Stable key for the carousel that changes when filter results change,
  // forcing a clean remount so scrollX / prevPositions start fresh.
  const carouselKey = useMemo(
    () => `${selectedCategory}|${selectedBrands.join(',')}|${selectedTypes.join(',')}|${selectedPriceRanges.join(',')}`,
    [selectedCategory, selectedBrands, selectedTypes, selectedPriceRanges],
  );

  // Filter products based on selected category, brand, type, and price range
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Apply category filter (skip if showing all brand products)
    if (!showAllBrandProducts) {
      filtered = filtered.filter(product => product.badgeType === selectedCategory);
    }

    // Apply brand filter (OR: product matches if ANY of its brands is selected)
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(product =>
        product.compatibleBrands?.some(b => selectedBrands.includes(b))
      );
    }

    // Apply type filter (OR: product matches any selected type)
    if (selectedTypes.length > 0) {
      filtered = filtered.filter(product =>
        selectedTypes.some(type => {
          switch (type) {
            case "Body Mirrorless":
              return !product.hasLens && !product.isKit && !product.isDSLR;
            case "Body DSLR":
              return !product.hasLens && !product.isKit && product.isDSLR;
            case "Kit Mirrorless":
              return product.hasLens && product.isKit && !product.isDSLR;
            case "Kit DSLR":
              return product.hasLens && product.isKit && product.isDSLR;
            case "All in one":
              return product.hasLens && !product.isKit;
            default:
              return false;
          }
        })
      );
    }

    // Apply price range filter (OR: product matches any selected range)
    // Parses badgePrice string (e.g. "$898" or "€500") to a number
    if (selectedPriceRanges.length > 0) {
      filtered = filtered.filter(p => {
        if (!p.badgePrice) return false;
        const price = parseFloat(p.badgePrice.replace(/[^0-9.]/g, ''));
        if (isNaN(price)) return false;
        return selectedPriceRanges.some(label => {
          const range = PRICE_RANGES.find(r => r.label === label);
          return range && price >= range.min && price < range.max;
        });
      });
    }

    return filtered;
  }, [products, selectedCategory, selectedBrands, selectedTypes, selectedPriceRanges, showAllBrandProducts]);

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
          colorPaletteCache.get(src) || FALLBACK_COLORS
        );

        setColorPalettes(cachedColors);
      } catch (error) {
        console.error("Failed to extract color palettes:", error);
        // Set fallback colors
        setColorPalettes(filteredProducts.map(() => FALLBACK_COLORS));
      } finally {
        setIsLoading(false);
      }
    };

    loadColorPalettes();
  }, [filteredProducts, isMobile]);

  // Reset active index when filters change; also reset all sub-filters on category change
  useEffect(() => {
    setActiveIndex(0);
    setSelectedBrands([]);
    setSelectedTypes([]);
    setSelectedPriceRanges([]);
  }, [selectedCategory]); // intentional: only reset sub-filters when category changes

  useEffect(() => {
    setActiveIndex(0);
  }, [selectedBrands, selectedTypes, selectedPriceRanges, showAllBrandProducts]);

  // Tell TopBar to offset its nav when showing 1-3 products in carousel mode
  useEffect(() => {
    const shouldOffset = viewMode === 'carousel' && !isMobile
      && filteredProducts.length >= 1 && filteredProducts.length <= 3;
    setSidebarOffset(shouldOffset);
    return () => setSidebarOffset(false);
  }, [viewMode, isMobile, filteredProducts.length, setSidebarOffset]);

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
      slides: product.slides,
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

  const handleApplyFilters = useCallback((brands: string[], types: string[], priceRanges: string[]) => {
    setSelectedBrands(brands);
    setSelectedTypes(types);
    setSelectedPriceRanges(priceRanges);
    setIsFilterModalOpen(false);
  }, []);

  const handleResetFilters = useCallback(() => {
    setSelectedBrands([]);
    setSelectedTypes([]);
    setSelectedPriceRanges([]);
    setSelectedCategory("Digital Camera");
    setShowAllBrandProducts(false);
    setViewMode('grid');
    setActiveIndex(0);
  }, []);

  // Get current theme (SSR-safe: use 'light' as fallback during SSR)
  const currentTheme = mounted ? resolvedTheme : 'light';
  const isDarkTheme = currentTheme === 'dark';

  const hasActiveFilters = selectedBrands.length > 0 || selectedTypes.length > 0 || selectedPriceRanges.length > 0;

  // Separate selectable backgrounds (no theme) from theme defaults
  const selectableBackgrounds = useMemo(() => backgrounds.filter(b => b.theme === null), [backgrounds]);
  const themeBackgrounds = useMemo(() => backgrounds.filter(b => b.theme !== null), [backgrounds]);

  // Resolve active background from DB data
  const activeBackground: Background | undefined = backgroundMedia === 'none'
    ? themeBackgrounds.find(b => b.theme === (isDarkTheme ? 'dark' : 'light'))
    : selectableBackgrounds.find(b => b.key === backgroundMedia);

  const isVideo = activeBackground?.type === 'video';
  const mediaSrc = activeBackground?.path ?? null;

  // Extract colors from background images for dynamic overlay
  useEffect(() => {
    // Skip color extraction when no selectable background is active
    if (backgroundMedia === 'none' || !activeBackground) {
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
          {/* Dynamic overlay - only for selectable (non-theme) backgrounds */}
          {backgroundMedia !== 'none' && activeBackground !== undefined && (
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

      {/* Filter Button — above the CategorySelector sidebar, desktop only */}
      {viewMode === 'carousel' && (
        <button
          onClick={() => setIsFilterModalOpen(true)}
          className="hidden lg:flex fixed left-4 z-20 items-center justify-center gap-2 rounded-xl shadow-2xl transition-all hover:opacity-90 active:scale-95"
          style={{
            top: '152px',
            width: '7.5rem', // w-30
            height: '40px',
            background: hasActiveFilters
              ? 'color-mix(in srgb, var(--accent) 25%, var(--surface))'
              : 'color-mix(in srgb, var(--surface) 85%, transparent)',
            border: hasActiveFilters
              ? '1px solid color-mix(in srgb, var(--accent) 60%, transparent)'
              : '1px solid var(--border)',
            backdropFilter: 'blur(16px)',
            color: hasActiveFilters
              ? 'var(--accent)'
              : 'var(--text-primary)',
          }}
          aria-label="Open filters"
        >
          <SlidersHorizontal className="w-4 h-4 shrink-0" />
          <span className="text-sm font-medium">Filters</span>
          {hasActiveFilters && (
            <span
              className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
              style={{ background: 'var(--accent)' }}
            />
          )}
        </button>
      )}

      {/* Background Selector Dropdown (Right) */}
      <BackgroundSelector backgrounds={selectableBackgrounds} value={backgroundMedia} onChange={setBackgroundMedia} />

      {/* Header Section */}
      <div className={`relative z-10 pt-16 md:pt-24 pb-4 px-4 text-center ${viewMode === 'carousel' && filteredProducts.length >= 1 && filteredProducts.length <= 3 ? 'lg:pl-[152px]' : ''}`}>
        <h1 className="text-fluid-4xl font-semibold text-text-primary drop-shadow-lg">
          Products Showcase
        </h1>
        <p className="mt-2 text-fluid-base text-text-secondary drop-shadow">
          Select a category and explore • Press Shift to scroll faster between products
        </p>
      </div>

      {/* Mobile Category + Filters Buttons */}
      <div className="md:hidden relative z-10 flex justify-center gap-3 pb-4">
        {/* Category picker */}
        <button
          onClick={() => setIsMobileCategoryOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 backdrop-blur-sm rounded-lg shadow-lg transition-all text-text-primary hover:shadow-xl min-h-[44px] border border-border"
          style={{
            background: 'color-mix(in srgb, var(--surface) 90%, transparent)',
          }}
        >
          {(() => {
            const Icon = getCategoryIcon(selectedCategory);
            return Icon ? (
              <Icon className="w-5 h-5 shrink-0" aria-hidden="true" />
            ) : (
              <span aria-hidden="true">{categories.find(cat => cat.name === selectedCategory)?.emoji}</span>
            );
          })()}
          <span className="text-sm font-medium">{selectedCategory}</span>
          <ChevronDown className="w-4 h-4 text-text-secondary shrink-0" />
        </button>

        {/* Filters button */}
        <button
          onClick={() => setIsFilterModalOpen(true)}
          className="relative flex items-center gap-2 px-4 py-2.5 backdrop-blur-sm rounded-lg shadow-lg transition-all hover:shadow-xl min-h-[44px]"
          style={{
            background: hasActiveFilters
              ? 'color-mix(in srgb, var(--accent) 20%, var(--surface))'
              : 'color-mix(in srgb, var(--surface) 90%, transparent)',
            border: hasActiveFilters
              ? '1px solid color-mix(in srgb, var(--accent) 60%, transparent)'
              : '1px solid var(--border)',
            color: hasActiveFilters
              ? 'var(--accent)'
              : 'var(--text-primary)',
          }}
          aria-label="Open filters"
        >
          <SlidersHorizontal className="w-4 h-4 shrink-0" />
          <span className="text-sm font-medium">Filters</span>
          {hasActiveFilters && (
            <span
              className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
              style={{ background: 'var(--accent)' }}
            />
          )}
        </button>
      </div>

      {/* Main Content: Sidebar + Carousel/Grid */}
      <div className="relative z-0 px-4">
        {/* Category Sidebar - Fixed Overlay (Only in Carousel Mode, Hidden on Mobile) */}
        {viewMode === 'carousel' && (
          <div className="hidden lg:block fixed left-4 top-[200px] w-30 z-20 glass rounded-xl shadow-2xl overflow-hidden transition-opacity duration-300 border border-border" style={{
            background: 'color-mix(in srgb, var(--surface) 85%, transparent)',
            backdropFilter: 'blur(16px)',
            height: mounted ? Math.max(0, Math.min(window.innerHeight - 240, footerTop - 200 - 16)) : 'calc(100vh - 240px)'
          }}>
            <CategorySelector
              categories={categories}
              selectedCategory={selectedCategory}
              onCategorySelect={setSelectedCategory}
            />
          </div>
        )}

        {/* Carousel or Grid View */}
        {viewMode === 'carousel' && !isMobile ? (
          <div className="w-full h-[calc(100vh-180px)] relative mt-5">
            {filteredProducts.length >= 4 ? (
              /* 4+ products — full infinite carousel */
              <InfiniteCarousel3D
                key={carouselKey}
                ref={carouselRef}
                onActiveIndexChange={handleActiveIndexChange}
                cardWidth={cardWidth}
                cardGap={cardGap}
                autoPlayDelay={3000}
              >
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAmazonUKClick={() => handleAmazonUK(product.id)}
                    onAmazonUSClick={() => handleAmazonUS(product.id)}
                    onButtonClick={() => handleOpenModal(product)}
                  />
                ))}
              </InfiniteCarousel3D>
            ) : filteredProducts.length === 1 ? (
              /* 1 product — centered, full container height */
              <div className="flex items-center justify-center h-full lg:pl-[152px]">
                <div style={{ height: '100%', aspectRatio: '600 / 850' }}>
                  <ProductCard
                    product={filteredProducts[0]}
                    onAmazonUKClick={() => handleAmazonUK(filteredProducts[0].id)}
                    onAmazonUSClick={() => handleAmazonUS(filteredProducts[0].id)}
                    onButtonClick={() => handleOpenModal(filteredProducts[0])}
                  />
                </div>
              </div>
            ) : filteredProducts.length > 1 ? (
              /* 2-3 products — static row, no carousel */
              <div className="flex items-center justify-center h-full gap-8 lg:pl-[152px]">
                {filteredProducts.map((product) => (
                  <div key={product.id} style={{ height: '100%', aspectRatio: '600 / 850' }}>
                    <ProductCard
                      product={product}
                      onAmazonUKClick={() => handleAmazonUK(product.id)}
                      onAmazonUSClick={() => handleAmazonUS(product.id)}
                      onButtonClick={() => handleOpenModal(product)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              /* 0 products — empty state */
              <NoProductsFound
                className="h-full lg:pl-[152px]"
                selectedCategory={selectedCategory}
                showAllBrandProducts={showAllBrandProducts}
                hasActiveFilters={hasActiveFilters}
                onReset={handleResetFilters}
              />
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
                    product={product}
                    onAmazonUKClick={() => handleAmazonUK(product.id)}
                    onAmazonUSClick={() => handleAmazonUS(product.id)}
                    onButtonClick={() => handleOpenModal(product)}
                  />
                ))}
              </div>
            ) : (
              <NoProductsFound
                className="min-h-[calc(100vh-300px)]"
                selectedCategory={selectedCategory}
                showAllBrandProducts={showAllBrandProducts}
                hasActiveFilters={hasActiveFilters}
                onReset={handleResetFilters}
              />
            )}
          </div>
        )}
      </div>

      {/* Footer: Toggle Button + Counter */}
      {filteredProducts.length > 0 && (
        <div className={`relative z-10 pb-4 pt-5 hidden md:flex flex-col items-center gap-4 ${viewMode === 'carousel' && filteredProducts.length >= 1 && filteredProducts.length <= 3 ? 'lg:pl-[152px]' : ''}`}>
          {/* Conditional Buttons: Brand-specific OR Standard Toggle */}
          {selectedBrands.length === 1 && !showAllBrandProducts ? (
            // Show TWO buttons when exactly one brand is selected
            <div className="flex flex-row gap-4 items-center">
              {/* Button 1: See all [Brand] products */}
              <GlassButton icon={<LayoutGrid size={20} />} onClick={handleShowAllBrandProducts}>
                See all {selectedBrands[0]} products
              </GlassButton>

              {/* Button 2: See all products */}
              <GlassButton icon={<Grid3x3 size={20} />} onClick={handleResetFilters}>
                See all products
              </GlassButton>
            </div>
          ) : showAllBrandProducts ? (
            // Show "Back to Carousel View" button when showing all brand products
            <GlassButton icon={<Layers size={20} />} onClick={handleBackToCarousel}>
              Back to Carousel View
            </GlassButton>
          ) : (
            // Standard view mode toggle button
            <GlassButton
              icon={viewMode === 'carousel' ? <LayoutGrid size={20} /> : <Layers size={20} />}
              onClick={() => setViewMode(viewMode === 'carousel' ? 'grid' : 'carousel')}
            >
              {viewMode === 'carousel' ? 'See All Products' : 'Carousel View'}
            </GlassButton>
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

      {/* Filter Modal (desktop + mobile) */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        brands={availableBrands}
        types={availableTypes}
        selectedBrands={selectedBrands}
        selectedTypes={selectedTypes}
        selectedPriceRanges={selectedPriceRanges}
        onApply={handleApplyFilters}
      />

      {/* Mobile Category Bottom Sheet */}
      <div className="md:hidden">
        <BottomSheet
          isOpen={isMobileCategoryOpen}
          onClose={() => setIsMobileCategoryOpen(false)}
          title="Select Category"
        >
          <div className="flex flex-col gap-2">
            {categories.map((category) => (
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
                {(() => {
                  const Icon = getCategoryIcon(category.name);
                  return Icon ? (
                    <Icon className="w-6 h-6 shrink-0" aria-label={category.name} />
                  ) : (
                    <span className="text-2xl" role="img" aria-label={category.name}>{category.emoji}</span>
                  );
                })()}
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </BottomSheet>
      </div>
    </main>
  );
}
