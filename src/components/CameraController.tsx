'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface CameraControllerProps {
  targetPosition: [number, number, number] | null;
  zoomProgress: number;
  isZooming: boolean;
  panOffset?: { x: number; y: number }; // Camera pan offset for exploration
}

/**
 * CameraController Component
 *
 * Smoothly animates the camera toward the selected activity card based on zoom progress.
 * Uses lerp (linear interpolation) for smooth 60 FPS camera movement.
 */
export default function CameraController({
  targetPosition,
  zoomProgress,
  isZooming,
  panOffset = { x: 0, y: 0 },
}: CameraControllerProps) {
  const { camera } = useThree();
  const initialPosition = useRef(new THREE.Vector3(0, 0, 8));
  const targetVec = useRef(new THREE.Vector3());
  const lookAtTarget = useRef(new THREE.Vector3());

  // Centered position where selected cards move to
  const centeredCardPosition = useRef(new THREE.Vector3(0, 0, 2));

  useFrame(() => {
    if (!isZooming || !targetPosition || zoomProgress === 0) {
      // Return to initial position when not zooming
      camera.position.lerp(initialPosition.current, 0.05);

      // Reset camera look-at to center of viewport
      lookAtTarget.current.set(0, 0, 0);
      camera.lookAt(lookAtTarget.current);
      camera.updateProjectionMatrix();
      return;
    }

    // Use the centered card position [0, 0, 2] as the target
    // This is where the card moves to when selected
    const cx = centeredCardPosition.current.x;
    const cy = centeredCardPosition.current.y;
    const cz = centeredCardPosition.current.z;

    // Calculate intermediate position based on zoom progress
    // Start: [0, 0, 8] -> End: [0, 0, 3.5] (close to centered card at z=2)
    const finalZ = cz + 1.5; // Stay 1.5 units in front of the card

    // Base target position (before pan offset)
    const baseX = initialPosition.current.x + (cx - initialPosition.current.x) * zoomProgress;
    const baseY = initialPosition.current.y + (cy - initialPosition.current.y) * zoomProgress;
    const baseZ = initialPosition.current.z + (finalZ - initialPosition.current.z) * zoomProgress;

    // Apply pan offset for camera exploration
    targetVec.current.set(
      baseX + panOffset.x,
      baseY + panOffset.y,
      baseZ
    );

    // Smooth lerp toward target position (60 FPS)
    camera.position.lerp(targetVec.current, 0.1);

    // Always look at the center of the viewport
    // This ensures the card stays centered regardless of camera position
    lookAtTarget.current.set(0, 0, 0);
    camera.lookAt(lookAtTarget.current);
    camera.updateProjectionMatrix();
  });

  return null; // No visual component
}
