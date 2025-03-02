
import React, { useEffect } from 'react';
import { usePlayer } from '@/context/PlayerContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star } from 'lucide-react';

const RankUpAnimation = () => {
  const { showRankUpAnimation, rank, dismissAnimations } = usePlayer();

  useEffect(() => {
    // Auto-dismiss after animation completes
    if (showRankUpAnimation) {
      const timer = setTimeout(() => dismissAnimations(), 4000);
      return () => clearTimeout(timer);
    }
  }, [showRankUpAnimation, dismissAnimations]);

  // Map rank to color
  const rankColor = {
    'E': 'text-gray-400',
    'D': 'text-green-400',
    'C': 'text-blue-400', 
    'B': 'text-purple-400',
    'A': 'text-yellow-400',
    'S': 'text-red-500'
  }[rank] || 'text-white';

  return (
    <AnimatePresence>
      {showRankUpAnimation && (
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
              <Trophy className="text-yellow-400 w-8 h-8 mr-2" />
              <h2 className="text-4xl font-orbitron text-white">RANK UP!</h2>
              <Trophy className="text-yellow-400 w-8 h-8 ml-2" />
            </motion.div>
            
            <motion.div
              className="relative flex items-center justify-center mt-4"
              initial={{ rotateY: 180, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              transition={{ delay: 0.6, type: "spring" }}
            >
              <div className={`flex items-center justify-center w-24 h-24 rounded-full bg-sl-dark border-4 ${rankColor.replace('text-', 'border-')}`}>
                <motion.span 
                  className={`text-6xl font-orbitron font-bold ${rankColor}`}
                  animate={{ 
                    scale: [1, 1.2, 1],
                    textShadow: [
                      '0 0 5px rgba(255,255,255,0.5)',
                      '0 0 20px rgba(255,255,255,0.8)',
                      '0 0 5px rgba(255,255,255,0.5)'
                    ]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "loop"
                  }}
                >
                  {rank}
                </motion.span>
              </div>
            </motion.div>
            
            <motion.div
              className="mt-8 relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <div className="flex space-x-1">
                {Array(5).fill(0).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1 + (i * 0.1) }}
                  >
                    <Star className="w-5 h-5 text-yellow-400" fill="currentColor" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.p 
              className="mt-4 text-xl text-slate-300 font-rajdhani"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              Your rank has increased!
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RankUpAnimation;
