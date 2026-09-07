import React, { useState, useEffect, Suspense } from 'react';
import { Navbar } from '../components/home/Navbar';
import { Hero } from '../components/home/Hero';
import { FeatureStrip } from '../components/home/FeatureStrip';
import { BentoFeatures } from '../components/home/BentoFeatures';
import { Testimonial } from '../components/home/Testimonial';
import { CtaBanner } from '../components/home/CtaBanner';
import { Footer } from '../components/home/Footer';

// Code-split heavy interactive modals on-demand
const DemoModal = React.lazy(() =>
  import('../components/home/DemoModal').then((m) => ({ default: m.DemoModal }))
);
const TemplatesModal = React.lazy(() =>
  import('../components/home/TemplatesModal').then((m) => ({ default: m.TemplatesModal }))
);
const ProductUpdatesModal = React.lazy(() =>
  import('../components/home/ProductUpdatesModal').then((m) => ({ default: m.ProductUpdatesModal }))
);

export const HomePage: React.FC = () => {
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [isUpdatesOpen, setIsUpdatesOpen] = useState(false);

  // Global listener for Templates modal trigger and URL query param
  useEffect(() => {
    const handleOpenTemplates = () => setIsTemplatesOpen(true);
    window.addEventListener('open-templates-modal', handleOpenTemplates);

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('templates') === 'open' || params.get('templates') === 'true') {
        setIsTemplatesOpen(true);
        window.history.replaceState({}, '', window.location.pathname);
      }
    }

    return () => {
      window.removeEventListener('open-templates-modal', handleOpenTemplates);
    };
  }, []);

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

      {/* Interactive Modals — Lazy Loaded On-Demand */}
      {isDemoOpen && (
        <Suspense fallback={null}>
          <DemoModal 
            isOpen={isDemoOpen} 
            onClose={() => setIsDemoOpen(false)} 
            onOpenUpdates={() => setIsUpdatesOpen(true)}
          />
        </Suspense>
      )}
      
      {isTemplatesOpen && (
        <Suspense fallback={null}>
          <TemplatesModal 
            isOpen={isTemplatesOpen} 
            onClose={() => setIsTemplatesOpen(false)} 
          />
        </Suspense>
      )}

      {/* Crafted-with-Love Release Timeline & What's New Modal */}
      {isUpdatesOpen && (
        <Suspense fallback={null}>
          <ProductUpdatesModal 
            isOpen={isUpdatesOpen} 
            onClose={() => setIsUpdatesOpen(false)} 
          />
        </Suspense>
      )}
    </div>
  );
};
