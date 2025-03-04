
import React from 'react';
import { motion } from 'framer-motion';

export const Particles: React.FC<{
  className?: string;
  quantity?: number;
  color?: string;
}> = ({ 
  className = "", 
  quantity = 20, 
  color = "bg-sl-purple" 
}) => {
  const particles = Array.from({ length: quantity });
  
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {particles.map((_, index) => {
        const size = Math.random() * 4 + 1;
        
        return (
          <motion.div
            key={index}
            className={`absolute rounded-full ${color}`}
            style={{
              width: size,
              height: size,
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
            }}
            animate={{
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
              opacity: [0, 0.7, 0],
            }}
            transition={{
              duration: Math.random() * 5 + 3,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
              delay: Math.random() * 2,
            }}
          />
        );
      })}
    </div>
  );
};

export const FireworkEffect: React.FC<{
  x: number;
  y: number;
  color?: string;
}> = ({ x, y, color = "bg-sl-purple" }) => {
  const particles = Array.from({ length: 30 });
  
  return (
    <div className="absolute left-0 top-0 w-full h-full pointer-events-none">
      {particles.map((_, index) => {
        const angle = (index / particles.length) * 360;
        const distance = Math.random() * 100 + 50;
        
        return (
          <motion.div
            key={index}
            className={`absolute ${color} rounded-full`}
            style={{
              width: Math.random() * 5 + 2,
              height: Math.random() * 5 + 2,
              left: x,
              top: y,
            }}
            animate={{
              x: Math.cos(angle * (Math.PI / 180)) * distance,
              y: Math.sin(angle * (Math.PI / 180)) * distance,
              opacity: [1, 0],
              scale: [1, 0.2],
            }}
            transition={{
              duration: Math.random() * 1 + 0.5,
              ease: "easeOut",
            }}
          />
        );
      })}
    </div>
  );
};

export const FloatingSymbols: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => {
  return (
    <motion.div
      className={`inline-block ${className}`}
      animate={{
        y: [0, -10, 0],
        rotate: [0, 5, 0, -5, 0],
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
};

export const GlowPulse: React.FC<{
  children: React.ReactNode;
  color?: string;
  className?: string;
}> = ({ 
  children, 
  color = "text-sl-blue", 
  className = "" 
}) => {
  return (
    <motion.div
      className={`relative inline-block ${className}`}
      animate={{
        textShadow: [
          "0 0 5px rgba(123, 180, 255, 0.5)",
          "0 0 15px rgba(123, 180, 255, 0.8)",
          "0 0 5px rgba(123, 180, 255, 0.5)",
        ],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse",
      }}
    >
      <motion.div
        className={`${color}`}
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

// Shadow extraction glow effect for shadow cards
export const ShadowGlow: React.FC<{
  className?: string;
  intensity?: "low" | "medium" | "high";
}> = ({ 
  className = "", 
  intensity = "medium" 
}) => {
  const glowSize = {
    low: "blur-md",
    medium: "blur-xl",
    high: "blur-2xl",
  };
  
  return (
    <motion.div
      className={`absolute inset-0 ${glowSize[intensity]} rounded-lg bg-sl-purple/20 -z-10 ${className}`}
      animate={{
        opacity: [0.2, 0.6, 0.2],
        scale: [0.95, 1.05, 0.95],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      }}
    />
  );
};

export default {
  Particles,
  FireworkEffect,
  FloatingSymbols,
  GlowPulse,
  ShadowGlow,
};
