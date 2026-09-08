import React from 'react';
import { 
  PenTool, 
  Folder, 
  FileDown, 
  Zap, 
  ShieldCheck 
} from 'lucide-react';

export const CtaFeatureStrip: React.FC = () => {
  const features = [
    {
      icon: PenTool,
      title: 'Minimal Interface',
      desc: 'Clean and intuitive',
    },
    {
      icon: Folder,
      title: 'Organize Easily',
      desc: 'Folders, favorites, recents',
    },
    {
      icon: FileDown,
      title: 'Export Anywhere',
      desc: 'PDF, HTML, DOCX, Text',
    },
    {
      icon: Zap,
      title: 'Blazing Fast',
      desc: 'Works instantly',
    },
    {
      icon: ShieldCheck,
      title: '100% Private',
      desc: 'Your data stays with you',
    },
  ];

  return (
    <div className="pt-10 sm:pt-14 border-t border-neutral-200/70 dark:border-neutral-850">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-y-6 gap-x-4 lg:gap-x-0 lg:divide-x lg:divide-neutral-200/70 dark:lg:divide-neutral-850">
        {features.map((feat) => {
          const Icon = feat.icon;
          return (
            <div
              key={feat.title}
              className="flex items-center gap-3 px-2 lg:px-6 transition-colors group select-none"
            >
              <div className="w-10 h-10 rounded-2xl bg-white dark:bg-blue-950/50 border border-neutral-200/80 dark:border-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-sm dark:shadow-none">
                <Icon className="w-5 h-5 stroke-[1.75]" />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-xs sm:text-sm text-neutral-900 dark:text-white truncate">
                  {feat.title}
                </h4>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
                  {feat.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

