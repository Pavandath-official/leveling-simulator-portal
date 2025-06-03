
import React from 'react';
import { useSupabasePlayer } from '@/hooks/useSupabasePlayer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Users, Sword, Shield, Zap, User, Star } from 'lucide-react';

interface DungeonGate {
  id: string;
  rank: string;
  name: string;
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
}

interface TeamSelectorProps {
  gate: DungeonGate;
  selectedTeam: string[];
  onTeamChange: (team: string[]) => void;
  calculateTeamPower: (teamIds: string[]) => number;
}

const TeamSelector: React.FC<TeamSelectorProps> = ({
  gate,
  selectedTeam,
  onTeamChange,
  calculateTeamPower,
}) => {
  const { profile, stats, shadows } = useSupabasePlayer();

  const arisenShadows = shadows.filter(shadow => shadow.arisen);
  const teamPower = calculateTeamPower(selectedTeam);
  const requiredPower = gate.requirements.recommendedStats.totalPower;
  const powerRatio = teamPower / requiredPower;

  const handleShadowToggle = (shadowId: string, checked: boolean) => {
    if (checked) {
      if (selectedTeam.length < gate.requirements.teamSize) {
        onTeamChange([...selectedTeam, shadowId]);
      }
    } else {
      onTeamChange(selectedTeam.filter(id => id !== shadowId));
    }
  };

  const getSuccessChance = () => {
    const chance = Math.min(95, Math.max(10, powerRatio * 100));
    return Math.round(chance);
  };

  const getSuccessColor = () => {
    const chance = getSuccessChance();
    if (chance >= 80) return 'text-green-400';
    if (chance >= 60) return 'text-yellow-400';
    if (chance >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  if (!profile || !stats) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-400">Loading player data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Team Leader (Player) */}
      <Card className="sl-card">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <User className="w-5 h-5 mr-2 text-sl-blue" />
            Team Leader
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-medium">{profile.username}</h3>
              <p className="text-slate-400 text-sm">Level {profile.level} Hunter</p>
            </div>
            <div className="text-right">
              <div className="text-slate-300 text-sm">Total Stats</div>
              <div className="text-white font-medium">
                {stats.strength + stats.agility + stats.intelligence + stats.vitality + stats.endurance}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
            <div className="text-center">
              <div className="text-red-400">STR</div>
              <div className="text-white">{stats.strength}</div>
            </div>
            <div className="text-center">
              <div className="text-green-400">AGI</div>
              <div className="text-white">{stats.agility}</div>
            </div>
            <div className="text-center">
              <div className="text-blue-400">INT</div>
              <div className="text-white">{stats.intelligence}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Shadows */}
      <Card className="sl-card">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <Users className="w-5 h-5 mr-2 text-sl-purple" />
            Shadow Army ({selectedTeam.length}/{gate.requirements.teamSize})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {arisenShadows.length === 0 ? (
            <div className="text-center py-6">
              <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">No arisen shadows available</p>
              <p className="text-slate-500 text-sm">Visit Shadow Army to arise shadows for battle</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {arisenShadows.map((shadow) => (
                <div
                  key={shadow.id}
                  className={`border rounded-lg p-3 transition-colors ${
                    selectedTeam.includes(shadow.id)
                      ? 'border-sl-blue bg-sl-blue/10'
                      : 'border-sl-grey-dark bg-sl-grey-dark/20'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      checked={selectedTeam.includes(shadow.id)}
                      onCheckedChange={(checked) => 
                        handleShadowToggle(shadow.id, checked as boolean)
                      }
                      disabled={
                        !selectedTeam.includes(shadow.id) && 
                        selectedTeam.length >= gate.requirements.teamSize
                      }
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-white font-medium text-sm">{shadow.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          Lv.{shadow.level}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-xs capitalize">{shadow.type}</span>
                        <div className="flex items-center text-xs">
                          <Sword className="w-3 h-3 mr-1 text-orange-400" />
                          <span className="text-white">{shadow.power}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Team Analysis */}
      <Card className="sl-card">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <Star className="w-5 h-5 mr-2 text-yellow-500" />
            Battle Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-slate-400 text-sm">Team Power</div>
              <div className="text-white font-medium">{teamPower}</div>
            </div>
            <div>
              <div className="text-slate-400 text-sm">Required Power</div>
              <div className="text-white font-medium">{requiredPower}</div>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-slate-400 text-sm">Power Ratio</span>
              <span className={`text-sm font-medium ${getSuccessColor()}`}>
                {Math.round(powerRatio * 100)}%
              </span>
            </div>
            <div className="w-full bg-sl-grey-dark rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  powerRatio >= 1 ? 'bg-green-500' : 
                  powerRatio >= 0.8 ? 'bg-yellow-500' : 
                  powerRatio >= 0.6 ? 'bg-orange-500' : 'bg-red-500'
                }`}
                style={{ width: `${Math.min(100, powerRatio * 100)}%` }}
              ></div>
            </div>
          </div>

          <div className="text-center">
            <div className="text-slate-400 text-sm mb-1">Estimated Success Rate</div>
            <div className={`text-2xl font-bold ${getSuccessColor()}`}>
              {getSuccessChance()}%
            </div>
          </div>

          {selectedTeam.length < gate.requirements.teamSize && (
            <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
              <p className="text-orange-400 text-sm text-center">
                Select {gate.requirements.teamSize - selectedTeam.length} more team member(s) to proceed
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamSelector;
