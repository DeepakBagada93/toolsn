'use client';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { useEffect, useState, useRef, useCallback } from 'react';
import { Menu, X, Search, ShoppingCart, Facebook, Twitter, Instagram } from 'lucide-react';

// Constants
const MAIN_NAV_ITEMS = ['Home', 'About', 'Products', 'Contact'];
const MEGA_MENU_ITEMS = {
  Categories: ['All Categories', 'Trending Tools', 'Latest Tools', 'Specialty Tools', 'Accessories'],
  Brands: ['Brand A', 'Brand B', 'Brand C', 'Brand D'],
  Services: ['Service 1', 'Service 2', 'Service 3'],
};

const SECONDARY_NAV_ITEMS = ['Trending Tools', 'Latest Tools', 'Specialty Tools', 'Accessories'];
const SOCIAL_ICONS = [
  { icon: Facebook, link: 'https://facebook.com' },
  { icon: Twitter, link: 'https://twitter.com' },
  { icon: Instagram, link: 'https://instagram.com' },
];

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const megaMenuRef = useRef(null);

  // Fetch user and set up auth listener
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  // Handle login
  const handleLogin = useCallback(async () => {
    try {
      await supabase.auth.signInWithOAuth({ provider: 'google' });
    } catch (error) {
      console.error('Login error:', error);
    }
  }, []);

  // Handle logout
  const handleLogout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      setIsDropdownOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, []);

  // Close dropdown and mega menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (megaMenuRef.current && !megaMenuRef.current.contains(event.target)) {
        setIsMegaMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {/* Top Navigation Bar */}
      <div className="bg-[#e31c39] text-white py-2 fixed top-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          {/* Promotion Text */}
          <p className="text-sm">🎉 Special Offer: Get 20% Off on All Products!</p>

          {/* Social Icons */}
          <div className="flex space-x-4">
            {SOCIAL_ICONS.map((social, index) => (
              <a
                key={index}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-200 transition duration-300"
              >
                <social.icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-[#fce8eb] shadow-md w-full fixed top-10 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <img
                src="/tooldocker.png"
                alt="Tooldocker Logo"
                className="h-12 w-auto"
                loading="lazy"
              />
            </Link>

            {/* Desktop Navigation */}
            <ul className="hidden md:flex space-x-8 items-center">
              {MAIN_NAV_ITEMS.map((item) => (
                <li key={item}>
                  <Link
                    href={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                    className="text-gray-800 hover:text-[#e31c39] active:text-[#c2182b] transition-all duration-300 font-medium relative group"
                  >
                    {item}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#e31c39] group-hover:w-full transition-all duration-300" />
                  </Link>
                </li>
              ))}
              {/* Mega Menu Trigger */}
              <li
                ref={megaMenuRef}
                className="relative"
                onMouseEnter={() => setIsMegaMenuOpen(true)}
                onMouseLeave={() => setIsMegaMenuOpen(false)}
              >
                <button
                  className="text-gray-800 hover:text-[#e31c39] active:text-[#c2182b] transition-all duration-300 font-medium focus:outline-none relative group"
                  aria-haspopup="true"
                  aria-expanded={isMegaMenuOpen}
                >
                  Categories
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#e31c39] group-hover:w-full transition-all duration-300" />
                </button>
                {/* Mega Menu */}
                {isMegaMenuOpen && (
                  <div className="absolute left-0 mt-2 w-96 bg-white rounded-lg shadow-lg py-4 z-10 grid grid-cols-3 gap-4">
                    {Object.entries(MEGA_MENU_ITEMS).map(([category, items]) => (
                      <div key={category}>
                        <h3 className="text-sm font-semibold text-gray-800 mb-2">{category}</h3>
                        <ul className="space-y-2">
                          {items.map((item) => (
                            <li key={item}>
                              <Link
                                href={`/${item.toLowerCase().replace(/ /g, '-')}`}
                                className="text-gray-700 hover:text-[#e31c39] transition duration-300 text-sm"
                              >
                                {item}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </li>
            </ul>

            {/* Search Bar */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-48 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#e31c39]"
                />
                <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
              </div>
            </div>

            {/* User Authentication and Cart */}
            <div className="hidden md:flex items-center space-x-6">
              {/* Cart Icon */}
              <Link href="/cart" className="relative">
                <ShoppingCart className="text-gray-800 hover:text-[#e31c39] transition duration-300" size={24} />
                <span className="absolute -top-2 -right-2 bg-[#e31c39] text-white text-xs rounded-full px-1.5 py-0.5">
                  3
                </span>
              </Link>

              {/* User Authentication */}
              <li ref={dropdownRef} className="relative">
                {user ? (
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-2 focus:outline-none"
                    aria-haspopup="true"
                    aria-expanded={isDropdownOpen}
                  >
                    <img
                      src={user.user_metadata?.avatar_url || '/default-avatar.png'}
                      alt="Profile"
                      className="w-8 h-8 rounded-full border-2 border-gray-300"
                    />
                    <span className="text-gray-800 font-medium">
                      {user.user_metadata?.full_name || 'User'}
                    </span>
                  </button>
                ) : (
                  <button
                    onClick={handleLogin}
                    className="bg-[#e31c39] text-white px-6 py-2 rounded-lg hover:bg-[#c2182b] transition duration-300 font-medium"
                  >
                    Login
                  </button>
                )}

                {/* Dropdown */}
                {isDropdownOpen && user && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10">
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-200"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-200"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </li>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-800 focus:outline-none"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Secondary Navbar */}
      <nav className="bg-[#e31c39] shadow-md w-full fixed top-20 mt-[40px] z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            <ul className="flex space-x-8 items-center">
              {SECONDARY_NAV_ITEMS.map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase().replace(/ /g, '-')}`}
                    className="text-white hover:text-gray-200 active:text-gray-300 transition-all duration-300 font-medium relative group"
                  >
                    {item}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg fixed top-20 w-full z-30">
          <ul className="space-y-4 py-6 text-center">
            {MAIN_NAV_ITEMS.map((item) => (
              <li key={item}>
                <Link
                  href={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                  className="text-gray-800 hover:text-[#e31c39] active:text-[#c2182b] transition-all duration-300 block py-2 font-medium relative group"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#e31c39] group-hover:w-full transition-all duration-300" />
                </Link>
              </li>
            ))}
            <li>
              {user ? (
                <button
                  onClick={handleLogout}
                  className="w-full text-gray-800 hover:text-[#e31c39] active:text-[#c2182b] transition-all duration-300 py-2 font-medium"
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={handleLogin}
                  className="bg-[#e31c39] text-white px-6 py-2 rounded-lg hover:bg-[#c2182b] active:bg-[#a11523] transition-all duration-300 font-medium"
                >
                  Login
                </button>
              )}
            </li>
          </ul>
        </div>
      )}
    </>
  );
}