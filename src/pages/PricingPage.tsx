import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Check, 
  Minus, 
  Sparkles, 
  ArrowRight, 
  ChevronDown, 
  Zap, 
  Cloud, 
  Users 
} from 'lucide-react';
import { Navbar } from '../components/home/Navbar';
import { Footer } from '../components/home/Footer';
import { CtaBanner } from '../components/home/CtaBanner';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/useAuthStore';
import { WaitlistSuccessModal } from '../components/common/WaitlistSuccessModal';
import { WaitlistAdminPanel } from '../components/pricing/WaitlistAdminPanel';

interface PricingTier {
  id: string;
  name: string;
  tagline: string;
  monthlyPrice: number;
  annualPrice: number;
  popular?: boolean;
  comingSoon?: boolean;
  icon: React.ElementType;
  features: string[];
  ctaText: string;
  ctaAction: string;
}

const TIERS: PricingTier[] = [
  {
    id: 'free',
    name: 'Starter (100% Free)',
    tagline: 'Ideal for solo writers, students, researchers, and local note-takers.',
    monthlyPrice: 0,
    annualPrice: 0,
    icon: Zap,
    features: [
      'Unlimited local Markdown documents',
      'Dexie.js IndexedDB instant offline cache',
      'Live dual-pane split view + Zen mode',
      'GFM formatting, tables & task checklists',
      'KaTeX LaTeX mathematical equations',
      'Export to Raw Markdown & Clean PDF',
      'Client-side WebP image compression studio',
      'Quick slash block commands (/) & callouts',
      '100% private — data never leaves browser'
    ],
    ctaText: 'Start Writing Free',
    ctaAction: '/editor'
  },
  {
    id: 'pro',
    name: 'Pro Cloud & Sync',
    tagline: 'Coming Soon: multi-device cloud sync, web publishing & revision snapshots.',
    monthlyPrice: 8,
    annualPrice: 6.4,
    comingSoon: true,
    icon: Cloud,
    features: [
      'Everything in Starter (100% Free Forever)',
      'Supabase Cloud sync across all your devices',
      'Real-time multi-device cloud backup',
      'Local revision history & 1-click snapshot rollback',
      '1-Click Web Publishing with password protection',
      'Custom tag organization & document library',
      'Curated blueprints & template studio',
      'Priority early access to all new updates'
    ],
    ctaText: 'Join Pro Waitlist',
    ctaAction: ''
  },
  {
    id: 'team',
    name: 'Team & Studio',
    tagline: 'For engineering teams, documentation squads, and studios.',
    monthlyPrice: 19,
    annualPrice: 15.2,
    icon: Users,
    features: [
      'Everything in Pro Writer',
      'Real-Time Multiplayer Collaboration (Live Presence)',
      'Shared team workspace & collaborative folders',
      'Role-based permissions (Admin, Editor, Viewer)',
      'Centralized team license & billing management',
      'Team shared templates & style guides',
      'SSO & SAML authentication integration',
      'Dedicated 99.9% uptime SLA & account manager'
    ],
    ctaText: 'Contact Sales',
    ctaAction: '/auth'
  }
];

const COMPARISON_ROWS = [
  { feature: 'Local Offline Storage (IndexedDB)', free: true, pro: true, team: true },
  { feature: 'Markdown & KaTeX Math Rendering', free: true, pro: true, team: true },
  { feature: 'Export to PDF & Markdown (.md)', free: true, pro: true, team: true },
  { feature: 'Slash Block Commands (/) & Callouts', free: true, pro: true, team: true },
  { feature: 'Curated Markdown Blueprint Templates', free: true, pro: true, team: true },
  { feature: 'Local Revision History & Snapshots', free: true, pro: true, team: true },
  { feature: 'Supabase Multi-Device Cloud Sync', free: false, pro: true, team: true },
  { feature: '1-Click Web Publishing & Passwords', free: false, pro: true, team: true },
  { feature: 'Real-Time Multiplayer Collaboration', free: false, pro: false, team: true },
  { feature: 'Shared Team Workspace & Tags', free: false, pro: false, team: true },
  { feature: 'SSO & Enterprise SAML Login', free: false, pro: false, team: true },
  { feature: 'Support Level', free: 'Community', pro: 'Priority Email', team: 'Dedicated 24/7' }
];

const FAQS = [
  {
    q: 'Can I use MD Writer completely offline without an account?',
    a: 'Yes! The Starter plan is 100% free and offline-first. Your documents are stored safely inside your browser using IndexedDB (Dexie.js). You do not need to register, log in, or install anything.'
  },
  {
    q: 'How does Supabase cloud synchronization work?',
    a: 'When you connect your Supabase account or upgrade to Pro, every edit is debounced and synchronized to your personal PostgreSQL database on Supabase. This gives you instant multi-device backup without lock-in.'
  },
  {
    q: 'What happens to my documents if I cancel my subscription?',
    a: 'You never lose access to your data. All documents are stored in open Markdown format and remain accessible in your local browser storage. You can export all your files anytime with one click.'
  },
  {
    q: 'Do you offer educational or open-source discounts?',
    a: 'Yes! We offer a 50% discount on Pro Writer for verified students, educators, and open-source project maintainers. Reach out to our team with your student or GitHub credentials.'
  },
  {
    q: 'Can I export to PDF without any watermark or ads?',
    a: 'Absolutely. MD Writer uses a publication-grade print stylesheet that forces clean white paper, crisp serif/sans typography, and removes all UI chrome and buttons.'
  }
];

