import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  Coffee, 
  X, 
  Heart, 
  ExternalLink, 
  ShieldCheck, 
  ArrowRight,
  Gift
} from 'lucide-react';
import { renderWithAppleEmojis } from '../../utils/appleEmoji';

export { openBuyCoffeeModal } from '../../utils/coffeeModalEvents';

interface BuyCoffeeModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

interface CoffeeTier {
  id: string;
  name: string;
  cups: string;
  price: number;
  popular?: boolean;
  tagline: string;
}

const TIERS: CoffeeTier[] = [
  {
    id: 'espresso',
    name: 'Espresso',
    cups: '☕',
    price: 3,
    tagline: 'Quick boost for rapid bug fixes'
  },
  {
    id: 'latte',
    name: 'Creamy Latte',
    cups: '☕☕',
    price: 5,
    popular: true,
    tagline: 'Fuel for building new features'
  },
  {
    id: 'roaster',
    name: 'Roaster Pack',
    cups: '☕☕☕',
    price: 10,
    tagline: 'Rocket fuel for MD Writer evolution'
  }
];

export const BuyCoffeeModal: React.FC<BuyCoffeeModalProps> = ({
  isOpen: propIsOpen,
  onClose: propOnClose
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isModalOpen = propIsOpen !== undefined ? propIsOpen : internalOpen;

  const [selectedTier, setSelectedTier] = useState<string>('latte');
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isCustom, setIsCustom] = useState(false);
  const [supporterName, setSupporterName] = useState('');
  const [supporterNote, setSupporterNote] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Listen to global open event
  useEffect(() => {
    const handleGlobalOpen = () => setInternalOpen(true);
    window.addEventListener('open-buy-coffee', handleGlobalOpen);
    return () => window.removeEventListener('open-buy-coffee', handleGlobalOpen);
  }, []);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  const handleClose = () => {
    if (propOnClose) propOnClose();
    setInternalOpen(false);
    // Reset celebration after exit
    setTimeout(() => {
      setIsSuccess(false);
      setSupporterName('');
      setSupporterNote('');
    }, 200);
  };

  const getActiveAmount = (): number => {
    if (isCustom) {
      const parsed = parseFloat(customAmount);
      return !isNaN(parsed) && parsed > 0 ? parsed : 5;
    }
    const tier = TIERS.find(t => t.id === selectedTier);
    return tier ? tier.price : 5;
  };

  const handleSimulatedSupport = () => {
    setIsSuccess(true);
  };

  return (
    <AnimatePresence>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-neutral-950/65 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative w-full max-w-lg bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden z-10 flex flex-col max-h-[92vh]"
          >
            {/* Ambient Warm Gradient Accent Top */}
            <div className="h-2 w-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500" />

            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-3 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-400 flex items-center justify-center shadow-xs">
                  <Coffee className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                    <span>Buy Me a Coffee</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-medium">
                      Support Creator
                    </span>
                  </h2>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Keep MD Writer independent, fast, and 100% ad-free
                  </p>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="p-1.5 rounded-xl text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs">
              {!isSuccess ? (
                <>
                  {/* Coffee Tiers */}
                  <div>
                    <label className="block font-bold text-neutral-800 dark:text-neutral-200 mb-2">
                      Choose Your Coffee Boost
                    </label>
                    <div className="grid grid-cols-3 gap-2.5">
                      {TIERS.map((tier) => {
                        const isSelected = !isCustom && selectedTier === tier.id;
                        return (
                          <div
                            key={tier.id}
                            onClick={() => {
                              setSelectedTier(tier.id);
                              setIsCustom(false);
                            }}
                            className={`relative p-3.5 rounded-2xl border-2 cursor-pointer transition-all text-center flex flex-col items-center justify-between ${
                              isSelected
                                ? 'border-amber-500 bg-amber-50/60 dark:bg-amber-950/30 shadow-xs'
                                : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-neutral-50/40 dark:bg-neutral-800/30'
                            }`}
                          >
                            {tier.popular && (
                              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.2 rounded-full bg-amber-500 text-white font-black text-[9px] uppercase tracking-wider shadow-2xs">
                                Most Popular
                              </span>
                            )}
                            <div className="text-lg mb-1">{tier.cups}</div>
                            <div className="font-bold text-neutral-900 dark:text-white text-xs">
                              {tier.name}
                            </div>
                            <div className="text-sm font-black text-amber-600 dark:text-amber-400 mt-1">
                              ${tier.price}
                            </div>
                            <p className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-1 leading-tight line-clamp-2">
                              {tier.tagline}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Custom Amount Button / Input */}
                  <div className="pt-1">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsCustom(!isCustom)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                          isCustom
                            ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
                            : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                        }`}
                      >
                        Custom Amount
                      </button>

                      {isCustom && (
                        <div className="flex-1 relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-neutral-400">
                            $
                          </span>
                          <input
                            type="number"
                            min="1"
                            step="1"
                            placeholder="Enter amount"
                            value={customAmount}
                            onChange={(e) => setCustomAmount(e.target.value)}
                            className="w-full pl-7 pr-3 py-1.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-bold"
                            autoFocus
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Supporter Name & Note */}
                  <div className="space-y-3 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                    <div>
                      <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                        Your Name / Handle (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Alex or @writer"
                        value={supporterName}
                        onChange={(e) => setSupporterName(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                        Message or Feedback (Optional)
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Leave a friendly note or idea..."
                        value={supporterNote}
                        onChange={(e) => setSupporterNote(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 resize-none"
                      />
                    </div>
                  </div>

                  {/* Direct External Donation Links */}
                  <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/70 dark:border-neutral-800 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Gift className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      <div>
                        <p className="font-bold text-neutral-800 dark:text-neutral-200">
                          External Payment Channels
                        </p>
                        <p className="text-[10px] text-neutral-400">
                          BuyMeACoffee.com, Ko-fi, or GitHub Sponsors
                        </p>
                      </div>
                    </div>

                    <a
                      href="https://buymeacoffee.com"
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 dark:bg-amber-950 dark:hover:bg-amber-900 text-amber-900 dark:text-amber-200 font-bold text-[11px] flex items-center gap-1 transition-colors"
                    >
                      <span>BMC Page</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </>
              ) : (
                /* Celebratory Thank You Screen */
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-6 text-center space-y-4"
                >
                  <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-500 to-rose-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-amber-500/30">
                    <Heart className="w-8 h-8 fill-white animate-pulse" />
                  </div>

                  <div>
                    <h3 className="text-xl font-extrabold text-neutral-900 dark:text-white">
                      You are amazing! {renderWithAppleEmojis('☕✨')}
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-sm mx-auto">
                      Thank you for fueling the craft of writing. Your support of{' '}
                      <span className="font-bold text-amber-600 dark:text-amber-400">
                        ${getActiveAmount()}
                      </span>{' '}
                      directly powers performance optimizations and new features.
                    </p>
                  </div>

                  {supporterNote && (
                    <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 max-w-sm mx-auto text-left">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                        Your Note ({supporterName || 'Anonymous Supporter'}):
                      </p>
                      <p className="text-neutral-700 dark:text-neutral-300 italic mt-0.5">
                        "{supporterNote}"
                      </p>
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="px-6 py-2.5 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 font-bold text-xs shadow-md transition-all cursor-pointer"
                    >
                      Back to Writing
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Footer Actions */}
            {!isSuccess && (
              <div className="px-6 py-4 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/50 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Secure & 100% Direct Support</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleSimulatedSupport}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Support with ${getActiveAmount()}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
