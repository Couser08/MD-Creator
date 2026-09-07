/**
 * Global custom event dispatcher to open Templates modal.
 * Decoupled from the heavy TemplatesModal React component to prevent
 * eager bundling of modal code and allowing triggering from anywhere.
 */
export const openTemplatesModal = (): void => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('open-templates-modal'));
  }
};
