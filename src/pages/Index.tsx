
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
    <div className="min-h-screen bg-black text-white p-4">
      {/* System Header with Background Image Area */}
      <div className="relative mb-8 rounded-xl overflow-hidden border-2 border-blue-500/30">
        {/* SYSTEM HEADER BACKGROUND IMAGE - Replace the div below with your image */}
        <div className="h-32 bg-gradient-to-r from-slate-900 via-blue-900/70 to-purple-900/70 relative">
          {/* <img src="/images/system-header-bg.jpg" alt="System Header" className="w-full h-full object-cover" /> */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
          <div className="absolute top-4 left-4 text-blue-400 font-mono text-lg">
            [ SOLO LEVELING SYSTEM ]
          </div>
          <div className="absolute bottom-4 right-4 text-white font-bold">
            STATUS INTERFACE v2.1
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Panel - Player Info */}
        <div className="lg:col-span-4 space-y-6">
          {/* Player Avatar Section */}
          <Card className="bg-slate-900/90 border-2 border-blue-500/40">
            <CardHeader className="text-center pb-2">
              <div className="relative">
                {/* PLAYER AVATAR IMAGE - Replace the div below with your avatar image */}
                <div className="w-24 h-24 mx-auto rounded-full border-4 border-blue-400 bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center text-2xl font-bold mb-4">
                  {/* <img src="/images/player-avatar.jpg" alt="Player Avatar" className="w-full h-full object-cover rounded-full" /> */}
                  {playerData.username.charAt(0)}
                </div>
                <Badge className={`${getRankColor(playerData.rank)} absolute -top-2 -right-2 text-white font-bold`}>
                  {playerData.rank}
                </Badge>
              </div>
              <CardTitle className="text-blue-400 font-mono">{playerData.username}</CardTitle>
              <CardDescription className="text-slate-300 flex items-center justify-center">
                <Crown className="w-4 h-4 mr-1 text-yellow-400" />
                {playerData.title}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 bg-slate-800/50 rounded">
                  <span className="text-slate-400">Level</span>
                  <span className="text-white font-bold text-xl">{playerData.level}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-slate-800/50 rounded">
                  <span className="text-slate-400">Guild</span>
                  <span className="text-white font-bold">{playerData.guild}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status Bars */}
          <Card className="bg-slate-900/90 border-2 border-green-500/40">
            <CardHeader>
              <CardTitle className="text-green-400 font-mono flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                VITAL STATUS
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span className="text-blue-300">EXP</span>
                  <span className="text-blue-300">{playerData.exp}/{playerData.expToNext}</span>
                </div>
                <Progress value={expPercentage} className="h-3 bg-slate-700" />
              </div>
              
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span className="text-red-300 flex items-center">
                    <Heart className="w-4 h-4 mr-1" />
                    HP
                  </span>
                  <span className="text-red-300">{playerData.hp}/{playerData.maxHp}</span>
                </div>
                <Progress value={hpPercentage} className="h-3 bg-red-900" />
              </div>
              
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span className="text-blue-300 flex items-center">
                    <Zap className="w-4 h-4 mr-1" />
                    MP
                  </span>
                  <span className="text-blue-300">{playerData.mp}/{playerData.maxMp}</span>
                </div>
                <Progress value={mpPercentage} className="h-3 bg-blue-900" />
              </div>
            </CardContent>
          </Card>

          {/* Achievement Gallery */}
          <Card className="bg-slate-900/90 border-2 border-yellow-500/40">
            <CardHeader>
              <CardTitle className="text-yellow-400 font-mono flex items-center">
                <Star className="w-5 h-5 mr-2" />
                ACHIEVEMENTS
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {/* ACHIEVEMENT IMAGES - Replace these divs with your achievement images */}
                <div className="aspect-square bg-slate-800/60 rounded border border-yellow-500/30 flex items-center justify-center text-xs text-slate-400">
                  {/* <img src="/images/achievement-1.jpg" alt="Achievement 1" className="w-full h-full object-cover rounded" /> */}
                  Achievement 1
                </div>
                <div className="aspect-square bg-slate-800/60 rounded border border-yellow-500/30 flex items-center justify-center text-xs text-slate-400">
                  {/* <img src="/images/achievement-2.jpg" alt="Achievement 2" className="w-full h-full object-cover rounded" /> */}
                  Achievement 2
                </div>
                <div className="aspect-square bg-slate-800/60 rounded border border-yellow-500/30 flex items-center justify-center text-xs text-slate-400">
                  {/* <img src="/images/achievement-3.jpg" alt="Achievement 3" className="w-full h-full object-cover rounded" /> */}
                  Achievement 3
                </div>
                <div className="aspect-square bg-slate-800/60 rounded border border-yellow-500/30 flex items-center justify-center text-xs text-slate-400">
                  {/* <img src="/images/achievement-4.jpg" alt="Achievement 4" className="w-full h-full object-cover rounded" /> */}
                  Achievement 4
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Center Panel - Stats */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="bg-slate-900/90 border-2 border-red-500/40">
            <CardHeader>
              <CardTitle className="text-red-400 font-mono flex items-center justify-between">
                <div className="flex items-center">
                  <Swords className="w-5 h-5 mr-2" />
                  COMBAT STATS
                </div>
                {playerData.availableStatPoints > 0 && (
                  <Badge variant="outline" className="text-blue-400 border-blue-400 font-mono">
                    {playerData.availableStatPoints} PTS
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <StatBar 
                name="STR" 
                value={playerData.stats.strength} 
                max={100} 
                color="red"
                icon={<Swords className="w-4 h-4" />}
                onAllocate={() => allocateStatPoint('strength')}
                canAllocate={playerData.availableStatPoints > 0}
              />
              <StatBar 
                name="AGI" 
                value={playerData.stats.agility} 
                max={100} 
                color="green"
                icon={<Zap className="w-4 h-4" />}
                onAllocate={() => allocateStatPoint('agility')}
                canAllocate={playerData.availableStatPoints > 0}
              />
              <StatBar 
                name="INT" 
                value={playerData.stats.intelligence} 
                max={100} 
                color="blue"
                icon={<Brain className="w-4 h-4" />}
                onAllocate={() => allocateStatPoint('intelligence')}
                canAllocate={playerData.availableStatPoints > 0}
              />
              <StatBar 
                name="VIT" 
                value={playerData.stats.vitality} 
                max={100} 
                color="purple"
                icon={<Heart className="w-4 h-4" />}
                onAllocate={() => allocateStatPoint('vitality')}
                canAllocate={playerData.availableStatPoints > 0}
              />
              <StatBar 
                name="END" 
                value={playerData.stats.endurance} 
                max={100} 
                color="yellow"
                icon={<Shield className="w-4 h-4" />}
                onAllocate={() => allocateStatPoint('endurance')}
                canAllocate={playerData.availableStatPoints > 0}
              />
              <StatBar 
                name="SEN" 
                value={playerData.stats.sense} 
                max={100} 
                color="orange"
                icon={<Eye className="w-4 h-4" />}
                onAllocate={() => allocateStatPoint('sense')}
                canAllocate={playerData.availableStatPoints > 0}
              />
            </CardContent>
          </Card>

          {/* Power Assessment */}
          <Card className="bg-slate-900/90 border-2 border-purple-500/40">
            <CardHeader>
              <CardTitle className="text-purple-400 font-mono flex items-center">
                <Target className="w-5 h-5 mr-2" />
                POWER ASSESSMENT
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center p-4 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded border border-purple-400/30">
                <div className="text-3xl font-bold text-purple-400 mb-2">
                  {Object.values(playerData.stats).reduce((sum, stat) => sum + stat, 0)}
                </div>
                <div className="text-slate-300 font-mono">TOTAL POWER POINTS</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Activities & Skills */}
        <div className="lg:col-span-3 space-y-6">
          {/* Daily Progress */}
          <Card className="bg-slate-900/90 border-2 border-orange-500/40">
            <CardHeader>
              <CardTitle className="text-orange-400 font-mono flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                DAILY PROGRESS
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-slate-800/50 rounded border border-green-500/30">
                  <div className="text-green-400 text-sm font-mono">QUESTS</div>
                  <div className="text-white font-bold">{playerData.dailyQuests.completed}/{playerData.dailyQuests.total}</div>
                </div>
                <div className="p-3 bg-slate-800/50 rounded border border-purple-500/30">
                  <div className="text-purple-400 text-sm font-mono">SHADOWS</div>
                  <div className="text-white font-bold">{playerData.shadowsArisen}</div>
                </div>
                <div className="p-3 bg-slate-800/50 rounded border border-blue-500/30">
                  <div className="text-blue-400 text-sm font-mono">RANK</div>
                  <div className="text-white font-bold">{playerData.rank}-CLASS</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills Preview */}
          <Card className="bg-slate-900/90 border-2 border-cyan-500/40">
            <CardHeader>
              <CardTitle className="text-cyan-400 font-mono flex items-center">
                <Flame className="w-5 h-5 mr-2" />
                SKILL PREVIEW
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {/* SKILL IMAGES - Replace these divs with your skill images */}
                <div className="aspect-square bg-slate-800/60 rounded border border-cyan-500/30 flex items-center justify-center text-xs text-slate-400">
                  {/* <img src="/images/skill-1.jpg" alt="Skill 1" className="w-full h-full object-cover rounded" /> */}
                  Shadow Extract
                </div>
                <div className="aspect-square bg-slate-800/60 rounded border border-cyan-500/30 flex items-center justify-center text-xs text-slate-400">
                  {/* <img src="/images/skill-2.jpg" alt="Skill 2" className="w-full h-full object-cover rounded" /> */}
                  Arise
                </div>
                <div className="aspect-square bg-slate-800/60 rounded border border-cyan-500/30 flex items-center justify-center text-xs text-slate-400">
                  {/* <img src="/images/skill-3.jpg" alt="Skill 3" className="w-full h-full object-cover rounded" /> */}
                  Domain
                </div>
                <div className="aspect-square bg-slate-800/60 rounded border border-cyan-500/30 flex items-center justify-center text-xs text-slate-400">
                  {/* <img src="/images/skill-4.jpg" alt="Skill 4" className="w-full h-full object-cover rounded" /> */}
                  Ruler's Authority
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Messages */}
          <Card className="bg-slate-900/90 border-2 border-green-500/40">
            <CardHeader>
              <CardTitle className="text-green-400 font-mono text-sm">SYSTEM LOG</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-xs font-mono">
                <div className="text-blue-400">› Level up available</div>
                <div className="text-green-400">› Daily quests updated</div>
                <div className="text-purple-400">› Shadow extracted</div>
                <div className="text-yellow-400">› New skill unlocked</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
