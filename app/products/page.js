'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { motion } from 'framer-motion';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    'Stone Cutting Machine',
    'Tile Making Machine',
    'Diamond Bits',
    'Polishing Machine',
    'Edge Cutting Machine',
    'Bridge Saw Machine',
    'CNC Router',
    'Other'
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*, profiles(*)');

      if (productsError) throw productsError;

      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="w-full bg-[#fce8eb] mt-[100px]">
      
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-[2000px] mx-auto p-4"
      >
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative py-16 bg-gray-50 rounded-lg mb-12"
        >
          <div className="max-w-4xl mx-auto text-center px-4">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">Our Products</h1>
            <p className="text-xl text-gray-600">
              Discover our wide range of professional stone and tile cutting equipment
            </p>
          </div>
        </motion.div>

        {/* Filters */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <select
            className="p-2 border rounded-lg"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Search products..."
            className="p-2 border rounded-lg flex-grow"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Products Grid */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              variants={fadeInUp}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
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
                <button className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors">
                  Add to Cart
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>

  );
} 