'use client';

import React, { useRef, useEffect, useState, ReactNode, forwardRef, useImperativeHandle } from 'react';

interface InfiniteCarousel3DProps {
  children: ReactNode[];
  onActiveIndexChange?: (index: number) => void;
  cardWidth?: number;
  cardGap?: number;
  className?: string;
  autoPlaySpeed?: number; // Auto-play scroll speed
  autoPlayDelay?: number; // Delay before auto-play starts (ms)
}

export interface InfiniteCarousel3DHandle {
  pause: () => void;
  resume: () => void;
}

// Configuration constants
const CONFIG = {
  MAX_ROTATION: 28, // Y-axis rotation in degrees
  MAX_DEPTH: 140, // Z-translation in pixels
  MIN_SCALE: 0.8, // Minimum scale for distant cards
  FRICTION: 0.9, // Velocity decay rate (0-1)
  WHEEL_SENS: 0.6, // Mouse wheel sensitivity
  DRAG_SENS: 1.2, // Touch/mouse drag sensitivity
  PERSPECTIVE: 1200, // Perspective distance in pixels
  VELOCITY_THRESHOLD: 0.01, // Minimum velocity before clamping to zero
  AUTO_PLAY_SPEED: 1.5, // Default auto-play velocity
  AUTO_PLAY_DELAY: 100, // 0.1 seconds
  SCROLL_THRESHOLD: 1.5, // Ratio threshold for detecting horizontal scroll intent
};

/**
 * InfiniteCarousel3D Component
 * Creates a 3D infinite carousel with velocity-based scrolling and auto-play
 */
