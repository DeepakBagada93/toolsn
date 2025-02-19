import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Navbar from './components/Navbar';
import Footer from './components/Footer';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <main>{children}</main>
        </div>
        <Footer />
      </body>
    </html>
  );
}