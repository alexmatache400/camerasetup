"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import ProductCard from "@/components/ProductCard";
import InfiniteCarousel3D, { InfiniteCarousel3DHandle } from "@/components/InfiniteCarousel3D";
import GradientBackground from "@/components/GradientBackground";
import BackgroundSelector, { BackgroundMedia } from "@/components/BackgroundSelector";
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

export default function Page() {
  const { products } = productsData as ProductsData;
  const carouselRef = useRef<InfiniteCarousel3DHandle>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [colorPalettes, setColorPalettes] = useState<string[][]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [backgroundMedia, setBackgroundMedia] = useState<BackgroundMedia>('none');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductData, setSelectedProductData] = useState<ModalData | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("Digital Camera");

  // Filter products based on selected category
  const filteredProducts = useMemo(() => {
    return products.filter((product) => product.badgeType === selectedCategory);
  }, [products, selectedCategory]);

  // Extract color palettes from filtered product images
  useEffect(() => {
    const loadColorPalettes = async () => {
      try {
        const imageSources = filteredProducts.map((product) => product.baseSrc);
        const palettes = await extractColorPalettes(imageSources);
        setColorPalettes(palettes.map((p) => p.colors));
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
  }, [filteredProducts]);

  // Reset active index when category changes
  useEffect(() => {
    setActiveIndex(0);
  }, [selectedCategory]);

  const handleAmazonUK = (productId: number) => {
    console.log(`Amazon UK clicked for product ${productId}`);
    // Add your Amazon UK link logic here
  };

  const handleAmazonUS = (productId: number) => {
    console.log(`Amazon US clicked for product ${productId}`);
    // Add your Amazon US link logic here
  };

  const handleActiveIndexChange = (index: number) => {
    setActiveIndex(index);
  };

  const handleOpenModal = (product: Product) => {
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
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProductData(null);
    carouselRef.current?.resume();
  };

  // Helper to get background media source
  const getBackgroundMediaSrc = () => {
    switch (backgroundMedia) {
      case 'sparkers':
        return '/productBackgroundImages/sparkers.jpg';
      case 'magical-tree':
        return '/videoBackground/Magical_Tree.mp4';
      case 'rainbow-nebula':
        return '/videoBackground/Rainbow_Nebula.mp4';
      default:
        return null;
    }
  };

  const isVideo = backgroundMedia === 'magical-tree' || backgroundMedia === 'rainbow-nebula';
  const mediaSrc = getBackgroundMediaSrc();

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
          {/* Overlay to ensure carousel remains visible */}
          <div className="absolute inset-0 bg-black/20 dark:bg-black/40" />
        </div>
      )}

      {/* Reactive Gradient Background */}
      {!isLoading && colorPalettes.length > 0 && (
        <GradientBackground
          colorPalettes={colorPalettes}
          activeIndex={activeIndex}
        />
      )}

      {/* Background Selector Dropdown */}
      <BackgroundSelector value={backgroundMedia} onChange={setBackgroundMedia} />

      {/* Header Section */}
      <div className="relative z-10 pt-24 pb-4 text-center">
        <h1 className="text-4xl font-semibold text-gray-900 dark:text-white drop-shadow-lg">
          3D Camera Showcase
        </h1>
        <p className="mt-2 text-gray-700 dark:text-gray-300 drop-shadow">
          Select a category and explore
        </p>
      </div>

      {/* Main Content: Sidebar + Carousel */}
      <div className="relative z-0 px-4 h-[calc(100vh-180px)]">
        {/* Category Sidebar - Fixed Overlay */}
        <div className="fixed left-4 top-[200px] w-52 h-[calc(100vh-240px)] z-20 bg-white/85 dark:bg-gray-900/85 backdrop-blur-md rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <CategorySelector
            categories={CATEGORIES}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
          />
        </div>

        {/* 3D Infinite Carousel - Full Width */}
        <div className="w-full h-full relative">
          {filteredProducts.length > 0 ? (
            <InfiniteCarousel3D
              key={selectedCategory} // Force re-mount when category changes
              ref={carouselRef}
              onActiveIndexChange={handleActiveIndexChange}
              cardWidth={420}
              cardGap={80}
              autoPlayDelay={7000}
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
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                No Products Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                No products available in the &quot;{selectedCategory}&quot; category yet.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer Instructions */}
      <div className="relative z-10 pb-4 text-center">
        {filteredProducts.length > 0 && (
          <p className="text-sm text-gray-600 dark:text-gray-400 drop-shadow">
            Viewing {activeIndex + 1} of {filteredProducts.length}
          </p>
        )}
      </div>

      {/* Product Modal */}
      {selectedProductData && (
        <ProductModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          data={selectedProductData}
        />
      )}
    </main>
  );
}
