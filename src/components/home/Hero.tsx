import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Play, Check, Hexagon, ArrowLeftRight } from 'lucide-react';
import { EditorMockup } from './EditorMockup';

interface HeroProps {
  onWatchDemo: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onWatchDemo }) => {
  const navigate = useNavigate();

  return (
    <section className="relative pt-12 pb-20 sm:pt-16 sm:pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Column */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50/80 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 text-neutral-600 dark:text-neutral-300 text-xs font-medium mb-6 select-none shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400"></span>
              <span>A better way to write</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-black text-neutral-950 dark:text-white tracking-tight leading-[1.08] mb-5">
              Write, Organize<br />
              and Share with<br />
              Markdown.
            </h1>

            {/* Subheadline Description */}
            <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-lg leading-relaxed mb-8">
              A clean, powerful and distraction-free Markdown editor to turn your ideas into beautiful documents.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 mb-10 w-full sm:w-auto">
              {/* Primary Open Editor Button */}
              <button
                onClick={() => navigate('/editor')}
                className="w-full sm:w-auto bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-950 px-6 py-3 rounded-lg font-semibold text-sm shadow-sm hover:shadow transition-all cursor-pointer flex items-center justify-center gap-2 group"
              >
                <span>Open Editor</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* Secondary Watch Demo Button */}
              <button
                onClick={onWatchDemo}
                className="w-full sm:w-auto bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 px-5 py-3 rounded-lg font-medium text-sm transition-all cursor-pointer flex items-center justify-center gap-2.5 shadow-xs"
              >
                <div className="w-5 h-5 rounded-full border border-neutral-300 dark:border-neutral-600 flex items-center justify-center">
                  <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
                </div>
                <span>Watch Demo</span>
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-neutral-500 dark:text-neutral-400">
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-neutral-700 dark:text-neutral-300 stroke-[2.5]" />
                <span>No sign-up required</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Hexagon className="w-3.5 h-3.5 text-neutral-700 dark:text-neutral-300" />
                <span>Works offline</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ArrowLeftRight className="w-3.5 h-3.5 text-neutral-700 dark:text-neutral-300" />
                <span>Export anywhere</span>
              </div>
            </div>

          </div>

          {/* Right Hero Column: Laptop Editor Mockup */}
          <div className="lg:col-span-6 w-full pt-4 lg:pt-0">
            <EditorMockup />
          </div>

        </div>

      </div>
    </section>
  );
};
