import { getAllProducts, getAllCategories, getAllBrands, getAllProductTypes, getAllBackgrounds } from '@/lib/supabase/queries';
import ProductPageClient from './ProductPageClient';

export default async function ProductPage() {
  const [products, categories, brands, productTypes, backgrounds] = await Promise.all([
    getAllProducts(),
    getAllCategories(),
    getAllBrands(),
    getAllProductTypes(),
    getAllBackgrounds(),
  ]);
  return <ProductPageClient products={products} categories={categories} brands={brands} productTypes={productTypes} backgrounds={backgrounds} />;
}
