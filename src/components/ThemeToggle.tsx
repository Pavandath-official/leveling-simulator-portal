
import React from 'react';
import { Sun, Moon, Sparkles } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="relative flex items-center justify-center p-2 rounded-full bg-sl-grey-dark/50 hover:bg-sl-grey-dark/80 border border-sl-grey-dark/50 transition-colors"
      aria-label="Toggle theme"
    >
      <motion.div
        initial={false}
        animate={{ 
          rotate: theme === 'dark' ? 0 : 180,
          scale: 1 
        }}
        transition={{ duration: 0.5, type: "spring" }}
        className="relative"
      >
        {theme === 'dark' ? (
          <Sun className="h-5 w-5 text-yellow-400" />
        ) : (
          <Moon className="h-5 w-5 text-sl-blue" />
        )}

        {/* Sparkle effect on toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          key={theme}
          className="absolute -top-1 -right-1"
        >
          <Sparkles className="h-3 w-3 text-sl-purple" />
        </motion.div>
      </motion.div>

      {/* Visual indicator for current theme */}
      <span className="sr-only">{theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}</span>
      <span className="absolute -right-1 -top-1 flex h-3 w-3">
        <span className={`absolute inline-flex h-full w-full rounded-full ${theme === 'dark' ? 'bg-yellow-400' : 'bg-sl-blue'} opacity-75 animate-ping`}></span>
        <span className={`relative inline-flex rounded-full h-3 w-3 ${theme === 'dark' ? 'bg-yellow-400' : 'bg-sl-blue'}`}></span>
      </span>
    </motion.button>
  );
};

export default ThemeToggle;
