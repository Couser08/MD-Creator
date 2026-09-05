import { create } from 'zustand';
import React from 'react';

export type ConfirmVariant = 'danger' | 'warning' | 'info' | 'primary';
export type ConfirmIcon = 'trash' | 'alert' | 'warning' | 'info' | 'logout' | 'clear' | 'refresh';

export interface ConfirmOptions {
  title?: string;
  message: React.ReactNode;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmVariant;
  icon?: ConfirmIcon;
  confirmButtonClass?: string;
}

interface ConfirmState {
  isOpen: boolean;
  options: ConfirmOptions;
  resolver: ((value: boolean) => void) | null;
  confirm: (options: ConfirmOptions) => Promise<boolean>;
  handleConfirm: () => void;
  handleCancel: () => void;
}

const defaultOptions: ConfirmOptions = {
  title: 'Confirm Action',
  message: 'Are you sure you want to proceed?',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  variant: 'danger',
  icon: 'alert'
};

export const useConfirmStore = create<ConfirmState>((set, get) => ({
  isOpen: false,
  options: defaultOptions,
  resolver: null,

  confirm: (options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      set({
        isOpen: true,
        options: {
          ...defaultOptions,
          ...options
        },
        resolver: resolve
      });
    });
  },

  handleConfirm: () => {
    const { resolver } = get();
    if (resolver) resolver(true);
    set({ isOpen: false, resolver: null });
  },

  handleCancel: () => {
    const { resolver } = get();
    if (resolver) resolver(false);
    set({ isOpen: false, resolver: null });
  }
}));

export const useConfirm = () => {
  return useConfirmStore((state) => state.confirm);
};
