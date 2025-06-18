
import React from 'react';
import { motion } from 'framer-motion';

interface CinematicEffectsProps {
  children: React.ReactNode;
  intensity?: 'low' | 'medium' | 'high';
}

export const CinematicContainer: React.FC<CinematicEffectsProps> = ({ 
  children, 
  intensity = 'medium' 
}) => {
  const getIntensitySettings = () => {
    switch (intensity) {
      case 'low':
        return { particles: 10, glowStrength: 0.3, animationSpeed: 8 };
      case 'high':
        return { particles: 50, glowStrength: 0.8, animationSpeed: 4 };
      default:
        return { particles: 25, glowStrength: 0.5, animationSpeed: 6 };
    }
  };

  const settings = getIntensitySettings();

  return (
    <div className="relative" style={{ perspective: '1000px' }}>
      {/* 3D Ambient Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: settings.particles }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-cyan-400/40"
            style={{
              width: Math.random() * 4 + 1,
              height: Math.random() * 4 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              z: [0, Math.random() * 100 - 50],
              opacity: [0, settings.glowStrength, 0],
              scale: [0.5, 1.5, 0.5],
              rotateX: [0, 360],
              rotateY: [0, 360]
            }}
            transition={{
              duration: settings.animationSpeed + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Holographic Grid Overlay */}
      <motion.div
        className="absolute inset-0 opacity-10 pointer-events-none"
        animate={{
          rotateX: [0, 5, 0],
          rotateY: [0, 2, 0]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '30px 30px',
          transform: 'rotateX(60deg)'
        }}
      />

      {/* Main Content */}
      <motion.div
        className="relative z-10"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {children}
      </motion.div>

      {/* Atmospheric Glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: [
            "radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 80% 50%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 50% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 50% 80%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)"
          ]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
};

export const HolographicCard: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => {
  return (
    <motion.div
      className={`relative ${className}`}
      whileHover={{
        scale: 1.02,
        rotateY: 5,
        rotateX: 2,
        z: 20
      }}
      style={{ transformStyle: 'preserve-3d' }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Holographic Border Effect */}
      <motion.div
        className="absolute inset-0 rounded-lg border border-cyan-400/30"
        animate={{
          borderColor: [
            "rgba(59, 130, 246, 0.3)",
            "rgba(147, 51, 234, 0.3)",
            "rgba(59, 130, 246, 0.3)"
          ],
          boxShadow: [
            "0 0 20px rgba(59, 130, 246, 0.2)",
            "0 0 30px rgba(147, 51, 234, 0.2)",
            "0 0 20px rgba(59, 130, 246, 0.2)"
          ]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ transform: 'translateZ(-5px)' }}
      />
      
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

export const FloatingElement: React.FC<{
  children: React.ReactNode;
  amplitude?: number;
  duration?: number;
}> = ({ children, amplitude = 10, duration = 4 }) => {
  return (
    <motion.div
      animate={{
        y: [-amplitude, amplitude, -amplitude],
        rotateX: [0, 2, 0],
        rotateY: [0, 1, 0]
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}
    </motion.div>
  );
};

export default { CinematicContainer, HolographicCard, FloatingElement };
