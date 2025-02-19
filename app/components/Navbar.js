'use client'; // Mark this component as a Client Component
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Check if a user is logged in
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    fetchUser();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google', // Use Google for authentication
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-md w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center">
            <img
              src="/logo.webp"
              alt="Tooldocker Logo"
              className="h-12 w-auto"
            />
          </Link>
          <ul className="flex space-x-6 items-center">
            <li>
              <Link href="/" className="text-gray-800 hover:text-gray-600">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-gray-800 hover:text-gray-600">
                About
              </Link>
            </li>
            <li>
              <Link href="/products" className="text-gray-800 hover:text-gray-600">
                Products
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-gray-800 hover:text-gray-600">
                Contact
              </Link>
            </li>
            <li>
              {user ? (
                <div className="relative">
                  <button
                    onClick={toggleMenu}
                    className="flex items-center space-x-2 focus:outline-none"
                  >
                    <img
                      src={user.user_metadata?.avatar_url || '/default-avatar.png'}
                      alt="Profile"
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-gray-800">
                      {user.user_metadata?.full_name || user.user_metadata?.name || 'User'}
                    </span>
                  </button>
                  
                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                      <Link
                        href="/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={handleLogin}
                  className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
                >
                  Login
                </button>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
