import { createServerSupabaseClient } from './server';
import { mapProduct, mapActivity } from './mappers';
import type { Product } from '@/types/product';
import type { Activity } from '@/types/activity';

export type LookupItem = { id: number; name: string };
export type Category = { id: number; name: string; emoji: string };

export interface Background {
  id: number;
  key: string;
  label: string;
  path: string;
  type: 'image' | 'video';
  theme: 'dark' | 'light' | null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function queryTable<T>(table: string, select: string, orderBy: string, mapper?: (row: any) => T): Promise<T[]> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.from(table).select(select).order(orderBy);
  if (error) {
    console.error(`Failed to fetch ${table}:`, error);
    return [];
  }
  return mapper ? (data ?? []).map(mapper) : ((data ?? []) as T[]);
}

export async function getAllProducts(): Promise<Product[]> {
  return queryTable('products', '*', 'id', mapProduct);
}

export async function getAllActivities(): Promise<Activity[]> {
  return queryTable('activities', '*', 'id', mapActivity);
}

export async function getAllCategories(): Promise<Category[]> {
  return queryTable('categories', 'id, name, emoji', 'sort_order');
}

export async function getAllBrands(): Promise<LookupItem[]> {
  return queryTable('brands', 'id, name', 'sort_order');
}

export async function getAllProductTypes(): Promise<LookupItem[]> {
  return queryTable('product_types', 'id, name', 'sort_order');
}

export async function getAllBackgrounds(): Promise<Background[]> {
  return queryTable('backgrounds', 'id, key, label, path, type, theme', 'id');
}
