'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const [editingProduct, setEditingProduct] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const productCategories = [
    'Stone Cutting Machine',
    'Tile Making Machine',
    'Diamond Bits',
    'Polishing Machine',
    'Edge Cutting Machine',
    'Bridge Saw Machine',
    'CNC Router',
    'Other'
  ];

  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    image_url: ''
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        checkUser();
        fetchProducts();
      } else if (event === 'SIGNED_OUT') {
        router.push('/');
      }
    });

    // Initial check
    checkUser();
    fetchProducts();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkUser = async () => {
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (!currentUser) {
      router.push('/');
      return;
    }

    // Check if user is approved
    const { data: approval } = await supabase
      .from('user_approvals')
      .select('is_approved')
      .eq('user_id', currentUser.id)
      .single();

    if (!approval?.is_approved) {
      router.push('/pending-approval');
      return;
    }

    setUser(currentUser);
  };

  const fetchProducts = async () => {
    try {
      // Get current user
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      if (!currentUser) {
        console.log('No user logged in');
        router.push('/');
        return;
      }

      // Check if user is approved
      const { data: approval } = await supabase
        .from('user_approvals')
        .select('is_approved')
        .eq('user_id', currentUser.id)
        .single();

      if (!approval?.is_approved) {
        console.log('User not approved');
        router.push('/pending-approval');
        return;
      }

      // Fetch user's products
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
        return;
      }

      setProducts(data || []);
      setUser(currentUser); // Update user state

    } catch (err) {
      console.error('Error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `product-images/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('products')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      return null;
    }

    const { data } = supabase.storage
      .from('products')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    let imageUrl = '';

    if (imageFile) {
      imageUrl = await uploadImage(imageFile);
      if (!imageUrl) return;
    }

    // Check if user exists in profiles
    const { data: userProfile, error: userError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single();

    if (userError || !userProfile) {
      console.error('User does not exist in profiles:', userError);
      return;
    }

    const { data, error } = await supabase
      .from('products')
      .insert([
        {
          name: newProduct.name,
          description: newProduct.description,
          price: parseFloat(newProduct.price),
          stock: parseInt(newProduct.stock),
          category: newProduct.category,
          image_url: imageUrl,
          user_id: user.id
        }
      ]);

    if (error) {
      console.error('Error adding product:', error);
    } else {
      setNewProduct({ name: '', description: '', price: '', stock: '', category: '', image_url: '' });
      setImageFile(null);
      fetchProducts();
    }
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();
    let imageUrl = editingProduct.image_url;

    if (imageFile) {
      imageUrl = await uploadImage(imageFile);
      if (!imageUrl) return;
    }

    const { error } = await supabase
      .from('products')
      .update({
        name: editingProduct.name,
        description: editingProduct.description,
        price: parseFloat(editingProduct.price),
        stock: parseInt(editingProduct.stock),
        category: editingProduct.category,
        image_url: imageUrl,
      })
      .eq('id', editingProduct.id);

    if (error) {
      console.error('Error updating product:', error);
    } else {
      setEditingProduct(null);
      setImageFile(null);
      fetchProducts();
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      if (!currentUser) {
        console.log('No user logged in');
        router.push('/');
        return;
      }

      // First delete the image from storage if it exists
      const product = products.find(p => p.id === productId);
      if (product?.image_url) {
        const imagePath = product.image_url.split('/').pop();
        await supabase.storage
          .from('products')
          .remove([`product-images/${imagePath}`]);
      }

      // Then delete the product record
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)
        .eq('user_id', currentUser.id); // Use currentUser instead of user state

      if (error) throw error;

      // Refresh the products list
      fetchProducts();
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting product:', error.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full">
      <div className="max-w-[2000px] mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6 text-black">Dashboard</h1>
        
        {/* Add/Edit Product Form */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4 text-black">
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </h2>
          <form onSubmit={editingProduct ? handleEditProduct : handleAddProduct} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black">Name</label>
              <input
                type="text"
                value={editingProduct ? editingProduct.name : newProduct.name}
                onChange={(e) => editingProduct 
                  ? setEditingProduct({...editingProduct, name: e.target.value})
                  : setNewProduct({...newProduct, name: e.target.value})
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-black">Category</label>
              <select
                value={editingProduct ? editingProduct.category : newProduct.category}
                onChange={(e) => editingProduct
                  ? setEditingProduct({...editingProduct, category: e.target.value})
                  : setNewProduct({...newProduct, category: e.target.value})
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black"
                required
              >
                <option value="">Select a category</option>
                {productCategories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-black">Product Image</label>
              {editingProduct && editingProduct.image_url && (
                <img
                  src={editingProduct.image_url}
                  alt="Current product"
                  className="w-32 h-32 object-cover mb-2 rounded"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="mt-1 block w-full text-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black">Description</label>
              <textarea
                value={editingProduct ? editingProduct.description : newProduct.description}
                onChange={(e) => editingProduct
                  ? setEditingProduct({...editingProduct, description: e.target.value})
                  : setNewProduct({...newProduct, description: e.target.value})
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black">Price</label>
              <input
                type="number"
                step="0.01"
                value={editingProduct ? editingProduct.price : newProduct.price}
                onChange={(e) => editingProduct
                  ? setEditingProduct({...editingProduct, price: e.target.value})
                  : setNewProduct({...newProduct, price: e.target.value})
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black">Stock</label>
              <input
                type="number"
                value={editingProduct ? editingProduct.stock : newProduct.stock}
                onChange={(e) => editingProduct
                  ? setEditingProduct({...editingProduct, stock: e.target.value})
                  : setNewProduct({...newProduct, stock: e.target.value})
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black"
                required
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                {editingProduct ? 'Update Product' : 'Add Product'}
              </button>
              {editingProduct && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingProduct(null);
                    setImageFile(null);
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Products List */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-black">Your Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {products.map((product) => (
              <div key={product.id} className="border rounded-lg p-4">
                {product.image_url && (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-48 object-cover mb-4 rounded"
                  />
                )}
                <h3 className="font-semibold text-black">{product.name}</h3>
                <p className="text-black">{product.category}</p>
                <p className="text-black">{product.description}</p>
                <p className="text-green-600 font-semibold">${product.price}</p>
                <p className="text-black">Stock: {product.stock}</p>
                
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => setEditingProduct(product)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  {showDeleteConfirm === product.id ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(null)}
                        className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowDeleteConfirm(product.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 