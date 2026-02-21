'use client';

import React, {
  useRef, useEffect, useState, useCallback,
  ReactNode, forwardRef, useImperativeHandle,
} from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface InfiniteCarousel3DProps {
  children: ReactNode[];
  onActiveIndexChange?: (index: number) => void;
  cardWidth?: number;
  cardGap?: number;
  className?: string;
  autoPlaySpeed?: number;
  autoPlayDelay?: number;
}

export interface InfiniteCarousel3DHandle {
  pause: () => void;
  resume: () => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CONFIG = {
  MAX_ROTATION: 28,
  MAX_DEPTH: 140,
  MIN_SCALE: 0.8,
  FRICTION: 0.9,
  WHEEL_SENS: 0.6,
  DRAG_SENS: 1.2,
  PERSPECTIVE: 1200,
  VELOCITY_THRESHOLD: 0.01,
  AUTO_PLAY_SPEED: 1.5,
  AUTO_PLAY_DELAY: 3000,
  SCROLL_THRESHOLD: 1.5,
  DRAG_THRESHOLD: 5,
} as const;

const CARD_ASPECT_RATIO = 850 / 600;

// ─── Utilities ────────────────────────────────────────────────────────────────

const mod = (n: number, m: number) => ((n % m) + m) % m;

const calculateTransform = (dist: number, cardSpacing: number) => {
  const nd = dist / cardSpacing;
  return {
    rotation: -nd * CONFIG.MAX_ROTATION,
    depth:    -Math.abs(nd) * CONFIG.MAX_DEPTH,
    scale:     1 - Math.abs(nd) * (1 - CONFIG.MIN_SCALE),
    opacity:   Math.max(0.3, 1 - Math.abs(nd) * 0.7),
  };
};

// ─── Component ────────────────────────────────────────────────────────────────

const InfiniteCarousel3D = forwardRef<InfiniteCarousel3DHandle, InfiniteCarousel3DProps>((
  {
    children,
    onActiveIndexChange,
    cardWidth    = 650,
    cardGap      = 100,
    className    = '',
    autoPlaySpeed = CONFIG.AUTO_PLAY_SPEED,
    autoPlayDelay = CONFIG.AUTO_PLAY_DELAY,
  },
  ref,
) => {
  const stageRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  const rafRef      = useRef<number | undefined>(undefined);
  const animateFnRef = useRef<(() => void) | null>(null);

  const engine = useRef({
    scrollX:          0,
    velocity:         0,
    lastTime:         0,
    lastInteractionTime: 0,

    isAutoPlaying:    false,
    isHovered:        false,

    // Drag state: mousedown records the start position but does NOT set
    // isDragging. We only enter drag mode when movement exceeds DRAG_THRESHOLD.
    // This prevents mousedown from interfering with simple clicks.
    isPointerDown:    false,
    isDragging:       false,
    wasDragging:      false,

    pointerStartX:    0,
    pointerStartScrollX: 0,

    targetCardIndex:  null as number | null,
    focusedCardIndex: null as number | null,

    prevPositions:    [] as number[],
    isPaused:         false,
    activeIndex:      0,
  });

  const totalCards  = children.length;
  const cardSpacing = cardWidth + cardGap;
  const trackLength = cardSpacing * totalCards;

  const configRef = useRef({ totalCards, cardSpacing, trackLength, autoPlaySpeed, autoPlayDelay, cardWidth });
  configRef.current = { totalCards, cardSpacing, trackLength, autoPlaySpeed, autoPlayDelay, cardWidth };

  const onActiveIndexChangeRef = useRef(onActiveIndexChange);
  onActiveIndexChangeRef.current = onActiveIndexChange;

  const [reactiveActiveIndex, setReactiveActiveIndex] = useState(0);
  const activeIndexTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // ── pause / resume ────────────────────────────────────────────────────────
  useImperativeHandle(ref, () => ({
    pause: () => {
      const e = engine.current;
      e.isPaused      = true;
      e.isAutoPlaying = false;
      e.velocity      = 0;
      if (rafRef.current !== undefined) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = undefined;
      }
    },
    resume: () => {
      const e  = engine.current;
      e.isPaused = false;
      const now  = performance.now();
      e.lastTime             = now;
      e.lastInteractionTime  = now;
      if (animateFnRef.current && rafRef.current === undefined) {
        animateFnRef.current();
      }
    },
  }));

  // ── updateCardPositions ─────────────────────────────────────────────────────
  const updateCardPositions = useCallback(() => {
    const e   = engine.current;
    const cfg = configRef.current;
    const stage = stageRef.current;
    if (!stage || cfg.totalCards === 0) return;

    const stageWidth = stage.offsetWidth;
    const centerX    = stageWidth / 2;

    if (cfg.totalCards === 1) {
      const card = cardsRef.current[0];
      if (card) {
        const x = centerX - cfg.cardWidth / 2;
        card.style.visibility = 'visible';
        card.style.transform  = `translateX(${x}px) translateY(-50%)`;
        card.style.opacity    = '1';
        card.style.zIndex     = '1000';
        card.style.transition = 'transform 0.15s ease-out';
        const inner = card.firstElementChild as HTMLElement | null;
        if (inner) inner.style.pointerEvents = 'auto';
        if (e.prevPositions.length === 0) e.prevPositions = [x];
        if (e.activeIndex !== 0) {
          e.activeIndex = 0;
          clearTimeout(activeIndexTimerRef.current);
          activeIndexTimerRef.current = setTimeout(() => {
            setReactiveActiveIndex(0);
            onActiveIndexChangeRef.current?.(0);
          }, 50);
        }
      }
      return;
    }

    if (e.prevPositions.length === 0) {
      e.prevPositions = Array.from({ length: cfg.totalCards }, (_, i) => {
        const p = mod(i * cfg.cardSpacing - e.scrollX, cfg.trackLength);
        return p > cfg.trackLength / 2 ? p - cfg.trackLength : p;
      });
    }

    let closestDist    = Infinity;
    let newActiveIndex = e.activeIndex;

    for (let index = 0; index < cfg.totalCards; index++) {
      const card = cardsRef.current[index];
      if (!card) continue;

      let pos = mod(index * cfg.cardSpacing - e.scrollX, cfg.trackLength);
      if (pos > cfg.trackLength / 2) pos -= cfg.trackLength;

      const prevPos   = e.prevPositions[index] ?? pos;
      const isWrapping = Math.abs(pos - prevPos) > cfg.trackLength / 3;
      e.prevPositions[index] = pos;

      const dist    = pos - centerX + cfg.cardWidth / 2;
      const absDist = Math.abs(dist);

      if (absDist < closestDist) {
        closestDist    = absDist;
        newActiveIndex = index;
      }

      const { rotation, depth, scale: baseScale, opacity } =
        calculateTransform(dist, cfg.cardSpacing);

      let finalScale = baseScale;
      if (e.focusedCardIndex === index) {
        const centeredness = 1 - Math.min(absDist / (cfg.cardSpacing * 0.5), 1);
        if (centeredness > 0) {
          const cardNaturalH = cfg.cardWidth * CARD_ASPECT_RATIO;
          const maxScale     = Math.min((stage.offsetHeight * 0.95) / cardNaturalH, 1.5);
          finalScale = baseScale + (maxScale - baseScale) * centeredness;
        }
      }

      const nd     = absDist / (stageWidth / 2);
      const zIndex = Math.round(1000 - nd * nd * 500);

      const hasTransition =
        !e.isDragging && !isWrapping && absDist < stageWidth * 0.75;

      card.style.visibility = 'visible';
      card.style.transform  = `translateX(${pos}px) translateY(-50%) perspective(${CONFIG.PERSPECTIVE}px) rotateY(${rotation}deg) translateZ(${depth}px) scale(${finalScale})`;
      card.style.opacity    = String(opacity);
      card.style.zIndex     = String(zIndex);
      card.style.transition = hasTransition
        ? 'transform 0.15s ease-out, opacity 0.15s ease-out'
        : 'none';

      // Pointer-events on inner wrapper:
      // - 'auto' on the centred card so buttons/links are clickable
      // - 'none' on non-centred cards so clicks fall through to the outer
      //   wrapper which has the onClick handler for click-to-centre
      const inner = card.firstElementChild as HTMLElement | null;
      if (inner) inner.style.pointerEvents = index === newActiveIndex ? 'auto' : 'none';
    }

    if (newActiveIndex !== e.activeIndex) {
      e.activeIndex = newActiveIndex;
      clearTimeout(activeIndexTimerRef.current);
      activeIndexTimerRef.current = setTimeout(() => {
        setReactiveActiveIndex(newActiveIndex);
        onActiveIndexChangeRef.current?.(newActiveIndex);
      }, 50);
    }
  }, []);

  // ── Animation loop ────────────────────────────────────────────────────────
  useEffect(() => {
    const animate = () => {
      const e   = engine.current;
      const cfg = configRef.current;
      if (e.isPaused) return;

      const now = performance.now();
      const dt  = Math.min((now - e.lastTime) / 1000, 0.1);
      e.lastTime = now;

      // Phase 1 – smooth-scroll to a target card
      if (e.targetCardIndex !== null && stageRef.current) {
        const sw = stageRef.current.offsetWidth;
        const cx = sw / 2;
        const targetScrollX = e.targetCardIndex * cfg.cardSpacing - cx + cfg.cardWidth / 2;
        let delta = targetScrollX - e.scrollX;
        if (delta >  cfg.trackLength / 2) delta -= cfg.trackLength;
        if (delta < -cfg.trackLength / 2) delta += cfg.trackLength;

        e.velocity = delta * 0.15;
        e.scrollX  = mod(e.scrollX + e.velocity * dt * 60, cfg.trackLength);

        if (Math.abs(delta) < 1) {
          e.targetCardIndex = null;
          e.velocity        = 0;
        }

        updateCardPositions();
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      // Phase 2 – auto-play check
      const elapsed = now - e.lastInteractionTime;
      if (
        cfg.totalCards > 1 &&
        !e.isPaused &&
        !e.isHovered &&
        !e.isDragging &&
        !e.isPointerDown &&
        Math.abs(e.velocity) < CONFIG.VELOCITY_THRESHOLD &&
        elapsed > cfg.autoPlayDelay
      ) {
        e.isAutoPlaying = true;
      }

      if (e.isAutoPlaying) e.velocity = cfg.autoPlaySpeed;

      // Phase 3 – physics
      e.scrollX = mod(e.scrollX + e.velocity * dt * 60, cfg.trackLength);
      if (!e.isAutoPlaying) {
        e.velocity *= CONFIG.FRICTION;
        if (Math.abs(e.velocity) < CONFIG.VELOCITY_THRESHOLD) e.velocity = 0;
      }

      // Phase 4 – update DOM
      updateCardPositions();
      rafRef.current = requestAnimationFrame(animate);
    };

    animateFnRef.current = animate;
    engine.current.lastTime = performance.now();
    animate();

    return () => {
      if (rafRef.current !== undefined) cancelAnimationFrame(rafRef.current);
    };
  }, [updateCardPositions]);

  // ── Initialisation ────────────────────────────────────────────────────────
  useEffect(() => {
    const e    = engine.current;
    const stage = stageRef.current;

    if (totalCards <= 1) {
      e.scrollX            = 0;
      e.lastInteractionTime = performance.now();
      return;
    }

    if (!stage) return;
    const cx  = stage.offsetWidth / 2;
    e.scrollX            = mod(-cx + cardWidth / 2, trackLength);
    e.lastInteractionTime = performance.now();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    engine.current.prevPositions = [];
  }, [totalCards]);

  // ── Wheel handler ─────────────────────────────────────────────────────────
  useEffect(() => {
    const onWheel = (ev: WheelEvent) => {
      const e = engine.current;
      if (e.isPaused) return;

      const ax = Math.abs(ev.deltaX), ay = Math.abs(ev.deltaY);
      const isHorizontal = ax > ay * CONFIG.SCROLL_THRESHOLD || ev.shiftKey;
      if (!isHorizontal) return;

      ev.preventDefault();
      e.targetCardIndex   = null;
      e.focusedCardIndex  = null;
      e.isAutoPlaying     = false;
      e.velocity         += (ax > 0 ? ev.deltaX : ev.deltaY) * CONFIG.WHEEL_SENS;
      e.lastInteractionTime = performance.now();
    };

    const stage = stageRef.current;
    stage?.addEventListener('wheel', onWheel, { passive: false });
    return () => stage?.removeEventListener('wheel', onWheel);
  }, []);

  // ── Pointer handlers (mouse + touch) ────────────────────────────────────
  //
  // Key fix: mousedown does NOT enter drag mode immediately. It only records
  // the start position. Drag mode activates when movement exceeds the threshold.
  // This means a simple click (mousedown → mouseup with no/little movement)
  // never triggers drag logic and the React onClick handler works normally.
  //
  useEffect(() => {
    const e = engine.current;

    const pointerStart = (x: number) => {
      if (e.isPaused) return;
      e.isPointerDown       = true;
      e.isDragging          = false;
      e.wasDragging         = false;
      e.pointerStartX       = x;
      e.pointerStartScrollX = e.scrollX;
      // Stop auto-play immediately on press so the carousel doesn't move
      // while the user is about to interact.
      e.isAutoPlaying       = false;
      e.velocity            = 0;
      e.lastInteractionTime = performance.now();
    };

    const pointerMove = (x: number) => {
      if (!e.isPointerDown || e.isPaused) return;
      const dx = e.pointerStartX - x;

      // Only enter drag mode once movement exceeds the threshold
      if (!e.isDragging) {
        if (Math.abs(dx) < CONFIG.DRAG_THRESHOLD) return;
        // Entering drag mode: clear any click-to-centre target
        e.isDragging       = true;
        e.targetCardIndex  = null;
        e.focusedCardIndex = null;
      }

      e.scrollX = mod(e.pointerStartScrollX + dx * CONFIG.DRAG_SENS, configRef.current.trackLength);
      updateCardPositions();
    };

    const pointerEnd = (x: number) => {
      if (!e.isPointerDown || e.isPaused) {
        e.isPointerDown = false;
        return;
      }

      if (e.isDragging) {
        // Real drag ended — apply fling velocity and suppress the next click
        e.velocity    = (e.pointerStartX - x) * CONFIG.DRAG_SENS * 0.5;
        e.wasDragging = true;
        setTimeout(() => { e.wasDragging = false; }, 300);
      }

      e.isPointerDown = false;
      e.isDragging    = false;
      e.lastInteractionTime = performance.now();
    };

    const onMouseDown  = (ev: MouseEvent)  => pointerStart(ev.clientX);
    const onMouseMove  = (ev: MouseEvent)  => pointerMove(ev.clientX);
    const onMouseUp    = (ev: MouseEvent)  => pointerEnd(ev.clientX);
    const onTouchStart = (ev: TouchEvent)  => { if (ev.touches[0])        pointerStart(ev.touches[0].clientX); };
    const onTouchMove  = (ev: TouchEvent)  => { if (ev.touches[0])        pointerMove(ev.touches[0].clientX); };
    const onTouchEnd   = (ev: TouchEvent)  => { if (ev.changedTouches[0]) pointerEnd(ev.changedTouches[0].clientX); };

    const stage = stageRef.current;
    stage?.addEventListener('mousedown',  onMouseDown);
    stage?.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('mousemove',  onMouseMove);
    window.addEventListener('mouseup',    onMouseUp);
    window.addEventListener('touchmove',  onTouchMove, { passive: true });
    window.addEventListener('touchend',   onTouchEnd,  { passive: true });

    return () => {
      stage?.removeEventListener('mousedown',  onMouseDown);
      stage?.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('mousemove',  onMouseMove);
      window.removeEventListener('mouseup',    onMouseUp);
      window.removeEventListener('touchmove',  onTouchMove);
      window.removeEventListener('touchend',   onTouchEnd);
    };
  }, [updateCardPositions]);

  // ── Card interaction handlers ─────────────────────────────────────────────

  const handleCardClick = useCallback((index: number, event: React.MouseEvent) => {
    const e = engine.current;

    // Suppress the ghost click after a real drag
    if (e.wasDragging) { e.wasDragging = false; return; }

    // If this card is already the centred (active) card, let interactive
    // children handle their own click. The inner wrapper has pointer-events
    // auto so buttons/links receive the event directly. For non-interactive
    // areas of the active card, we just ignore the click (no re-snap needed).
    if (index === e.activeIndex) return;

    // Non-centred card clicked → scroll it to centre
    e.targetCardIndex  = index;
    e.focusedCardIndex = index;
    e.isAutoPlaying    = false;
    e.lastInteractionTime = performance.now();
  }, []);

  const handleCardMouseEnter = useCallback(() => {
    const e = engine.current;
    if (e.isPaused) return;
    e.isHovered     = true;
    e.isAutoPlaying = false;
    e.velocity      = 0;
    e.lastInteractionTime = performance.now();
  }, []);

  const handleCardMouseLeave = useCallback(() => {
    const e = engine.current;
    if (e.isPaused) return;
    e.isHovered = false;
    e.lastInteractionTime = performance.now();
  }, []);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    const e = engine.current;
    if (e.isPaused) return;
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;

    event.preventDefault();
    e.targetCardIndex  = null;
    e.focusedCardIndex = null;
    e.isAutoPlaying    = false;
    e.lastInteractionTime = performance.now();
    e.velocity += event.key === 'ArrowLeft' ? -20 : 20;
  }, []);

