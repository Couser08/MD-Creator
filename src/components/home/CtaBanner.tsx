import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Play, Check, Sparkles } from 'lucide-react';
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
    <section className="relative py-20 sm:py-28 overflow-hidden bg-[#f5f7ff] dark:bg-neutral-950 border-t border-neutral-100 dark:border-neutral-850 transition-colors">
      
      {/* Soft radial background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[700px] bg-[radial-gradient(ellipse_at_center,_rgba(219,234,254,0.6)_0%,_transparent_65%)] dark:bg-[radial-gradient(ellipse_at_center,_rgba(30,58,138,0.14)_0%,_transparent_65%)] blur-3xl rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        
        {/* ── Two-column grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-6 items-center">

          {/* ── Left: Content ── */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            
            {/* Badge pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200/70 dark:border-blue-900/50 text-[11px] font-semibold tracking-widest uppercase text-blue-600 dark:text-blue-400 mb-7 w-fit select-none">
              <Sparkles className="w-3 h-3" />
              <span>Your Ideas, Better Written</span>
            </div>

            {/* Headline */}
            <h2 className="text-[38px] sm:text-5xl lg:text-[52px] font-black tracking-tight leading-[1.07] mb-5">
              <span className="text-neutral-950 dark:text-white block">Turn your ideas into</span>
              <span className="text-blue-600 dark:text-blue-500 block">meaningful content.</span>
            </h2>

            {/* Subtitle */}
            <p className="text-base text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-md mb-9">
              A clean, fast and powerful Markdown editor to write, organize and export beautiful documents — all in your browser.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 mb-8">
              {/* Primary blue button with glow */}
              <button
                onClick={() => navigate('/editor')}
                className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-sm transition-all flex items-center gap-2 shadow-[0_3px_16px_rgba(37,99,235,0.4)] hover:shadow-[0_6px_24px_rgba(37,99,235,0.5)] cursor-pointer group"
              >
                <span>Open Editor</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* Ghost button with circular play icon */}
              <button
                onClick={onOpenTemplates}
                className="px-5 py-3.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-200 font-semibold text-sm transition-all flex items-center gap-2.5 cursor-pointer shadow-sm"
              >
                <div className="w-6 h-6 rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 flex items-center justify-center shrink-0 shadow-xs">
                  <Play className="w-2.5 h-2.5 fill-neutral-600 dark:fill-neutral-300 text-neutral-600 dark:text-neutral-300 ml-px" />
                </div>
                <span>View Templates</span>
              </button>
            </div>

            {/* Social proof: avatar stack + text */}
            <div className="flex items-center gap-3.5 mb-5">
              <div className="flex -space-x-2.5">
                {avatars.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt="User avatar"
                    className="w-8 h-8 rounded-full ring-2 ring-white dark:ring-neutral-950 object-cover"
                  />
                ))}
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-snug">
                Loved by{' '}
                <span className="font-bold text-neutral-900 dark:text-white">10,000+</span>{' '}
                creators, students and professionals.
              </p>
            </div>

            {/* Trust checkmarks with blue Check icon */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-neutral-500 dark:text-neutral-400 font-medium">
              {['No installation', 'Works offline', 'Your data stays private'].map((item) => (
                <div key={item} className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 stroke-[2.5] shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

          </div>

          {/* ── Right: Floating Editor Mockup ── */}
          <div className="lg:col-span-7 w-full">
            <CtaFloatingEditor 
              onOpenTemplates={onOpenTemplates} 
              onOpenEditor={() => navigate('/editor')}
            />
          </div>

        </div>

        {/* ── Bottom feature strip ── */}
        <CtaFeatureStrip />

      </div>
    </section>
  );
};

