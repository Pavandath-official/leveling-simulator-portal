
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Ghost, Sparkles, User, Shield, Wand2, Sword } from 'lucide-react';
import { Particles, FireworkEffect } from './VisualEffects';

interface ShadowExtractionAnimationProps {
  shadowType: string;
  onComplete: () => void;
}

const ShadowExtractionAnimation: React.FC<ShadowExtractionAnimationProps> = ({ 
  shadowType, 
  onComplete 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showFireworks, setShowFireworks] = useState(false);
  const [fireworksPos, setFireworksPos] = useState({ x: 0, y: 0 });
  
  // Play animation sequence
  useEffect(() => {
    // Show fireworks at the end of the animation
    const fireworksTimer = setTimeout(() => {
      setShowFireworks(true);
      setFireworksPos({
        x: Math.random() * window.innerWidth * 0.8,
        y: Math.random() * window.innerHeight * 0.8
      });
      
      // Add some more fireworks
      const intervals = [];
      for (let i = 0; i < 5; i++) {
        intervals.push(
          setTimeout(() => {
            setFireworksPos({
              x: Math.random() * window.innerWidth * 0.8,
              y: Math.random() * window.innerHeight * 0.8
            });
          }, 300 * i)
        );
      }
      
      return () => intervals.forEach(interval => clearTimeout(interval));
    }, 3000);
    
    // Complete the animation
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 5000);
    
    return () => {
      clearTimeout(fireworksTimer);
      clearTimeout(completeTimer);
    };
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
      {/* Background particles */}
      <Particles quantity={50} color="bg-sl-blue/30" />
      <Particles quantity={30} color="bg-sl-purple/40" />
      
      {/* Main animation container */}
      <div className="relative w-full max-w-2xl aspect-video overflow-hidden rounded-lg">
        {/* Background gradient */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-sl-darker via-sl-dark to-sl-grey-dark"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
        
        {/* Shadow essence particles */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 40 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                background: `rgba(155, 135, 245, ${Math.random() * 0.5 + 0.5})`,
                width: `${Math.random() * 4 + 1}px`,
                height: `${Math.random() * 4 + 1}px`,
              }}
              initial={{ 
                x: Math.random() * 100 - 50 + 50 + '%', 
                y: Math.random() * 100 + 100 + '%',
                opacity: 0,
                scale: 0,
                rotate: Math.random() * 360
              }}
              animate={{ 
                x: 50 + '%', 
                y: 50 + '%',
                opacity: [0, 0.7, 0],
                scale: [0, 1.5, 0.5],
                rotate: Math.random() * 720
              }}
              transition={{ 
                duration: 3,
                delay: Math.random() * 2,
                repeat: 1,
                repeatType: "loop",
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
        
        {/* 3D-looking extraction vortex */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <div className="relative w-full h-full perspective-800">
            {/* Multiple rotating rings with 3D transforms */}
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div 
                key={i}
                className={`absolute inset-${i * 2} rounded-full border-2 border-sl-purple/50`}
                style={{ 
                  transformStyle: "preserve-3d", 
                  transform: `rotateX(${i * 10}deg) rotateY(${i * 5}deg)` 
                }}
                animate={{ 
                  rotateZ: 360,
                  rotateX: [i * 10, i * 10 + 5, i * 10],
                  rotateY: [i * 5, i * 5 + 10, i * 5]
                }}
                transition={{ 
                  rotateZ: { duration: 8 - i, ease: "linear", repeat: Infinity },
                  rotateX: { duration: 3, repeat: Infinity, repeatType: "reverse" },
                  rotateY: { duration: 4, repeat: Infinity, repeatType: "reverse" }
                }}
              />
            ))}
            
            {/* Glowing core */}
            <motion.div 
              className="absolute inset-10 rounded-full bg-sl-purple/20 blur-md"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                repeatType: "reverse" 
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
            scale: [0, 1, 1.2, 1.5, 3],
            filter: ["blur(0px)", "blur(0px)", "blur(1px)", "blur(5px)", "blur(10px)"]
          }}
          transition={{ 
            duration: 4,
            times: [0, 0.3, 0.6, 0.8, 1],
            delay: 0.8
          }}
        >
          <div className="relative">
            <motion.div 
              className="absolute -inset-6 rounded-full bg-sl-purple/30 blur-xl"
              animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
            />
            <div className="relative z-10 text-sl-purple">
              {getShadowIcon(shadowType)}
            </div>
            
            {/* Additional glow effects */}
            <motion.div
              className="absolute -inset-2 rounded-full"
              style={{ 
                background: "radial-gradient(circle, rgba(155,135,245,0.6) 0%, rgba(155,135,245,0) 70%)" 
              }}
              animate={{ 
                opacity: [0.4, 0.8, 0.4],
                scale: [0.8, 1.2, 0.8]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
          </div>
        </motion.div>
        
        {/* Energy beams */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.3 }}
        >
          {Array.from({ length: 24 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute origin-center"
              style={{ 
                width: "2px",
                height: "150px",
                background: "linear-gradient(to top, rgba(155,135,245,0) 0%, rgba(155,135,245,0.8) 50%, rgba(155,135,245,0) 100%)",
                rotate: `${i * 15}deg`, 
              }}
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ 
                scaleY: [0, 1, 0],
                opacity: [0, 0.8, 0] 
              }}
              transition={{ 
                duration: 1.5,
                delay: 2 + (i % 8) * 0.05,
              }}
            />
          ))}
        </motion.div>

        {/* Sparkles and special effects */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ delay: 3, duration: 1.5 }}
        >
          <Sparkles className="text-sl-purple w-32 h-32 absolute opacity-70" />
        </motion.div>
        
        {/* Text with enhanced animation */}
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
                "0 0 7px rgba(155,135,245,0.7)",
                "0 0 20px rgba(155,135,245,0.9)",
                "0 0 50px rgba(155,135,245,1)",
                "0 0 20px rgba(155,135,245,0.9)",
                "0 0 7px rgba(155,135,245,0.7)",
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
      
      {/* Fireworks effects */}
      {showFireworks && (
        <>
          <FireworkEffect x={fireworksPos.x} y={fireworksPos.y} color="bg-sl-purple" />
          <FireworkEffect 
            x={window.innerWidth - fireworksPos.x}
            y={fireworksPos.y * 0.7}
            color="bg-sl-blue"
          />
          <FireworkEffect 
            x={fireworksPos.x * 0.5}
            y={window.innerHeight - fireworksPos.y}
            color="bg-sl-blue-light"
          />
        </>
      )}
    </div>
  );
};

export default ShadowExtractionAnimation;
