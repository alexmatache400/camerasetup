'use client';

import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import activitiesData from '@/data/activities.json';
import productsData from '@/data/products.json';
import type { Activity } from '@/types/activity';
import CinemaWizard from '@/components/CinemaWizard';

/**
 * Activity Detail Page
 *
 * Displays full-screen background image for the selected activity
 * with activity name, description, and navigation controls.
 */
export default function ActivityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [activity, setActivity] = useState<Activity | null>(null);
  const slug = params.slug as string;

  useEffect(() => {
    // Find the activity by slug
    const foundActivity = activitiesData.activities.find((a) => a.slug === slug);
    setActivity(foundActivity || null);

    // If activity not found, redirect to activity setup page
    if (!foundActivity) {
      router.push('/activity-setup');
    }
  }, [slug, router]);

  if (!activity) {
    return (
      <div className="flex items-center justify-center h-screen bg-background-primary">
        <div className="text-text-primary text-lg">Loading...</div>
      </div>
    );
  }

  // Use background image without text overlay, fallback to card image if not available
  const backgroundImage = activity.backgroundImagePath || activity.imagePath;

  // Render Cinema wizard layout
  if (slug === 'cinema') {
    return (
      <main className="relative w-full min-h-screen pb-16">
        {/* Background Image */}
        <div className="fixed inset-0 z-0">
          <Image
            src={backgroundImage}
            alt={activity.name}
            fill
            className="object-cover"
            priority
          />
          {/* Light overlay for readability */}
          <div className="absolute inset-0" style={{ background: 'rgba(0, 0, 0, 0.3)' }} />
        </div>

        {/* Header */}
        <div className="sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Back Button */}
              <button
                onClick={() => router.push('/activity-setup')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:opacity-80"
                style={{
                  color: 'white',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
                }}
              >
                <ArrowLeft size={20} />
                <span className="hidden sm:inline">Back to Activities</span>
              </button>

              {/* Title (Centered) */}
              <h1
                className="absolute left-1/2 -translate-x-1/2 text-2xl md:text-3xl font-bold"
                style={{
                  color: 'white',
                  textShadow: '0 2px 8px rgba(0, 0, 0, 0.7)',
                }}
              >
                Cinema
              </h1>

              {/* Spacer to balance flex */}
              <div className="w-[140px]" />
            </div>
          </div>
        </div>

        {/* Subtitle */}
        <div className="max-w-7xl mx-auto px-6 pt-8 pb-6 relative z-10">
          <p className="text-center text-lg" style={{
            color: 'white',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.6)'
          }}>
            Setups for cinema enthusiasts
          </p>
        </div>

        {/* Cinema Wizard */}
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <CinemaWizard products={productsData.products} activityColor={activity.color} />
        </div>
      </main>
    );
  }

  // Default full-screen background layout for other activities
  return (
    <main className="relative w-full h-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={backgroundImage}
          alt={activity.name}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Dark overlay for text readability */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background: 'var(--overlay)',
        }}
      />

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full px-4 gap-6">
        {/* Activity Name */}
        <h1
          className="text-fluid-4xl font-bold text-white text-center tracking-wide"
          style={{
            textShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
          }}
        >
          {activity.name}
        </h1>

        {/* Description */}
        {activity.description && (
          <p
            className="text-lg md:text-xl text-white/90 text-center max-w-2xl"
            style={{
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
            }}
          >
            {activity.description}
          </p>
        )}

        {/* Badge with activity color */}
        <div
          className="px-6 py-3 rounded-full text-white font-semibold backdrop-blur-md"
          style={{
            background: `linear-gradient(135deg, ${activity.color}dd, ${activity.color}99)`,
          }}
        >
          Equipment Setup Guide
        </div>
      </div>

      {/* Back Button */}
      <button
        onClick={() => router.push('/activity-setup')}
        className="absolute top-8 left-8 z-30 flex items-center gap-2 px-4 py-2 rounded-full text-white backdrop-blur-md transition-all duration-200 hover:scale-110 hover:shadow-lg"
        style={{
          background: 'rgba(255, 255, 255, 0.15)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        <ArrowLeft size={20} />
        <span className="hidden sm:inline">Back to Activities</span>
      </button>

      {/* Bottom navigation hint */}
      <div className="absolute bottom-8 left-0 right-0 z-30 flex justify-center">
        <div
          className="px-6 py-3 rounded-full text-white/80 text-sm backdrop-blur-md"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
          }}
        >
          Coming soon: Detailed equipment recommendations
        </div>
      </div>
    </main>
  );
}
