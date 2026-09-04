import React, { useState } from 'react';

const TESTIMONIALS = [
  {
    quote: "MD Writer has completely changed the way I write. It's fast, minimal and just works. I use it every day for my notes, blogs and documentation.",
    name: "Rahul Mehta",
    role: "Student & Developer",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
  },
  {
    quote: "The dual-pane live preview and instant offline caching make this my favorite markdown editor. It replaced my heavy desktop tools completely.",
    name: "Elena Rostova",
    role: "Open Source Maintainer",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
  },
  {
    quote: "Being able to type '/' to format anything without touching the mouse is pure flow state. The export to PDF is crisp and clean.",
    name: "David Chen",
    role: "Technical Writer & Architect",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
  }
];

export const Testimonial: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const current = TESTIMONIALS[activeIndex];

  return (
    <section className="py-20 sm:py-24 overflow-hidden border-t border-neutral-100 dark:border-neutral-800/60">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col items-center text-center">
          
          {/* Quote Icon */}
          <div className="text-4xl sm:text-5xl text-neutral-900 dark:text-neutral-100 font-serif leading-none select-none mb-6">
            “
          </div>

          {/* Testimonial Quote Text */}
          <blockquote className="text-lg sm:text-xl md:text-2xl text-neutral-800 dark:text-neutral-200 font-medium leading-relaxed max-w-3xl mb-10 transition-opacity duration-300">
            "{current.quote}"
          </blockquote>

          {/* Author Details & Pagination */}
          <div className="w-full flex items-center justify-between pt-2">
            
            {/* Spacer to keep author centered */}
            <div className="w-16 hidden sm:block"></div>

            {/* Author Attribution */}
            <div className="flex items-center gap-3.5 mx-auto sm:mx-0">
              <img
                src={current.avatar}
                alt={current.name}
                className="w-11 h-11 rounded-full object-cover ring-2 ring-neutral-200 dark:ring-neutral-700 shadow-xs"
              />
              <div className="text-left">
                <div className="font-bold text-sm text-neutral-900 dark:text-white">
                  {current.name}
                </div>
                <div className="text-xs text-neutral-500 dark:text-neutral-400">
                  {current.role}
                </div>
              </div>
            </div>

            {/* Pagination Dots */}
            <div className="flex items-center gap-1.5">
              {TESTIMONIALS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  aria-label={`Testimonial ${idx + 1}`}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    idx === activeIndex
                      ? 'w-5 bg-neutral-900 dark:bg-white'
                      : 'w-2 bg-neutral-300 dark:bg-neutral-700 hover:bg-neutral-400 dark:hover:bg-neutral-600'
                  }`}
                />
              ))}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
