import { getAllActivities, getAllProducts } from '@/lib/supabase/queries';
import ActivityDetailClient from './ActivityDetailClient';

export default async function ActivityDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [activities, products] = await Promise.all([
    getAllActivities(),
    getAllProducts(),
  ]);
  const activity = activities.find((a) => a.slug === slug) ?? null;
  return <ActivityDetailClient activity={activity} products={products} slug={slug} />;
}
