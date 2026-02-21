'use client';

import dynamic from 'next/dynamic';
import type { Activity } from '@/types/activity';

const ActivityScene3D = dynamic(
  () => import('@/components/ActivityScene3D'),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-screen bg-background-primary">
        <div className="text-text-primary text-lg">Loading Activity Setups...</div>
      </div>
    ),
  }
);

export default function ActivityScene3DLoader({ activities }: { activities: Activity[] }) {
  return <ActivityScene3D activities={activities} />;
}
