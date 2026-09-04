import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sun, Moon, FolderOpen } from 'lucide-react';
import { useThemeStore } from '../../stores/useThemeStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { ProfileDropdown } from '../auth/ProfileDropdown';

interface NavbarProps {
  onOpenTemplates?: () => void;
  onOpenFeatures?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenTemplates, onOpenFeatures }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark, toggleTheme } = useThemeStore();
  const { user } = useAuthStore();

  const handleNavClick = (sectionId: string) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full glass-nav border-b border-neutral-100 dark:border-neutral-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="w-8 h-8 rounded-lg bg-neutral-950 dark:bg-white flex items-center justify-center text-white dark:text-neutral-950 font-black text-lg tracking-wider shadow-sm group-hover:scale-105 transition-transform">
            M
          </div>
          <span className="font-bold text-lg text-neutral-900 dark:text-white tracking-tight">
            MD Writer
          </span>
        </div>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-600 dark:text-neutral-300">
          <button 
            onClick={() => navigate('/')}
            className={`relative py-1 font-semibold transition-colors cursor-pointer ${
              location.pathname === '/' ? 'text-neutral-900 dark:text-white after:content-[\'\'] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-neutral-900 dark:after:bg-white after:rounded-full' : 'hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Home
          </button>
          <button 
            onClick={() => navigate('/documents')}
            className={`py-1 transition-colors cursor-pointer flex items-center gap-1 ${
              location.pathname === '/documents' ? 'text-neutral-900 dark:text-white font-semibold' : 'hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>Documents</span>
          </button>
          <button 
            onClick={() => {
              handleNavClick('features');
              onOpenFeatures?.();
            }}
            className="hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            Features
          </button>
          <button 
            onClick={() => onOpenTemplates ? onOpenTemplates() : handleNavClick('templates')}
            className="hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            Templates
          </button>
          <button 
            onClick={() => navigate('/pricing')}
            className={`py-1 transition-colors cursor-pointer ${
              location.pathname === '/pricing' ? 'text-neutral-900 dark:text-white font-semibold' : 'hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Pricing
          </button>
          <button 
            onClick={() => navigate('/blog')}
            className={`py-1 transition-colors cursor-pointer ${
              location.pathname === '/blog' ? 'text-neutral-900 dark:text-white font-semibold' : 'hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Blog
          </button>
        </nav>

        {/* Right Action Utilities */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="w-9 h-9 rounded-full flex items-center justify-center text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all cursor-pointer"
          >
            {isDark ? (
              <Sun className="w-4.5 h-4.5 text-amber-400 transition-transform rotate-0 hover:rotate-45" />
            ) : (
              <Moon className="w-4.5 h-4.5 text-neutral-600 transition-transform rotate-0 hover:rotate-12" />
            )}
          </button>

          {/* Conditional Profile Dropdown OR Sign In / Get Started */}
          {user ? (
            <ProfileDropdown />
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/auth')}
                className="text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white px-2 py-1.5 transition-colors cursor-pointer hidden sm:block"
              >
                Sign In
              </button>

              <button
                onClick={() => navigate('/auth')}
                className="bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-950 px-4.5 py-2 rounded-lg text-sm font-semibold tracking-tight shadow-sm hover:shadow transition-all cursor-pointer flex items-center gap-1"
              >
                Get Started
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
