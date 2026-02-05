'use client';

import dynamic from 'next/dynamic';

// Dynamically import the 3D scene to avoid SSR issues
const ActivityScene3D = dynamic(() => import('@/components/ActivityScene3D'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-screen bg-background-primary">
      <div className="text-text-primary text-lg">Loading Activity Setups...</div>
    </div>
  ),
});

/**
 * Activity Setup Page
 *
 * Displays predefined camera/equipment setups as interactive 3D floating cards.
 * Users can select activities and navigate to detailed setup pages.
 */
export default function Page() {
  return (
    <main className="relative w-full h-screen overflow-hidden">
      <ActivityScene3D />
    </main>
  );
}
