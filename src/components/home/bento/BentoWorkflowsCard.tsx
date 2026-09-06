import React from 'react';
import { Zap, WifiOff, Palette, ShieldCheck } from 'lucide-react';

export const BentoWorkflowsCard: React.FC = () => {
  const workflowFeatures = [
    {
      title: '100% Offline',
      description: 'Your data stays with you.',
      icon: WifiOff,
    },
    {
      title: 'Lightning Fast',
      description: 'Instant response.',
      icon: Zap,
    },
    {
      title: 'Custom Themes',
      description: 'Light, dark or your own.',
      icon: Palette,
    },
    {
      title: 'Privacy First',
      description: 'No tracking. No ads.',
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 shadow-[0_4px_30px_-6px_rgba(0,0,0,0.03)] dark:shadow-none flex flex-col justify-between transition-all group">
      {/* Top Header */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/60 border border-purple-100 dark:border-purple-900/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shadow-2xs">
            <Zap className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
            Simple. Fast. Powerful.
          </span>
        </div>

        <h3 className="text-2xl font-black tracking-tight text-neutral-950 dark:text-white">
          Built for Modern Workflows
        </h3>

        <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed mt-2 mb-6">
          A clean interface, instant performance, and all the tools you need — nothing you don&apos;t.
        </p>
      </div>

      {/* 2x2 Feature Grid */}
      <div className="grid grid-cols-2 gap-3 my-auto">
        {workflowFeatures.map((feat) => {
          const Icon = feat.icon;
          return (
            <div
              key={feat.title}
              className="p-3 sm:p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800/80 flex flex-col justify-between hover:border-neutral-200 dark:hover:border-neutral-700 transition-colors"
            >
              <div className="mb-2">
                <Icon className="w-5 h-5 text-neutral-800 dark:text-neutral-200" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-neutral-950 dark:text-white">
                  {feat.title}
                </h4>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 leading-snug">
                  {feat.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
