import React from 'react';

export default function Hero() {
  return (
    <section className="bg-gray-100 py-20">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Our Startup</h1>
        <p className="text-lg text-gray-600 mb-8">Innovative solutions for the future</p>
        <button className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600">
          Get Started
        </button>
      </div>
    </section>

    
  );
}