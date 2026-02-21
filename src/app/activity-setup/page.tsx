import { getAllActivities } from '@/lib/supabase/queries';
import ActivityScene3DLoader from '@/components/ActivityScene3DLoader';

export default async function Page() {
  const activities = await getAllActivities();
  return (
    <main className="relative w-full h-screen overflow-hidden">
      <ActivityScene3DLoader activities={activities} />
    </main>
  );
}
