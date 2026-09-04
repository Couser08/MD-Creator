import React, { useState } from 'react';
import { Navbar } from '../components/home/Navbar';
import { Hero } from '../components/home/Hero';
import { FeatureStrip } from '../components/home/FeatureStrip';
import { BentoFeatures } from '../components/home/BentoFeatures';
import { Testimonial } from '../components/home/Testimonial';
import { CtaBanner } from '../components/home/CtaBanner';
import { Footer } from '../components/home/Footer';
import { DemoModal } from '../components/home/DemoModal';
import { TemplatesModal } from '../components/home/TemplatesModal';

export const HomePage: React.FC = () => {
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors">
      {/* Top Sticky Navigation */}
      <Navbar 
        onOpenTemplates={() => setIsTemplatesOpen(true)}
        onOpenFeatures={() => {
          const el = document.getElementById('features');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Hero Section with Laptop Mockup */}
        <Hero onWatchDemo={() => setIsDemoOpen(true)} />

        {/* 5-Item Highlights Strip */}
        <FeatureStrip />

        {/* Bento Grid 3 Features */}
        <BentoFeatures onExploreFeatures={() => setIsDemoOpen(true)} />

        {/* Testimonial Quote */}
        <Testimonial />

        {/* Bottom CTA Banner with Wave */}
        <CtaBanner onOpenTemplates={() => setIsTemplatesOpen(true)} />
      </main>

      {/* Footer */}
      <Footer />

      {/* Interactive Modals */}
      <DemoModal 
        isOpen={isDemoOpen} 
        onClose={() => setIsDemoOpen(false)} 
      />
      
      <TemplatesModal 
        isOpen={isTemplatesOpen} 
        onClose={() => setIsTemplatesOpen(false)} 
      />
    </div>
  );
};
