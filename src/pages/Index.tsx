import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Zap, User, Heart, Shield, Brain, Swords, Star, TrendingUp, Crown, Flame, Eye, Target, Activity, Trophy, Award, Medal, Gem, Lock, ChevronRight, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import StatBar from '@/components/StatBar';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { toast } = useToast();
  
  // Mock player data - using fake user from localStorage
  const [playerData, setPlayerData] = useState({
    username: "Sung Jin-Woo",
    level: 87,
    exp: 145680,
    expToNext: 180000,
    rank: "S",
    title: "Shadow Monarch",
    hp: 28450,
    maxHp: 30000,
    mp: 7420,
    maxMp: 8500,
    stats: {
      strength: 167,
      agility: 152,
      intelligence: 94,
      vitality: 145,
      endurance: 138,
      sense: 87
    },
    availableStatPoints: 12,
    dailyQuests: {
      completed: 4,
      total: 5
    },
    guild: "Solo",
    shadowArmy: 57,
    totalPower: 0,
    achievements: [
      { id: 1, name: "System User", description: "Awakened to the System", icon: Star, completed: true, rarity: "legendary" },
      { id: 2, name: "Shadow Sovereign", description: "Became the Shadow Monarch", icon: Crown, completed: true, rarity: "legendary" },
      { id: 3, name: "Double Dungeon Survivor", description: "Survived the Double Dungeon", icon: Shield, completed: true, rarity: "epic" },
      { id: 4, name: "Demon King Slayer", description: "Defeated Baran", icon: Swords, completed: true, rarity: "legendary" },
      { id: 5, name: "A-Rank Hunter", description: "Reached A-Rank", icon: TrendingUp, completed: true, rarity: "rare" },
      { id: 6, name: "S-Rank Hunter", description: "Reached S-Rank", icon: Trophy, completed: true, rarity: "epic" },
      { id: 7, name: "Shadow General", description: "Command 50+ Shadows", icon: Target, completed: true, rarity: "epic" },
      { id: 8, name: "Beyond National Power", description: "Exceed National Level Power", icon: Flame, completed: false, rarity: "legendary" }
    ]
  });

  useEffect(() => {
    // Calculate total power
    const totalPower = Object.values(playerData.stats).reduce((sum, stat) => sum + stat, 0);
    setPlayerData(prev => ({ ...prev, totalPower }));

    // Try to get user data from localStorage
    const userData = localStorage.getItem('fakeUser');
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        setPlayerData(prev => ({
          ...prev,
          username: parsed.username || prev.username,
          level: parsed.level || prev.level
        }));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  const allocateStatPoint = (stat: string) => {
    if (playerData.availableStatPoints > 0) {
      setPlayerData(prev => ({
        ...prev,
        stats: {
          ...prev.stats,
          [stat]: prev.stats[stat as keyof typeof prev.stats] + 1
        },
        availableStatPoints: prev.availableStatPoints - 1
      }));

      toast({
        title: "STAT POINT ALLOCATED",
        description: `${stat.toUpperCase()} +1`,
        variant: "default",
      });
    }
  };

  const expPercentage = (playerData.exp / playerData.expToNext) * 100;
  const hpPercentage = (playerData.hp / playerData.maxHp) * 100;
  const mpPercentage = (playerData.mp / playerData.maxMp) * 100;

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden perspective-1000">
      {/* 3D Background Environment */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-black to-slate-800">
        {/* Place your background image here: public/images/system-background.jpg */}
        <div 
          className="absolute inset-0 opacity-30 bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/system-background.jpg')",
            transform: "translateZ(-50px) scale(1.1)"
          }}
        />
      </div>
      
      {/* 3D Holographic Grid */}
      <motion.div 
        className="absolute inset-0 opacity-20"
        animate={{
          rotateX: [0, 2, 0],
          rotateY: [0, 1, 0]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.4) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          transform: "translateZ(0) rotateX(60deg)"
        }}></div>
      </motion.div>

      {/* 3D Floating Holographic Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              transformStyle: "preserve-3d"
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              z: [0, Math.random() * 50 - 25, 0],
              opacity: [0.2, 1, 0.2],
              scale: [0.5, 1.2, 0.5],
              rotateX: [0, 360],
              rotateY: [0, 360]
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* 3D System Interface Overlay */}
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        {/* Holographic UI Elements */}
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute border border-cyan-400/30 rounded-lg"
            style={{
              width: `${100 + Math.random() * 100}px`,
              height: `${60 + Math.random() * 60}px`,
              left: `${Math.random() * 80}%`,
              top: `${Math.random() * 80}%`,
              transformStyle: "preserve-3d"
            }}
            animate={{
              rotateY: [0, 5, 0],
              rotateX: [0, 2, 0],
              opacity: [0.2, 0.6, 0.2],
              scale: [0.9, 1.1, 0.9]
            }}
            transition={{
              duration: 6 + i,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut"
            }}
          />
        ))}
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto p-6 space-y-6">
        
        {/* 3D System Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -50, rotateX: 90 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 1.5, type: "spring" }}
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="relative inline-block">
            {/* Place your system logo here: public/images/system-logo.png */}
            <motion.img 
              src="/images/system-logo.png"
              alt="System Logo"
              className="w-24 h-24 mx-auto mb-4 opacity-80"
              animate={{
                rotateY: [0, 10, 0, -10, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{ transformStyle: "preserve-3d" }}
            />
            
            <motion.h1 
              className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 font-mono tracking-wider"
              animate={{
                textShadow: [
                  "0 0 20px rgba(59, 130, 246, 0.5)",
                  "0 0 40px rgba(59, 130, 246, 0.8)",
                  "0 0 20px rgba(59, 130, 246, 0.5)"
                ],
                scale: [1, 1.02, 1]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              [ SYSTEM ]
            </motion.h1>
            
            <motion.div 
              className="absolute inset-0 text-6xl font-bold text-cyan-400 font-mono tracking-wider"
              animate={{
                opacity: [0.2, 0.4, 0.2],
                scale: [1.01, 1.03, 1.01]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              [ SYSTEM ]
            </motion.div>
          </div>
          
          <motion.div 
            className="mt-4 h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
            animate={{
              scaleX: [0.5, 1, 0.5],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>

        {/* 3D Main System Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotateX: 45 }}
          animate={{ opacity: 1, scale: 1, rotateX: 0 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="relative"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* 3D System Window Border with depth */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-lg"
            animate={{
              boxShadow: [
                "0 0 20px rgba(59, 130, 246, 0.3)",
                "0 0 40px rgba(59, 130, 246, 0.6)",
                "0 0 20px rgba(59, 130, 246, 0.3)"
              ]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{ transform: "translateZ(-10px)" }}
          />
          
          <motion.div 
            className="relative bg-black/90 border-2 border-cyan-400/50 rounded-lg p-8 backdrop-blur-sm"
            animate={{
              borderColor: [
                "rgba(59, 130, 246, 0.5)",
                "rgba(59, 130, 246, 0.8)",
                "rgba(59, 130, 246, 0.5)"
              ]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            
            {/* 3D Player Info Header */}
            <motion.div 
              className="flex items-center justify-between mb-8 pb-4 border-b border-cyan-400/30"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 1 }}
            >
              <div className="flex items-center gap-6">
                <motion.div 
                  className="relative"
                  whileHover={{ scale: 1.1, rotateY: 15 }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Place player avatar here: public/images/player-avatar.jpg */}
                  <motion.div 
                    className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center text-2xl font-bold shadow-lg overflow-hidden"
                    animate={{
                      boxShadow: [
                        "0 10px 20px rgba(59, 130, 246, 0.3)",
                        "0 20px 40px rgba(59, 130, 246, 0.6)",
                        "0 10px 20px rgba(59, 130, 246, 0.3)"
                      ]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <img 
                      src="/images/player-avatar.jpg" 
                      alt="Player Avatar"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to initial if image doesn't exist
                        (e.target as HTMLImageElement).style.display = 'none';
                        (e.target as HTMLImageElement).nextElementSibling!.textContent = playerData.username.charAt(0);
                      }}
                    />
                    <span className="text-white font-bold text-2xl">{playerData.username.charAt(0)}</span>
                  </motion.div>
                  
                  <motion.div 
                    className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center"
                    animate={{
                      rotate: [0, 360],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{
                      rotate: { duration: 10, repeat: Infinity, ease: "linear" },
                      scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                    }}
                  >
                    <Crown className="w-3 h-3 text-black" />
                  </motion.div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 1.2 }}
                >
                  <h2 className="text-3xl font-bold text-cyan-300 mb-1">{playerData.username}</h2>
                  <div className="flex items-center gap-3">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Badge className="bg-gradient-to-r from-red-600 to-red-700 text-white font-bold px-3 py-1">
                        {playerData.rank}-RANK HUNTER
                      </Badge>
                    </motion.div>
                    <motion.span 
                      className="text-yellow-300 font-semibold"
                      animate={{
                        textShadow: [
                          "0 0 5px rgba(255, 255, 0, 0.5)",
                          "0 0 15px rgba(255, 255, 0, 0.8)",
                          "0 0 5px rgba(255, 255, 0, 0.5)"
                        ]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      {playerData.title}
                    </motion.span>
                  </div>
                </motion.div>
              </div>
              
              <motion.div 
                className="grid grid-cols-2 gap-4"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 1.4 }}
              >
                <motion.div 
                  className="text-center p-3 bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded border border-cyan-400/30"
                  whileHover={{ 
                    scale: 1.05, 
                    rotateY: 5,
                    boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)"
                  }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div className="text-2xl font-bold text-cyan-300">LV.{playerData.level}</div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider">Level</div>
                </motion.div>
                
                <motion.div 
                  className="text-center p-3 bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded border border-cyan-400/30"
                  whileHover={{ 
                    scale: 1.05, 
                    rotateY: -5,
                    boxShadow: "0 10px 25px rgba(147, 51, 234, 0.3)"
                  }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div className="text-2xl font-bold text-purple-400">{playerData.totalPower.toLocaleString()}</div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider">Power</div>
                </motion.div>
              </motion.div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* 3D Status Section */}
              <motion.div 
                className="space-y-6"
                initial={{ opacity: 0, rotateY: -45 }}
                animate={{ opacity: 1, rotateY: 0 }}
                transition={{ duration: 1.5, delay: 1.6 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* HP/MP/EXP Bars with 3D effects */}
                <motion.div 
                  className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-6 rounded-lg border border-cyan-400/20"
                  whileHover={{ 
                    scale: 1.02,
                    rotateY: 3,
                    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)"
                  }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <h3 className="text-xl font-bold text-cyan-300 mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    STATUS
                  </h3>
                  <div className="space-y-4">
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 1, delay: 2 }}
                    >
                      <div className="flex justify-between mb-2">
                        <span className="text-cyan-300 font-semibold">EXP</span>
                        <span className="text-cyan-300 text-sm">{playerData.exp.toLocaleString()}/{playerData.expToNext.toLocaleString()}</span>
                      </div>
                      <div className="h-3 bg-slate-800 rounded-full overflow-hidden border border-cyan-400/30">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 shadow-lg shadow-cyan-400/50"
                          initial={{ width: 0 }}
                          animate={{ width: `${expPercentage}%` }}
                          transition={{ duration: 2, delay: 2.2 }}
                        />
                      </div>
                    </motion.div>
                    
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 1, delay: 2.4 }}
                    >
                      <div className="flex justify-between mb-2">
                        <span className="text-red-400 font-semibold">HP</span>
                        <span className="text-red-400 text-sm">{playerData.hp.toLocaleString()}/{playerData.maxHp.toLocaleString()}</span>
                      </div>
                      <div className="h-3 bg-slate-800 rounded-full overflow-hidden border border-red-400/30">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-red-500 to-red-600 shadow-lg shadow-red-400/50"
                          initial={{ width: 0 }}
                          animate={{ width: `${hpPercentage}%` }}
                          transition={{ duration: 1, delay: 2.6 }}
                        />
                      </div>
                    </motion.div>
                    
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 1, delay: 2.8 }}
                    >
                      <div className="flex justify-between mb-2">
                        <span className="text-blue-400 font-semibold">MP</span>
                        <span className="text-blue-400 text-sm">{playerData.mp.toLocaleString()}/{playerData.maxMp.toLocaleString()}</span>
                      </div>
                      <div className="h-3 bg-slate-800 rounded-full overflow-hidden border border-blue-400/30">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg shadow-blue-400/50"
                          initial={{ width: 0 }}
                          animate={{ width: `${mpPercentage}%` }}
                          transition={{ duration: 1, delay: 3 }}
                        />
                      </div>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Additional Info */}
                <motion.div 
                  className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-6 rounded-lg border border-cyan-400/20"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.5, delay: 3 }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <h3 className="text-xl font-bold text-cyan-300 mb-4">ADDITIONAL INFO</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <motion.div 
                      className="text-center p-3 bg-slate-900/60 rounded border border-cyan-400/20"
                      whileHover={{ 
                        scale: 1.05, 
                        rotateY: 5,
                        boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)"
                      }}
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      <div className="text-lg font-bold text-green-400">{playerData.shadowArmy}</div>
                      <div className="text-xs text-gray-400 uppercase">Shadow Soldiers</div>
                    </motion.div>
                    
                    <motion.div 
                      className="text-center p-3 bg-slate-900/60 rounded border border-cyan-400/20"
                      whileHover={{ 
                        scale: 1.05, 
                        rotateY: -5,
                        boxShadow: "0 10px 25px rgba(147, 51, 234, 0.3)"
                      }}
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      <div className="text-lg font-bold text-purple-400">{playerData.guild}</div>
                      <div className="text-xs text-gray-400 uppercase">Guild</div>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>

              {/* 3D Stats Section */}
              <motion.div 
                className="space-y-6"
                initial={{ opacity: 0, rotateY: 45 }}
                animate={{ opacity: 1, rotateY: 0 }}
                transition={{ duration: 1.5, delay: 1.8 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <motion.div 
                  className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-6 rounded-lg border border-cyan-400/20"
                  whileHover={{ 
                    scale: 1.02,
                    rotateY: 3,
                    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)"
                  }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-cyan-300 flex items-center gap-2">
                      <Swords className="w-5 h-5" />
                      STATISTICS
                    </h3>
                    {playerData.availableStatPoints > 0 && (
                      <Badge variant="outline" className="text-yellow-400 border-yellow-400 bg-yellow-400/10">
                        +{playerData.availableStatPoints} POINTS
                      </Badge>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <StatBar 
                      name="STRENGTH" 
                      value={playerData.stats.strength} 
                      max={200} 
                      color="red"
                      icon={<Swords className="w-4 h-4" />}
                      onAllocate={() => allocateStatPoint('strength')}
                      canAllocate={playerData.availableStatPoints > 0}
                    />
                    <StatBar 
                      name="AGILITY" 
                      value={playerData.stats.agility} 
                      max={200} 
                      color="green"
                      icon={<Zap className="w-4 h-4" />}
                      onAllocate={() => allocateStatPoint('agility')}
                      canAllocate={playerData.availableStatPoints > 0}
                    />
                    <StatBar 
                      name="INTELLIGENCE" 
                      value={playerData.stats.intelligence} 
                      max={200} 
                      color="blue"
                      icon={<Brain className="w-4 h-4" />}
                      onAllocate={() => allocateStatPoint('intelligence')}
                      canAllocate={playerData.availableStatPoints > 0}
                    />
                    <StatBar 
                      name="VITALITY" 
                      value={playerData.stats.vitality} 
                      max={200} 
                      color="purple"
                      icon={<Heart className="w-4 h-4" />}
                      onAllocate={() => allocateStatPoint('vitality')}
                      canAllocate={playerData.availableStatPoints > 0}
                    />
                    <StatBar 
                      name="ENDURANCE" 
                      value={playerData.stats.endurance} 
                      max={200} 
                      color="yellow"
                      icon={<Shield className="w-4 h-4" />}
                      onAllocate={() => allocateStatPoint('endurance')}
                      canAllocate={playerData.availableStatPoints > 0}
                    />
                    <StatBar 
                      name="SENSE" 
                      value={playerData.stats.sense} 
                      max={200} 
                      color="orange"
                      icon={<Eye className="w-4 h-4" />}
                      onAllocate={() => allocateStatPoint('sense')}
                      canAllocate={playerData.availableStatPoints > 0}
                    />
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* 3D Achievements Section */}
            <motion.div 
              className="mt-8 bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-6 rounded-lg border border-cyan-400/20"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, delay: 2 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-cyan-300 flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  ACHIEVEMENTS
                </h3>
                <Badge variant="outline" className="text-yellow-400 border-yellow-400 bg-yellow-400/10">
                  {playerData.achievements.filter(a => a.completed).length}/{playerData.achievements.length}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {playerData.achievements.map((achievement) => {
                  const IconComponent = achievement.icon;
                  const rarityColors = {
                    'legendary': 'border-yellow-400 bg-yellow-400/10 shadow-yellow-400/20',
                    'epic': 'border-purple-400 bg-purple-400/10 shadow-purple-400/20',
                    'rare': 'border-blue-400 bg-blue-400/10 shadow-blue-400/20',
                    'common': 'border-gray-400 bg-gray-400/10 shadow-gray-400/20'
                  };
                  
                  return (
                    <motion.div
                      key={achievement.id}
                      className={`p-4 rounded-lg border-2 ${rarityColors[achievement.rarity as keyof typeof rarityColors]} ${
                        achievement.completed ? 'opacity-100' : 'opacity-40 grayscale'
                      } transition-all duration-300 hover:scale-105`}
                      whileHover={{ y: -2 }}
                    >
                      <div className="flex flex-col items-center text-center space-y-2">
                        <div className={`p-3 rounded-full ${
                          achievement.completed ? 'bg-cyan-400/20 text-cyan-300' : 'bg-gray-600/20 text-gray-500'
                        }`}>
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <h4 className={`font-bold text-sm ${
                          achievement.completed ? 'text-white' : 'text-gray-500'
                        }`}>
                          {achievement.name}
                        </h4>
                        <p className={`text-xs ${
                          achievement.completed ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          {achievement.description}
                        </p>
                        {achievement.completed && (
                          <Award className="w-4 h-4 text-green-400" />
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
