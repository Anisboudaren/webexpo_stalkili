import React from 'react';

export default function Navbar() {
  return (
    <nav className="bg-white border-b px-6 py-4 flex items-center justify-between">
      <span className="font-bold text-lg">MyStartup</span>
      <div className="flex gap-4">
        <a href="/" className="text-gray-600 hover:text-black">Home</a>
        <a href="/about" className="text-gray-600 hover:text-black">About</a>
        <a href="/contact" className="text-gray-600 hover:text-black">Contact</a>
        <a href="/login" className="text-gray-600 hover:text-black">Login</a>
        <a href="/signup" className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Sign Up</a>
      </div>
    </nav>
  );
}
