'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

/**
 * SceneSetup Component
 *
 * Configures lighting and environment for the 3D scene.
 * Adapts lighting intensity based on the current theme (dark/light mode).
 */
export default function SceneSetup() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by only rendering theme-dependent content after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Adjust lighting intensity based on theme
  const isDark = mounted && theme === 'dark';
  const ambientIntensity = isDark ? 1.0 : 1.2;
  const directionalIntensity = isDark ? 1.5 : 2.0;
  const pointLightIntensity = isDark ?  0.6 : 0.8;

  return (
    <>
      {/* Ambient light - provides base illumination for all objects */}
      <ambientLight intensity={ambientIntensity} />

      {/* Directional light - simulates sunlight, creates depth with shadows */}
      <directionalLight
        position={[5, 5, 5]}
        intensity={directionalIntensity}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* Point light - top left - adds highlights */}
      <pointLight
        position={[-5, 3, 2]}
        intensity={pointLightIntensity}
        color="#ff9966"
      />

      {/* Point light - bottom right - adds depth */}
      <pointLight
        position={[5, -3, -2]}
        intensity={pointLightIntensity}
        color="#66ccff"
      />

      {/* Subtle fill light from behind */}
      <pointLight
        position={[0, 0, -5]}
        intensity={pointLightIntensity * 0.5}
        color="#ffffff"
      />
    </>
  );
}
