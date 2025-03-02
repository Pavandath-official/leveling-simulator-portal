
import React, { useEffect } from 'react';
import { usePlayer } from '@/context/PlayerContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowUp } from 'lucide-react';

const LevelUpAnimation = () => {
  const { showLevelUpAnimation, level, dismissAnimations } = usePlayer();

  useEffect(() => {
    // Auto-dismiss after animation completes
    if (showLevelUpAnimation) {
      const timer = setTimeout(() => dismissAnimations(), 3000);
      return () => clearTimeout(timer);
    }
  }, [showLevelUpAnimation, dismissAnimations]);

  return (
    <AnimatePresence>
      {showLevelUpAnimation && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="bg-black/80 absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            exit={{ opacity: 0 }}
          />
          
          <motion.div
            className="relative z-10 flex flex-col items-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 15 }}
          >
            <motion.div 
              className="flex items-center justify-center mb-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Sparkles className="text-yellow-400 w-8 h-8 mr-2" />
              <h2 className="text-4xl font-orbitron text-white">LEVEL UP!</h2>
              <Sparkles className="text-yellow-400 w-8 h-8 ml-2" />
            </motion.div>
            
            <motion.div 
              className="relative flex items-center justify-center"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
            >
              <motion.div
                className="absolute inset-0 bg-sl-blue rounded-full opacity-20"
                animate={{ 
                  scale: [1, 1.5, 2],
                  opacity: [0.3, 0.1, 0] 
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "loop"
                }}
              />
              <div className="bg-sl-blue/20 rounded-full p-8 border-2 border-sl-blue">
                <ArrowUp className="text-sl-blue w-10 h-10" />
              </div>
            </motion.div>
            
            <motion.h3 
              className="mt-6 text-6xl font-bold font-orbitron text-sl-blue"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {level}
            </motion.h3>
            
            <motion.p 
              className="mt-2 text-xl text-slate-300 font-rajdhani"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              You've become stronger!
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LevelUpAnimation;
