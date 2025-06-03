import React, { useState, useEffect } from 'react';
import { useSupabasePlayer } from '@/hooks/useSupabasePlayer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, Sword, Shield, Clock, Trophy, Star, Zap } from 'lucide-react';
import TeamSelector from '@/components/TeamSelector';
import { useToast } from '@/hooks/use-toast';

type GateRank = 'E' | 'D' | 'C' | 'B' | 'A' | 'S';

interface DungeonGate {
  id: string;
  rank: GateRank;
  name: string;
  description: string;
  location: string;
  timeRemaining: number;
  requirements: {
    minLevel: number;
    teamSize: number;
    recommendedStats: {
      totalPower: number;
      minStrength: number;
      minAgility: number;
      minIntelligence: number;
    };
  };
  rewards: {
    exp: number;
    gold: number;
    items: string[];
  };
  difficulty: number;
}

const DungeonGates = () => {
  const { profile, stats, shadows, updateProfile, recordBattle } = useSupabasePlayer();
  const { toast } = useToast();
  const [gates, setGates] = useState<DungeonGate[]>([]);
  const [selectedGate, setSelectedGate] = useState<DungeonGate | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<string[]>([]);
  const [isInBattle, setIsInBattle] = useState(false);

  // Gate templates for different ranks
  const gateTemplates = {
    E: {
      names: ['Goblin Cave', 'Abandoned Mine', 'Spider Nest', 'Bandit Hideout'],
      minLevel: 1,
      teamSize: 2,
      difficulty: 1,
      rewards: { exp: 100, gold: 200, items: ['Health Potion', 'Basic Gear'] }
    },
    D: {
      names: ['Orc Stronghold', 'Undead Crypt', 'Wolf Den', 'Troll Bridge'],
      minLevel: 5,
      teamSize: 3,
      difficulty: 2,
      rewards: { exp: 250, gold: 500, items: ['Magic Weapon', 'Defense Scroll'] }
    },
    C: {
      names: ['Dragon Lair (Young)', 'Demon Portal', 'Giant Fortress', 'Elemental Shrine'],
      minLevel: 10,
      teamSize: 4,
      difficulty: 3,
      rewards: { exp: 500, gold: 1000, items: ['Rare Equipment', 'Skill Book'] }
    },
    B: {
      names: ['Ancient Temple', 'Shadow Realm', 'Titan Ruins', 'Crystal Cavern'],
      minLevel: 15,
      teamSize: 5,
      difficulty: 4,
      rewards: { exp: 1000, gold: 2000, items: ['Epic Gear', 'Power Crystal'] }
    },
    A: {
      names: ['Demon King Castle', 'Void Dimension', 'Phoenix Nest', 'Time Rift'],
      minLevel: 20,
      teamSize: 6,
      difficulty: 5,
      rewards: { exp: 2000, gold: 5000, items: ['Legendary Weapon', 'Ancient Relic'] }
    },
    S: {
      names: ['Dragon Emperor Throne', 'Chaos Dimension', 'God Beast Domain', 'Infinity Tower'],
      minLevel: 25,
      teamSize: 8,
      difficulty: 6,
      rewards: { exp: 5000, gold: 10000, items: ['Mythical Artifact', 'Divine Essence'] }
    }
  };

  const locations = [
    'Seoul Station', 'Gangnam District', 'Busan Port', 'Jeju Island',
    'DMZ Border', 'Mt. Jiri', 'Incheon Airport', 'Gwanghwamun Square'
  ];

  // Generate random gate
  const generateRandomGate = (): DungeonGate => {
    const ranks: GateRank[] = ['E', 'D', 'C', 'B', 'A', 'S'];
    const weights = [30, 25, 20, 15, 7, 3]; // Higher chance for lower ranks
    
    let randomNum = Math.random() * 100;
    let selectedRank: GateRank = 'E';
    
    for (let i = 0; i < ranks.length; i++) {
      if (randomNum < weights[i]) {
        selectedRank = ranks[i];
        break;
      }
      randomNum -= weights[i];
    }

    const template = gateTemplates[selectedRank];
    const randomName = template.names[Math.floor(Math.random() * template.names.length)];
    const randomLocation = locations[Math.floor(Math.random() * locations.length)];

    return {
      id: `gate-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      rank: selectedRank,
      name: randomName,
      description: `A ${selectedRank}-Rank dungeon has appeared! Clear it before time runs out.`,
      location: randomLocation,
      timeRemaining: 300 + Math.random() * 600, // 5-15 minutes
      requirements: {
        minLevel: template.minLevel,
        teamSize: template.teamSize,
        recommendedStats: {
          totalPower: template.difficulty * 50,
          minStrength: template.difficulty * 10,
          minAgility: template.difficulty * 8,
          minIntelligence: template.difficulty * 8,
        }
      },
      rewards: {
        exp: template.rewards.exp + Math.floor(Math.random() * template.rewards.exp * 0.5),
        gold: template.rewards.gold + Math.floor(Math.random() * template.rewards.gold * 0.3),
        items: template.rewards.items
      },
      difficulty: template.difficulty
    };
  };

  // Spawn gates randomly
  useEffect(() => {
    const spawnGate = () => {
      if (gates.length < 5) { // Max 5 gates at a time
        setGates(prev => [...prev, generateRandomGate()]);
      }
    };

    // Initial gates
    const initialGates = [];
    for (let i = 0; i < 3; i++) {
      initialGates.push(generateRandomGate());
    }
    setGates(initialGates);

    // Spawn new gates every 2-5 minutes
    const spawnInterval = setInterval(() => {
      if (Math.random() < 0.6) { // 60% chance to spawn
        spawnGate();
      }
    }, (2 + Math.random() * 3) * 60 * 1000);

    return () => clearInterval(spawnInterval);
  }, []);

  // Update gate timers
  useEffect(() => {
    const timer = setInterval(() => {
      setGates(prev => prev.map(gate => ({
        ...gate,
        timeRemaining: Math.max(0, gate.timeRemaining - 1)
      })).filter(gate => gate.timeRemaining > 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getRankColor = (rank: GateRank) => {
    const colors = {
      E: 'bg-gray-500',
      D: 'bg-green-500',
      C: 'bg-blue-500',
      B: 'bg-purple-500',
      A: 'bg-orange-500',
      S: 'bg-red-500'
    };
    return colors[rank];
  };

  const getRankGlow = (rank: GateRank) => {
    const glows = {
      E: 'shadow-gray-500/20',
      D: 'shadow-green-500/20',
      C: 'shadow-blue-500/20',
      B: 'shadow-purple-500/20',
      A: 'shadow-orange-500/20',
      S: 'shadow-red-500/20'
    };
    return glows[rank];
  };

  const canEnterGate = (gate: DungeonGate) => {
    return profile && profile.level >= gate.requirements.minLevel;
  };

  const calculateTeamPower = (teamIds: string[]) => {
    const arisenShadows = shadows.filter(s => s.arisen && teamIds.includes(s.id));
    const totalShadowPower = arisenShadows.reduce((sum, shadow) => sum + shadow.power, 0);
    const playerPower = stats ? (stats.strength + stats.agility + stats.intelligence + stats.vitality + stats.endurance) : 0;
    return totalShadowPower + playerPower;
  };

  const handleEnterGate = async (gate: DungeonGate) => {
    if (!canEnterGate(gate)) {
      toast({
        title: "Level Too Low",
        description: `You need to be at least level ${gate.requirements.minLevel} to enter this gate.`,
        variant: "destructive",
      });
      return;
    }

    setSelectedGate(gate);
    setSelectedTeam([]);
  };

  const handleStartBattle = async () => {
    if (!selectedGate || selectedTeam.length < selectedGate.requirements.teamSize || !profile) {
      toast({
        title: "Incomplete Team",
        description: `You need exactly ${selectedGate.requirements.teamSize} team members to enter this dungeon.`,
        variant: "destructive",
      });
      return;
    }

    setIsInBattle(true);

    // Calculate success chance based on team power vs gate difficulty
    const teamPower = calculateTeamPower(selectedTeam);
    const requiredPower = selectedGate.requirements.recommendedStats.totalPower;
    const successChance = Math.min(0.95, Math.max(0.1, teamPower / requiredPower));

    // Simulate battle time
    await new Promise(resolve => setTimeout(resolve, 3000));

    const success = Math.random() < successChance;

    if (success) {
      // Update player with rewards
      const newLevel = profile.level + Math.floor(selectedGate.rewards.exp / 100);
      const newExp = profile.exp + selectedGate.rewards.exp;
      const newGold = profile.gold + selectedGate.rewards.gold;

      await updateProfile({
        level: newLevel,
        exp: newExp,
        gold: newGold
      });

      // Record battle
      await recordBattle({
        gate_name: selectedGate.name,
        gate_rank: selectedGate.rank,
        team_power: teamPower,
        success: true,
        exp_gained: selectedGate.rewards.exp,
        gold_gained: selectedGate.rewards.gold,
        artifacts: selectedGate.rewards.items
      });

      toast({
        title: "🎉 Victory!",
        description: `Successfully cleared ${selectedGate.name}! Gained ${selectedGate.rewards.exp} EXP and ${selectedGate.rewards.gold} gold.`,
        variant: "default",
      });

      // Remove cleared gate
      setGates(prev => prev.filter(g => g.id !== selectedGate.id));
    } else {
      // Record failed battle
      await recordBattle({
        gate_name: selectedGate.name,
        gate_rank: selectedGate.rank,
        team_power: teamPower,
        success: false,
        exp_gained: 0,
        gold_gained: 0,
        artifacts: []
      });

      toast({
        title: "💀 Defeat",
        description: `Your team was defeated in ${selectedGate.name}. Train harder and try again!`,
        variant: "destructive",
      });
    }

    setIsInBattle(false);
    setSelectedGate(null);
    setSelectedTeam([]);
  };

  if (!profile || !stats) {
    return (
      <div className="sl-container pb-16 mx-auto px-4 md:px-8 sl-page-transition">
        <div className="text-center py-16">
          <MapPin className="w-12 h-12 text-sl-blue mx-auto mb-4 animate-pulse" />
          <p className="text-slate-400">Loading dungeon gates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="sl-container pb-16 mx-auto px-4 md:px-8 sl-page-transition">
      <div className="mt-8 mb-12 text-center">
        <div className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-sl-blue/20 to-sl-purple/20 border border-sl-blue/30 text-sl-blue text-sm mb-4">
          <MapPin className="w-4 h-4 inline mr-2" />
          Dungeon Gates System
        </div>
        <h1 className="sl-heading mb-4 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
          Active Gates
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
          Dungeon gates appear randomly around the world. Assemble your shadow army and clear them for massive rewards!
        </p>
        <div className="mt-6 flex justify-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-slate-300">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-slate-300">High Difficulty</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-3 h-3 text-yellow-500" />
            <span className="text-slate-300">Time Limited</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {gates.map((gate) => (
          <Card key={gate.id} className={`sl-card animate-fade-in relative overflow-hidden border-2 ${getRankColor(gate.rank).replace('bg-', 'border-')}/30 hover:${getRankColor(gate.rank).replace('bg-', 'border-')}/50 transition-all duration-300 ${getRankGlow(gate.rank)}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-sl-blue/5 to-sl-purple/5"></div>
            <div className="absolute top-4 right-4 z-10">
              <Badge className={`${getRankColor(gate.rank)} text-white font-bold text-lg px-3 py-1 shadow-lg`}>
                {gate.rank}-Rank
              </Badge>
            </div>
            
            <CardHeader className="relative z-10">
              <CardTitle className="text-white text-xl pr-20 mb-2">{gate.name}</CardTitle>
              <CardDescription className="text-slate-300 text-base">
                {gate.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 relative z-10">
              <div className="flex items-center text-slate-300">
                <MapPin className="w-4 h-4 mr-2 text-sl-blue" />
                <span className="font-medium">{gate.location}</span>
              </div>

              <div className="flex items-center text-slate-300">
                <Clock className="w-4 h-4 mr-2 text-yellow-500" />
                <span>Time remaining: </span>
                <span className="font-mono font-bold text-yellow-400 ml-1">
                  {formatTime(gate.timeRemaining)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 py-3 border-y border-sl-grey-dark/30">
                <div className="flex items-center text-slate-300">
                  <Users className="w-4 h-4 mr-2 text-green-500" />
                  <span className="text-sm">Team: {gate.requirements.teamSize}</span>
                </div>
                <div className="flex items-center text-slate-300">
                  <Star className="w-4 h-4 mr-2 text-purple-500" />
                  <span className="text-sm">Lv.{gate.requirements.minLevel}+</span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-white font-medium flex items-center">
                  <Trophy className="w-4 h-4 mr-2 text-yellow-500" />
                  Rewards
                </h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center">
                    <Zap className="w-3 h-3 mr-1 text-blue-400" />
                    <span className="text-blue-400">+{gate.rewards.exp} EXP</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-3 h-3 mr-1 text-yellow-400">💰</span>
                    <span className="text-yellow-400">+{gate.rewards.gold} Gold</span>
                  </div>
                </div>
                <div className="text-xs text-slate-400">
                  Items: {gate.rewards.items.join(', ')}
                </div>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    className={`w-full font-medium py-3 ${
                      canEnterGate(gate) 
                        ? `${getRankColor(gate.rank)} hover:opacity-90 text-white shadow-lg` 
                        : 'bg-slate-600 text-slate-300 cursor-not-allowed'
                    } transition-all duration-300`}
                    disabled={!canEnterGate(gate)}
                    onClick={() => handleEnterGate(gate)}
                  >
                    {canEnterGate(gate) ? (
                      <>
                        <Sword className="w-4 h-4 mr-2" />
                        Enter Gate
                      </>
                    ) : (
                      `Level ${gate.requirements.minLevel} Required`
                    )}
                  </Button>
                </DialogTrigger>

                {selectedGate?.id === gate.id && (
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-sl-dark border-sl-blue/30">
                    <DialogHeader>
                      <DialogTitle className="flex items-center text-2xl">
                        <Badge className={`${getRankColor(gate.rank)} text-white font-bold mr-3 text-lg px-3 py-1`}>
                          {gate.rank}
                        </Badge>
                        {gate.name}
                      </DialogTitle>
                      <DialogDescription className="text-slate-300 text-base">
                        Select your team carefully. Your success depends on your combined power and strategy.
                      </DialogDescription>
                    </DialogHeader>

                    <TeamSelector
                      gate={selectedGate}
                      selectedTeam={selectedTeam}
                      onTeamChange={setSelectedTeam}
                      calculateTeamPower={calculateTeamPower}
                    />

                    <div className="flex gap-3 pt-6 border-t border-sl-grey-dark/30">
                      <Button
                        onClick={handleStartBattle}
                        disabled={selectedTeam.length < gate.requirements.teamSize || isInBattle}
                        className="sl-button flex-1 bg-gradient-to-r from-sl-blue to-sl-purple hover:from-sl-blue-dark hover:to-sl-purple-dark text-white font-medium py-3"
                      >
                        {isInBattle ? (
                          <>
                            <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                            Fighting...
                          </>
                        ) : (
                          <>
                            <Sword className="w-4 h-4 mr-2" />
                            Start Battle
                          </>
                        )}
                      </Button>
                    </div>
                  </DialogContent>
                )}
              </Dialog>
            </CardContent>
          </Card>
        ))}
      </div>

      {gates.length === 0 && (
        <div className="text-center py-16">
          <div className="relative">
            <MapPin className="w-20 h-20 text-slate-600 mx-auto mb-6 animate-pulse" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-sl-blue/20 to-transparent blur-xl"></div>
          </div>
          <h3 className="text-2xl text-slate-400 mb-3 font-medium">No Active Gates</h3>
          <p className="text-slate-500 text-lg">New dungeon gates will appear soon. Stay alert, Hunter!</p>
          <div className="mt-6 text-sm text-slate-600">
            Gates spawn every 2-5 minutes
          </div>
        </div>
      )}
    </div>
  );
};

export default DungeonGates;
