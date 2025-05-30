
import React, { useState, useEffect } from 'react';
import { usePlayer } from '@/context/PlayerContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, Sword, Shield, Clock, Trophy, Star } from 'lucide-react';
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
  const { level, stats, shadows, gainExp, gold } = usePlayer();
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
    for (let i = 0; i < 2; i++) {
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

  const canEnterGate = (gate: DungeonGate) => {
    return level >= gate.requirements.minLevel;
  };

  const calculateTeamPower = (teamIds: string[]) => {
    const arisenShadows = shadows.filter(s => s.arisen && teamIds.includes(s.id));
    const totalPower = arisenShadows.reduce((sum, shadow) => sum + shadow.power, 0);
    const playerPower = stats.reduce((sum, stat) => sum + stat.value, 0);
    return totalPower + playerPower;
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
  };

  const handleStartBattle = async () => {
    if (!selectedGate || selectedTeam.length < selectedGate.requirements.teamSize) {
      toast({
        title: "Invalid Team",
        description: `You need at least ${selectedGate.requirements.teamSize} team members.`,
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
      gainExp(selectedGate.rewards.exp);
      toast({
        title: "Victory!",
        description: `Successfully cleared ${selectedGate.name}! Gained ${selectedGate.rewards.exp} EXP and ${selectedGate.rewards.gold} gold.`,
        variant: "default",
      });

      // Remove cleared gate
      setGates(prev => prev.filter(g => g.id !== selectedGate.id));
    } else {
      toast({
        title: "Defeat",
        description: `Your team was defeated in ${selectedGate.name}. Train harder and try again!`,
        variant: "destructive",
      });
    }

    setIsInBattle(false);
    setSelectedGate(null);
    setSelectedTeam([]);
  };

  return (
    <div className="sl-container pb-16 mx-auto px-4 md:px-8 sl-page-transition">
      <div className="mt-8 mb-12 text-center">
        <div className="inline-block px-3 py-1 rounded-full bg-sl-dark border border-sl-blue/30 text-sl-blue text-sm mb-3">
          Dungeon Gates
        </div>
        <h1 className="sl-heading mb-2">Active Gates</h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Dungeon gates appear randomly around the world. Assemble your shadow army and clear them for rewards!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gates.map((gate) => (
          <Card key={gate.id} className="sl-card animate-fade-in relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <Badge className={`${getRankColor(gate.rank)} text-white font-bold`}>
                {gate.rank}-Rank
              </Badge>
            </div>
            
            <CardHeader>
              <CardTitle className="text-white text-lg pr-16">{gate.name}</CardTitle>
              <CardDescription className="text-slate-400">
                {gate.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center text-slate-300 text-sm">
                <MapPin className="w-4 h-4 mr-2 text-sl-blue" />
                {gate.location}
              </div>

              <div className="flex items-center text-slate-300 text-sm">
                <Clock className="w-4 h-4 mr-2 text-yellow-500" />
                Time remaining: {formatTime(gate.timeRemaining)}
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-slate-300 text-sm">
                  <Users className="w-4 h-4 mr-2 text-green-500" />
                  Team size: {gate.requirements.teamSize}
                </div>
                <div className="flex items-center text-slate-300 text-sm">
                  <Star className="w-4 h-4 mr-2 text-purple-500" />
                  Min level: {gate.requirements.minLevel}
                </div>
              </div>

              <div className="border-t border-sl-grey-dark pt-4">
                <h4 className="text-white font-medium mb-2 flex items-center">
                  <Trophy className="w-4 h-4 mr-2 text-yellow-500" />
                  Rewards
                </h4>
                <div className="space-y-1 text-sm text-slate-400">
                  <div>EXP: +{gate.rewards.exp}</div>
                  <div>Gold: +{gate.rewards.gold}</div>
                  <div>Items: {gate.rewards.items.join(', ')}</div>
                </div>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    className="w-full sl-button"
                    disabled={!canEnterGate(gate)}
                    onClick={() => handleEnterGate(gate)}
                  >
                    {canEnterGate(gate) ? 'Enter Gate' : `Level ${gate.requirements.minLevel} Required`}
                  </Button>
                </DialogTrigger>

                {selectedGate?.id === gate.id && (
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center">
                        <Badge className={`${getRankColor(gate.rank)} text-white font-bold mr-3`}>
                          {gate.rank}
                        </Badge>
                        {gate.name}
                      </DialogTitle>
                      <DialogDescription>
                        Select your team to enter this dungeon gate. Choose wisely based on the requirements.
                      </DialogDescription>
                    </DialogHeader>

                    <TeamSelector
                      gate={selectedGate}
                      selectedTeam={selectedTeam}
                      onTeamChange={setSelectedTeam}
                      calculateTeamPower={calculateTeamPower}
                    />

                    <div className="flex gap-3 pt-4">
                      <Button
                        onClick={handleStartBattle}
                        disabled={selectedTeam.length < gate.requirements.teamSize || isInBattle}
                        className="sl-button flex-1"
                      >
                        {isInBattle ? 'Fighting...' : 'Start Battle'}
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
        <div className="text-center py-12">
          <MapPin className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl text-slate-400 mb-2">No Active Gates</h3>
          <p className="text-slate-500">New dungeon gates will appear soon. Stay alert!</p>
        </div>
      )}
    </div>
  );
};

export default DungeonGates;
