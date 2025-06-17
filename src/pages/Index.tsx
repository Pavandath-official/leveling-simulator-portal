
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
    <div className="min-h-screen relative">
      {/* Background Image - Replace with your image path */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(21, 24, 35, 0.85), rgba(13, 15, 22, 0.9)),
            url('/images/background-main.jpg')
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      />
      
      <div className="container mx-auto p-6 max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header with Glow Effect */}
          <div className="text-center mb-8">
            <motion.h1 
              className="text-5xl font-bold text-white mb-2 font-orbitron"
              style={{
                textShadow: `
                  0 0 20px rgba(123, 180, 255, 0.8),
                  0 0 40px rgba(123, 180, 255, 0.6),
                  0 0 60px rgba(123, 180, 255, 0.4),
                  2px 2px 4px rgba(0, 0, 0, 0.9)
                `
              }}
              animate={{
                textShadow: [
                  "0 0 20px rgba(123, 180, 255, 0.8), 0 0 40px rgba(123, 180, 255, 0.6), 0 0 60px rgba(123, 180, 255, 0.4)",
                  "0 0 30px rgba(123, 180, 255, 1), 0 0 50px rgba(123, 180, 255, 0.8), 0 0 70px rgba(123, 180, 255, 0.6)",
                  "0 0 20px rgba(123, 180, 255, 0.8), 0 0 40px rgba(123, 180, 255, 0.6), 0 0 60px rgba(123, 180, 255, 0.4)"
                ]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              Player Status
            </motion.h1>
            <p className="text-slate-300 text-lg">Monitor your progression and unlock your potential</p>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Player Info */}
            <div className="space-y-6">
              {/* Player Card with Glow */}
              <motion.div
                className="relative"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-sl-blue to-sl-purple opacity-20 rounded-lg blur-xl"></div>
                <Card className="bg-slate-900/95 border-slate-700 backdrop-blur-md relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-sl-blue/10 to-sl-purple/10"></div>
                  <CardHeader className="text-center relative z-10">
                    <div className="relative w-20 h-20 mx-auto mb-4">
                      {/* Player Avatar Image - Replace with your image path */}
                      <div 
                        className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-white relative overflow-hidden"
                        style={{
                          backgroundImage: `url('/images/player-avatar.jpg')`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                      >
                        {/* Fallback text if image doesn't load */}
                        <span className="bg-gradient-to-br from-blue-500 to-purple-600 w-full h-full flex items-center justify-center rounded-full">
                          {playerData.username.charAt(0)}
                        </span>
                      </div>
                      <div className="absolute inset-0 rounded-full shadow-[0_0_30px_rgba(123,180,255,0.6)] animate-pulse"></div>
                    </div>
                    <CardTitle className="text-white text-xl">{playerData.username}</CardTitle>
                    <CardDescription className="flex items-center justify-center gap-2">
                      <Crown className="w-4 h-4 text-yellow-500" />
                      {playerData.title}
                      <Badge className={`${getRankColor(playerData.rank)} text-white ml-2 shadow-lg`}>
                        Rank {playerData.rank}
                      </Badge>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-600">
                        <div className="text-3xl font-bold text-white mb-1">{playerData.level}</div>
                        <div className="text-sm text-slate-400">Level</div>
                      </div>
                      <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-600">
                        <div className="text-3xl font-bold text-white mb-1">{playerData.guild}</div>
                        <div className="text-sm text-slate-400">Guild</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Health/MP Bars with Enhanced Glow */}
              <Card className="bg-slate-900/95 border-slate-700 backdrop-blur-md relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-blue-500/5"></div>
                <CardHeader className="relative z-10">
                  <CardTitle className="text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-sl-blue" />
                    Vital Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 relative z-10">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-slate-300">Experience</span>
                      <span className="text-sm text-slate-300">{playerData.exp}/{playerData.expToNext}</span>
                    </div>
                    <div className="relative">
                      <Progress value={expPercentage} className="h-3" />
                      <div className="absolute inset-0 rounded-full shadow-[0_0_15px_rgba(123,180,255,0.4)]"></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-red-400 flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        HP
                      </span>
                      <span className="text-sm text-red-400">{playerData.hp}/{playerData.maxHp}</span>
                    </div>
                    <div className="relative">
                      <Progress value={hpPercentage} className="h-3" />
                      <div className="absolute inset-0 rounded-full shadow-[0_0_15px_rgba(239,68,68,0.4)]"></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-blue-400 flex items-center gap-1">
                        <Zap className="w-4 h-4" />
                        MP
                      </span>
                      <span className="text-sm text-blue-400">{playerData.mp}/{playerData.maxMp}</span>
                    </div>
                    <div className="relative">
                      <Progress value={mpPercentage} className="h-3" />
                      <div className="absolute inset-0 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.4)]"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Middle Column - Stats */}
            <div className="space-y-6">
              <Card className="bg-slate-900/95 border-slate-700 backdrop-blur-md relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-red-500/5"></div>
                <CardHeader className="relative z-10">
                  <CardTitle className="text-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Swords className="w-5 h-5 text-sl-purple" />
                      Combat Stats
                    </div>
                    {playerData.availableStatPoints > 0 && (
                      <Badge variant="outline" className="text-blue-400 border-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.3)]">
                        {playerData.availableStatPoints} Points
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 relative z-10">
                  <StatBar 
                    name="Strength" 
                    value={playerData.stats.strength} 
                    max={100} 
                    color="red"
                    icon={<Swords className="w-4 h-4" />}
                    onAllocate={() => allocateStatPoint('strength')}
                    canAllocate={playerData.availableStatPoints > 0}
                  />
                  <StatBar 
                    name="Agility" 
                    value={playerData.stats.agility} 
                    max={100} 
                    color="green"
                    icon={<Zap className="w-4 h-4" />}
                    onAllocate={() => allocateStatPoint('agility')}
                    canAllocate={playerData.availableStatPoints > 0}
                  />
                  <StatBar 
                    name="Intelligence" 
                    value={playerData.stats.intelligence} 
                    max={100} 
                    color="blue"
                    icon={<Brain className="w-4 h-4" />}
                    onAllocate={() => allocateStatPoint('intelligence')}
                    canAllocate={playerData.availableStatPoints > 0}
                  />
                  <StatBar 
                    name="Vitality" 
                    value={playerData.stats.vitality} 
                    max={100} 
                    color="purple"
                    icon={<Heart className="w-4 h-4" />}
                    onAllocate={() => allocateStatPoint('vitality')}
                    canAllocate={playerData.availableStatPoints > 0}
                  />
                  <StatBar 
                    name="Endurance" 
                    value={playerData.stats.endurance} 
                    max={100} 
                    color="yellow"
                    icon={<Shield className="w-4 h-4" />}
                    onAllocate={() => allocateStatPoint('endurance')}
                    canAllocate={playerData.availableStatPoints > 0}
                  />
                  <StatBar 
                    name="Sense" 
                    value={playerData.stats.sense} 
                    max={100} 
                    color="orange"
                    icon={<Eye className="w-4 h-4" />}
                    onAllocate={() => allocateStatPoint('sense')}
                    canAllocate={playerData.availableStatPoints > 0}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Progress & Achievements */}
            <div className="space-y-6">
              {/* Daily Progress */}
              <Card className="bg-slate-900/95 border-slate-700 backdrop-blur-md relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-blue-500/5"></div>
                <CardHeader className="relative z-10">
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-sl-green" />
                    Daily Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg border border-slate-600">
                      <span className="text-slate-300">Daily Quests</span>
                      <span className="text-white font-bold">
                        {playerData.dailyQuests.completed}/{playerData.dailyQuests.total}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg border border-slate-600">
                      <span className="text-slate-300">Shadows Arisen</span>
                      <span className="text-white font-bold">{playerData.shadowsArisen}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg border border-slate-600">
                      <span className="text-slate-300">Total Power</span>
                      <span className="text-white font-bold">{playerData.totalPower}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Achievements */}
              <Card className="bg-slate-900/95 border-slate-700 backdrop-blur-md relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-orange-500/5"></div>
                <CardHeader className="relative z-10">
                  <CardTitle className="text-white flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {playerData.achievements.map((achievement) => {
                      const IconComponent = achievement.icon;
                      return (
                        <motion.div
                          key={achievement.id}
                          className={`p-3 rounded-lg border ${getRarityColor(achievement.rarity)} ${
                            achievement.completed ? 'opacity-100' : 'opacity-50'
                          } relative overflow-hidden`}
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                        >
                          {achievement.completed && (
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
                          )}
                          <div className="flex items-start gap-3 relative z-10">
                            <div className={`p-2 rounded-full ${achievement.completed ? 'bg-yellow-500/20' : 'bg-slate-700'}`}>
                              <IconComponent className={`w-4 h-4 ${achievement.completed ? 'text-yellow-400' : 'text-slate-400'}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className={`font-semibold text-sm ${achievement.completed ? 'text-white' : 'text-slate-400'}`}>
                                {achievement.name}
                              </h4>
                              <p className={`text-xs ${achievement.completed ? 'text-slate-300' : 'text-slate-500'}`}>
                                {achievement.description}
                              </p>
                              <Badge variant="outline" className={`text-xs mt-1 ${achievement.rarity === 'legendary' ? 'border-yellow-400 text-yellow-400' : achievement.rarity === 'epic' ? 'border-purple-400 text-purple-400' : achievement.rarity === 'rare' ? 'border-blue-400 text-blue-400' : 'border-gray-400 text-gray-400'}`}>
                                {achievement.rarity}
                              </Badge>
                            </div>
                            {achievement.completed && (
                              <div className="text-green-400">
                                <Award className="w-4 h-4" />
                              </div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="bg-slate-900/95 border-slate-700 backdrop-blur-md relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5"></div>
                <CardHeader className="relative z-10">
                  <CardTitle className="text-white flex items-center gap-2">
                    <Star className="w-5 h-5 text-sl-purple" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2 text-green-400 p-2 bg-green-500/10 rounded border border-green-500/20">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      Completed daily quest
                    </div>
                    <div className="flex items-center gap-2 text-blue-400 p-2 bg-blue-500/10 rounded border border-blue-500/20">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                      Leveled up to {playerData.level}
                    </div>
                    <div className="flex items-center gap-2 text-purple-400 p-2 bg-purple-500/10 rounded border border-purple-500/20">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                      Shadow extracted
                    </div>
                    <div className="flex items-center gap-2 text-yellow-400 p-2 bg-yellow-500/10 rounded border border-yellow-500/20">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                      Achievement unlocked
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
