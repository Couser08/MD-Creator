/**
 * Global custom event dispatcher to open Buy Me a Coffee modal.
 * Decoupled from the heavy BuyCoffeeModal React component to prevent
 * eager bundling of framer-motion and modal code into the main bundle.
 */
export const openBuyCoffeeModal = (): void => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('open-buy-coffee'));
  }
};
