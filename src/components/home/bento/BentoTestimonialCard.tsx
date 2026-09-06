import React from 'react';
import { Quote } from 'lucide-react';

export const BentoTestimonialCard: React.FC = () => {
  return (
    <div className="lg:col-span-3 rounded-3xl bg-sky-50/40 dark:bg-neutral-900 border border-sky-100/70 dark:border-neutral-800 shadow-[0_4px_30px_-6px_rgba(0,0,0,0.03)] dark:shadow-none p-6 sm:p-7 flex flex-col justify-between transition-all group">
      {/* Top Quote Icon */}
      <div>
        <Quote className="w-6 h-6 text-sky-400 dark:text-sky-500/80 mb-2 fill-sky-100 dark:fill-sky-950/40" />

        {/* Quote Content */}
        <blockquote className="text-xs sm:text-sm font-medium italic text-neutral-700 dark:text-neutral-300 leading-relaxed my-3">
          &ldquo;MD Writer has completely changed how I take notes. It&apos;s clean, fast and just works.&rdquo;
        </blockquote>
      </div>

      {/* Author Footer */}
      <div className="flex items-center gap-3 pt-3">
        <div className="w-8 h-8 rounded-full bg-neutral-900 dark:bg-neutral-800 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
          A
        </div>
        <div>
          <div className="text-xs font-bold text-neutral-950 dark:text-white">
            Aarav Mehta
          </div>
          <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
            Student &amp; Creator
          </div>
        </div>
      </div>
    </div>
  );
};
