'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const admin = sessionStorage.getItem('adminUser');
    if (!admin || JSON.parse(admin).username !== 'tooldocker') {
      router.push('/admin/login');
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // First fetch profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*');

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError.message);
        return;
      }

      // Then fetch approval status
      const { data: approvalsData, error: approvalsError } = await supabase
        .from('user_approvals')
        .select('*');

      if (approvalsError) {
        console.error('Error fetching approvals:', approvalsError.message);
        return;
      }

      // Create a map of approvals for quick lookup
      const approvalMap = new Map(
        approvalsData.map(approval => [approval.user_id, approval])
      );

      // Combine profile and approval data
      const enrichedUsers = profilesData.map(profile => ({
        id: profile.id,
        email: profile.email,
        user_metadata: {
          full_name: profile.full_name
        },
        is_approved: approvalMap.get(profile.id)?.is_approved || false
      }));

      setUsers(enrichedUsers);

      // Fetch products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (productsError) {
        console.error('Error fetching products:', productsError.message);
        return;
      }

      // Create a map of profiles for products
      const profilesMap = new Map(
        profilesData.map(profile => [profile.id, profile])
      );

      // Combine products with profile data
      const enrichedProducts = productsData.map(product => ({
        ...product,
        profiles: profilesMap.get(product.user_id) || null
      }));

      setProducts(enrichedProducts);
    } catch (error) {
      console.error('Error fetching data:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (userId, approve) => {
    try {
      // First check if approval record exists
      const { data: existingApproval, error: checkError } = await supabase
        .from('user_approvals')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingApproval) {
        // Update existing approval
        const { error } = await supabase
          .from('user_approvals')
          .update({
            is_approved: approve,
            approved_at: approve ? new Date().toISOString() : null
          })
          .eq('user_id', userId);

        if (error) throw error;
      } else {
        // Insert new approval
        const { error } = await supabase
          .from('user_approvals')
          .insert({
            user_id: userId,
            is_approved: approve,
            approved_at: approve ? new Date().toISOString() : null
          });

        if (error) throw error;
      }
      
      // Refresh data after approval
      await fetchData();

    } catch (error) {
      console.error('Error updating approval:', error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="max-w-[2000px] mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-black">Admin Dashboard</h1>
          <button
            onClick={() => {
              sessionStorage.removeItem('adminUser');
              router.push('/admin/login');
            }}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        {/* User Management Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-black">User Management</h2>
          {users.length === 0 ? (
            <p className="text-gray-500">No users found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-6 py-3 text-left">Email</th>
                    <th className="px-6 py-3 text-left">Name</th>
                    <th className="px-6 py-3 text-left">Status</th>
                    <th className="px-6 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-t">
                      <td className="px-6 py-4">{user.email}</td>
                      <td className="px-6 py-4">
                        {user.user_metadata?.full_name || 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded ${
                          user.is_approved ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.is_approved ? 'Approved' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleApproval(user.id, !user.is_approved)}
                          className={`px-3 py-1 rounded ${
                            user.is_approved 
                              ? 'bg-red-500 hover:bg-red-600 text-white'
                              : 'bg-green-500 hover:bg-green-600 text-white'
                          }`}
                        >
                          {user.is_approved ? 'Revoke Access' : 'Approve'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Products Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-black">All Products</h2>
          {products.length === 0 ? (
            <p className="text-gray-500">No products found.</p>
          ) : (
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
                  <p className="text-sm text-gray-500 mt-2">
                    Added by: {product.profiles?.email || 'Unknown'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 