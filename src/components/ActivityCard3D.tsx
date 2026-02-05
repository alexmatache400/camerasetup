'use client';

import { useRef, useState, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import * as THREE from 'three';
import gsap from 'gsap';
import type { Activity } from '@/types/activity';

interface ActivityCard3DProps {
  activity: Activity;
  isSelected: boolean;
  isOtherSelected: boolean;
  zoomProgress?: number; // 0-1 zoom progress
  onClick: (activity: Activity) => void;
  onDoubleClick: (activity: Activity) => void;
}

/**
 * ActivityCard3D Component
 *
 * Renders a 3D card with an image texture that floats in space.
 * Supports hover effects, selection states, and click interactions.
 */
export default function ActivityCard3D({
  activity,
  isSelected,
  isOtherSelected,
  zoomProgress = 0,
  onClick,
  onDoubleClick,
}: ActivityCard3DProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [viewportScale, setViewportScale] = useState(1);
  const [currentTexture, setCurrentTexture] = useState<THREE.Texture | null>(null);

  // Store texture references
  const textureWithTextRef = useRef<THREE.Texture | null>(null);
  const textureWithoutTextRef = useRef<THREE.Texture | null>(null);

  // Load initial texture (with text overlay)
  const textureWithText = useLoader(TextureLoader, activity.imagePath);

  // Load background texture (without text) if available
  const textureWithoutText = activity.backgroundImagePath
    ? useLoader(TextureLoader, activity.backgroundImagePath)
    : null;

  // Store texture references when loaded
  useEffect(() => {
    textureWithTextRef.current = textureWithText;
    textureWithoutTextRef.current = textureWithoutText;
    // Set initial texture to the one with text
    if (!currentTexture) {
      setCurrentTexture(textureWithText);
    }
  }, [textureWithText, textureWithoutText, currentTexture]);

  // Swap textures based on selection state
  useEffect(() => {
    if (isSelected && textureWithoutTextRef.current) {
      // When selected, swap to texture without text (clean image)
      setCurrentTexture(textureWithoutTextRef.current);
    } else if (!isSelected && textureWithTextRef.current) {
      // When deselected, swap back to texture with text
      setCurrentTexture(textureWithTextRef.current);
    }
  }, [isSelected]);

  // Responsive scaling based on viewport width
  useEffect(() => {
    const updateScale = () => {
      const width = window.innerWidth;

      // Scale factors based on screen size
      let scale = 1.0; // Default for desktop (1440px - 1920px)

      if (width < 1440) {
        // Laptop/small screens
        scale = 0.75;
      } else if (width > 1920) {
        // Large desktop monitors
        scale = 1.15;
      }

      setViewportScale(scale);
    };

    updateScale();
    window.addEventListener('resize', updateScale);

    return () => {
      window.removeEventListener('resize', updateScale);
    };
  }, []);

  // Animation state
  const floatOffset = useRef(Math.random() * Math.PI * 2); // Random start phase
  const floatSpeed = useRef(0.5 + Math.random() * 0.3); // Slight variation in speed

  // Initial position from activity data
  const initialPosition = activity.initialPosition;

  // Detect if this card is in row 2 (middle row with y=0)
  const isRow2 = initialPosition[1] === 0;

  // Set base renderOrder: Row 2 cards render behind others
  const baseRenderOrder = isRow2 ? 0 : 1;

  // Base position tracker for GSAP animations (so floating can be added on top)
  const basePosition = useRef({ x: initialPosition[0], y: initialPosition[1], z: initialPosition[2] });

  // Dispose textures on unmount to free memory
  useEffect(() => {
    return () => {
      if (textureWithTextRef.current) {
        textureWithTextRef.current.dispose();
      }
      if (textureWithoutTextRef.current) {
        textureWithoutTextRef.current.dispose();
      }
    };
  }, []);

  // Update renderOrder based on hover state
  // Row 2 cards appear behind others, but come to front when hovered
  useEffect(() => {
    if (!meshRef.current) return;

    // Determine renderOrder based on row and hover state
    let renderOrder = baseRenderOrder;

    if (isRow2 && hovered) {
      // Row 2 card being hovered: bring to front (above everything)
      renderOrder = 2;
    }

    // Apply to main mesh
    meshRef.current.renderOrder = renderOrder;

    // Also need to ensure transparent objects render correctly
    if (meshRef.current.material instanceof THREE.Material) {
      (meshRef.current.material as THREE.MeshStandardMaterial).depthWrite = !isRow2 || hovered;
    }
  }, [hovered, isRow2, baseRenderOrder]);

  // Entrance animation on mount
  useEffect(() => {
    if (!groupRef.current || !meshRef.current) return;

    // Start with scaled down and transparent
    groupRef.current.scale.set(0.1, 0.1, 0.1);
    if (meshRef.current.material instanceof THREE.Material) {
      (meshRef.current.material as THREE.MeshStandardMaterial).opacity = 0;
    }

    // Animate entrance with staggered delay based on activity id
    const delay = activity.id * 0.2;

    gsap.to(groupRef.current.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 1,
      delay,
      ease: 'back.out(1.4)',
    });

    gsap.to(meshRef.current.material, {
      opacity: 1,
      duration: 0.8,
      delay,
      ease: 'power2.out',
    });
  }, [activity.id]);

  // Set cursor style on hover
  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = 'pointer';
    } else {
      document.body.style.cursor = 'auto';
    }

    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [hovered]);

  // Animate position and opacity based on selection state
  useEffect(() => {
    if (!groupRef.current || !meshRef.current) return;

    if (isSelected) {
      // Selected card: move to center and scale up
      basePosition.current = { x: 0, y: 0, z: 2 };
      gsap.to(groupRef.current.position, {
        x: 0,
        y: 0,
        z: 2,
        duration: 0.8,
        ease: 'power2.out',
      });

      gsap.to(groupRef.current.scale, {
        x: 1.3,
        y: 1.3,
        z: 1.3,
        duration: 0.8,
        ease: 'power2.out',
      });

      gsap.to(meshRef.current.material, {
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out',
      });
    } else if (isOtherSelected) {
      // Other cards: move to background and reduce opacity
      const backgroundPosition = {
        x: initialPosition[0] * 1.5,
        y: initialPosition[1] * 1.5,
        z: initialPosition[2] - 5,
      };

      basePosition.current = backgroundPosition;
      gsap.to(groupRef.current.position, {
        x: backgroundPosition.x,
        y: backgroundPosition.y,
        z: backgroundPosition.z,
        duration: 0.8,
        ease: 'power2.out',
      });

      gsap.to(groupRef.current.scale, {
        x: 0.8,
        y: 0.8,
        z: 0.8,
        duration: 0.8,
        ease: 'power2.out',
      });

      gsap.to(meshRef.current.material, {
        opacity: 0.3,
        duration: 0.5,
        ease: 'power2.out',
      });
    } else {
      // Default state: return to initial position
      basePosition.current = { x: initialPosition[0], y: initialPosition[1], z: initialPosition[2] };
      gsap.to(groupRef.current.position, {
        x: initialPosition[0],
        y: initialPosition[1],
        z: initialPosition[2],
        duration: 0.8,
        ease: 'power2.out',
      });

      gsap.to(groupRef.current.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.8,
        ease: 'power2.out',
      });

      gsap.to(meshRef.current.material, {
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out',
      });
    }
  }, [isSelected, isOtherSelected, initialPosition]);

  // Zoom visual effects - increase scale as zoom progresses
  useEffect(() => {
    if (!groupRef.current || !isSelected || zoomProgress === 0) return;

    // Calculate zoom scale: 1.3 (selected) -> 2.0 (fully zoomed)
    const zoomScale = 1.3 + zoomProgress * 0.7; // 1.3 + (0.7 * progress)

    gsap.to(groupRef.current.scale, {
      x: zoomScale,
      y: zoomScale,
      z: zoomScale,
      duration: 0.3,
      ease: 'power2.out',
    });
  }, [isSelected, zoomProgress]);

  // Floating animation loop - applies to entire group so all layers move together
  useFrame((state) => {
    if (!groupRef.current || isSelected) return;

    const time = state.clock.getElapsedTime();

    // Gentle sine wave floating motion
    const floatY = Math.sin(time * floatSpeed.current + floatOffset.current) * 0.15;
    const floatX = Math.cos(time * floatSpeed.current * 0.7 + floatOffset.current) * 0.1;

    // Apply floating offset on top of base position
    groupRef.current.position.x = basePosition.current.x + floatX;
    groupRef.current.position.y = basePosition.current.y + floatY;
    groupRef.current.position.z = basePosition.current.z;

    // Subtle rotation of entire group
    groupRef.current.rotation.y = Math.sin(time * 0.3 + floatOffset.current) * 0.05;
  });

  // Hover scale effect
  useEffect(() => {
    if (!groupRef.current || isOtherSelected) return;

    const targetScale = hovered && !isSelected ? 1.1 : isSelected ? 1.3 : 1;

    gsap.to(groupRef.current.scale, {
      x: targetScale,
      y: targetScale,
      z: targetScale,
      duration: 0.3,
      ease: 'power2.out',
    });
  }, [hovered, isSelected, isOtherSelected]);

  const handleClick = () => {
    onClick(activity);
  };

  const handleDoubleClick = () => {
    onDoubleClick(activity);
  };

  // Card dimensions (16:9 aspect ratio to match image format)
  // Responsive sizing based on viewport width
  // 15% smaller than original (multiplied by 0.85)
  const cardWidth = 3.825 * viewportScale;
  const cardHeight = 2.1505 * viewportScale;

  // Calculate current renderOrder for all meshes
  const currentRenderOrder = (isRow2 && hovered) ? 2 : baseRenderOrder;

  return (
    <group ref={groupRef} position={initialPosition}>
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        renderOrder={currentRenderOrder}
      >
        {/* Plane geometry for the card */}
        <planeGeometry args={[cardWidth, cardHeight]} />

        {/* Material with image texture (swaps between with-text and without-text) */}
        <meshStandardMaterial
          map={currentTexture}
          transparent
          opacity={1}
          side={THREE.DoubleSide}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>

      {/* Glow effect when hovered (only if not in background) */}
      {hovered && !isOtherSelected && (
        <mesh position={[0, 0, -0.01]} renderOrder={currentRenderOrder}>
          <planeGeometry args={[cardWidth + 0.1, cardHeight + 0.1]} />
          <meshBasicMaterial
            color={activity.color}
            transparent
            opacity={0.2}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Border glow when selected */}
      {isSelected && (
        <mesh position={[0, 0, -0.02]} renderOrder={currentRenderOrder}>
          <planeGeometry args={[cardWidth + 0.15, cardHeight + 0.15]} />
          <meshBasicMaterial
            color={activity.color}
            transparent
            opacity={0.3 + zoomProgress * 0.3} // 0.3 -> 0.6 as zoom increases
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
}
