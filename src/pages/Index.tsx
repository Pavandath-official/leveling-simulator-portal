
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
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* System Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-black to-slate-800"></div>
      
      {/* Glowing Grid Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 1, 0.3],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6 space-y-6">
        
        {/* System Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="relative inline-block">
            <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 font-mono tracking-wider">
              [ SYSTEM ]
            </h1>
            <div className="absolute inset-0 text-6xl font-bold text-cyan-400 animate-pulse opacity-30 font-mono tracking-wider">
              [ SYSTEM ]
            </div>
          </div>
          <div className="mt-4 h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse"></div>
        </motion.div>

        {/* Main System Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative"
        >
          {/* System Window Border */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-lg blur-sm"></div>
          <div className="relative bg-black/90 border-2 border-cyan-400/50 rounded-lg p-8 backdrop-blur-sm">
            
            {/* Player Info Header */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-cyan-400/30">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center text-2xl font-bold shadow-lg shadow-cyan-400/30">
                    {playerData.username.charAt(0)}
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                    <Crown className="w-3 h-3 text-black" />
                  </div>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-cyan-300 mb-1">{playerData.username}</h2>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-gradient-to-r from-red-600 to-red-700 text-white font-bold px-3 py-1">
                      {playerData.rank}-RANK HUNTER
                    </Badge>
                    <span className="text-yellow-300 font-semibold">{playerData.title}</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded border border-cyan-400/30">
                  <div className="text-2xl font-bold text-cyan-300">LV.{playerData.level}</div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider">Level</div>
                </div>
                <div className="text-center p-3 bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded border border-cyan-400/30">
                  <div className="text-2xl font-bold text-purple-400">{playerData.totalPower.toLocaleString()}</div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider">Power</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Status Section */}
              <div className="space-y-6">
                {/* HP/MP/EXP Bars */}
                <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-6 rounded-lg border border-cyan-400/20">
                  <h3 className="text-xl font-bold text-cyan-300 mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    STATUS
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-cyan-300 font-semibold">EXP</span>
                        <span className="text-cyan-300 text-sm">{playerData.exp.toLocaleString()}/{playerData.expToNext.toLocaleString()}</span>
                      </div>
                      <div className="h-3 bg-slate-800 rounded-full overflow-hidden border border-cyan-400/30">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 shadow-lg shadow-cyan-400/50"
                          initial={{ width: 0 }}
                          animate={{ width: `${expPercentage}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-red-400 font-semibold">HP</span>
                        <span className="text-red-400 text-sm">{playerData.hp.toLocaleString()}/{playerData.maxHp.toLocaleString()}</span>
                      </div>
                      <div className="h-3 bg-slate-800 rounded-full overflow-hidden border border-red-400/30">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-red-500 to-red-600 shadow-lg shadow-red-400/50"
                          initial={{ width: 0 }}
                          animate={{ width: `${hpPercentage}%` }}
                          transition={{ duration: 1, delay: 0.7 }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-blue-400 font-semibold">MP</span>
                        <span className="text-blue-400 text-sm">{playerData.mp.toLocaleString()}/{playerData.maxMp.toLocaleString()}</span>
                      </div>
                      <div className="h-3 bg-slate-800 rounded-full overflow-hidden border border-blue-400/30">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg shadow-blue-400/50"
                          initial={{ width: 0 }}
                          animate={{ width: `${mpPercentage}%` }}
                          transition={{ duration: 1, delay: 0.9 }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-6 rounded-lg border border-cyan-400/20">
                  <h3 className="text-xl font-bold text-cyan-300 mb-4">ADDITIONAL INFO</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-slate-900/60 rounded border border-cyan-400/20">
                      <div className="text-lg font-bold text-green-400">{playerData.shadowArmy}</div>
                      <div className="text-xs text-gray-400 uppercase">Shadow Soldiers</div>
                    </div>
                    <div className="text-center p-3 bg-slate-900/60 rounded border border-cyan-400/20">
                      <div className="text-lg font-bold text-purple-400">{playerData.guild}</div>
                      <div className="text-xs text-gray-400 uppercase">Guild</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Section */}
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-6 rounded-lg border border-cyan-400/20">
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
                </div>
              </div>
            </div>

            {/* Achievements Section */}
            <div className="mt-8 bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-6 rounded-lg border border-cyan-400/20">
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
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
