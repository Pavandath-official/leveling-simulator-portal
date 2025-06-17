
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Zap, User, Heart, Shield, Brain, Swords, Star, TrendingUp, Crown, Flame } from 'lucide-react';
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
    <div className="sl-container pb-16 mx-auto px-4 md:px-8 sl-page-transition">
      <div className="mt-8 mb-12 text-center">
        <div className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/30 to-purple-500/30 border-2 border-blue-400/50 text-blue-300 text-sm mb-6 shadow-xl backdrop-blur-sm">
          <User className="w-5 h-5 inline mr-2" />
          Player Status Interface
        </div>
        <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 font-orbitron">
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent drop-shadow-2xl">
            [Player Status]
          </span>
        </h1>
        <p className="text-slate-200 max-w-3xl mx-auto text-xl leading-relaxed backdrop-blur-sm bg-black/20 rounded-lg p-4">
          Monitor your progression as a Hunter. Allocate stat points and track your journey to become the ultimate Shadow Monarch.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Player Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Basic Info Card */}
          <Card className="bg-slate-900/80 backdrop-blur-xl border-2 border-blue-500/30 shadow-2xl">
            <CardHeader className="text-center">
              <div className="relative mx-auto w-24 h-24 mb-4">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white shadow-2xl border-4 border-blue-400/50">
                  {playerData.username.charAt(0)}
                </div>
                <div className="absolute -bottom-2 -right-2">
                  <Badge className={`${getRankColor(playerData.rank)} text-white font-bold text-lg px-3 py-1 shadow-lg border-2 border-white/30`}>
                    {playerData.rank}
                  </Badge>
                </div>
              </div>
              <CardTitle className="text-2xl text-white drop-shadow-lg">{playerData.username}</CardTitle>
              <CardDescription className="text-slate-300">
                <Crown className="w-4 h-4 inline mr-1 text-yellow-400" />
                {playerData.title}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-slate-800/60 backdrop-blur-sm p-3 rounded-lg border border-blue-500/20">
                  <div className="text-slate-400 text-sm">Level</div>
                  <div className="text-white font-bold text-xl">{playerData.level}</div>
                </div>
                <div className="bg-slate-800/60 backdrop-blur-sm p-3 rounded-lg border border-blue-500/20">
                  <div className="text-slate-400 text-sm">Guild</div>
                  <div className="text-white font-bold text-xl">{playerData.guild}</div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-300 text-sm">Experience</span>
                    <span className="text-slate-300 text-sm">{playerData.exp}/{playerData.expToNext}</span>
                  </div>
                  <Progress value={expPercentage} className="h-3" />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-red-400 text-sm flex items-center">
                      <Heart className="w-4 h-4 mr-1" />
                      Health
                    </span>
                    <span className="text-red-400 text-sm">{playerData.hp}/{playerData.maxHp}</span>
                  </div>
                  <Progress value={hpPercentage} className="h-3 bg-red-900" />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-blue-400 text-sm flex items-center">
                      <Zap className="w-4 h-4 mr-1" />
                      Mana
                    </span>
                    <span className="text-blue-400 text-sm">{playerData.mp}/{playerData.maxMp}</span>
                  </div>
                  <Progress value={mpPercentage} className="h-3 bg-blue-900" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="bg-slate-900/80 backdrop-blur-xl border-2 border-purple-500/30 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800/60 backdrop-blur-sm p-3 rounded-lg text-center border border-yellow-500/20">
                  <div className="text-yellow-400 text-sm">Daily Quests</div>
                  <div className="text-white font-bold">{playerData.dailyQuests.completed}/{playerData.dailyQuests.total}</div>
                </div>
                <div className="bg-slate-800/60 backdrop-blur-sm p-3 rounded-lg text-center border border-purple-500/20">
                  <div className="text-purple-400 text-sm">Shadows</div>
                  <div className="text-white font-bold">{playerData.shadowsArisen}</div>
                </div>
                <div className="bg-slate-800/60 backdrop-blur-sm p-3 rounded-lg text-center border border-orange-500/20">
                  <div className="text-orange-400 text-sm">Achievements</div>
                  <div className="text-white font-bold">{playerData.achievements}</div>
                </div>
                <div className="bg-slate-800/60 backdrop-blur-sm p-3 rounded-lg text-center border border-green-500/20">
                  <div className="text-green-400 text-sm">Rank</div>
                  <div className="text-white font-bold">{playerData.rank}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-slate-900/80 backdrop-blur-xl border-2 border-blue-500/30 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <div className="flex items-center">
                  <Swords className="w-5 h-5 mr-2 text-blue-400" />
                  Character Stats
                </div>
                {playerData.availableStatPoints > 0 && (
                  <Badge variant="outline" className="text-blue-400 border-blue-400">
                    <Star className="w-4 h-4 mr-1" />
                    {playerData.availableStatPoints} points available
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
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
                icon={<Star className="w-4 h-4" />}
                onAllocate={() => allocateStatPoint('sense')}
                canAllocate={playerData.availableStatPoints > 0}
              />

              <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-400/30 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium">Total Power Level</h4>
                    <p className="text-slate-400 text-sm">Combined stats assessment</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-400">
                      {Object.values(playerData.stats).reduce((sum, stat) => sum + stat, 0)}
                    </div>
                    <div className="text-sm text-slate-400">Power Points</div>
                  </div>
                </div>
              </div>

              {playerData.availableStatPoints === 0 && (
                <div className="text-center p-4 bg-slate-800/40 rounded-lg border border-slate-600/50">
                  <p className="text-slate-400">No stat points available. Level up to gain more!</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* System Messages */}
          <Card className="bg-slate-900/80 backdrop-blur-xl border-2 border-orange-500/30 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Flame className="w-5 h-5 mr-2 text-orange-400" />
                System Messages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <motion.div 
                  className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg backdrop-blur-sm"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <p className="text-blue-400 text-sm">
                    📊 Daily quest progress: {playerData.dailyQuests.completed}/{playerData.dailyQuests.total} completed
                  </p>
                </motion.div>
                
                <motion.div 
                  className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg backdrop-blur-sm"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <p className="text-purple-400 text-sm">
                    👥 Shadow army growing: {playerData.shadowsArisen} shadows arisen
                  </p>
                </motion.div>
                
                <motion.div 
                  className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg backdrop-blur-sm"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <p className="text-green-400 text-sm">
                    ⚡ Ready for next dungeon challenge!
                  </p>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
