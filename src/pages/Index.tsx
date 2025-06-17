
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Zap, User, Heart, Shield, Brain, Swords, Star, TrendingUp, Crown, Flame, Eye, Target, Activity } from 'lucide-react';
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
    achievements: 12,
    shadowsArisen: 8
  });

  useEffect(() => {
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

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Player Status</h1>
          <p className="text-slate-400">Monitor your progression and stats</p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Player Info */}
          <div className="space-y-6">
            {/* Player Card */}
            <Card className="bg-slate-900/90 border-slate-700">
              <CardHeader className="text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-white">
                  {playerData.username.charAt(0)}
                </div>
                <CardTitle className="text-white">{playerData.username}</CardTitle>
                <CardDescription className="flex items-center justify-center gap-2">
                  <Crown className="w-4 h-4 text-yellow-500" />
                  {playerData.title}
                  <Badge className={`${getRankColor(playerData.rank)} text-white ml-2`}>
                    {playerData.rank}
                  </Badge>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-white">{playerData.level}</div>
                    <div className="text-sm text-slate-400">Level</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{playerData.guild}</div>
                    <div className="text-sm text-slate-400">Guild</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Health/MP Bars */}
            <Card className="bg-slate-900/90 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Vital Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-slate-300">Experience</span>
                    <span className="text-sm text-slate-300">{playerData.exp}/{playerData.expToNext}</span>
                  </div>
                  <Progress value={expPercentage} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-red-400 flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      HP
                    </span>
                    <span className="text-sm text-red-400">{playerData.hp}/{playerData.maxHp}</span>
                  </div>
                  <Progress value={hpPercentage} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-blue-400 flex items-center gap-1">
                      <Zap className="w-4 h-4" />
                      MP
                    </span>
                    <span className="text-sm text-blue-400">{playerData.mp}/{playerData.maxMp}</span>
                  </div>
                  <Progress value={mpPercentage} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Middle Column - Stats */}
          <div className="space-y-6">
            <Card className="bg-slate-900/90 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Swords className="w-5 h-5" />
                    Combat Stats
                  </div>
                  {playerData.availableStatPoints > 0 && (
                    <Badge variant="outline" className="text-blue-400 border-blue-400">
                      {playerData.availableStatPoints} Points
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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

          {/* Right Column - Progress & Info */}
          <div className="space-y-6">
            {/* Daily Progress */}
            <Card className="bg-slate-900/90 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Daily Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Daily Quests</span>
                    <span className="text-white font-bold">
                      {playerData.dailyQuests.completed}/{playerData.dailyQuests.total}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Shadows Arisen</span>
                    <span className="text-white font-bold">{playerData.shadowsArisen}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Achievements</span>
                    <span className="text-white font-bold">{playerData.achievements}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Power Level */}
            <Card className="bg-slate-900/90 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Power Level
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-400 mb-2">
                    {Object.values(playerData.stats).reduce((sum, stat) => sum + stat, 0)}
                  </div>
                  <div className="text-slate-400">Total Power Points</div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-slate-900/90 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="text-green-400">✓ Completed daily quest</div>
                  <div className="text-blue-400">• Leveled up to {playerData.level}</div>
                  <div className="text-purple-400">• Shadow extracted</div>
                  <div className="text-yellow-400">• Achievement unlocked</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Index;
