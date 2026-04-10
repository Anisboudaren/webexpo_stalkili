import React from 'react';
import { Component as HeroSection } from '../components/ui/gradient-bar-hero-section';
import Features from '../sections/Features';
import About from '../sections/About';
import Footer from '../sections/Footer';
export default function Home() {
  return (
    <div className="overflow-x-hidden w-full">
      <HeroSection />
      <Features />
      <About />
      <Footer />
    </div>
  );
}
