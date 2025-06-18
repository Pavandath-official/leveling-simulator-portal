
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Zap, User, Heart, Shield, Brain, Swords, Star, TrendingUp, Crown, Flame, Eye, Target, Activity, Trophy, Award, Medal, Gem, Lock, ChevronRight } from 'lucide-react';
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

  const getRankColor = (rank: string) => {
    const colors = {
      'E': 'from-gray-600 to-gray-700',
      'D': 'from-green-600 to-green-700',
      'C': 'from-blue-600 to-blue-700',
      'B': 'from-purple-600 to-purple-700',
      'A': 'from-orange-600 to-orange-700',
      'S': 'from-red-600 to-red-700'
    };
    return colors[rank as keyof typeof colors] || 'from-gray-600 to-gray-700';
  };

  const getRarityColor = (rarity: string) => {
    const colors = {
      'common': 'border-gray-500 shadow-gray-500/20',
      'rare': 'border-blue-500 shadow-blue-500/30',
      'epic': 'border-purple-500 shadow-purple-500/30',
      'legendary': 'border-yellow-500 shadow-yellow-500/40'
    };
    return colors[rarity as keyof typeof colors] || 'border-gray-500 shadow-gray-500/20';
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* System Background */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(135deg, rgba(0, 0, 0, 0.95), rgba(20, 30, 60, 0.8)),
            radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(147, 51, 234, 0.1) 0%, transparent 50%),
            url('/images/background-main.jpg')
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      />
      
      {/* System Grid Pattern */}
      <div className="fixed inset-0 z-0 opacity-20">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
      </div>
      
      {/* Floating System Particles */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {Array.from({ length: 30 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/40 rounded-sm"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() > 0.5 ? 10 : -10, 0],
              opacity: [0.2, 0.6, 0.2],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      
      <div className="container mx-auto p-6 max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* System Header */}
          <motion.div className="text-center mb-10">
            <motion.div 
              className="relative inline-block mb-6"
              animate={{
                textShadow: [
                  "0 0 20px rgba(59, 130, 246, 0.8)",
                  "0 0 40px rgba(59, 130, 246, 1)",
                  "0 0 20px rgba(59, 130, 246, 0.8)"
                ]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-2 tracking-wider font-mono">
                ［ SYSTEM ］
              </h1>
              <div className="text-xl text-blue-400 font-mono tracking-widest">
                ＿＿＿ PLAYER STATUS ＿＿＿
              </div>
            </motion.div>
            <motion.div 
              className="w-full h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent"
              animate={{
                opacity: [0.5, 1, 0.5],
                scaleX: [0.8, 1, 0.8]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
          </motion.div>

          {/* Main System Interface */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Player Profile */}
            <motion.div 
              className="lg:col-span-1 space-y-6"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-gradient-to-br from-slate-900/90 to-black/90 border-2 border-blue-500/40 backdrop-blur-xl shadow-2xl shadow-blue-500/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5"></div>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500"></div>
                
                <CardHeader className="text-center relative z-10 pb-4">
                  <div className="relative w-28 h-28 mx-auto mb-6">
                    <div 
                      className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-4xl font-bold text-white relative overflow-hidden shadow-2xl border-4 border-blue-400/50"
                      style={{
                        backgroundImage: `url('/images/player-avatar.jpg')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    >
                      <span className="bg-gradient-to-br from-blue-500 to-purple-600 w-full h-full flex items-center justify-center rounded-full font-mono">
                        {playerData.username.charAt(0)}
                      </span>
                    </div>
                    <motion.div 
                      className="absolute inset-0 rounded-full border-2 border-blue-400"
                      animate={{
                        boxShadow: [
                          "0 0 20px rgba(59, 130, 246, 0.6)",
                          "0 0 40px rgba(59, 130, 246, 0.9)",
                          "0 0 20px rgba(59, 130, 246, 0.6)"
                        ]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                    />
                  </div>
                  
                  <CardTitle className="text-white text-2xl font-bold mb-3 font-mono tracking-wider">
                    {playerData.username}
                  </CardTitle>
                  <CardDescription className="space-y-3">
                    <div className="flex items-center justify-center gap-2">
                      <Crown className="w-5 h-5 text-yellow-400" />
                      <span className="text-yellow-400 font-medium font-mono">{playerData.title}</span>
                    </div>
                    <Badge className={`bg-gradient-to-r ${getRankColor(playerData.rank)} text-white shadow-lg text-lg px-4 py-2 font-mono border border-red-400/50`}>
                      {playerData.rank}-RANK HUNTER
                    </Badge>
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="relative z-10 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <motion.div 
                      className="p-4 bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-lg border border-blue-400/30 shadow-lg"
                      whileHover={{ scale: 1.05, borderColor: "rgba(59, 130, 246, 0.6)" }}
                    >
                      <div className="text-3xl font-bold text-blue-400 mb-1 font-mono">LV.{playerData.level}</div>
                      <div className="text-xs text-slate-300 font-mono">LEVEL</div>
                    </motion.div>
                    <motion.div 
                      className="p-4 bg-gradient-to-br from-purple-500/20 to-purple-600/10 rounded-lg border border-purple-400/30 shadow-lg"
                      whileHover={{ scale: 1.05, borderColor: "rgba(147, 51, 234, 0.6)" }}
                    >
                      <div className="text-3xl font-bold text-purple-400 mb-1 font-mono">{playerData.totalPower}</div>
                      <div className="text-xs text-slate-300 font-mono">POWER</div>
                    </motion.div>
                  </div>
                  
                  <motion.div 
                    className="p-4 bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-lg border border-green-400/30 shadow-lg"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400 mb-1 font-mono">{playerData.shadowArmy}</div>
                      <div className="text-xs text-slate-300 font-mono">SHADOW SOLDIERS</div>
                    </div>
                  </motion.div>
                </CardContent>
              </Card>

              {/* Status Bars */}
              <Card className="bg-gradient-to-br from-slate-900/90 to-black/90 border-2 border-green-500/40 backdrop-blur-xl shadow-2xl shadow-green-500/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-blue-500/5"></div>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-cyan-400 to-blue-500"></div>
                
                <CardHeader className="relative z-10 pb-4">
                  <CardTitle className="text-white flex items-center gap-2 text-lg font-mono">
                    <Activity className="w-5 h-5 text-green-400" />
                    VITAL STATUS
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-5 relative z-10">
                  {/* Experience */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-blue-300 font-mono text-sm flex items-center gap-2">
                        <Star className="w-4 h-4" />
                        EXP
                      </span>
                      <span className="text-blue-300 font-mono text-sm">{playerData.exp.toLocaleString()}/{playerData.expToNext.toLocaleString()}</span>
                    </div>
                    <div className="relative">
                      <div className="h-3 bg-slate-800 rounded-full border border-blue-500/30">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full shadow-lg"
                          style={{ width: `${expPercentage}%` }}
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
                  </div>
                  
                  {/* Health */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-red-300 font-mono text-sm flex items-center gap-2">
                        <Heart className="w-4 h-4" />
                        HP
                      </span>
                      <span className="text-red-300 font-mono text-sm">{playerData.hp.toLocaleString()}/{playerData.maxHp.toLocaleString()}</span>
                    </div>
                    <div className="relative">
                      <div className="h-3 bg-slate-800 rounded-full border border-red-500/30">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-red-500 to-red-400 rounded-full shadow-lg"
                          style={{ width: `${hpPercentage}%` }}
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
                  </div>
                  
                  {/* Mana */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-blue-300 font-mono text-sm flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        MP
                      </span>
                      <span className="text-blue-300 font-mono text-sm">{playerData.mp.toLocaleString()}/{playerData.maxMp.toLocaleString()}</span>
                    </div>
                    <div className="relative">
                      <div className="h-3 bg-slate-800 rounded-full border border-blue-500/30">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg"
                          style={{ width: `${mpPercentage}%` }}
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
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Stats and Achievements */}
            <motion.div 
              className="lg:col-span-2 space-y-6"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              {/* Combat Stats */}
              <Card className="bg-gradient-to-br from-slate-900/90 to-black/90 border-2 border-purple-500/40 backdrop-blur-xl shadow-2xl shadow-purple-500/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-red-500/5"></div>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-red-500 to-orange-500"></div>
                
                <CardHeader className="relative z-10 pb-4">
                  <CardTitle className="text-white flex items-center justify-between text-lg">
                    <div className="flex items-center gap-2">
                      <Swords className="w-5 h-5 text-purple-400" />
                      <span className="font-mono">STATISTICS</span>
                    </div>
                    {playerData.availableStatPoints > 0 && (
                      <motion.div
                        animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Badge variant="outline" className="text-cyan-400 border-cyan-400 shadow-lg px-3 py-1 font-mono bg-cyan-400/10">
                          +{playerData.availableStatPoints} POINTS
                        </Badge>
                      </motion.div>
                    )}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-4 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                </CardContent>
              </Card>

              {/* Achievements System */}
              <Card className="bg-gradient-to-br from-slate-900/90 to-black/90 border-2 border-yellow-500/40 backdrop-blur-xl shadow-2xl shadow-yellow-500/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-orange-500/5"></div>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500"></div>
                
                <CardHeader className="relative z-10 pb-4">
                  <CardTitle className="text-white flex items-center gap-2 text-lg">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    <span className="font-mono">ACHIEVEMENTS</span>
                    <Badge variant="outline" className="ml-auto text-yellow-400 border-yellow-400 bg-yellow-400/10 font-mono">
                      {playerData.achievements.filter(a => a.completed).length}/{playerData.achievements.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-80 overflow-y-auto custom-scrollbar">
                    {playerData.achievements.map((achievement, index) => {
                      const IconComponent = achievement.icon;
                      return (
                        <motion.div
                          key={achievement.id}
                          className={`p-4 rounded-lg border-2 ${getRarityColor(achievement.rarity)} ${
                            achievement.completed 
                              ? 'bg-gradient-to-br from-white/5 to-white/10' 
                              : 'bg-gradient-to-br from-slate-800/50 to-slate-900/50 opacity-60'
                          } relative overflow-hidden shadow-lg`}
                          whileHover={{ scale: 1.02, y: -2 }}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.05 * index }}
                        >
                          {achievement.completed && (
                            <motion.div 
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                              animate={{ x: ['-100%', '100%'] }}
                              transition={{ duration: 3, repeat: Infinity, repeatDelay: 5 }}
                            />
                          )}
                          
                          <div className="flex items-start gap-3 relative z-10">
                            <motion.div 
                              className={`p-2 rounded-lg ${
                                achievement.completed 
                                  ? 'bg-yellow-500/20 border border-yellow-400/50' 
                                  : 'bg-slate-700/50 border border-slate-600/50'
                              }`}
                              animate={achievement.completed ? { 
                                boxShadow: [
                                  "0 0 10px rgba(234, 179, 8, 0.3)",
                                  "0 0 20px rgba(234, 179, 8, 0.6)",
                                  "0 0 10px rgba(234, 179, 8, 0.3)"
                                ]
                              } : {}}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <IconComponent className={`w-5 h-5 ${
                                achievement.completed ? 'text-yellow-400' : 'text-slate-500'
                              }`} />
                            </motion.div>
                            
                            <div className="flex-1 min-w-0">
                              <h4 className={`font-bold text-sm font-mono ${
                                achievement.completed ? 'text-white' : 'text-slate-500'
                              }`}>
                                {achievement.name}
                              </h4>
                              <p className={`text-xs mt-1 ${
                                achievement.completed ? 'text-slate-300' : 'text-slate-600'
                              }`}>
                                {achievement.description}
                              </p>
                              <Badge variant="outline" className={`text-xs mt-2 font-mono ${
                                achievement.rarity === 'legendary' ? 'border-yellow-400 text-yellow-400 bg-yellow-400/10' : 
                                achievement.rarity === 'epic' ? 'border-purple-400 text-purple-400 bg-purple-400/10' : 
                                achievement.rarity === 'rare' ? 'border-blue-400 text-blue-400 bg-blue-400/10' : 
                                'border-gray-400 text-gray-400 bg-gray-400/10'
                              }`}>
                                {achievement.rarity.toUpperCase()}
                              </Badge>
                            </div>
                            
                            {achievement.completed ? (
                              <motion.div 
                                className="text-green-400"
                                animate={{ scale: [1, 1.2, 1], rotate: [0, 360] }}
                                transition={{ duration: 3, repeat: Infinity }}
                              >
                                <Award className="w-5 h-5" />
                              </motion.div>
                            ) : (
                              <Lock className="w-5 h-5 text-slate-600" />
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
            width: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(30, 41, 59, 0.3);
            border-radius: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: linear-gradient(to bottom, rgba(59, 130, 246, 0.6), rgba(147, 51, 234, 0.6));
            border-radius: 4px;
            border: 1px solid rgba(59, 130, 246, 0.3);
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(to bottom, rgba(59, 130, 246, 0.8), rgba(147, 51, 234, 0.8));
          }
        `}
      </style>
    </div>
  );
};

export default Index;
