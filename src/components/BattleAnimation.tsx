
import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Sword, Shield, Zap, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BattleAnimationProps {
  isActive: boolean;
  onComplete: (success: boolean) => void;
  gateName: string;
  gateRank: string;
}

const BattleAnimation: React.FC<BattleAnimationProps> = ({
  isActive,
  onComplete,
  gateName,
  gateRank
}) => {
  const [progress, setProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState('entering');
  const [battleLog, setBattleLog] = useState<string[]>([]);

  const phases = [
    { name: 'entering', duration: 2000, message: 'Entering the gate...' },
    { name: 'scanning', duration: 3000, message: 'Scanning for enemies...' },
    { name: 'combat', duration: 5000, message: 'Engaging in combat!' },
    { name: 'victory', duration: 2000, message: 'Victory achieved!' }
  ];

  const battleMessages = [
    'Shadow soldiers are advancing!',
    'Enemy monsters detected!',
    'Critical hit landed!',
    'Shadow army overwhelming enemies!',
    'Collecting magic crystals...',
    'Experience gained!'
  ];

  useEffect(() => {
    if (!isActive) {
      setProgress(0);
      setCurrentPhase('entering');
      setBattleLog([]);
      return;
    }

    let totalDuration = 0;
    let currentTime = 0;

    const runPhases = () => {
      phases.forEach((phase, index) => {
        setTimeout(() => {
          setCurrentPhase(phase.name);
          setBattleLog(prev => [...prev, phase.message]);
          
          // Add random battle messages during combat phase
          if (phase.name === 'combat') {
            const messageInterval = setInterval(() => {
              const randomMessage = battleMessages[Math.floor(Math.random() * battleMessages.length)];
              setBattleLog(prev => [...prev, randomMessage]);
            }, 800);
            
            setTimeout(() => {
              clearInterval(messageInterval);
            }, phase.duration);
          }
        }, totalDuration);
        
        totalDuration += phase.duration;
      });

      // Complete the battle
      setTimeout(() => {
        const success = Math.random() > 0.1; // 90% success rate
        onComplete(success);
      }, totalDuration);
    };

    // Progress animation
    const progressInterval = setInterval(() => {
      currentTime += 100;
      const totalTime = phases.reduce((sum, phase) => sum + phase.duration, 0);
      const newProgress = Math.min((currentTime / totalTime) * 100, 100);
      setProgress(newProgress);
      
      if (newProgress >= 100) {
        clearInterval(progressInterval);
      }
    }, 100);

    runPhases();

    return () => {
      clearInterval(progressInterval);
    };
  }, [isActive]);

  if (!isActive) return null;

  const getPhaseIcon = () => {
    switch (currentPhase) {
      case 'entering':
        return <Target className="w-6 h-6 text-blue-400" />;
      case 'scanning':
        return <Zap className="w-6 h-6 text-yellow-400 animate-pulse" />;
      case 'combat':
        return <Sword className="w-6 h-6 text-red-400 animate-bounce" />;
      case 'victory':
        return <Shield className="w-6 h-6 text-green-400" />;
      default:
        return <Target className="w-6 h-6 text-blue-400" />;
    }
  };

  const getPhaseColor = () => {
    switch (currentPhase) {
      case 'entering':
        return 'border-blue-400/50 bg-blue-500/10';
      case 'scanning':
        return 'border-yellow-400/50 bg-yellow-500/10';
      case 'combat':
        return 'border-red-400/50 bg-red-500/10';
      case 'victory':
        return 'border-green-400/50 bg-green-500/10';
      default:
        return 'border-blue-400/50 bg-blue-500/10';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <Card className={`w-full max-w-md mx-4 bg-slate-900/90 backdrop-blur-xl border-2 ${getPhaseColor()} shadow-2xl`}>
        <CardContent className="p-6 space-y-6">
          {/* Gate Info */}
          <div className="text-center">
            <h2 className="text-xl font-bold text-white mb-2">{gateName}</h2>
            <div className="text-sm text-slate-400">Rank: {gateRank}</div>
          </div>

          {/* Current Phase */}
          <div className="flex items-center justify-center space-x-3">
            {getPhaseIcon()}
            <div className="text-white font-medium capitalize">
              {currentPhase.replace('_', ' ')}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress 
              value={progress} 
              className="h-3"
            />
            <div className="text-center text-sm text-slate-400">
              {Math.round(progress)}% Complete
            </div>
          </div>

          {/* Battle Log */}
          <div className="bg-slate-800/50 rounded-lg p-4 max-h-32 overflow-y-auto">
            <div className="text-xs text-slate-300 space-y-1">
              <AnimatePresence>
                {battleLog.slice(-4).map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center space-x-2"
                  >
                    <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                    <span>{message}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Animated effects */}
          {currentPhase === 'combat' && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-red-400 rounded-full"
                  initial={{ 
                    x: Math.random() * 300,
                    y: Math.random() * 200,
                    opacity: 0
                  }}
                  animate={{
                    x: Math.random() * 300,
                    y: Math.random() * 200,
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.3
                  }}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BattleAnimation;
