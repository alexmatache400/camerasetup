'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';
import Button3D from './Button3D';

/**
 * ModalData Interface
 *
 * NOTE: The Product type (from @/types/product) contains additional filtering traits
 * that are not currently displayed in the modal but are available in the product data:
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
 * These traits can be added to the modal UI in the future if needed.
 */
export interface ModalData {
  cameraName: string;
  description?: string;
  features?: string[];
  specs?: { label: string; value: string }[];
  amazonUKLink?: string;
  amazonUSLink?: string;
  amazonDELink?: string;
}

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ModalData;
}

export default function ProductModal({ isOpen, onClose, data }: ProductModalProps) {
  // Close on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-4 max-md:p-0"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 backdrop-blur-xl" style={{
        background: 'var(--overlay)'
      }} />

      {/* Modal Card */}
      <div
        className="relative w-full max-w-3xl max-md:max-w-none max-md:h-full max-md:flex max-md:flex-col backdrop-blur-2xl rounded-2xl max-md:rounded-none shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'color-mix(in srgb, var(--surface) 90%, transparent)',
          border: '1px solid var(--border)',
          boxShadow: '0 25px 50px -12px var(--shadow-strong)'
        }}
      >
        {/* Header */}
        <div className="sticky top-0 backdrop-blur-md border-b px-6 py-4 flex items-center justify-between z-10" style={{
          background: 'color-mix(in srgb, var(--surface) 80%, transparent)',
          borderColor: 'var(--border)'
        }}>
          <h2 className="text-fluid-2xl font-bold text-gradient-accent font-montserrat">
            {data.cameraName}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full transition-colors text-text-secondary hover:text-accent"
            style={{
              background: 'var(--hover-overlay)'
            }}
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 md:max-h-[70vh] md:overflow-y-auto max-md:flex-1 max-md:overflow-y-auto">
          {/* Description Section */}
          {data.description && (
            <div className="mb-6">
              <h3 className="text-fluid-lg font-semibold text-gradient-accent mb-3">
                Description
              </h3>
              <p className="text-text-secondary leading-relaxed">
                {data.description}
              </p>
            </div>
          )}

          {/* Technical Specifications Section */}
          {data.specs && data.specs.length > 0 && (
            <div className="mb-6">
              <h3 className="text-fluid-lg font-semibold text-gradient-accent mb-3">
                Technical Specifications
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {data.specs.map((spec, index) => (
                  <div
                    key={index}
                    className="backdrop-blur-sm rounded-lg p-3"
                    style={{
                      background: 'color-mix(in srgb, var(--accent) 8%, var(--surface))',
                      border: '1px solid color-mix(in srgb, var(--accent) 20%, transparent)'
                    }}
                  >
                    <div className="text-sm font-medium" style={{
                      color: 'var(--accent)'
                    }}>
                      {spec.label}
                    </div>
                    <div className="text-base font-semibold text-text-primary mt-1">
                      {spec.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key Features Section */}
          {data.features && data.features.length > 0 && (
            <div>
              <h3 className="text-fluid-lg font-semibold text-gradient-accent mb-3">
                Key Features
              </h3>
              <ul className="space-y-2">
                {data.features.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-text-secondary"
                  >
                    <span className="text-xl mt-0.5" style={{color: 'var(--accent)'}}>•</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 backdrop-blur-md border-t px-6 py-4 flex items-center justify-between gap-4 z-10" style={{
          background: 'color-mix(in srgb, var(--surface) 80%, transparent)',
          borderColor: 'var(--border)'
        }}>
          {/* Amazon Buttons */}
          <div className="grid grid-cols-2 md:flex md:flex-row gap-x-2 gap-y-4 md:gap-3 w-full md:w-auto [&>*:last-child:nth-child(odd)]:col-span-2 [&>*:last-child:nth-child(odd)]:justify-self-center">
            {data.amazonUKLink && (
              <Button3D
                text="Amazon UK"
                href={data.amazonUKLink}
                scale={0.85}
              />
            )}
            {data.amazonUSLink && (
              <Button3D
                text="Amazon US"
                href={data.amazonUSLink}
                scale={0.85}
              />
            )}
            {data.amazonDELink && (
              <Button3D
                text="Amazon DE"
                href={data.amazonDELink}
                scale={0.85}
              />
            )}
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-white font-medium rounded-lg transition-all hover:opacity-90"
            style={{
              background: 'color-mix(in srgb, var(--text-secondary) 80%, transparent)'
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