export const PricingPage: React.FC = () => {
  const { user } = useAuthStore();
  const [isAnnual, setIsAnnual] = useState(true);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [isWaitlistSubmitting, setIsWaitlistSubmitting] = useState(false);
  const [isWaitlistSubmitted, setIsWaitlistSubmitted] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [lastSubmittedEmail, setLastSubmittedEmail] = useState('');
  const navigate = useNavigate();

  const isAdmin = user?.email?.toLowerCase() === 'tungariyarahul08@gmail.com';

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!waitlistEmail || !waitlistEmail.includes('@')) return;
    const submitted = waitlistEmail;
    setIsWaitlistSubmitting(true);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('mdwriter_waitlist_email', submitted);
      }
      if (supabase) {
        await supabase.from('waitlist').insert([{ email: submitted, plan: 'pro', created_at: new Date().toISOString() }]);
      }
    } catch (err) {
      console.warn('Waitlist registered locally:', err);
    } finally {
      setIsWaitlistSubmitting(false);
      setIsWaitlistSubmitted(true);
      setLastSubmittedEmail(submitted);
      setIsSuccessModalOpen(true);
      setWaitlistEmail('');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors">
      <Navbar />

      <main className="flex-1">
        
        {/* Header Hero Section */}
        <section className="pt-16 pb-12 sm:pt-20 sm:pb-16 text-center max-w-4xl mx-auto px-4 sm:px-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 text-xs font-semibold text-blue-700 dark:text-blue-300 mb-5 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Simple, Transparent Pricing</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-neutral-950 dark:text-white tracking-tight mb-5 leading-tight">
            Write for free forever.<br />Upgrade when you need cloud sync.
          </h1>

          <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed mb-10">
            No forced subscriptions for basic markdown writing. Enjoy an offline-first experience with optional cloud superpowers.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="inline-flex items-center p-1 rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 text-xs font-semibold select-none">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                !isAnnual
                  ? 'bg-white dark:bg-neutral-800 text-neutral-950 dark:text-white shadow-2xs'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                isAnnual
                  ? 'bg-white dark:bg-neutral-800 text-neutral-950 dark:text-white shadow-2xs'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <span>Annual Billing</span>
              <span className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-800">
                Save 20%
              </span>
            </button>
          </div>
        </section>

        {/* 3 Pricing Cards Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {TIERS.map((tier) => {
              const Icon = tier.icon;
              const price = isAnnual ? tier.annualPrice : tier.monthlyPrice;

              return (
                <div
                  key={tier.id}
                  className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-200 ${
                    tier.id === 'free'
                      ? 'bg-white dark:bg-neutral-900/90 border-2 border-neutral-950 dark:border-white shadow-xl lg:-translate-y-2'
                      : tier.comingSoon
                      ? 'bg-neutral-50/50 dark:bg-neutral-900/40 border-2 border-dashed border-amber-300 dark:border-amber-800/80 shadow-sm'
                      : 'bg-white dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md'
                  }`}
                >
                  {/* Badge */}
                  {tier.id === 'free' && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-emerald-400" />
                      <span>100% Free Forever</span>
                    </div>
                  )}

                  {tier.comingSoon && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-500 text-neutral-950 text-[11px] font-black px-3.5 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-neutral-950" />
                      <span>Coming Soon • Waitlist Open</span>
                    </div>
                  )}

                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-800 dark:text-neutral-200">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                        {tier.id.toUpperCase()}
                      </span>
                    </div>

                    <h3 className="text-2xl font-black text-neutral-950 dark:text-white tracking-tight mb-2">
                      {tier.name}
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 min-h-[34px] leading-relaxed mb-6">
                      {tier.tagline}
                    </p>

                    {/* Price */}
                    <div className="flex items-baseline gap-1 mb-6 pb-6 border-b border-neutral-100 dark:border-neutral-800">
                      <span className="text-4xl sm:text-5xl font-black text-neutral-950 dark:text-white tracking-tight">
                        ${price === 0 ? '0' : price.toFixed(2)}
                      </span>
                      <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                        {tier.monthlyPrice === 0 ? 'forever' : isAnnual ? '/ month, billed annually' : '/ month'}
                      </span>
                    </div>

                    {/* Features List */}
                    <div className="space-y-3 mb-8">
                      <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
                        What's Included:
                      </div>
                      {tier.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs text-neutral-700 dark:text-neutral-300">
                          <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5 stroke-[2.5]" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Button or Waitlist Form */}
                  {tier.comingSoon ? (
                    <div className="pt-2">
                      {isWaitlistSubmitted ? (
                        <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 text-center">
                          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                            <Check className="w-4 h-4" />
                            <span>You're on the early access list!</span>
                          </div>
                          <p className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80 mt-0.5">
                            We'll ping you before public launch.
                          </p>
                        </div>
                      ) : (
                        <form onSubmit={handleWaitlistSubmit} className="space-y-2">
                          <div className="flex items-center justify-between text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">
                            <span>Get early access & updates</span>
                            <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400">Demand Signal</span>
                          </div>
                          <div className="flex gap-1.5">
                            <input
                              type="email"
                              required
                              value={waitlistEmail}
                              onChange={(e) => setWaitlistEmail(e.target.value)}
                              placeholder="Enter your email"
                              className="flex-1 px-3 py-2 text-xs rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-amber-500"
                            />
                            <button
                              type="submit"
                              disabled={isWaitlistSubmitting}
                              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs transition-colors cursor-pointer shadow-xs shrink-0"
                            >
                              {isWaitlistSubmitting ? 'Joining...' : 'Notify Me'}
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => navigate(tier.ctaAction)}
                      className={`w-full py-3 px-4 rounded-xl text-xs font-bold tracking-tight transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        tier.id === 'free'
                          ? 'bg-neutral-950 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-950 shadow-md hover:shadow-lg'
                          : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-200'
                      }`}
                    >
                      <span>{tier.ctaText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Feature Comparison Matrix Table */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-neutral-100 dark:border-neutral-800/80">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-neutral-950 dark:text-white tracking-tight mb-2">
              Compare Plan Features
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Detailed breakdown of features across all MD Writer tiers.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xs">
            <table className="w-full text-left text-xs divide-y divide-neutral-200 dark:divide-neutral-800">
              <thead className="bg-neutral-50 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 font-bold uppercase text-[11px]">
                <tr>
                  <th className="p-4 sm:px-6">Feature</th>
                  <th className="p-4 text-center w-28">Starter</th>
                  <th className="p-4 text-center w-28 bg-neutral-100/50 dark:bg-neutral-800/50">Pro Writer</th>
                  <th className="p-4 text-center w-28">Team</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60 bg-white dark:bg-neutral-950">
                {COMPARISON_ROWS.map((row, idx) => (
                  <tr key={idx} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30 transition-colors">
                    <td className="p-4 sm:px-6 font-medium text-neutral-800 dark:text-neutral-200">
                      {row.feature}
                    </td>
                    <td className="p-4 text-center text-neutral-600 dark:text-neutral-400">
                      {typeof row.free === 'boolean' ? (
                        row.free ? (
                          <Check className="w-4 h-4 text-emerald-500 mx-auto" />
                        ) : (
                          <Minus className="w-4 h-4 text-neutral-300 dark:text-neutral-600 mx-auto" />
                        )
                      ) : (
                        <span className="font-semibold">{row.free}</span>
                      )}
                    </td>
                    <td className="p-4 text-center bg-neutral-100/30 dark:bg-neutral-800/30 text-neutral-800 dark:text-neutral-200">
                      {typeof row.pro === 'boolean' ? (
                        row.pro ? (
                          <Check className="w-4 h-4 text-emerald-500 mx-auto stroke-[2.5]" />
                        ) : (
                          <Minus className="w-4 h-4 text-neutral-300 dark:text-neutral-600 mx-auto" />
                        )
                      ) : (
                        <span className="font-bold text-neutral-900 dark:text-white">{row.pro}</span>
                      )}
                    </td>
                    <td className="p-4 text-center text-neutral-600 dark:text-neutral-400">
                      {typeof row.team === 'boolean' ? (
                        row.team ? (
                          <Check className="w-4 h-4 text-emerald-500 mx-auto" />
                        ) : (
                          <Minus className="w-4 h-4 text-neutral-300 dark:text-neutral-600 mx-auto" />
                        )
                      ) : (
                        <span className="font-semibold">{row.team}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Admin Hub for tungariyarahul08@gmail.com */}
        {isAdmin && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
            <WaitlistAdminPanel />
          </section>
        )}

        {/* FAQ Accordion Section */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-neutral-100 dark:border-neutral-800/80">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-neutral-950 dark:text-white tracking-tight mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Got questions? We have answers to help you get writing smoothly.
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden bg-white dark:bg-neutral-900/40 transition-colors"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-neutral-900 dark:text-white cursor-pointer select-none"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed border-t border-neutral-100 dark:border-neutral-800/60 pt-3 animate-in fade-in duration-150">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA Banner */}
        <CtaBanner onOpenTemplates={() => navigate('/editor')} />

      </main>

      <WaitlistSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        email={lastSubmittedEmail}
      />

      <Footer />
    </div>
  );
};
