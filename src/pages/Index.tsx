
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
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* System Header */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold mb-2 text-blue-400">SYSTEM</h1>
          <div className="h-0.5 w-24 bg-blue-500 mx-auto"></div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Player Profile */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="text-center">
                <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-2xl font-bold">
                  {playerData.username.charAt(0)}
                </div>
                <CardTitle className="text-xl">{playerData.username}</CardTitle>
                <CardDescription>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Crown className="w-4 h-4 text-yellow-400" />
                    <span className="text-yellow-400">{playerData.title}</span>
                  </div>
                  <Badge className={`bg-gradient-to-r ${getRankColor(playerData.rank)} text-white`}>
                    {playerData.rank}-RANK HUNTER
                  </Badge>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gray-700 rounded">
                    <div className="text-2xl font-bold text-blue-400">LV.{playerData.level}</div>
                    <div className="text-xs text-gray-400">LEVEL</div>
                  </div>
                  <div className="text-center p-3 bg-gray-700 rounded">
                    <div className="text-2xl font-bold text-purple-400">{playerData.totalPower}</div>
                    <div className="text-xs text-gray-400">POWER</div>
                  </div>
                </div>
                <div className="text-center p-3 bg-gray-700 rounded">
                  <div className="text-xl font-bold text-green-400">{playerData.shadowArmy}</div>
                  <div className="text-xs text-gray-400">SHADOW SOLDIERS</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Status and Stats */}
          <motion.div 
            className="lg:col-span-2 space-y-8"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            
            {/* Status Bars */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-400" />
                  STATUS
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-blue-300 text-sm">EXP</span>
                    <span className="text-blue-300 text-sm">{playerData.exp.toLocaleString()}/{playerData.expToNext.toLocaleString()}</span>
                  </div>
                  <Progress value={expPercentage} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-red-300 text-sm">HP</span>
                    <span className="text-red-300 text-sm">{playerData.hp.toLocaleString()}/{playerData.maxHp.toLocaleString()}</span>
                  </div>
                  <Progress value={hpPercentage} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-blue-300 text-sm">MP</span>
                    <span className="text-blue-300 text-sm">{playerData.mp.toLocaleString()}/{playerData.maxMp.toLocaleString()}</span>
                  </div>
                  <Progress value={mpPercentage} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Combat Stats */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Swords className="w-5 h-5 text-purple-400" />
                    STATISTICS
                  </div>
                  {playerData.availableStatPoints > 0 && (
                    <Badge variant="outline" className="text-cyan-400 border-cyan-400">
                      +{playerData.availableStatPoints} POINTS
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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

            {/* Achievements */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  ACHIEVEMENTS
                  <Badge variant="outline" className="ml-auto text-yellow-400 border-yellow-400">
                    {playerData.achievements.filter(a => a.completed).length}/{playerData.achievements.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-80 overflow-y-auto">
                  {playerData.achievements.map((achievement) => {
                    const IconComponent = achievement.icon;
                    return (
                      <motion.div
                        key={achievement.id}
                        className={`p-4 rounded-lg border-2 ${getRarityColor(achievement.rarity)} ${
                          achievement.completed 
                            ? 'bg-gray-700' 
                            : 'bg-gray-800 opacity-60'
                        }`}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded ${
                            achievement.completed 
                              ? 'bg-yellow-500/20 text-yellow-400' 
                              : 'bg-gray-600 text-gray-500'
                          }`}>
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <h4 className={`font-bold text-sm ${
                              achievement.completed ? 'text-white' : 'text-gray-500'
                            }`}>
                              {achievement.name}
                            </h4>
                            <p className={`text-xs mt-1 ${
                              achievement.completed ? 'text-gray-300' : 'text-gray-600'
                            }`}>
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
                          {achievement.completed ? (
                            <Award className="w-5 h-5 text-green-400" />
                          ) : (
                            <Lock className="w-5 h-5 text-gray-600" />
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
      </div>
    </div>
  );
};

export default Index;
