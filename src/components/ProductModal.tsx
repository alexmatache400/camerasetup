'use client';

import { useEffect, useCallback, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button3D from './Button3D';
import { useModalBehavior } from '@/hooks/useModalBehavior';
import { CloseButton } from './CloseButton';

export interface ModalData {
  cameraName: string;
  slides?: string[];
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

function CarouselArrowButton({ direction, onClick }: {
  direction: 'prev' | 'next';
  onClick: () => void;
}) {
  const isPrev = direction === 'prev';
  return (
    <button
      onClick={onClick}
      aria-label={isPrev ? 'Previous image' : 'Next image'}
      className={`absolute ${isPrev ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:opacity-90 active:scale-95 border border-border`}
      style={{ background: 'color-mix(in srgb, var(--surface) 85%, transparent)', backdropFilter: 'blur(8px)' }}
    >
      {isPrev ? <ChevronLeft size={20} className="text-text-primary" /> : <ChevronRight size={20} className="text-text-primary" />}
    </button>
  );
}

function ModalCarousel({ slides }: { slides: string[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => { emblaApi.off('select', onSelect); emblaApi.off('reInit', onSelect); };
  }, [emblaApi]);

  if (slides.length === 0) return null;

  return (
    <div className="w-full mb-6">
      <div className="relative">
        {/* Carousel track */}
        <div ref={emblaRef} className="overflow-hidden rounded-xl">
          <div className="flex">
            {slides.map((src, i) => (
              <div key={i} className="flex-[0_0_100%] min-w-0 relative" style={{ height: '320px' }}>
                <Image
                  src={src}
                  alt={`Product image ${i + 1}`}
                  fill
                  priority={i === 0}
                  className="object-contain"
                  style={{ background: 'color-mix(in srgb, var(--surface) 60%, transparent)' }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Arrows — only show if more than one slide */}
        {slides.length > 1 && (
          <>
            <CarouselArrowButton direction="prev" onClick={scrollPrev} />
            <CarouselArrowButton direction="next" onClick={scrollNext} />
          </>
        )}
      </div>

      {/* Dot indicators */}
      {slides.length > 1 && (
        <div className="flex justify-center gap-2 mt-3">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              aria-label={`Go to image ${i + 1}`}
              className="w-2 h-2 rounded-full transition-all"
              style={{
                background: i === selectedIndex ? 'var(--accent)' : 'var(--border)',
                transform: i === selectedIndex ? 'scale(1.3)' : 'scale(1)',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProductModal({ isOpen, onClose, data }: ProductModalProps) {
  useModalBehavior(isOpen, onClose);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ padding: '89px 16px 25px' }}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 backdrop-blur-xl" style={{ background: 'var(--overlay)' }} />

      {/* Modal Card — full height within the padding */}
      <div
        className="relative w-full max-w-3xl h-full flex flex-col backdrop-blur-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-border"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'color-mix(in srgb, var(--surface) 90%, transparent)',
          boxShadow: '0 25px 50px -12px var(--shadow-strong)',
        }}
      >
        {/* Header */}
        <div
          className="sticky top-0 backdrop-blur-md border-b border-border px-6 py-4 flex items-center justify-between z-10 shrink-0"
          style={{
            background: 'color-mix(in srgb, var(--surface) 80%, transparent)',
          }}
        >
          <h2 className="text-fluid-2xl font-bold text-gradient-accent font-montserrat">
            {data.cameraName}
          </h2>
          <CloseButton onClick={onClose} size="lg" ariaLabel="Close modal" />
        </div>

        {/* Content — scrollable, fills remaining space */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* Image carousel */}
          {data.slides && data.slides.length > 0 && (
            <ModalCarousel slides={data.slides} />
          )}

          {/* Description Section */}
          {data.description && (
            <div className="mb-6">
              <h3 className="text-fluid-lg font-semibold text-gradient-accent mb-3">Description</h3>
              <p className="text-text-secondary leading-relaxed">{data.description}</p>
            </div>
          )}

          {/* Technical Specifications Section */}
          {data.specs && data.specs.length > 0 && (
            <div className="mb-6">
              <h3 className="text-fluid-lg font-semibold text-gradient-accent mb-3">Technical Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {data.specs.map((spec, index) => (
                  <div
                    key={index}
                    className="backdrop-blur-sm rounded-lg p-3"
                    style={{
                      background: 'color-mix(in srgb, var(--accent) 8%, var(--surface))',
                      border: '1px solid color-mix(in srgb, var(--accent) 20%, transparent)',
                    }}
                  >
                    <div className="text-sm font-medium text-accent">
                      {spec.label}
                    </div>
                    <div className="text-base font-semibold text-text-primary mt-1">{spec.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key Features Section */}
          {data.features && data.features.length > 0 && (
            <div>
              <h3 className="text-fluid-lg font-semibold text-gradient-accent mb-3">Key Features</h3>
              <ul className="space-y-2">
                {data.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-text-secondary">
                    <span className="text-xl mt-0.5 text-accent">•</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="sticky bottom-0 backdrop-blur-md border-t border-border px-6 py-4 flex items-center justify-between gap-4 z-10 shrink-0"
          style={{
            background: 'color-mix(in srgb, var(--surface) 80%, transparent)',
          }}
        >
          {/* Amazon Buttons */}
          <div className="grid grid-cols-2 md:flex md:flex-row gap-x-2 gap-y-4 md:gap-3 w-full md:w-auto [&>*:last-child:nth-child(odd)]:col-span-2 [&>*:last-child:nth-child(odd)]:justify-self-center">
            {data.amazonUKLink && <Button3D text="Amazon UK" href={data.amazonUKLink} scale={0.85} />}
            {data.amazonUSLink && <Button3D text="Amazon US" href={data.amazonUSLink} scale={0.85} />}
            {data.amazonDELink && <Button3D text="Amazon DE" href={data.amazonDELink} scale={0.85} />}
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-white font-medium rounded-lg transition-all hover:opacity-90 shrink-0"
            style={{ background: 'color-mix(in srgb, var(--text-secondary) 80%, transparent)' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
