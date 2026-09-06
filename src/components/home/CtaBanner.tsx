import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { CtaFloatingEditor } from './cta/CtaFloatingEditor';
import { CtaFeatureStrip } from './cta/CtaFeatureStrip';

interface CtaBannerProps {
  onOpenTemplates?: () => void;
}

export const CtaBanner: React.FC<CtaBannerProps> = ({ onOpenTemplates }) => {
  const navigate = useNavigate();

  const avatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
  ];

  return (
    <section className="relative py-16 sm:py-24 overflow-hidden bg-white dark:bg-neutral-950 border-t border-neutral-100 dark:border-neutral-850 transition-colors">
      {/* Background Soft Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-gradient-to-tr from-blue-500/5 via-indigo-500/5 to-emerald-500/5 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-14">
        
        {/* Top Showcase: Hero Left + Floating Editor Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Hero & Action Area */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            
            {/* Eyebrow Pill */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-neutral-200/90 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-850 text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-5 w-fit">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span className="tracking-wider uppercase font-mono">YOUR IDEAS, BETTER WRITTEN</span>
            </div>

            {/* Main Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-[52px] font-black tracking-tight leading-[1.08] mb-4">
              <span className="text-neutral-950 dark:text-white block">Turn your ideas into</span>
              <span className="text-blue-600 dark:text-blue-500 block">meaningful content.</span>
            </h2>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-lg mb-8">
              A clean, fast and powerful Markdown editor to write, organize and export beautiful documents — all in your browser.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 mb-8">
              <button
                onClick={() => navigate('/editor')}
                className="px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 font-bold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-sm cursor-pointer group"
              >
                <span>Open Editor</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={onOpenTemplates}
                className="px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl border border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-2xs"
              >
                View Templates
              </button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2 overflow-hidden">
                {avatars.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt="User avatar"
                    className="inline-block h-7 w-7 rounded-full ring-2 ring-white dark:ring-neutral-900 object-cover"
                  />
                ))}
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                Loved by <span className="font-bold text-neutral-900 dark:text-white">10,000+</span> creators, students and professionals.
              </p>
            </div>

          </div>

          {/* Right Floating Interactive Showcase */}
          <div className="lg:col-span-7 pt-6 lg:pt-0">
            <CtaFloatingEditor 
              onOpenTemplates={onOpenTemplates} 
              onOpenEditor={() => navigate('/editor')}
            />
          </div>

        </div>

        {/* Bottom 5-Item Highlights Strip */}
        <CtaFeatureStrip />

      </div>
    </section>
  );
};
