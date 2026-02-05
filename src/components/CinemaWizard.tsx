'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import BrandSearchInput from './BrandSearchInput';
import ProductCard from './ProductCard';
import { Product } from '@/types/product';

interface CinemaWizardProps {
  products: Product[];
  activityColor?: string;
}

type BudgetLevel = 'low' | 'medium' | 'high';
type CameraType = 'mirrorless' | 'dslr' | 'any';

interface KitComponent {
  category: string;
  product: Product;
}

export default function CinemaWizard({ products, activityColor = '#e85a24' }: CinemaWizardProps) {
  // Wizard selections
  const [selectedBudget, setSelectedBudget] = useState<BudgetLevel | null>(null);
  const [selectedCameraType, setSelectedCameraType] = useState<CameraType | null>(null);
  const [selectedBodyBrand, setSelectedBodyBrand] = useState<string>('');
  const [selectedLensBrand, setSelectedLensBrand] = useState<string>('');
  const [kit, setKit] = useState<KitComponent[]>([]);

  // Extract available brands from products
  const availableBrands = useMemo(() => {
    const brandSet = new Set<string>();
    products.forEach(product => {
      if (product.isCinemaOnly === 'yes') {
        product.compatibleBrands?.forEach(brand => brandSet.add(brand.trim()));
      }
    });
    return Array.from(brandSet).sort();
  }, [products]);

  // Progress calculation starting at 0%
  const progress = useMemo(() => {
    if (!selectedBudget) return 0;

    if (selectedBudget === 'low') {
      // Low budget: Budget (50%) + Kit (100%)
      return kit.length > 0 ? 100 : 50;
    }

    // Medium/High budget: Budget (20%) + Camera Type (40%) + Body Brand (60%) + Lens Brand (80%) + Kit (100%)
    let completed = 1; // Budget selected
    if (selectedCameraType !== null) completed++;
    if (selectedBodyBrand) completed++;
    if (selectedLensBrand) completed++;

    if (kit.length > 0) return 100;

    return Math.round((completed / 5) * 100);
  }, [selectedBudget, selectedCameraType, selectedBodyBrand, selectedLensBrand, kit]);

  // Check if we should show Step 2 (equipment preferences)
  const showStep2 = selectedBudget === 'medium' || selectedBudget === 'high';

  // Check if we can generate the kit
  const canGenerateKit = useMemo(() => {
    if (!selectedBudget) return false;
    if (selectedBudget === 'low') return true;
    // For medium/high, need all selections (camera type can be null initially)
    return !!(selectedCameraType !== null && selectedBodyBrand && selectedLensBrand);
  }, [selectedBudget, selectedCameraType, selectedBodyBrand, selectedLensBrand]);

  // Selection handlers that reset dependent selections
  const handleBudgetSelect = (budget: BudgetLevel) => {
    setSelectedBudget(budget);
    // Reset all dependent selections
    setSelectedCameraType(null);
    setSelectedBodyBrand('');
    setSelectedLensBrand('');
    setKit([]);
  };

  const handleCameraTypeSelect = (type: CameraType) => {
    setSelectedCameraType(type);
    // Reset dependent selections
    setSelectedBodyBrand('');
    setSelectedLensBrand('');
    setKit([]);
  };

  const handleBodyBrandSelect = (brand: string) => {
    setSelectedBodyBrand(brand);
    // Reset dependent selections
    setSelectedLensBrand('');
    setKit([]);
  };

  const handleLensBrandSelect = (brand: string) => {
    setSelectedLensBrand(brand);
    // Reset kit only
    setKit([]);
  };

  // Filter products based on selections
  const filterProducts = (
    categoryFilter: string,
    existingProducts: Product[] = []
  ): Product[] => {
    return products.filter(product => {
      // Must be cinema product
      if (product.isCinemaOnly !== 'yes') return false;

      // Budget filter
      if (product.budget !== selectedBudget) return false;

      // Camera type filter (only for camera bodies)
      if (categoryFilter === 'Camera Body' && selectedCameraType && selectedCameraType !== 'any') {
        if (product.cameraType && product.cameraType !== 'both') {
          if (product.cameraType !== selectedCameraType) return false;
        }
      }

      // Brand filter for camera body
      if (categoryFilter === 'Camera Body' && selectedBodyBrand && selectedBodyBrand !== 'Any brand') {
        if (!product.compatibleBrands?.includes(selectedBodyBrand)) return false;
      }

      // Brand filter for lens
      if (categoryFilter === 'Lens' && selectedLensBrand && selectedLensBrand !== 'Any brand') {
        if (!product.compatibleBrands?.includes(selectedLensBrand)) return false;
      }

      // Category filter (based on badgeType)
      if (categoryFilter === 'Camera Body') {
        return product.badgeType === 'Digital Camera' && product.hasLens === 'no';
      }
      if (categoryFilter === 'Lens') {
        return product.badgeType === 'Lenses';
      }
      if (categoryFilter === 'Accessory') {
        return product.badgeType !== 'Digital Camera' && product.badgeType !== 'Lenses';
      }

      // Exclude already selected products
      if (existingProducts.some(p => p.id === product.id)) return false;

      return true;
    });
  };

  // Generate kit recommendation
  const generateKit = () => {
    const newKit: KitComponent[] = [];

    // Define categories to include
    const categories = ['Camera Body', 'Lens', 'Accessory'];

    categories.forEach(category => {
      const availableProducts = filterProducts(category, newKit.map(k => k.product));
      if (availableProducts.length > 0) {
        // Pick a random product from available
        const randomProduct = availableProducts[Math.floor(Math.random() * availableProducts.length)];
        newKit.push({ category, product: randomProduct });
      }
    });

    setKit(newKit);
  };

  // Reroll a specific component
  const rerollComponent = (index: number) => {
    const componentToReroll = kit[index];
    const otherComponents = kit.filter((_, i) => i !== index);
    const availableProducts = filterProducts(
      componentToReroll.category,
      otherComponents.map(k => k.product)
    );

    if (availableProducts.length > 0) {
      const randomProduct = availableProducts[Math.floor(Math.random() * availableProducts.length)];
      const newKit = [...kit];
      newKit[index] = { ...componentToReroll, product: randomProduct };
      setKit(newKit);
    }
  };

  // Reset wizard
  const resetWizard = () => {
    setSelectedBudget(null);
    setSelectedCameraType(null);
    setSelectedBodyBrand('');
    setSelectedLensBrand('');
    setKit([]);
  };

  // Auto-generate kit when prerequisites are met
  useEffect(() => {
    if (canGenerateKit && kit.length === 0) {
      generateKit();
    }
  }, [canGenerateKit]);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Progress Bar */}
      <div>
        <div className="flex justify-between text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div
          className="h-2 rounded-full overflow-hidden"
          style={{ background: 'var(--border)' }}
        >
          <div
            className="h-full transition-all duration-500 ease-out"
            style={{
              width: `${progress}%`,
              background: `linear-gradient(to right, ${activityColor}, ${activityColor}dd)`,
            }}
          />
        </div>
      </div>

      {/* Step 1: Budget Selection - Always visible */}
      <div className="space-y-4 animate-fadeIn">
        <h3 className="text-lg font-semibold" style={{ color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
          What is your budget?
        </h3>
        <div className="grid gap-3 sm:grid-cols-3">
          {(['low', 'medium', 'high'] as BudgetLevel[]).map((budget) => {
            const labels = {
              low: 'Hobbyist',
              medium: 'Enthusiast',
              high: 'Professional'
            };
            const isSelected = selectedBudget === budget;

            return (
              <label
                key={budget}
                className="flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all duration-300"
                style={{
                  background: isSelected
                    ? `linear-gradient(to right, ${activityColor}, ${activityColor}dd)`
                    : 'color-mix(in srgb, var(--surface) 80%, transparent)',
                  backdropFilter: 'blur(12px)',
                  border: isSelected ? 'none' : '1px solid var(--border)',
                  color: isSelected ? 'white' : 'var(--text-primary)',
                  transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                  boxShadow: isSelected ? `0 8px 24px ${activityColor}4d` : 'none',
                }}
              >
                <input
                  type="radio"
                  checked={isSelected}
                  onChange={() => handleBudgetSelect(budget)}
                  className="sr-only"
                />
                <div
                  className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
                  style={{
                    borderColor: isSelected ? 'white' : 'var(--border)',
                  }}
                >
                  {isSelected && (
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ background: 'white' }}
                    />
                  )}
                </div>
                <span className="font-medium">{labels[budget]}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Step 2: Camera Type Selection (visible for medium/high budget) */}
      {showStep2 && selectedBudget && (
        <div className="space-y-4 animate-fadeIn">
          <h3 className="text-lg font-semibold" style={{ color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
            What camera type do you prefer?
          </h3>
          <div className="grid gap-3 sm:grid-cols-3">
            {(['mirrorless', 'dslr', 'any'] as CameraType[]).map((type) => {
              const labels = {
                mirrorless: 'Mirrorless',
                dslr: 'DSLR',
                any: 'Does not matter'
              };
              const isSelected = selectedCameraType === type;

              return (
                <label
                  key={type}
                  className="flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all duration-300"
                  style={{
                    background: isSelected
                      ? `linear-gradient(to right, ${activityColor}, ${activityColor}dd)`
                      : 'color-mix(in srgb, var(--surface) 80%, transparent)',
                    backdropFilter: 'blur(12px)',
                    border: isSelected ? 'none' : '1px solid var(--border)',
                    color: isSelected ? 'white' : 'var(--text-primary)',
                    transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                    boxShadow: isSelected ? `0 8px 24px ${activityColor}4d` : 'none',
                  }}
                >
                  <input
                    type="radio"
                    checked={isSelected}
                    onChange={() => handleCameraTypeSelect(type)}
                    className="sr-only"
                  />
                  <div
                    className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
                    style={{
                      borderColor: isSelected ? 'white' : 'var(--border)',
                    }}
                  >
                    {isSelected && (
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ background: 'white' }}
                      />
                    )}
                  </div>
                  <span className="font-medium">{labels[type]}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 3: Camera Body Brand Selection (visible when camera type is selected for med/high, or budget is low) */}
      {selectedCameraType !== null && (
        <div className="space-y-4 animate-fadeIn">
          <BrandSearchInput
            brands={availableBrands}
            selectedBrand={selectedBodyBrand}
            onBrandSelect={handleBodyBrandSelect}
            label="Preferred camera body brand?"
            placeholder="Search brands..."
            allowAny={true}
            anyBrandLabel="Any brand"
          />
        </div>
      )}

      {/* Step 4: Lens Brand Selection (visible when body brand is selected) */}
      {selectedBodyBrand && (
        <div className="space-y-4 animate-fadeIn">
          <BrandSearchInput
            brands={availableBrands}
            selectedBrand={selectedLensBrand}
            onBrandSelect={handleLensBrandSelect}
            label="Preferred lens brand?"
            placeholder="Search lens brands..."
            allowAny={true}
            anyBrandLabel="Any brand"
          />
        </div>
      )}

      {/* Step 5: Kit Recommendation (visible when kit is generated) */}
      {kit.length > 0 && (
        <div className="mt-12 pt-8 border-t animate-fadeIn" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold" style={{ color: 'white', textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
              Your Recommended Cinema Kit
            </h2>
            <button
              onClick={resetWizard}
              className="px-4 py-2 rounded-lg transition-all hover:opacity-80"
              style={{
                background: 'color-mix(in srgb, var(--surface) 80%, transparent)',
                border: '1px solid var(--border)',
                color: 'var(--text-secondary)',
              }}
            >
              Reset Configuration
            </button>
          </div>

          {/* Kit Components */}
          <div className="grid gap-8">
            {kit.map((component, index) => (
              <div
                key={`${component.category}-${component.product.id}`}
                className="p-6 rounded-xl"
                style={{
                  background: 'color-mix(in srgb, var(--surface) 90%, transparent)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid var(--border)',
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span
                      className="text-xs font-semibold px-3 py-1 rounded-full"
                      style={{
                        background: `${activityColor}33`,
                        color: activityColor,
                      }}
                    >
                      {component.category}
                    </span>
                    <h3 className="text-xl font-semibold mt-2" style={{ color: 'var(--text-primary)' }}>
                      {component.product.cameraName}
                    </h3>
                  </div>
                  <button
                    onClick={() => rerollComponent(index)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:opacity-80"
                    style={{
                      background: `linear-gradient(to right, ${activityColor}, ${activityColor}dd)`,
                      color: 'white',
                    }}
                  >
                    <RefreshCw className="w-4 h-4" />
                    Show Alternative
                  </button>
                </div>

                {/* Product Card Preview */}
                <div className="mt-4 flex justify-center">
                  <div style={{ maxWidth: '400px', width: '100%' }}>
                    <ProductCard
                      baseSrc={component.product.baseSrc}
                      slides={component.product.slides}
                      cameraName={component.product.cameraName}
                      buttonSrc={component.product.buttonSrc}
                      infoButtonSrc={component.product.infoButtonSrc}
                      infoButtonMain={component.product.infoButtonMain}
                      infoButtonSecondary={component.product.infoButtonSecondary}
                      infoButtonAmazonUK={component.product.infoButtonAmazonUK}
                      infoButtonAmazonUS={component.product.infoButtonAmazonUS}
                      badgeBrand={component.product.badgeBrand}
                      badgeType={component.product.badgeType}
                      badgePrice={component.product.badgePrice}
                      isNew={component.product.isNew}
                      containerWidth={400}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Total Price Display (if available) */}
          {kit.some(k => k.product.badgePrice) && (
            <div
              className="mt-6 p-4 rounded-xl text-right"
              style={{
                background: `${activityColor}1a`,
                border: `1px solid ${activityColor}4d`,
              }}
            >
              <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Estimated Total Kit Price
              </div>
              <div className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>
                Contact for pricing
              </div>
            </div>
          )}
        </div>
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
