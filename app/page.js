'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // First fetch all products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (productsError) {
        console.error('Error fetching products:', productsError.message);
        return;
      }

      // Then fetch all profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email, full_name');

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError.message);
        return;
      }

      // Create a map of profiles for quick lookup
      const profilesMap = new Map(
        profilesData.map(profile => [profile.id, profile])
      );

      // Combine products with seller information
      const enrichedProducts = productsData.map(product => ({
        ...product,
        profiles: profilesMap.get(product.user_id) || null
      }));

      setProducts(enrichedProducts);
    } catch (err) {
      console.error('Exception while fetching products:', err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-black mb-6">Welcome to ToolDocker</h1>
      <p className="text-black mb-8">Your one-stop shop for all tools and equipment.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {product.image_url && (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h2 className="text-xl font-semibold text-black mb-2">{product.name}</h2>
              <p className="text-sm text-black mb-2">Category: {product.category}</p>
              <p className="text-black mb-3">{product.description}</p>
              <p className="text-2xl font-bold text-green-600 mb-2">${product.price}</p>
              <p className="text-sm text-black mb-2">Stock: {product.stock}</p>
              <p className="text-sm text-black">
                Seller: {product.profiles?.full_name || product.profiles?.email || 'Unknown'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}