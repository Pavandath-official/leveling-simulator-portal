
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Zap, User, Heart, Shield, Brain, Swords, Star, TrendingUp, Crown, Flame, Eye, Target, Activity, Trophy, Award, Medal, Gem } from 'lucide-react';
import { motion } from 'framer-motion';
import StatBar from '@/components/StatBar';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { toast } = useToast();
  
  // Mock player data - using fake user from localStorage
  const [playerData, setPlayerData] = useState({
    username: "Shadow Monarch",
    level: 15,
    exp: 2500,
    expToNext: 3000,
    rank: "S",
    title: "Shadow Monarch",
    hp: 850,
    maxHp: 1000,
    mp: 420,
    maxMp: 500,
    stats: {
      strength: 45,
      agility: 38,
      intelligence: 42,
      vitality: 35,
      endurance: 40,
      sense: 28
    },
    availableStatPoints: 5,
    dailyQuests: {
      completed: 3,
      total: 5
    },
    guild: "Solo",
    achievements: [
      { id: 1, name: "First Awakening", description: "Complete your first awakening", icon: Star, completed: true, rarity: "legendary" },
      { id: 2, name: "Shadow Master", description: "Extract 10 shadows", icon: Crown, completed: true, rarity: "epic" },
      { id: 3, name: "Dungeon Conqueror", description: "Clear 5 S-Rank gates", icon: Swords, completed: true, rarity: "rare" },
      { id: 4, name: "System User", description: "Use the system for 7 days", icon: Target, completed: false, rarity: "common" },
      { id: 5, name: "Hunter Elite", description: "Reach Level 20", icon: Trophy, completed: false, rarity: "epic" },
      { id: 6, name: "Monarch's Path", description: "Unlock Shadow Monarch abilities", icon: Flame, completed: true, rarity: "legendary" }
    ],
    shadowsArisen: 8,
    totalPower: 0
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
        title: "Stat Increased!",
        description: `${stat.charAt(0).toUpperCase() + stat.slice(1)} increased by 1`,
        variant: "default",
      });
    }
  };

  const expPercentage = (playerData.exp / playerData.expToNext) * 100;
  const hpPercentage = (playerData.hp / playerData.maxHp) * 100;
  const mpPercentage = (playerData.mp / playerData.maxMp) * 100;

  const getRankColor = (rank: string) => {
    const colors = {
      'E': 'bg-gray-500',
      'D': 'bg-green-500',
      'C': 'bg-blue-500',
      'B': 'bg-purple-500',
      'A': 'bg-orange-500',
      'S': 'bg-red-500'
    };
    return colors[rank as keyof typeof colors] || 'bg-gray-500';
  };

  const getRarityColor = (rarity: string) => {
    const colors = {
      'common': 'border-gray-400 bg-gray-400/10',
      'rare': 'border-blue-400 bg-blue-400/10',
      'epic': 'border-purple-400 bg-purple-400/10',
      'legendary': 'border-yellow-400 bg-yellow-400/10'
    };
    return colors[rarity as keyof typeof colors] || 'border-gray-400 bg-gray-400/10';
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced Background with Particle Effects */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(11, 17, 32, 0.92), rgba(5, 10, 20, 0.96)),
            url('/images/background-main.jpg')
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      />
      
      {/* Animated Particles */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {Array.from({ length: 50 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
      
      <div className="container mx-auto p-4 max-w-8xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Enhanced Header with Multiple Glow Effects */}
          <div className="text-center mb-12">
            <motion.div 
              className="relative inline-block"
              animate={{
                filter: [
                  "drop-shadow(0 0 20px rgba(123, 180, 255, 0.6))",
                  "drop-shadow(0 0 40px rgba(123, 180, 255, 0.9))",
                  "drop-shadow(0 0 20px rgba(123, 180, 255, 0.6))"
                ]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <h1 className="text-6xl md:text-7xl font-bold text-white mb-4 font-orbitron relative">
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                  PLAYER STATUS
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent opacity-50 blur-sm">
                  PLAYER STATUS
                </div>
              </h1>
            </motion.div>
            <motion.p 
              className="text-slate-300 text-xl font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Monitor your progression and unlock your true potential
            </motion.p>
          </div>

          {/* Organized 2x2 Grid Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            
            {/* Top Left - Player Info & Vitals */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* Player Card */}
              <Card className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 border-2 border-blue-500/30 backdrop-blur-xl shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-transparent"></div>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500"></div>
                
                <CardHeader className="text-center relative z-10 pb-4">
                  <div className="relative w-24 h-24 mx-auto mb-6">
                    <div 
                      className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white relative overflow-hidden shadow-2xl"
                      style={{
                        backgroundImage: `url('/images/player-avatar.jpg')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    >
                      <span className="bg-gradient-to-br from-blue-500 to-purple-600 w-full h-full flex items-center justify-center rounded-full">
                        {playerData.username.charAt(0)}
                      </span>
                    </div>
                    <motion.div 
                      className="absolute inset-0 rounded-full"
                      animate={{
                        boxShadow: [
                          "0 0 20px rgba(123, 180, 255, 0.6)",
                          "0 0 40px rgba(123, 180, 255, 0.9)",
                          "0 0 20px rgba(123, 180, 255, 0.6)"
                        ]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                    />
                  </div>
                  
                  <CardTitle className="text-white text-2xl font-bold mb-2">{playerData.username}</CardTitle>
                  <CardDescription className="flex items-center justify-center gap-3 flex-wrap">
                    <div className="flex items-center gap-1">
                      <Crown className="w-5 h-5 text-yellow-500" />
                      <span className="text-yellow-400 font-medium">{playerData.title}</span>
                    </div>
                    <Badge className={`${getRankColor(playerData.rank)} text-white shadow-lg text-sm px-3 py-1`}>
                      Rank {playerData.rank}
                    </Badge>
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="relative z-10">
                  <div className="grid grid-cols-3 gap-4 text-center mb-6">
                    <motion.div 
                      className="p-4 bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-xl border border-blue-400/30 shadow-lg"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="text-3xl font-bold text-blue-400 mb-1">{playerData.level}</div>
                      <div className="text-sm text-slate-300 font-medium">Level</div>
                    </motion.div>
                    <motion.div 
                      className="p-4 bg-gradient-to-br from-purple-500/20 to-purple-600/10 rounded-xl border border-purple-400/30 shadow-lg"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="text-3xl font-bold text-purple-400 mb-1">{playerData.totalPower}</div>
                      <div className="text-sm text-slate-300 font-medium">Power</div>
                    </motion.div>
                    <motion.div 
                      className="p-4 bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-xl border border-green-400/30 shadow-lg"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="text-3xl font-bold text-green-400 mb-1">{playerData.guild}</div>
                      <div className="text-sm text-slate-300 font-medium">Guild</div>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>

              {/* Health/MP Bars */}
              <Card className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 border-2 border-green-500/30 backdrop-blur-xl shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-blue-500/5"></div>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-blue-500 to-red-500"></div>
                
                <CardHeader className="relative z-10 pb-4">
                  <CardTitle className="text-white flex items-center gap-2 text-xl">
                    <Activity className="w-6 h-6 text-green-400" />
                    <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                      Vital Status
                    </span>
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-6 relative z-10">
                  {/* Experience Bar */}
                  <div>
                    <div className="flex justify-between mb-3">
                      <span className="text-blue-300 font-medium flex items-center gap-2">
                        <Star className="w-4 h-4" />
                        Experience
                      </span>
                      <span className="text-blue-300 font-bold">{playerData.exp}/{playerData.expToNext}</span>
                    </div>
                    <div className="relative">
                      <Progress value={expPercentage} className="h-4 bg-slate-700" />
                      <motion.div 
                        className="absolute inset-0 rounded-full"
                        animate={{
                          boxShadow: [
                            "0 0 10px rgba(59, 130, 246, 0.5)",
                            "0 0 20px rgba(59, 130, 246, 0.8)",
                            "0 0 10px rgba(59, 130, 246, 0.5)"
                          ]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </div>
                  </div>
                  
                  {/* Health Bar */}
                  <div>
                    <div className="flex justify-between mb-3">
                      <span className="text-red-300 font-medium flex items-center gap-2">
                        <Heart className="w-4 h-4" />
                        Health Points
                      </span>
                      <span className="text-red-300 font-bold">{playerData.hp}/{playerData.maxHp}</span>
                    </div>
                    <div className="relative">
                      <Progress value={hpPercentage} className="h-4 bg-slate-700" />
                      <motion.div 
                        className="absolute inset-0 rounded-full"
                        animate={{
                          boxShadow: [
                            "0 0 10px rgba(239, 68, 68, 0.5)",
                            "0 0 20px rgba(239, 68, 68, 0.8)",
                            "0 0 10px rgba(239, 68, 68, 0.5)"
                          ]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </div>
                  </div>
                  
                  {/* Mana Bar */}
                  <div>
                    <div className="flex justify-between mb-3">
                      <span className="text-blue-300 font-medium flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        Mana Points
                      </span>
                      <span className="text-blue-300 font-bold">{playerData.mp}/{playerData.maxMp}</span>
                    </div>
                    <div className="relative">
                      <Progress value={mpPercentage} className="h-4 bg-slate-700" />
                      <motion.div 
                        className="absolute inset-0 rounded-full"
                        animate={{
                          boxShadow: [
                            "0 0 10px rgba(59, 130, 246, 0.5)",
                            "0 0 20px rgba(59, 130, 246, 0.8)",
                            "0 0 10px rgba(59, 130, 246, 0.5)"
                          ]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Top Right - Combat Stats */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 border-2 border-purple-500/30 backdrop-blur-xl shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-red-500/5"></div>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-red-500 to-orange-500"></div>
                
                <CardHeader className="relative z-10 pb-4">
                  <CardTitle className="text-white flex items-center justify-between text-xl">
                    <div className="flex items-center gap-2">
                      <Swords className="w-6 h-6 text-purple-400" />
                      <span className="bg-gradient-to-r from-purple-400 to-red-400 bg-clip-text text-transparent">
                        Combat Statistics
                      </span>
                    </div>
                    {playerData.availableStatPoints > 0 && (
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Badge variant="outline" className="text-blue-400 border-blue-400 shadow-lg px-3 py-1">
                          {playerData.availableStatPoints} Points Available
                        </Badge>
                      </motion.div>
                    )}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-5 relative z-10">
                  <StatBar 
                    name="Strength" 
                    value={playerData.stats.strength} 
                    max={100} 
                    color="red"
                    icon={<Swords className="w-5 h-5" />}
                    onAllocate={() => allocateStatPoint('strength')}
                    canAllocate={playerData.availableStatPoints > 0}
                  />
                  <StatBar 
                    name="Agility" 
                    value={playerData.stats.agility} 
                    max={100} 
                    color="green"
                    icon={<Zap className="w-5 h-5" />}
                    onAllocate={() => allocateStatPoint('agility')}
                    canAllocate={playerData.availableStatPoints > 0}
                  />
                  <StatBar 
                    name="Intelligence" 
                    value={playerData.stats.intelligence} 
                    max={100} 
                    color="blue"
                    icon={<Brain className="w-5 h-5" />}
                    onAllocate={() => allocateStatPoint('intelligence')}
                    canAllocate={playerData.availableStatPoints > 0}
                  />
                  <StatBar 
                    name="Vitality" 
                    value={playerData.stats.vitality} 
                    max={100} 
                    color="purple"
                    icon={<Heart className="w-5 h-5" />}
                    onAllocate={() => allocateStatPoint('vitality')}
                    canAllocate={playerData.availableStatPoints > 0}
                  />
                  <StatBar 
                    name="Endurance" 
                    value={playerData.stats.endurance} 
                    max={100} 
                    color="yellow"
                    icon={<Shield className="w-5 h-5" />}
                    onAllocate={() => allocateStatPoint('endurance')}
                    canAllocate={playerData.availableStatPoints > 0}
                  />
                  <StatBar 
                    name="Sense" 
                    value={playerData.stats.sense} 
                    max={100} 
                    color="orange"
                    icon={<Eye className="w-5 h-5" />}
                    onAllocate={() => allocateStatPoint('sense')}
                    canAllocate={playerData.availableStatPoints > 0}
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* Bottom Left - Daily Progress */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 border-2 border-green-500/30 backdrop-blur-xl shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-blue-500/5"></div>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-blue-500 to-teal-500"></div>
                
                <CardHeader className="relative z-10 pb-4">
                  <CardTitle className="text-white flex items-center gap-2 text-xl">
                    <TrendingUp className="w-6 h-6 text-green-400" />
                    <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                      Daily Progress
                    </span>
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="relative z-10">
                  <div className="space-y-4">
                    <motion.div 
                      className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-500/20 to-blue-600/10 rounded-xl border border-blue-400/30 shadow-lg"
                      whileHover={{ scale: 1.02, x: 5 }}
                    >
                      <span className="text-slate-200 font-medium flex items-center gap-2">
                        <Target className="w-5 h-5 text-blue-400" />
                        Daily Quests
                      </span>
                      <span className="text-white font-bold text-lg">
                        {playerData.dailyQuests.completed}/{playerData.dailyQuests.total}
                      </span>
                    </motion.div>
                    
                    <motion.div 
                      className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-500/20 to-purple-600/10 rounded-xl border border-purple-400/30 shadow-lg"
                      whileHover={{ scale: 1.02, x: 5 }}
                    >
                      <span className="text-slate-200 font-medium flex items-center gap-2">
                        <Crown className="w-5 h-5 text-purple-400" />
                        Shadows Arisen
                      </span>
                      <span className="text-white font-bold text-lg">{playerData.shadowsArisen}</span>
                    </motion.div>
                    
                    <motion.div 
                      className="flex justify-between items-center p-4 bg-gradient-to-r from-orange-500/20 to-orange-600/10 rounded-xl border border-orange-400/30 shadow-lg"
                      whileHover={{ scale: 1.02, x: 5 }}
                    >
                      <span className="text-slate-200 font-medium flex items-center gap-2">
                        <Flame className="w-5 h-5 text-orange-400" />
                        Total Power
                      </span>
                      <span className="text-white font-bold text-lg">{playerData.totalPower}</span>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Bottom Right - Achievements */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Card className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 border-2 border-yellow-500/30 backdrop-blur-xl shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-orange-500/5"></div>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500"></div>
                
                <CardHeader className="relative z-10 pb-4">
                  <CardTitle className="text-white flex items-center gap-2 text-xl">
                    <Trophy className="w-6 h-6 text-yellow-500" />
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                      Achievements
                    </span>
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="relative z-10">
                  <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
                    {playerData.achievements.map((achievement, index) => {
                      const IconComponent = achievement.icon;
                      return (
                        <motion.div
                          key={achievement.id}
                          className={`p-4 rounded-xl border ${getRarityColor(achievement.rarity)} ${
                            achievement.completed ? 'opacity-100' : 'opacity-60'
                          } relative overflow-hidden shadow-lg`}
                          whileHover={{ scale: 1.02, y: -2 }}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * index }}
                        >
                          {achievement.completed && (
                            <motion.div 
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                              animate={{ x: ['-100%', '100%'] }}
                              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                            />
                          )}
                          
                          <div className="flex items-start gap-3 relative z-10">
                            <motion.div 
                              className={`p-3 rounded-xl ${achievement.completed ? 'bg-yellow-500/20' : 'bg-slate-700/50'}`}
                              animate={achievement.completed ? { 
                                boxShadow: [
                                  "0 0 10px rgba(234, 179, 8, 0.5)",
                                  "0 0 20px rgba(234, 179, 8, 0.8)",
                                  "0 0 10px rgba(234, 179, 8, 0.5)"
                                ]
                              } : {}}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <IconComponent className={`w-5 h-5 ${achievement.completed ? 'text-yellow-400' : 'text-slate-400'}`} />
                            </motion.div>
                            
                            <div className="flex-1 min-w-0">
                              <h4 className={`font-bold text-sm ${achievement.completed ? 'text-white' : 'text-slate-400'}`}>
                                {achievement.name}
                              </h4>
                              <p className={`text-xs mt-1 ${achievement.completed ? 'text-slate-300' : 'text-slate-500'}`}>
                                {achievement.description}
                              </p>
                              <Badge variant="outline" className={`text-xs mt-2 ${
                                achievement.rarity === 'legendary' ? 'border-yellow-400 text-yellow-400' : 
                                achievement.rarity === 'epic' ? 'border-purple-400 text-purple-400' : 
                                achievement.rarity === 'rare' ? 'border-blue-400 text-blue-400' : 
                                'border-gray-400 text-gray-400'
                              }`}>
                                {achievement.rarity.toUpperCase()}
                              </Badge>
                            </div>
                            
                            {achievement.completed && (
                              <motion.div 
                                className="text-green-400"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              >
                                <Award className="w-5 h-5" />
                              </motion.div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <style>
        {`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(71, 85, 105, 0.3);
            border-radius: 3px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(123, 180, 255, 0.6);
            border-radius: 3px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(123, 180, 255, 0.8);
          }
        `}
      </style>
    </div>
  );
};

export default Index;
