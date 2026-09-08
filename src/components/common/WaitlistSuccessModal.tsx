import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  Sparkles, 
  X, 
  Check, 
  Copy, 
  ShieldCheck, 
  Gift,
  Star
} from 'lucide-react';

interface WaitlistSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  couponCode?: string | null;
}

export const WaitlistSuccessModal: React.FC<WaitlistSuccessModalProps> = ({
  isOpen,
  onClose,
  email,
  couponCode
}) => {
  const [copiedShare, setCopiedShare] = useState(false);
  const [copiedCoupon, setCopiedCoupon] = useState(false);

  if (!isOpen) return null;

  const handleCopyShareLink = () => {
    const shareUrl = window.location.origin + '/pricing';
    navigator.clipboard.writeText(shareUrl);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  const handleCopyCoupon = () => {
    if (!couponCode) return;
    navigator.clipboard.writeText(couponCode);
    setCopiedCoupon(true);
    setTimeout(() => setCopiedCoupon(false), 2500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-md bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-neutral-200/80 dark:border-neutral-800 p-6 sm:p-8 overflow-hidden z-10"
        >
          {/* Ambient Glow */}
          <div className="absolute -top-24 -right-24 w-60 h-60 bg-blue-500/15 dark:bg-blue-500/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-indigo-500/15 dark:bg-indigo-500/25 rounded-full blur-3xl pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer z-10"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Icon & VIP Badge */}
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
                <Sparkles className="w-8 h-8 animate-pulse" />
              </div>
              <div className="absolute -bottom-1 -right-1 p-1 bg-amber-400 text-neutral-950 rounded-full shadow">
                <Star className="w-3.5 h-3.5 fill-current" />
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-900/50 mb-3 uppercase tracking-wider">
              <span>VIP Early Access Confirmed</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-neutral-950 dark:text-white tracking-tight">
              You're On the Priority List!
            </h3>

            <p className="mt-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-sm">
              We've reserved your spot for <span className="font-semibold text-neutral-900 dark:text-white">{email}</span>. You'll be among the first to unlock Pro writing features when they launch.
            </p>
          </div>

          {/* Exclusive Coupon Code Card */}
          {couponCode && (
            <div className="mt-5 p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/80 flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider block">
                  Your Earlybird Coupon Code
                </span>
                <span className="font-mono text-sm font-black text-amber-900 dark:text-amber-200 tracking-wider">
                  {couponCode}
                </span>
              </div>
              <button
                onClick={handleCopyCoupon}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
                title="Copy Coupon Code"
              >
                {copiedCoupon ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Perks Card */}
          <div className="mt-4 p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/60 space-y-2.5 text-xs text-neutral-700 dark:text-neutral-300">
            <div className="font-bold text-neutral-900 dark:text-white text-[11px] uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Gift className="w-3.5 h-3.5 text-blue-500" />
              <span>Your Waitlist Member Rewards</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </div>
              <span><strong>Monthly:</strong> 1 month Pro free at redemption</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </div>
              <span><strong>Annual:</strong> 20% annual discount + <strong>2 months Pro free</strong></span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </div>
              <span>Priority direct access to shape the product roadmap</span>
            </div>
          </div>

          {/* Share Invitation Link */}
          <div className="mt-6 space-y-3">
            <button
              onClick={handleCopyShareLink}
              className="w-full py-3 px-4 rounded-xl font-semibold text-xs bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-950 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow"
            >
              {copiedShare ? (
                <>
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span>Invitation Link Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Share MD Writer with Friends</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="w-full py-2.5 text-xs font-semibold text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors cursor-pointer"
            >
              Back to Pricing
            </button>
          </div>

          <div className="mt-4 flex items-center justify-center gap-1.5 text-[10.5px] text-neutral-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Zero spam. Unsubscribe with 1-click anytime.</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