  // ── JSX ───────────────────────────────────────────────────────────────────
  return (
    <div
      ref={stageRef}
      tabIndex={0}
      className={`relative w-full h-full overflow-hidden cursor-grab active:cursor-grabbing focus:outline-none ${className}`}
      style={{
        perspective: `${CONFIG.PERSPECTIVE}px`,
        contain:     'layout paint',
        touchAction: 'pan-y pinch-zoom',
      }}
      onKeyDown={handleKeyDown}
      onMouseEnter={handleCardMouseEnter}
      onMouseLeave={handleCardMouseLeave}
      role="region"
      aria-label="3D Product Carousel"
    >
      <div
        className="relative w-full h-full"
        style={{ transformStyle: 'preserve-3d', pointerEvents: 'none' }}
      >
        {children.map((child, index) => (
          <div
            key={index}
            ref={(el) => { if (el) cardsRef.current[index] = el; }}
            className="absolute top-1/2 left-0"
            style={{
              width:          `${cardWidth}px`,
              transformStyle: 'preserve-3d',
              willChange:     'transform, opacity',
              visibility:     'hidden',
              pointerEvents:  'auto',
            }}
            onClick={(e)      => handleCardClick(index, e)}
          >
            <div>
              {child}
            </div>
          </div>
        ))}
      </div>

      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Viewing item {reactiveActiveIndex + 1} of {totalCards}
      </div>
    </div>
  );
});

InfiniteCarousel3D.displayName = 'InfiniteCarousel3D';

export default InfiniteCarousel3D;
