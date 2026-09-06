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
import { ProductUpdatesModal } from '../components/home/ProductUpdatesModal';

export const HomePage: React.FC = () => {
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [isUpdatesOpen, setIsUpdatesOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors">
      {/* Top Sticky Navigation */}
      <Navbar 
        onOpenTemplates={() => setIsTemplatesOpen(true)}
        onOpenFeatures={() => {
          const el = document.getElementById('features');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenUpdates={() => setIsUpdatesOpen(true)}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Hero Section with Laptop Mockup */}
        <Hero onWatchDemo={() => setIsDemoOpen(true)} />

        {/* 5-Item Highlights Strip */}
        <FeatureStrip />

        {/* Bento Grid Features */}
        <BentoFeatures 
          onExploreFeatures={() => setIsDemoOpen(true)} 
          onOpenUpdates={() => setIsUpdatesOpen(true)}
          onOpenTemplates={() => setIsTemplatesOpen(true)}
        />

        {/* Testimonial Quote */}
        <Testimonial />

        {/* Bottom CTA Banner with Wave */}
        <CtaBanner onOpenTemplates={() => setIsTemplatesOpen(true)} />
      </main>

      {/* Footer */}
      <Footer onOpenUpdates={() => setIsUpdatesOpen(true)} />

      {/* Interactive Modals */}
      <DemoModal 
        isOpen={isDemoOpen} 
        onClose={() => setIsDemoOpen(false)} 
        onOpenUpdates={() => setIsUpdatesOpen(true)}
      />
      
      <TemplatesModal 
        isOpen={isTemplatesOpen} 
        onClose={() => setIsTemplatesOpen(false)} 
      />

      {/* Crafted-with-Love Release Timeline & What's New Modal */}
      <ProductUpdatesModal 
        isOpen={isUpdatesOpen} 
        onClose={() => setIsUpdatesOpen(false)} 
      />
    </div>
  );
};