const InfiniteCarousel3D = forwardRef<InfiniteCarousel3DHandle, InfiniteCarousel3DProps>(({
  children,
  onActiveIndexChange,
  cardWidth = 650,
  cardGap = 100,
  className = '',
  autoPlaySpeed = CONFIG.AUTO_PLAY_SPEED,
  autoPlayDelay = CONFIG.AUTO_PLAY_DELAY,
}, ref) => {
  const stageRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const velocityRef = useRef(0);
  const scrollXRef = useRef(0);
  const lastTimeRef = useRef(Date.now());
  const animationFrameRef = useRef<number | undefined>(undefined);
  const [activeIndex, setActiveIndex] = useState(0);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, scrollX: 0 });

  // Auto-play state
  const lastInteractionRef = useRef(Date.now());
  const isAutoPlayingRef = useRef(false);
  const isHoveredRef = useRef(false);
  const hoveredCardIndexRef = useRef<number | null>(null);
  const isPausedRef = useRef(false);

  // Previous positions for wrap detection
  const prevPositionsRef = useRef<number[]>([]);

  // Store animate function for resume
  const animateFnRef = useRef<(() => void) | null>(null);

  // Auto-scroll to center target
  const targetCardIndexRef = useRef<number | null>(null);

  const totalCards = children.length;
  const cardSpacing = cardWidth + cardGap;
  const trackLength = cardSpacing * totalCards;

  // Reset interaction timer
  const resetInteractionTimer = () => {
    lastInteractionRef.current = Date.now();
    isAutoPlayingRef.current = false;
  };

  // Handle card background click to center
  const handleCardBackgroundClick = (index: number, e: React.MouseEvent) => {
    // Don't center if clicking on interactive elements
    const target = e.target as HTMLElement;
    if (target.tagName === 'BUTTON' || target.closest('button')) return;
    if (target.tagName === 'A' || target.closest('a')) return;
    if (target.tagName === 'INPUT' || target.closest('input')) return;

    // Set target card to smoothly scroll toward center
    targetCardIndexRef.current = index;
    isAutoPlayingRef.current = false;
  };

  // Expose pause/resume methods via ref
  useImperativeHandle(ref, () => ({
    pause: () => {
      isPausedRef.current = true;
      isAutoPlayingRef.current = false;
      velocityRef.current = 0;

      // Cancel the animation frame to stop the loop
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = undefined;
      }
    },
    resume: () => {
      isPausedRef.current = false;
      lastInteractionRef.current = Date.now();
      lastTimeRef.current = Date.now(); // Reset time to avoid huge delta

      // Restart animation loop if it was stopped
      if (animateFnRef.current && !animationFrameRef.current) {
        animateFnRef.current();
      }
    },
  }));

  // Modulo function that handles negative numbers correctly
  const mod = (n: number, m: number) => ((n % m) + m) % m;

  // Calculate 3D transform properties based on distance from center
  const calculateTransform = (distanceFromCenter: number) => {
    // Normalize distance
    const normalizedDist = distanceFromCenter / cardSpacing;

    // Calculate rotation (peaks at ±MAX_ROTATION)
    const rotation = -normalizedDist * CONFIG.MAX_ROTATION;

    // Calculate depth (farther cards move back in Z)
    const depth = -Math.abs(normalizedDist) * CONFIG.MAX_DEPTH;

    // Calculate scale (farther cards get smaller)
    const scale =
      1 - Math.abs(normalizedDist) * (1 - CONFIG.MIN_SCALE);

    // Calculate opacity (farther cards fade out)
    const opacity = Math.max(0.3, 1 - Math.abs(normalizedDist) * 0.7);

    return { rotation, depth, scale, opacity };
  };

  // Find closest card to center for better z-index distribution
  const findClosestCardDistance = () => {
    if (!stageRef.current) return 0;

    const stageWidth = stageRef.current.offsetWidth;
    const centerX = stageWidth / 2;
    let minDistance = Infinity;

    for (let index = 0; index < totalCards; index++) {
      const basePosition = index * cardSpacing;
      const wrappedPosition = mod(basePosition - scrollXRef.current, trackLength);

      let adjustedPosition = wrappedPosition;
      if (adjustedPosition > trackLength / 2) {
        adjustedPosition -= trackLength;
      }

      const distanceFromCenter = Math.abs(adjustedPosition - centerX + cardWidth / 2);
      minDistance = Math.min(minDistance, distanceFromCenter);
    }

    return minDistance;
  };

  // Apply transforms to all cards with improved z-index
  const updateCardPositions = () => {
    if (!stageRef.current) return;
    if (totalCards === 0) return; // Guard against empty carousel

    const stageWidth = stageRef.current.offsetWidth;
    const centerX = stageWidth / 2;
    let closestDistance = Infinity;
    let newActiveIndex = activeIndex;

    // Special handling for single card - center it perfectly with no transforms
    if (totalCards === 1) {
      const card = cardsRef.current[0];
      if (card) {
        // Position card at viewport center (left edge of card at centerX - cardWidth/2)
        const centeredPosition = centerX - cardWidth / 2;

        // Apply simple centered transform with no 3D effects
        card.style.transform = `translateX(${centeredPosition}px)`;
        card.style.opacity = '1'; // Full opacity - fully visible
        card.style.zIndex = '1000'; // High z-index
        card.style.transition = 'transform 0.15s ease-out, opacity 0.15s ease-out';

        // Initialize prevPositions if needed
        if (prevPositionsRef.current.length === 0) {
          prevPositionsRef.current = [centeredPosition];
        }

        // Set active index to 0 (only one card)
        if (activeIndex !== 0) {
          setActiveIndex(0);
          onActiveIndexChange?.(0);
        }
      }
      return; // Skip all the complex wrapping logic
    }

    // Initialize previous positions array on first run with actual starting positions
    if (prevPositionsRef.current.length === 0) {
      prevPositionsRef.current = new Array(totalCards).fill(0).map((_, idx) => {
        const basePosition = idx * cardSpacing;
        const wrappedPosition = mod(basePosition - scrollXRef.current, trackLength);
        return wrappedPosition > trackLength / 2
          ? wrappedPosition - trackLength
          : wrappedPosition;
      });
    }

    cardsRef.current.forEach((card, index) => {
      if (!card) return;

      // Calculate card's position in the infinite loop
      const basePosition = index * cardSpacing;
      const wrappedPosition = mod(
        basePosition - scrollXRef.current,
        trackLength
      );

      // Adjust position to center around viewport
      let adjustedPosition = wrappedPosition;
      if (adjustedPosition > trackLength / 2) {
        adjustedPosition -= trackLength;
      }

      // Detect position wrapping by comparing with previous frame
      // Wraps cause position changes > trackLength/3 (e.g., -400px → 3100px)
      // This prevents visible transitions during infinite loop wrap-around
      const prevPosition = prevPositionsRef.current[index];
      const positionDelta = Math.abs(adjustedPosition - prevPosition);
      const isWrapping = positionDelta > trackLength / 3;

      // Store current position for next frame
      prevPositionsRef.current[index] = adjustedPosition;

      // Distance from center of viewport
      const distanceFromCenter = adjustedPosition - centerX + cardWidth / 2;
      const absoluteDistance = Math.abs(distanceFromCenter);

      // Track closest card
      if (absoluteDistance < closestDistance) {
        closestDistance = absoluteDistance;
        newActiveIndex = index;
      }

      // Calculate transform properties
      const { rotation, depth, scale, opacity } =
        calculateTransform(distanceFromCenter);

      // Improved z-index calculation: base 1000, subtract squared normalized distance
      // This creates smoother z-index transitions and prevents visual "jumps"
      const normalizedDistance = absoluteDistance / (stageWidth / 2);
      const zIndex = Math.round(1000 - normalizedDistance * normalizedDistance * 500);

      // Enhanced transition logic: disable for wrapping cards and distant cards
      // Tightened threshold from stageWidth to 0.75x for better edge card handling
      const shouldHaveTransition =
        !isDraggingRef.current &&
        !isWrapping &&
        absoluteDistance < stageWidth * 0.75;

      // Apply transforms
      card.style.transform = `
        translateX(${adjustedPosition}px)
        perspective(${CONFIG.PERSPECTIVE}px)
        rotateY(${rotation}deg)
        translateZ(${depth}px)
        scale(${scale})
      `;
      card.style.opacity = String(opacity);
      card.style.zIndex = String(zIndex);

      // Conditionally apply transitions
      if (shouldHaveTransition) {
        card.style.transition = 'transform 0.15s ease-out, opacity 0.15s ease-out';
      } else {
        card.style.transition = 'none';
      }
    });

    // Update active index
    if (newActiveIndex !== activeIndex) {
      setActiveIndex(newActiveIndex);
      onActiveIndexChange?.(newActiveIndex);
    }
  };

  // Initialize carousel with first card centered on mount
  useEffect(() => {
    if (!stageRef.current) return;

    // Special handling for single card - keep at position 0 to avoid wrapping issues
    if (totalCards === 1) {
      scrollXRef.current = 0;
      lastInteractionRef.current = Date.now();
      return;
    }

    const stageWidth = stageRef.current.offsetWidth;
    const centerX = stageWidth / 2;

    // Calculate scroll position to center card 0 (first card)
    // Uses same formula as click-to-center: (cardIndex × cardSpacing) - centerX + (cardWidth / 2)
    const initialScrollX = (0 * cardSpacing) - centerX + (cardWidth / 2);

    // Set initial scroll position to center the first card
    scrollXRef.current = mod(initialScrollX, trackLength);

    // Delay auto-play start by resetting interaction timer
    lastInteractionRef.current = Date.now();
  }, []); // Run once on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps

  // Animation loop with velocity-based scrolling and auto-play
  useEffect(() => {
    const animate = () => {
      const now = Date.now();
      const dt = (now - lastTimeRef.current) / 1000; // Delta time in seconds
      lastTimeRef.current = now;

      // Skip animation if paused
      if (isPausedRef.current) {
        return; // Don't request next frame - loop stops here
      }

      // Handle auto-scroll to center target card
      if (targetCardIndexRef.current !== null && stageRef.current) {
        const stageWidth = stageRef.current.offsetWidth;
        const centerX = stageWidth / 2;

        // Calculate scroll position to center the card
        // The card's center should align with the viewport center
        const targetScrollX = (targetCardIndexRef.current * cardSpacing)
                              - centerX
                              + (cardWidth / 2);

        const currentScrollX = scrollXRef.current;

        // Calculate shortest path considering infinite loop
        let delta = targetScrollX - currentScrollX;

        // Adjust for wrapping (find shortest distance)
        if (delta > trackLength / 2) {
          delta -= trackLength;
        } else if (delta < -trackLength / 2) {
          delta += trackLength;
        }

        // Smooth easing towards target (0.15 = easing factor)
        velocityRef.current = delta * 0.15;

        // Apply velocity
        scrollXRef.current = mod(
          scrollXRef.current + velocityRef.current * dt * 60,
          trackLength
        );

        // If close enough to target, clear it (allow normal scrolling)
        if (Math.abs(delta) < 1) {
          targetCardIndexRef.current = null;
          velocityRef.current = 0;
        }

        // Update card positions and skip other logic
        updateCardPositions();
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      // Check if auto-play should be enabled
      const timeSinceInteraction = now - lastInteractionRef.current;
      const shouldAutoPlay =
        totalCards > 1 && // Disable auto-play for single card (prevents pointless wrapping)
        !isPausedRef.current &&
        !isHoveredRef.current &&
        !isDraggingRef.current &&
        Math.abs(velocityRef.current) < CONFIG.VELOCITY_THRESHOLD &&
        timeSinceInteraction > autoPlayDelay;

      if (shouldAutoPlay && !isAutoPlayingRef.current) {
        isAutoPlayingRef.current = true;
      }

      // Apply auto-play velocity
      if (isAutoPlayingRef.current) {
        velocityRef.current = autoPlaySpeed;
      }

      // Update scroll position based on velocity
      scrollXRef.current = mod(
        scrollXRef.current + velocityRef.current * dt * 60,
        trackLength
      );

      // Apply friction (only if not auto-playing)
      if (!isAutoPlayingRef.current) {
        velocityRef.current *= CONFIG.FRICTION;
      }

      // Clamp small velocities to zero (except during auto-play)
      if (!isAutoPlayingRef.current && Math.abs(velocityRef.current) < CONFIG.VELOCITY_THRESHOLD) {
        velocityRef.current = 0;
      }

      // Update card positions
      updateCardPositions();

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Store animate function for resume
    animateFnRef.current = animate;

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [totalCards, trackLength, activeIndex, autoPlaySpeed, autoPlayDelay]);

  // Mouse wheel handler with smart scroll direction detection
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isPausedRef.current) return;

      // Detect scroll direction: horizontal vs vertical
      const absDeltaX = Math.abs(e.deltaX);
      const absDeltaY = Math.abs(e.deltaY);

      // Determine if this is a horizontal scroll intent:
      // 1. Horizontal delta is greater than vertical (touchpad horizontal swipe)
      // 2. Shift key is pressed (Shift+Wheel for carousel navigation)
      const isHorizontalIntent =
        (absDeltaX > absDeltaY * CONFIG.SCROLL_THRESHOLD) ||
        e.shiftKey;

      // Only handle carousel interaction for horizontal scroll intent
      if (isHorizontalIntent) {
        e.preventDefault(); // Block default only for carousel interaction
        targetCardIndexRef.current = null; // Clear auto-center on user scroll

        // Use deltaX if available (horizontal touchpad swipe), otherwise use deltaY with Shift
        const scrollDelta = absDeltaX > 0 ? e.deltaX : e.deltaY;
        velocityRef.current += scrollDelta * CONFIG.WHEEL_SENS;
        resetInteractionTimer();
      }
      // Vertical scroll passes through to page (no preventDefault)
    };

    const stage = stageRef.current;
    if (stage) {
      stage.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (stage) {
        stage.removeEventListener('wheel', handleWheel);
      }
    };
  }, []);

  // Mouse/Touch drag handlers
  useEffect(() => {
    const handleDragStart = (clientX: number) => {
      if (isPausedRef.current) return;
      targetCardIndexRef.current = null; // Clear auto-center on user drag
      isDraggingRef.current = true;
      dragStartRef.current = { x: clientX, scrollX: scrollXRef.current };
      velocityRef.current = 0;
      resetInteractionTimer();
    };

    const handleDragMove = (clientX: number) => {
      if (!isDraggingRef.current || isPausedRef.current) return;

      const deltaX = dragStartRef.current.x - clientX;
      scrollXRef.current = mod(
        dragStartRef.current.scrollX + deltaX * CONFIG.DRAG_SENS,
        trackLength
      );
      updateCardPositions();
    };

    const handleDragEnd = (clientX: number) => {
      if (!isDraggingRef.current) return;
      if (isPausedRef.current) return;

      const deltaX = dragStartRef.current.x - clientX;
      velocityRef.current = deltaX * CONFIG.DRAG_SENS * 0.5;

      isDraggingRef.current = false;
      resetInteractionTimer();
    };

    // Mouse events
    const handleMouseDown = (e: MouseEvent) => {
      handleDragStart(e.clientX);
    };

    const handleMouseMove = (e: MouseEvent) => {
      handleDragMove(e.clientX);
    };

    const handleMouseUp = (e: MouseEvent) => {
      handleDragEnd(e.clientX);
    };

    // Touch events
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handleDragStart(e.touches[0].clientX);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handleDragMove(e.touches[0].clientX);
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (e.changedTouches.length > 0) {
        handleDragEnd(e.changedTouches[0].clientX);
      }
    };

    const stage = stageRef.current;
    if (stage) {
      stage.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);

      stage.addEventListener('touchstart', handleTouchStart, { passive: true });
      window.addEventListener('touchmove', handleTouchMove, { passive: true });
      window.addEventListener('touchend', handleTouchEnd, { passive: true });
    }

    return () => {
      if (stage) {
        stage.removeEventListener('mousedown', handleMouseDown);
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [trackLength]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isPausedRef.current) return;
      targetCardIndexRef.current = null; // Clear auto-center on keyboard input
      if (e.key === 'ArrowLeft') {
        velocityRef.current -= 20;
        resetInteractionTimer();
      } else if (e.key === 'ArrowRight') {
        velocityRef.current += 20;
        resetInteractionTimer();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Card hover handlers
  const handleCardMouseEnter = (index: number) => {
    if (isPausedRef.current) return;
    isHoveredRef.current = true;
    hoveredCardIndexRef.current = index;
    velocityRef.current = 0; // Stop movement
    resetInteractionTimer();
  };

  const handleCardMouseLeave = () => {
    if (isPausedRef.current) return;
    isHoveredRef.current = false;
    hoveredCardIndexRef.current = null;
    resetInteractionTimer();
  };

  // Reset previous positions when card count changes
  useEffect(() => {
    prevPositionsRef.current = [];
  }, [totalCards]);

  // Pre-warm GPU compositing
  useEffect(() => {
    updateCardPositions();
  }, []);

  return (
    <div
      ref={stageRef}
      className={`relative w-full h-full overflow-hidden cursor-grab active:cursor-grabbing ${className}`}
      style={{
        perspective: `${CONFIG.PERSPECTIVE}px`,
        contain: 'layout paint',
      }}
      role="region"
      aria-label="3D Product Carousel"
      aria-live="polite"
    >
      <div
        className="relative w-full h-full"
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        {children.map((child, index) => (
          <div
            key={index}
            ref={(el) => {
              if (el) cardsRef.current[index] = el;
            }}
            className="absolute top-1/2 left-0 -translate-y-1/2"
            style={{
              width: `${cardWidth}px`,
              transformStyle: 'preserve-3d',
              willChange: 'transform, opacity',
              pointerEvents: 'auto',
              visibility: prevPositionsRef.current.length > 0 ? 'visible' : 'hidden',
              opacity: prevPositionsRef.current.length > 0 ? 1 : 0,
              transition: 'opacity 0.3s ease-out',
            }}
            onClick={(e) => handleCardBackgroundClick(index, e)}
            onMouseEnter={() => handleCardMouseEnter(index)}
            onMouseLeave={handleCardMouseLeave}
          >
            {child}
          </div>
        ))}
      </div>

      {/* Accessibility: Announce active card */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Viewing item {activeIndex + 1} of {totalCards}
        {isAutoPlayingRef.current && ' - Auto-playing'}
      </div>
    </div>
  );
});

InfiniteCarousel3D.displayName = 'InfiniteCarousel3D';

export default InfiniteCarousel3D;
