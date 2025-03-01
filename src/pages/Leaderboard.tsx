
import React, { useState, useEffect } from 'react';
import { Trophy, User, Shield, Search, ChevronUp, ChevronDown, Filter } from 'lucide-react';
import { usePlayer } from '@/context/PlayerContext';

type LeaderboardUser = {
  id: string;
  name: string;
  rank: string;
  level: number;
  totalQuests: number;
  power: number;
};

const Leaderboard = () => {
  const { name, rank, level } = usePlayer();
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'rank' | 'level' | 'quests' | 'power'>('level');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [isLoading, setIsLoading] = useState(true);

  // Generate fake leaderboard data
  useEffect(() => {
    const generateLeaderboard = () => {
      const names = ['Sung Jin-Woo', 'Go Gun-Hee', 'Choi Jong-In', 'Baek Yoon-Ho', 'Cha Hae-In', 
        'Thomas Andre', 'Liu Zhigang', 'Christopher Reed', 'Hwang Dong-Su', 'Min Byung-Gu',
        'Yoo Jin-Ho', 'Goto Ryuji', 'Park Heejin', 'Igris', 'Beru', 'Tusk', 'Iron', 'Tank'];
      
      const ranks = ['S', 'A', 'B', 'C', 'D', 'E'];
      const weights = [5, 10, 15, 25, 30, 15]; // Probability weights for each rank
      
      // Include current player in leaderboard
      const currentPlayer: LeaderboardUser = {
        id: 'current-player',
        name: name,
        rank: rank,
        level: level,
        totalQuests: Math.floor(Math.random() * 50) + 10,
        power: calculatePower(rank, level),
      };
      
      // Generate random users
      const randomUsers: LeaderboardUser[] = names.map((name, index) => {
        // Determine rank based on weighted probability
        let rankIndex = 0;
        const randNum = Math.random() * 100;
        let cumWeight = 0;
        
        for (let i = 0; i < weights.length; i++) {
          cumWeight += weights[i];
          if (randNum <= cumWeight) {
            rankIndex = i;
            break;
          }
        }
        
        const userRank = ranks[rankIndex];
        const userLevel = Math.floor(Math.random() * getRankMaxLevel(userRank)) + 1;
        
        return {
          id: `user-${index}`,
          name: name,
          rank: userRank,
          level: userLevel,
          totalQuests: Math.floor(Math.random() * 100) + 5,
          power: calculatePower(userRank, userLevel),
        };
      });
      
      // Combine and sort data
      const combinedData = [currentPlayer, ...randomUsers];
      return combinedData;
    };
    
    // Simulate loading time
    setTimeout(() => {
      const data = generateLeaderboard();
      setLeaderboardData(data);
      setIsLoading(false);
    }, 1000);
  }, [name, rank, level]);

  // Helper functions for power calculation
  const getRankMaxLevel = (rank: string): number => {
    switch (rank) {
      case 'S': return 50;
      case 'A': return 40;
      case 'B': return 30;
      case 'C': return 20;
      case 'D': return 15;
      default: return 10;
    }
  };
  
  const calculatePower = (rank: string, level: number): number => {
    const rankMultiplier = {
      'S': 1000,
      'A': 500,
      'B': 200,
      'C': 100,
      'D': 50,
      'E': 10
    }[rank] || 1;
    
    return rankMultiplier * level + Math.floor(Math.random() * 100);
  };

  // Sort and filter functionality
  const toggleSort = (key: 'rank' | 'level' | 'quests' | 'power') => {
    if (sortBy === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortDirection('desc');
    }
  };

  const getRankValue = (rank: string): number => {
    const rankValues: Record<string, number> = {
      'S': 6,
      'A': 5,
      'B': 4,
      'C': 3,
      'D': 2,
      'E': 1
    };
    return rankValues[rank] || 0;
  };

  const sortedData = [...leaderboardData]
    .filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === 'rank') {
        comparison = getRankValue(b.rank) - getRankValue(a.rank);
      } else if (sortBy === 'level') {
        comparison = b.level - a.level;
      } else if (sortBy === 'quests') {
        comparison = b.totalQuests - a.totalQuests;
      } else if (sortBy === 'power') {
        comparison = b.power - a.power;
      }
      
      return sortDirection === 'asc' ? -comparison : comparison;
    });

  const getSortIcon = (key: 'rank' | 'level' | 'quests' | 'power') => {
    if (sortBy !== key) return <Filter className="h-4 w-4 opacity-50" />;
    return sortDirection === 'asc' ? 
      <ChevronUp className="h-4 w-4" /> : 
      <ChevronDown className="h-4 w-4" />;
  };

  // Get medal for top 3 ranks
  const getMedal = (index: number) => {
    if (index === 0) return <Trophy className="h-5 w-5 text-yellow-400" />;
    if (index === 1) return <Trophy className="h-5 w-5 text-slate-400" />;
    if (index === 2) return <Trophy className="h-5 w-5 text-amber-700" />;
    return <span className="text-slate-400 ml-1">{index + 1}</span>;
  };

  return (
    <div className="sl-container pb-16 mx-auto px-4 md:px-8 sl-page-transition">
      <div className="mt-8 mb-12 text-center">
        <div className="inline-block px-3 py-1 rounded-full bg-sl-dark border border-sl-blue/30 text-sl-blue text-sm mb-3">
          Global Rankings
        </div>
        <h1 className="sl-heading mb-2">[Hunter Leaderboard]</h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          The strongest hunters from around the world, ranked by their level, completed quests and combat power.
        </p>
      </div>

      <div className="sl-card mb-8 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="search"
              className="bg-sl-grey-dark/50 border border-sl-grey-dark focus:ring-sl-blue focus:border-sl-blue block w-full pl-10 pr-3 py-2 rounded-md text-white"
              placeholder="Search hunters..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => toggleSort('level')}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-sm ${
                sortBy === 'level' ? 'bg-sl-blue text-sl-dark' : 'bg-sl-grey-dark text-slate-300'
              }`}
            >
              <span>Level</span>
              {getSortIcon('level')}
            </button>
            <button
              onClick={() => toggleSort('rank')}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-sm ${
                sortBy === 'rank' ? 'bg-sl-blue text-sl-dark' : 'bg-sl-grey-dark text-slate-300'
              }`}
            >
              <span>Rank</span>
              {getSortIcon('rank')}
            </button>
            <button
              onClick={() => toggleSort('quests')}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-sm ${
                sortBy === 'quests' ? 'bg-sl-blue text-sl-dark' : 'bg-sl-grey-dark text-slate-300'
              }`}
            >
              <span>Quests</span>
              {getSortIcon('quests')}
            </button>
            <button
              onClick={() => toggleSort('power')}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-sm ${
                sortBy === 'power' ? 'bg-sl-blue text-sl-dark' : 'bg-sl-grey-dark text-slate-300'
              }`}
            >
              <span>Power</span>
              {getSortIcon('power')}
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="sl-card py-16 text-center animate-pulse">
          <Trophy className="h-12 w-12 text-sl-blue mx-auto mb-4 animate-pulse" />
          <p className="text-slate-400">Loading hunter rankings...</p>
        </div>
      ) : (
        <div className="space-y-4 animate-fade-in">
          {sortedData.map((user, index) => (
            <div 
              key={user.id}
              className={`sl-card hover:sl-hover-effect flex items-center p-4 ${
                user.id === 'current-player' ? 'border border-sl-blue bg-sl-blue/5' : ''
              }`}
            >
              <div className="flex-shrink-0 w-8 text-center">
                {getMedal(index)}
              </div>
              
              <div className="ml-4 flex-grow">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-sl-grey-dark flex items-center justify-center">
                        <User className="h-5 w-5 text-slate-300" />
                      </div>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-white font-medium">
                        {user.name}
                        {user.id === 'current-player' && (
                          <span className="text-xs bg-sl-blue text-sl-dark px-2 py-0.5 rounded ml-2">You</span>
                        )}
                      </h3>
                    </div>
                  </div>
                  
                  <div className="flex items-center mt-2 sm:mt-0">
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4">
                      <div className="flex items-center">
                        <Shield className="h-4 w-4 text-sl-blue mr-1" />
                        <span className={`font-semibold mr-1 ${
                          user.rank === 'S' ? 'text-red-400' :
                          user.rank === 'A' ? 'text-orange-400' :
                          user.rank === 'B' ? 'text-purple-400' :
                          user.rank === 'C' ? 'text-blue-400' :
                          user.rank === 'D' ? 'text-green-400' :
                          'text-slate-400'
                        }`}>{user.rank}</span>
                        <span className="text-slate-300">Rank</span>
                      </div>
                      
                      <div className="text-slate-300">
                        <span className="font-semibold text-white mr-1">Lv. {user.level}</span>
                      </div>
                      
                      <div className="text-slate-300">
                        <span className="font-semibold text-white mr-1">{user.totalQuests}</span>
                        <span>Quests</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-2 flex items-center">
                  <div className="text-xs text-slate-400 mr-2">Power</div>
                  <div className="flex-grow h-1.5 bg-sl-grey-dark rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        user.rank === 'S' ? 'bg-red-400' :
                        user.rank === 'A' ? 'bg-orange-400' :
                        user.rank === 'B' ? 'bg-purple-400' :
                        user.rank === 'C' ? 'bg-blue-400' :
                        user.rank === 'D' ? 'bg-green-400' :
                        'bg-slate-400'
                      }`}
                      style={{ width: `${Math.min(100, (user.power / 10000) * 100)}%` }}
                    ></div>
                  </div>
                  <div className="text-xs font-semibold text-white ml-2">{user.power}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {!isLoading && sortedData.length === 0 && (
        <div className="sl-card py-10 text-center">
          <User className="h-10 w-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-white mb-1">No Hunters Found</h3>
          <p className="text-slate-400">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
