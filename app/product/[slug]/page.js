'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function ProductPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        if (!slug) throw new Error('Product slug is required');
        
        // Convert slug back to product name
        const productName = slug
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

        const { data, error: productError } = await supabase
          .from('products')
          .select('*')
          .ilike('name', productName)
          .single();

        if (productError) throw productError;
        if (!data) throw new Error('Product not found');

        setProduct(data);
        setError(null);

        // Update page metadata
        document.title = `${data.name} - Tooldocker`;
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
          metaDescription.setAttribute('content', data.description);
        }
      } catch (err) {
        console.error('Error fetching product:', err.message);
        setError(err.message);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#e31c39]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-center">
          <h2 className="text-2xl font-bold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
          <p>The product you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            {product.image_url && (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full rounded-lg object-cover"
              />
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <p className="text-gray-600 mb-2">Category: {product.category}</p>
            <p className="text-gray-700 mb-4">{product.description}</p>
            <p className="text-3xl font-bold text-[#e31c39] mb-4">${product.price}</p>
            <p className="text-gray-600 mb-4">Stock: {product.stock}</p>
            <button className="bg-[#e31c39] text-white px-8 py-3 rounded-lg hover:bg-[#c2182b] transition-colors">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 