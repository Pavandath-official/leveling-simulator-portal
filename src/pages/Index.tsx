import React from 'react';
import { usePlayer } from '@/context/PlayerContext';
import StatBar from '@/components/StatBar';
import { Shield, Zap, Brain, Heart, Clock, User, Star, Coins, Target, MapPin } from 'lucide-react';

const Index = () => {
  const { name, level, exp, expToNextLevel, stats, rank, gold } = usePlayer();

  return (
    <div className="sl-container pb-16 mx-auto px-4 md:px-8 sl-page-transition">
      <div className="mt-8 mb-12 text-center">
        <div className="inline-block px-3 py-1 rounded-full bg-sl-dark border border-sl-blue/30 text-sl-blue text-sm mb-3">
          Hunter Info
        </div>
        <h1 className="sl-heading mb-2">[Hunter: {name}]</h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          View your current stats, rank and progress. Level up by completing quests
          and defeating monsters.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="sl-card animate-fade-in relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 z-0">
              <img 
                src="/images/solo-leveling-system.jpg" 
                alt="System Background" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="relative z-10">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-14 h-14 rounded-md bg-sl-dark border border-sl-blue text-sl-blue font-bold text-xl mr-5 animate-pulse-glow">
                  {rank}
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Hunter Name</p>
                  <h2 className="text-white text-xl font-bold">{name}</h2>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center space-x-3 bg-sl-grey-dark/30 p-3 rounded-md border border-sl-grey-dark/50">
                  <User className="text-sl-blue w-5 h-5" />
                  <div>
                    <p className="text-xs text-slate-400">Level</p>
                    <p className="text-white font-semibold">{level}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 bg-sl-grey-dark/30 p-3 rounded-md border border-sl-grey-dark/50">
                  <Star className="text-yellow-400 w-5 h-5" />
                  <div>
                    <p className="text-xs text-slate-400">Rank</p>
                    <p className="text-white font-semibold">{rank}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 bg-sl-grey-dark/30 p-3 rounded-md border border-sl-grey-dark/50">
                  <Zap className="text-sl-purple w-5 h-5" />
                  <div>
                    <p className="text-xs text-slate-400">EXP</p>
                    <p className="text-white font-semibold">{exp} / {expToNextLevel}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 bg-sl-grey-dark/30 p-3 rounded-md border border-sl-grey-dark/50">
                  <Coins className="text-yellow-400 w-5 h-5" />
                  <div>
                    <p className="text-xs text-slate-400">Gold</p>
                    <p className="text-white font-semibold">{gold}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <StatBar 
                  name="Experience" 
                  value={exp} 
                  max={expToNextLevel} 
                  color="bg-sl-purple" 
                />
              </div>
            </div>
          </div>

          <div className="sl-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <h3 className="text-lg font-bold text-white mb-3 flex items-center">
              <Clock className="text-sl-blue mr-2 w-5 h-5" />
              Hunter Progression
            </h3>
            <p className="text-slate-400 text-sm mb-4">
              Your journey as a hunter has just begun. Complete quests to increase your rank and unlock new abilities.
            </p>
            
            <div className="relative pt-2">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 rounded-full bg-sl-blue text-sl-dark flex items-center justify-center font-bold text-sm mr-3">
                  E
                </div>
                <div className="flex-1">
                  <div className="h-2 w-full bg-sl-grey-dark rounded-full overflow-hidden">
                    <div
                      className="h-full bg-sl-blue rounded-full"
                      style={{ width: rank === 'E' ? `${(level / 5) * 100}%` : '100%' }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center mb-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mr-3 ${
                  rank !== 'E' ? 'bg-sl-blue text-sl-dark' : 'bg-sl-grey-dark/50 text-slate-400'
                }`}>
                  D
                </div>
                <div className="flex-1">
                  <div className="h-2 w-full bg-sl-grey-dark rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${rank !== 'E' ? 'bg-sl-blue' : 'bg-sl-grey-dark/30'}`}
                      style={{ width: rank === 'D' ? `${((level - 5) / 5) * 100}%` : (rank === 'E' ? '0%' : '100%') }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center mb-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mr-3 ${
                  rank !== 'E' && rank !== 'D' ? 'bg-sl-blue text-sl-dark' : 'bg-sl-grey-dark/50 text-slate-400'
                }`}>
                  C
                </div>
                <div className="flex-1">
                  <div className="h-2 w-full bg-sl-grey-dark rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${rank !== 'E' && rank !== 'D' ? 'bg-sl-blue' : 'bg-sl-grey-dark/30'}`}
                      style={{ width: rank === 'C' ? `${((level - 10) / 5) * 100}%` : (rank === 'E' || rank === 'D' ? '0%' : '100%') }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center mb-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mr-3 ${
                  rank !== 'E' && rank !== 'D' && rank !== 'C' ? 'bg-sl-blue text-sl-dark' : 'bg-sl-grey-dark/50 text-slate-400'
                }`}>
                  B
                </div>
                <div className="flex-1">
                  <div className="h-2 w-full bg-sl-grey-dark rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${rank !== 'E' && rank !== 'D' && rank !== 'C' ? 'bg-sl-blue' : 'bg-sl-grey-dark/30'}`}
                      style={{ width: rank === 'B' ? `${((level - 15) / 5) * 100}%` : (rank === 'E' || rank === 'D' || rank === 'C' ? '0%' : '100%') }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mr-3 ${
                  rank === 'A' || rank === 'S' ? 'bg-sl-blue text-sl-dark' : 'bg-sl-grey-dark/50 text-slate-400'
                }`}>
                  A
                </div>
                <div className="flex-1">
                  <div className="h-2 w-full bg-sl-grey-dark rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${rank === 'A' || rank === 'S' ? 'bg-sl-blue' : 'bg-sl-grey-dark/30'}`}
                      style={{ width: rank === 'A' ? `${((level - 20) / 5) * 100}%` : (rank === 'S' ? '100%' : '0%') }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="sl-card animate-fade-in relative overflow-hidden" style={{ animationDelay: '0.2s' }}>
            <div className="absolute inset-0 opacity-5 z-0">
              <img 
                src="/images/solo-leveling-stats.jpg" 
                alt="Stats Background" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="relative z-10">
              <h3 className="text-lg font-bold text-white mb-5 flex items-center">
                <Shield className="text-sl-blue mr-2 w-5 h-5" />
                Hunter Statistics
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  {stats.slice(0, 3).map((stat) => (
                    <div key={stat.name} className="mb-6">
                      <div className="flex items-center mb-2">
                        {stat.name === 'Strength' && <Shield className="text-red-500 w-5 h-5 mr-2" />}
                        {stat.name === 'Agility' && <Zap className="text-green-500 w-5 h-5 mr-2" />}
                        {stat.name === 'Intelligence' && <Brain className="text-blue-500 w-5 h-5 mr-2" />}
                        <h4 className="text-white font-medium">{stat.name}</h4>
                      </div>
                      <StatBar 
                        name="" 
                        value={stat.value} 
                        max={stat.max} 
                        color={stat.color} 
                      />
                      <p className="text-xs text-slate-400 mt-1">
                        {stat.name === 'Strength' && 'Affects physical damage and carrying capacity'}
                        {stat.name === 'Agility' && 'Affects movement speed and attack speed'}
                        {stat.name === 'Intelligence' && 'Affects magical abilities and skill cooldowns'}
                      </p>
                    </div>
                  ))}
                </div>
                
                <div>
                  {stats.slice(3).map((stat) => (
                    <div key={stat.name} className="mb-6">
                      <div className="flex items-center mb-2">
                        {stat.name === 'Vitality' && <Heart className="text-yellow-500 w-5 h-5 mr-2" />}
                        {stat.name === 'Endurance' && <Clock className="text-purple-500 w-5 h-5 mr-2" />}
                        <h4 className="text-white font-medium">{stat.name}</h4>
                      </div>
                      <StatBar 
                        name="" 
                        value={stat.value} 
                        max={stat.max} 
                        color={stat.color} 
                      />
                      <p className="text-xs text-slate-400 mt-1">
                        {stat.name === 'Vitality' && 'Affects health points and healing rate'}
                        {stat.name === 'Endurance' && 'Affects stamina and resistance to debuffs'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="sl-card animate-fade-in relative overflow-hidden" style={{ animationDelay: '0.3s' }}>
            <div className="absolute inset-0 opacity-5 z-0">
              <img 
                src="/images/solo-leveling-hunter.jpg" 
                alt="Hunter Background" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="relative z-10">
              <h3 className="text-lg font-bold text-white mb-5 flex items-center">
                <User className="text-sl-blue mr-2 w-5 h-5" />
                Hunter Overview
              </h3>
              
              <div className="prose prose-sm prose-invert max-w-none">
                <p>
                  As a newly awakened hunter, you have been granted access to the System Interface. 
                  This interface will help you track your progress, manage your skills, and accept quests.
                </p>
                
                <p>
                  Currently, you are ranked as an <span className="text-sl-blue font-semibold">E-Rank</span> hunter. 
                  Complete quests and gain experience to increase your level and rank.
                </p>
                
                <p>
                  Your stats are balanced, but focusing on specific attributes may unlock specialized 
                  skills and abilities. Visit the Skills page to view your current abilities.
                </p>
              </div>
              
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <a 
                  href="/skills" 
                  className="sl-button group transition-all"
                >
                  <Zap className="w-5 h-5 mr-2 group-hover:text-sl-dark" />
                  <span>View Skills</span>
                </a>
                
                <a 
                  href="/quests" 
                  className="sl-button group transition-all"
                >
                  <Target className="w-5 h-5 mr-2 group-hover:text-sl-dark" />
                  <span>Available Quests</span>
                </a>

                <a 
                  href="/dungeon-gates" 
                  className="sl-button group transition-all"
                >
                  <MapPin className="w-5 h-5 mr-2 group-hover:text-sl-dark" />
                  <span>Dungeon Gates</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
