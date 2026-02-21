'use client';

import { Suspense, useState, useEffect, useRef, useCallback} from 'react';
import { Canvas } from '@react-three/fiber';
import { useRouter } from 'next/navigation';
import SceneSetup from './SceneSetup';
import ActivityCard3D from './ActivityCard3D';
import CameraController from './CameraController';
import type { Activity } from '@/types/activity';

/**
 * ActivityScene3D Component
 *
 * Main 3D scene component that manages the Canvas, activities, and interactions.
 * Handles selection state, navigation, and scroll gestures.
 */
export default function ActivityScene3D({ activities }: { activities: Activity[] }) {
  const router = useRouter();
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [zoomProgress, setZoomProgress] = useState(0); // 0-1 progress for zoom animation
  const [isZooming, setIsZooming] = useState(false);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 }); // Camera pan offset for exploration
  const canvasRef = useRef<HTMLDivElement>(null);
  const scrollAccumulator = useRef(0);
  const lastClickTime = useRef(0);
  const clickTimeout = useRef<NodeJS.Timeout | null>(null);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const zoomThreshold = 300; // pixels to scroll to reach 100% zoom

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Handle single click - select card
  const handleCardClick = (activity: Activity) => {
    if (isNavigating) return;

    const now = Date.now();
    const timeSinceLastClick = now - lastClickTime.current;

    // Clear any pending single-click timeout
    if (clickTimeout.current) {
      clearTimeout(clickTimeout.current);
      clickTimeout.current = null;
    }

    // If this is a double click (within 300ms), don't process as single click
    if (timeSinceLastClick < 300) {
      return;
    }

    lastClickTime.current = now;

    // Delay single-click action to detect potential double-click
    clickTimeout.current = setTimeout(() => {
      if (selectedActivity?.id === activity.id) {
        // Clicking the same card again - do nothing (deselect only via Escape)
        return;
      } else {
        // Select new card - keep zoom progress but reset pan
        setSelectedActivity(activity);
        // Don't reset zoom progress when switching cards during zoom
        if (zoomProgress === 0) {
          scrollAccumulator.current = 0;
          setZoomProgress(0);
          setIsZooming(false);
        }
        setPanOffset({ x: 0, y: 0 }); // Reset pan when switching cards
      }
      clickTimeout.current = null;
    }, 250);
  };

  // Handle double click - navigate to detail page
  const handleCardDoubleClick = (activity: Activity) => {
    if (isNavigating) return;

    // Clear single-click timeout
    if (clickTimeout.current) {
      clearTimeout(clickTimeout.current);
      clickTimeout.current = null;
    }

    setIsNavigating(true);

    // If the card is already selected, navigate immediately
    // Otherwise, select it first, then navigate
    if (selectedActivity?.id === activity.id) {
      navigateToActivity(activity);
    } else {
      setSelectedActivity(activity);
      // Small delay to show selection before navigation
      setTimeout(() => {
        navigateToActivity(activity);
      }, 300);
    }
  };

  // Navigate to activity detail page
  const navigateToActivity = useCallback((activity: Activity) => {
    router.push(`/activity-setup/${activity.slug}`);
  }, [router]);

  // Cleanup click timeout on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (clickTimeout.current) {
        clearTimeout(clickTimeout.current);
        clickTimeout.current = null;
      }
    };
  }, []);

  // Handle scroll gesture on selected card
  useEffect(() => {
    if (!selectedActivity) {
      scrollAccumulator.current = 0;
      // Use setTimeout to prevent cascading renders
      setTimeout(() => {
        setZoomProgress(0);
        setIsZooming(false);
        setPanOffset({ x: 0, y: 0 });
      }, 0);
      return;
    }

    const handleWheel = (e: WheelEvent) => {
      if (!selectedActivity || isNavigating) return;

      // Prevent default scroll behavior
      e.preventDefault();

      // Accumulate scroll delta (only forward scrolling for zoom)
      if (e.deltaY > 0) {
        scrollAccumulator.current += e.deltaY;
      } else {
        // Allow scrolling backward to zoom out
        scrollAccumulator.current = Math.max(0, scrollAccumulator.current + e.deltaY);
      }

      // Calculate zoom progress (0-1)
      const progress = Math.min(scrollAccumulator.current / zoomThreshold, 1.0);

      setZoomProgress(progress);
      setIsZooming(progress > 0);

      // Navigate at 100% zoom
      if (progress >= 1.0) {
        setIsNavigating(true);
        navigateToActivity(selectedActivity);
      }
    };

    // Add wheel event listener
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('wheel', handleWheel);
    }

    return () => {
      if (canvas) {
        canvas.removeEventListener('wheel', handleWheel);
      }
    };
  }, [selectedActivity, isNavigating, navigateToActivity]);

  // Keyboard navigation (accessibility)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isNavigating) return;

      // Enter key on selected card navigates
      if (e.key === 'Enter' && selectedActivity) {
        setIsNavigating(true);
        navigateToActivity(selectedActivity);
      }

      // Escape key deselects
      if (e.key === 'Escape' && selectedActivity) {
        scrollAccumulator.current = 0;
        // Use setTimeout to prevent cascading renders
        setTimeout(() => {
          setSelectedActivity(null);
          setZoomProgress(0);
          setIsZooming(false);
          setPanOffset({ x: 0, y: 0 });
        }, 0);
      }

      // Arrow keys during zoom - pan camera
      if (isZooming && selectedActivity && (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
        e.preventDefault(); // Prevent page scroll
        const panSpeed = 0.1;

        setPanOffset((prev) => {
          let x = prev.x;
          let y = prev.y;

          if (e.key === 'ArrowLeft') x -= panSpeed;
          if (e.key === 'ArrowRight') x += panSpeed;
          if (e.key === 'ArrowUp') y += panSpeed;
          if (e.key === 'ArrowDown') y -= panSpeed;

          // Apply pan limits (-2 to 2 units)
          return {
            x: Math.max(-2, Math.min(2, x)),
            y: Math.max(-2, Math.min(2, y))
          };
        });
      }
      // Arrow keys without zoom - cycle through activities
      else if (!isZooming && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
        const currentIndex = selectedActivity
          ? activities.findIndex((a) => a.id === selectedActivity.id)
          : -1;

        let nextIndex;
        if (e.key === 'ArrowRight') {
          nextIndex = currentIndex < activities.length - 1 ? currentIndex + 1 : 0;
        } else {
          nextIndex = currentIndex > 0 ? currentIndex - 1 : activities.length - 1;
        }

        // Use setTimeout to prevent cascading renders
        setTimeout(() => {
          setSelectedActivity(activities[nextIndex]);
          scrollAccumulator.current = 0;
          setZoomProgress(0);
          setIsZooming(false);
          setPanOffset({ x: 0, y: 0 });
        }, 0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedActivity, isNavigating, activities, isZooming, navigateToActivity]);

  // Handle drag-to-pan during zoom
  useEffect(() => {
    if (!isZooming) return;

    const handleMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      dragStart.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;

      const deltaX = (e.clientX - dragStart.current.x) * 0.005; // Sensitivity factor
      const deltaY = -(e.clientY - dragStart.current.y) * 0.005; // Invert Y axis

      setPanOffset((prev) => ({
        x: Math.max(-2, Math.min(2, prev.x + deltaX)), // Constrain to [-2, 2]
        y: Math.max(-2, Math.min(2, prev.y + deltaY)),
      }));

      dragStart.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    // Touch events for mobile
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      isDragging.current = true;
      dragStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging.current || e.touches.length !== 1) return;

      const deltaX = (e.touches[0].clientX - dragStart.current.x) * 0.005;
      const deltaY = -(e.touches[0].clientY - dragStart.current.y) * 0.005;

      setPanOffset((prev) => ({
        x: Math.max(-2, Math.min(2, prev.x + deltaX)),
        y: Math.max(-2, Math.min(2, prev.y + deltaY)),
      }));

      dragStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const handleTouchEnd = () => {
      isDragging.current = false;
    };

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      canvas.addEventListener('touchstart', handleTouchStart, { passive: true });
      canvas.addEventListener('touchmove', handleTouchMove, { passive: true });
      canvas.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      if (canvas) {
        canvas.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        canvas.removeEventListener('touchstart', handleTouchStart);
        canvas.removeEventListener('touchmove', handleTouchMove);
        canvas.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [isZooming]);

  return (
    <div
      ref={canvasRef}
      className={`w-full h-screen bg-background-primary transition-opacity duration-500 ${
        zoomProgress >= 0.95 ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Loading fallback */}
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-screen bg-background-primary">
            <div className="text-text-primary text-lg">Loading 3D scene...</div>
          </div>
        }
      >
        <Canvas
          camera={{
            position: [0, 0, 8],
            fov: 50,
          }}
          dpr={isMobile ? [1, 1.5] : [1, 2]} // Lower DPR on mobile for performance
          shadows
        >
          {/* Lighting setup */}
          <SceneSetup />

          {/* Camera zoom controller */}
          <CameraController
            targetPosition={selectedActivity?.initialPosition || null}
            zoomProgress={zoomProgress}
            isZooming={isZooming}
            panOffset={panOffset}
          />

          {/* Activity cards */}
          {activities.map((activity) => (
            <ActivityCard3D
              key={activity.id}
              activity={activity}
              isSelected={selectedActivity?.id === activity.id}
              isOtherSelected={
                selectedActivity !== null && selectedActivity.id !== activity.id
              }
              zoomProgress={
                selectedActivity?.id === activity.id ? zoomProgress : 0
              }
              onClick={handleCardClick}
              onDoubleClick={handleCardDoubleClick}
            />
          ))}
        </Canvas>
      </Suspense>

      {/* Instructions overlay */}
      {!selectedActivity && (
        <div className="absolute bottom-8 left-0 right-0 flex justify-center pointer-events-none px-4">
          <div className="glass px-4 md:px-6 py-2 md:py-3 rounded-full text-text-secondary text-xs md:text-sm text-center">
            {isMobile
              ? 'Tap to select • Double-tap or scroll to explore'
              : 'Click to select • Double-click or scroll to explore'
            }
          </div>
        </div>
      )}

      {/* Selected activity info */}
      {selectedActivity && !isNavigating && (
        <div className="absolute top-24 left-0 right-0 flex flex-col items-center pointer-events-none gap-2 px-4">
          <div
            className="px-4 md:px-6 py-2 md:py-3 rounded-full text-white text-base md:text-lg font-semibold text-center"
            style={{
              background: `linear-gradient(135deg, ${selectedActivity.color}dd, ${selectedActivity.color}99)`,
              backdropFilter: 'blur(10px)',
            }}
          >
            {selectedActivity.name}
          </div>
          <div className="glass px-3 md:px-4 py-1.5 md:py-2 rounded-full text-text-secondary text-xs text-center">
            {isZooming
              ? (isMobile
                  ? 'Drag to explore • Tap other cards to switch'
                  : 'Drag to pan • Arrow keys to move • Click cards to switch • Press Escape to deselect')
              : (isMobile
                  ? 'Double-tap or scroll to enter'
                  : 'Double-click or scroll to enter • Press Escape to deselect')
            }
          </div>
        </div>
      )}

      {/* Zoom progress indicator */}
      {isZooming && selectedActivity && !isNavigating && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 pointer-events-none">
          <div className="glass px-4 py-2 rounded-full flex items-center gap-3">
            <div className="text-xs text-text-secondary font-medium">
              Zoom: {Math.round(zoomProgress * 100)}%
            </div>
            <div className="w-24 h-1.5 bg-background-secondary rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-200"
                style={{
                  width: `${zoomProgress * 100}%`,
                  background: `linear-gradient(90deg, ${selectedActivity.color}, ${selectedActivity.color}dd)`,
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
