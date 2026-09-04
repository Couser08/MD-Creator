import React from 'react';
import { ArrowRight, FolderKanban, PenTool, Share2 } from 'lucide-react';

interface BentoFeaturesProps {
  onExploreFeatures?: () => void;
}

const CARDS = [
  {
    icon: FolderKanban,
    iconBg: 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40',
    title: 'Organize Effortlessly',
    description: 'Keep your notes, documents and projects in one place with a simple and intuitive workspace.'
  },
  {
    icon: PenTool,
    iconBg: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/40',
    title: 'Write Faster',
    description: 'Use shortcuts, formatting tools and templates to speed up your workflow and stay productive.'
  },
  {
    icon: Share2,
    iconBg: 'bg-rose-50 dark:bg-rose-950/60 text-rose-500 dark:text-rose-400 border border-rose-100 dark:border-rose-900/40',
    title: 'Share with Ease',
    description: 'Export your documents or share them instantly with a link. Perfect for notes, docs, blogs and more.'
  }
];

export const BentoFeatures: React.FC<BentoFeaturesProps> = ({ onExploreFeatures }) => {
  return (
    <section id="features" className="py-20 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Eyebrow */}
        <p className="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-3">
          MORE THAN JUST AN EDITOR
        </p>

        {/* Two Column Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-neutral-950 dark:text-white tracking-tight leading-tight max-w-md">
            Everything you need,<br />in one place.
          </h2>

          <div className="flex flex-col items-start md:items-end">
            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-md md:text-right leading-relaxed mb-3">
              MD Writer combines a clean writing experience with powerful features, so you can focus on what really matters — your ideas.
            </p>
            <button 
              onClick={onExploreFeatures}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-900 dark:text-white hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors group cursor-pointer"
            >
              <span>Explore all features</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* 3 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {CARDS.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="p-8 sm:p-9 rounded-2xl bg-white dark:bg-neutral-900/80 border border-neutral-100 dark:border-neutral-800/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] dark:shadow-none hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-200"
              >
                {/* Colored Icon Box */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-7 ${card.iconBg} shadow-2xs`}>
                  <Icon className="w-5 h-5 stroke-[2]" />
                </div>

                {/* Card Title */}
                <h3 className="text-xl font-bold text-neutral-950 dark:text-white mb-2.5 tracking-tight">
                  {card.title}
                </h3>

                {/* Card Description */}
                <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
