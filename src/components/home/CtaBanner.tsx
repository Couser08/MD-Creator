import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface CtaBannerProps {
  onOpenTemplates?: () => void;
}

export const CtaBanner: React.FC<CtaBannerProps> = ({ onOpenTemplates }) => {
  const navigate = useNavigate();

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden wavy-gradient border-t border-neutral-100 dark:border-neutral-800/80">
      
      {/* Background Soft Wave Contours */}
      <div className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20 flex items-center justify-center">
        <svg viewBox="0 0 1440 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full object-cover">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,144C672,139,768,181,864,197.3C960,213,1056,203,1152,181.3C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            fill="currentColor"
            className="text-neutral-200 dark:text-neutral-800"
          />
        </svg>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Eyebrow */}
        <p className="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-3">
          READY TO GET STARTED?
        </p>

        {/* Headline */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-neutral-950 dark:text-white tracking-tight mb-4">
          Turn your ideas into something meaningful.
        </h2>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-lg mx-auto leading-relaxed mb-8">
          Start writing with MD Writer today — it's free and works right in your browser.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 mb-6">
          <button
            onClick={() => navigate('/editor')}
            className="bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-950 px-6.5 py-3 rounded-lg font-semibold text-sm shadow-sm hover:shadow transition-all cursor-pointer flex items-center gap-2 group"
          >
            <span>Open Editor</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={onOpenTemplates ? onOpenTemplates : () => navigate('/editor')}
            className="bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 px-6 py-3 rounded-lg font-medium text-sm transition-all cursor-pointer shadow-xs"
          >
            View Templates
          </button>
        </div>

        {/* Microcopy */}
        <p className="text-xs text-neutral-400 dark:text-neutral-500">
          No installation. No distractions. Just writing.
        </p>

      </div>
    </section>
  );
};
