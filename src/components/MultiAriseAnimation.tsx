
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ghost, Flame } from 'lucide-react';

interface MultiAriseAnimationProps {
  isVisible: boolean;
  shadowCount: number;
  onComplete: () => void;
}

const MultiAriseAnimation: React.FC<MultiAriseAnimationProps> = ({
  isVisible,
  shadowCount,
  onComplete
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onAnimationComplete={() => {
            setTimeout(onComplete, 4000);
          }}
        >
          <div className="text-center relative">
            {/* Black flames effect */}
            <div className="absolute inset-0 -m-20">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-8 h-8"
                  style={{
                    left: `${50 + 30 * Math.cos((i * Math.PI * 2) / 8)}%`,
                    top: `${50 + 30 * Math.sin((i * Math.PI * 2) / 8)}%`,
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: [0, 1.5, 0.8, 1.2, 0],
                    opacity: [0, 1, 0.8, 1, 0],
                    rotate: [0, 180, 360]
                  }}
                  transition={{
                    duration: 3,
                    delay: i * 0.2,
                    repeat: 1
                  }}
                >
                  <Flame className="w-full h-full text-purple-900" />
                </motion.div>
              ))}
            </div>

            {/* Main ARISE text */}
            <motion.h2
              className="text-8xl font-orbitron text-sl-purple mb-8 relative z-10"
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                scale: 1,
                textShadow: [
                  "0 0 7px #9b87f5",
                  "0 0 21px #9b87f5",
                  "0 0 42px #9b87f5",
                  "0 0 82px #9b87f5",
                  "0 0 151px #9b87f5"
                ]
              }}
              transition={{ 
                delay: 0.5, 
                duration: 1,
                textShadow: {
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }
              }}
            >
              ARISE
            </motion.h2>

            {/* Shadow count indicator */}
            <motion.div
              className="text-2xl text-sl-blue mb-6 relative z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              {shadowCount} Shadows Awakening...
            </motion.div>

            {/* Multiple shadow silhouettes */}
            <div className="flex justify-center space-x-4 relative z-10">
              {[...Array(Math.min(shadowCount, 5))].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: [0, 1, 0.8, 1],
                    y: [20, 0, -5, 0],
                    scale: [0.8, 1.1, 0.9, 1]
                  }}
                  transition={{ delay: 2 + i * 0.3, duration: 1.5 }}
                >
                  <Ghost className="w-16 h-16 text-sl-purple" />
                </motion.div>
              ))}
            </div>

            {/* Purple energy waves */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-sl-purple opacity-50"
              animate={{
                scale: [1, 2, 3],
                opacity: [0.5, 0.2, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 1
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MultiAriseAnimation;
