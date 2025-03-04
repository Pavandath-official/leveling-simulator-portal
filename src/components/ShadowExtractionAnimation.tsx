
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Ghost, Sparkles, User, Shield, Wand2, Sword } from 'lucide-react';

interface ShadowExtractionAnimationProps {
  shadowType: string;
  onComplete: () => void;
}

const ShadowExtractionAnimation: React.FC<ShadowExtractionAnimationProps> = ({ 
  shadowType, 
  onComplete 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Play sound effect when animation starts
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 5000); // Complete after 5 seconds
    
    return () => clearTimeout(timer);
  }, [onComplete]);

  const getShadowIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'soldier':
        return <User className="w-12 h-12" />;
      case 'knight':
        return <Shield className="w-12 h-12" />;
      case 'mage':
        return <Wand2 className="w-12 h-12" />;
      case 'assassin':
        return <Sword className="w-12 h-12" />;
      default:
        return <Ghost className="w-12 h-12" />;
    }
  };

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
    >
      <div className="relative w-full max-w-2xl aspect-video overflow-hidden rounded-lg">
        {/* Background elements */}
        <motion.div 
          className="absolute inset-0 bg-sl-dark"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
        
        {/* Shadow essence particles */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-sl-purple"
              initial={{ 
                x: Math.random() * 100 - 50 + 50 + '%', 
                y: Math.random() * 100 + 100 + '%',
                opacity: 0,
                scale: 0 
              }}
              animate={{ 
                x: 50 + '%', 
                y: 50 + '%',
                opacity: [0, 0.7, 0],
                scale: [0, 1.5, 0.5]
              }}
              transition={{ 
                duration: 3,
                delay: Math.random() * 2,
                repeat: 1,
                repeatType: "loop"
              }}
            />
          ))}
        </div>
        
        {/* Extraction vortex */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <div className="relative w-full h-full">
            <motion.div 
              className="absolute inset-0 rounded-full border-4 border-sl-purple/50"
              animate={{ 
                rotate: 360,
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 8, ease: "linear", repeat: Infinity },
                scale: { duration: 2, repeat: Infinity, repeatType: "reverse" }
              }}
            />
            <motion.div 
              className="absolute inset-4 rounded-full border-2 border-sl-purple/70"
              animate={{ rotate: -360 }}
              transition={{ duration: 6, ease: "linear", repeat: Infinity }}
            />
            <motion.div 
              className="absolute inset-10 rounded-full border border-sl-purple"
              animate={{ rotate: 360, scale: [1, 0.9, 1] }}
              transition={{ 
                rotate: { duration: 4, ease: "linear", repeat: Infinity },
                scale: { duration: 1.5, repeat: Infinity, repeatType: "reverse" }
              }}
            />
          </div>
        </motion.div>
        
        {/* Shadow core */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0, 1, 1, 0.8, 0],
            scale: [0, 1, 1.2, 1.5, 3]
          }}
          transition={{ 
            duration: 4,
            times: [0, 0.3, 0.6, 0.8, 1],
            delay: 0.8
          }}
        >
          <div className="relative">
            <motion.div 
              className="absolute -inset-6 rounded-full bg-sl-purple/20 blur-md"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
            />
            <div className="relative z-10 text-sl-purple">
              {getShadowIcon(shadowType)}
            </div>
          </div>
        </motion.div>
        
        {/* Particles bursting */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 0.1 }}
        >
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-4 bg-sl-purple/80"
              style={{ 
                originX: '50%',
                originY: '100%',
                rotate: `${i * 18}deg`, 
              }}
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ 
                scaleY: [0, 1, 0],
                opacity: [0, 1, 0] 
              }}
              transition={{ 
                duration: 2,
                delay: 2.5 + (i % 5) * 0.1,
              }}
            />
          ))}
        </motion.div>

        {/* Sparkles */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ delay: 3, duration: 1.5 }}
        >
          <Sparkles className="text-sl-purple w-24 h-24 absolute opacity-70" />
        </motion.div>
        
        {/* Text */}
        <motion.div
          className="absolute left-0 right-0 bottom-10 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{ delay: 1, duration: 3 }}
          >
            <h2 className="text-3xl md:text-4xl font-orbitron text-sl-purple mb-2">
              Extracting Shadow
            </h2>
            <p className="text-sl-purple-light text-lg">
              {shadowType.charAt(0).toUpperCase() + shadowType.slice(1)} shadow detected
            </p>
          </motion.div>
          
          <motion.h2
            className="text-5xl md:text-6xl font-orbitron text-sl-purple mt-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: [0, 1, 0],
              scale: [0.8, 1.1, 0.9],
              textShadow: [
                "0 0 7px #9b87f5",
                "0 0 20px #9b87f5",
                "0 0 50px #9b87f5",
                "0 0 20px #9b87f5",
                "0 0 7px #9b87f5",
              ]
            }}
            transition={{ 
              delay: 3,
              duration: 2,
              textShadow: {
                duration: 2,
                times: [0, 0.25, 0.5, 0.75, 1]
              }
            }}
          >
            ARISE
          </motion.h2>
        </motion.div>
      </div>
    </div>
  );
};

export default ShadowExtractionAnimation;
