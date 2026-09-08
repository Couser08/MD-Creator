import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles, X, Check, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';
import { joinEarlybirdWaitlist } from '../../services/couponService';

interface ProUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureTitle?: string;
  featureDescription?: string;
}

export const ProUpgradeModal: React.FC<ProUpgradeModalProps> = ({
  isOpen,
  onClose,
  featureTitle = 'Pro Cloud & Advanced Publishing',
  featureDescription = 'This power feature is part of MD Writer Pro. Claim one of our 100 Earlybird VIP spots to unlock free Pro access at launch.'
}) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimedCode, setClaimedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleClaimSpot = async () => {
    if (!user) {
      navigate('/auth?redirect=/pricing&intent=waitlist');
      onClose();
      return;
    }

    setIsClaiming(true);
    try {
      const res = await joinEarlybirdWaitlist(user.id, user.email);
      if (res.success && res.couponCode) {
        setClaimedCode(res.couponCode);
      }
    } catch (e) {
      console.warn('Failed to claim spot from modal:', e);
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-md bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-neutral-200/80 dark:border-neutral-800 p-6 sm:p-7 overflow-hidden z-10"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer z-10"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="text-center">
            {/* Pro Badge Icon */}
            <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Sparkles className="w-7 h-7" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60 mb-2.5">
              <span>Pro Writer Feature</span>
            </div>

            <h3 className="text-xl font-black text-neutral-950 dark:text-white tracking-tight">
              {featureTitle}
            </h3>

            <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {featureDescription}
            </p>
          </div>

          {claimedCode ? (
            <div className="mt-5 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-center space-y-2">
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                <Check className="w-4 h-4" />
                <span>Earlybird VIP Spot Reserved!</span>
              </div>
              <div className="p-2 bg-white dark:bg-neutral-900 rounded-xl font-mono text-sm font-black text-neutral-900 dark:text-white border border-emerald-200/60">
                {claimedCode}
              </div>
              <p className="text-[10.5px] text-emerald-600/90 dark:text-emerald-400/90">
                Reward: 1 month free on Monthly or 2 months free + 20% off on Annual.
              </p>
              <button
                onClick={() => {
                  onClose();
                  navigate('/pricing');
                }}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer mt-2"
              >
                Go to Pricing &amp; Redeem
              </button>
            </div>
          ) : (
            <div className="mt-6 space-y-3">
              <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/60 space-y-2 text-xs text-neutral-700 dark:text-neutral-300">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>Limited to strictly 100 Earlybird VIP members</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>1 to 2 free months of full Pro access</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>Free Starter plan remains 100% offline &amp; free forever</span>
                </div>
              </div>

              <button
                onClick={handleClaimSpot}
                disabled={isClaiming}
                className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow"
              >
                <Tag className="w-3.5 h-3.5" />
                <span>{user ? (isClaiming ? 'Claiming Spot...' : 'Claim 1 of 100 VIP Spots') : 'Sign In to Claim VIP Spot'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  onClose();
                  navigate('/pricing');
                }}
                className="w-full py-2 text-xs font-semibold text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors cursor-pointer"
              >
                View Full Pricing Details
              </button>
            </div>
          )}

          <div className="mt-4 flex items-center justify-center gap-1.5 text-[10.5px] text-neutral-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Zero obligation • No credit card required</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
