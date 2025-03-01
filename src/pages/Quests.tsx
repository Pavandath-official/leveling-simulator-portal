
import React, { useState } from 'react';
import { usePlayer } from '@/context/PlayerContext';
import { 
  Target, Award, XCircle, Clock, ChevronDown, ChevronUp, 
  Check, Zap, Coins, Package, ArrowRight 
} from 'lucide-react';
import StatBar from '@/components/StatBar';

const difficultyColors = {
  E: 'text-slate-400',
  D: 'text-green-400',
  C: 'text-blue-400',
  B: 'text-purple-400',
  A: 'text-orange-400',
  S: 'text-red-400'
};

const difficultyBorders = {
  E: 'border-slate-400',
  D: 'border-green-400',
  C: 'border-blue-400',
  B: 'border-purple-400',
  A: 'border-orange-400',
  S: 'border-red-400'
};

const Quests = () => {
  const { quests, completeQuest, rank } = usePlayer();
  const [expandedQuest, setExpandedQuest] = useState<string | null>(null);
  const [filter, setFilter] = useState<string | null>(null);

  const toggleQuest = (id: string) => {
    if (expandedQuest === id) {
      setExpandedQuest(null);
    } else {
      setExpandedQuest(id);
    }
  };

  const filteredQuests = filter 
    ? quests.filter(quest => quest.difficulty === filter)
    : quests;

  const availableQuests = filteredQuests.filter(quest => !quest.completed);
  const completedQuests = filteredQuests.filter(quest => quest.completed);

  const rankToDifficultyMap: Record<string, string[]> = {
    'E': ['E'],
    'D': ['E', 'D'],
    'C': ['E', 'D', 'C'],
    'B': ['E', 'D', 'C', 'B'],
    'A': ['E', 'D', 'C', 'B', 'A'],
    'S': ['E', 'D', 'C', 'B', 'A', 'S']
  };
  
  const availableDifficulties = rankToDifficultyMap[rank] || ['E'];

  return (
    <div className="sl-container pb-16 mx-auto px-4 md:px-8 sl-page-transition">
      <div className="mt-8 mb-12 text-center">
        <div className="inline-block px-3 py-1 rounded-full bg-sl-dark border border-sl-blue/30 text-sl-blue text-sm mb-3">
          Hunter Assignment
        </div>
        <h1 className="sl-heading mb-2">[Quest Board]</h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Accept and complete quests to earn experience, gold and items. Higher rank quests offer better rewards but are more challenging.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="sl-card animate-fade-in">
            <h3 className="text-lg font-bold text-white mb-3 flex items-center">
              <Award className="text-sl-blue mr-2 w-5 h-5" />
              Quest Filters
            </h3>
            <p className="text-slate-400 text-sm mb-5">
              Filter quests by difficulty level. Your current rank allows you to accept 
              quests up to {rank}-Rank.
            </p>

            <div className="space-y-2">
              <button
                onClick={() => setFilter(null)}
                className={`w-full text-left px-4 py-3 rounded-md flex items-center justify-between transition-all duration-200 ${
                  filter === null 
                    ? 'bg-sl-blue text-sl-dark font-medium' 
                    : 'bg-sl-grey-dark/30 text-slate-300 hover:bg-sl-grey-dark/50'
                }`}
              >
                <span>All Quests</span>
                {filter === null && <Check className="w-4 h-4" />}
              </button>
              
              {['E', 'D', 'C', 'B', 'A', 'S'].map((difficulty) => (
                <button
                  key={difficulty}
                  onClick={() => setFilter(difficulty)}
                  disabled={!availableDifficulties.includes(difficulty)}
                  className={`w-full text-left px-4 py-3 rounded-md flex items-center justify-between transition-all duration-200 ${
                    filter === difficulty 
                      ? 'bg-sl-blue text-sl-dark font-medium' 
                      : 'bg-sl-grey-dark/30 text-slate-300 hover:bg-sl-grey-dark/50'
                  } ${!availableDifficulties.includes(difficulty) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center">
                    <span className={`mr-2 ${difficultyColors[difficulty as keyof typeof difficultyColors]}`}>
                      {difficulty}
                    </span>
                    <span>Rank Quests</span>
                  </div>
                  {filter === difficulty && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>

          <div className="sl-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <h3 className="text-lg font-bold text-white mb-3 flex items-center">
              <Target className="text-sl-blue mr-2 w-5 h-5" />
              Quest Status
            </h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-slate-300">Available</span>
                  <span className="text-sm text-slate-300">{availableQuests.length}</span>
                </div>
                <div className="h-2 w-full bg-sl-grey-dark rounded-full overflow-hidden">
                  <div
                    className="h-full bg-sl-blue rounded-full"
                    style={{ width: `${(availableQuests.length / quests.length) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-slate-300">Completed</span>
                  <span className="text-sm text-slate-300">{completedQuests.length}</span>
                </div>
                <div className="h-2 w-full bg-sl-grey-dark rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full"
                    style={{ width: `${(completedQuests.length / quests.length) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="pt-2 border-t border-sl-grey-dark">
                <div className="flex justify-between text-sm text-slate-300 mb-2">
                  <span>Total Quests Completed</span>
                  <span>{completedQuests.length}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-300">
                  <span>Completion Rate</span>
                  <span>{Math.round((completedQuests.length / quests.length) * 100)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-8">
          {availableQuests.length > 0 && (
            <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <h3 className="text-xl font-bold text-white mb-5 flex items-center">
                <Clock className="text-sl-blue mr-2 w-5 h-5" />
                Available Quests
              </h3>

              <div className="space-y-4">
                {availableQuests.map((quest) => (
                  <div 
                    key={quest.id}
                    className={`sl-card hover:sl-hover-effect ${
                      expandedQuest === quest.id ? 'sl-border-glow' : ''
                    } border-l-4 ${difficultyBorders[quest.difficulty as keyof typeof difficultyBorders]}`}
                  >
                    <div 
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => toggleQuest(quest.id)}
                    >
                      <div className="flex items-center">
                        <div className={`w-12 h-12 flex items-center justify-center rounded mr-4 bg-sl-grey-dark font-bold ${difficultyColors[quest.difficulty as keyof typeof difficultyColors]}`}>
                          {quest.difficulty}
                        </div>
                        <div>
                          <h4 className="font-medium text-white text-lg">{quest.title}</h4>
                          <div className="flex items-center mt-1 space-x-2">
                            <span className="text-xs bg-sl-dark px-2 py-0.5 rounded text-slate-300 flex items-center">
                              <Zap className="w-3 h-3 mr-1 text-sl-blue" />
                              {quest.rewards.exp} EXP
                            </span>
                            {quest.rewards.gold && (
                              <span className="text-xs bg-sl-dark px-2 py-0.5 rounded text-slate-300 flex items-center">
                                <Coins className="w-3 h-3 mr-1 text-yellow-400" />
                                {quest.rewards.gold} Gold
                              </span>
                            )}
                            {quest.rewards.items && quest.rewards.items.length > 0 && (
                              <span className="text-xs bg-sl-dark px-2 py-0.5 rounded text-slate-300 flex items-center">
                                <Package className="w-3 h-3 mr-1 text-purple-400" />
                                {quest.rewards.items.length} {quest.rewards.items.length === 1 ? 'Item' : 'Items'}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div>
                        {expandedQuest === quest.id ? (
                          <ChevronUp className="w-5 h-5 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                    </div>
                    
                    {expandedQuest === quest.id && (
                      <div className="mt-4 pt-4 border-t border-sl-grey-dark animate-fade-in">
                        <p className="text-slate-300 mb-4">
                          {quest.description}
                        </p>
                        
                        <div className="mb-4">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-slate-300">Progress</span>
                            <span className="text-sm text-slate-300">{quest.progress}%</span>
                          </div>
                          <StatBar 
                            name="" 
                            value={quest.progress} 
                            max={100} 
                            color="bg-sl-blue" 
                            showValue={false} 
                          />
                        </div>
                        
                        <div className="flex flex-col sm:flex-row justify-between items-center">
                          <div className="mb-4 sm:mb-0">
                            <h5 className="text-white font-medium mb-1">Rewards:</h5>
                            <div className="flex flex-wrap gap-2">
                              <div className="flex items-center bg-sl-dark px-3 py-1.5 rounded-md text-sm">
                                <Zap className="w-4 h-4 mr-1 text-sl-blue" />
                                <span className="text-white">{quest.rewards.exp} EXP</span>
                              </div>
                              
                              {quest.rewards.gold && (
                                <div className="flex items-center bg-sl-dark px-3 py-1.5 rounded-md text-sm">
                                  <Coins className="w-4 h-4 mr-1 text-yellow-400" />
                                  <span className="text-white">{quest.rewards.gold} Gold</span>
                                </div>
                              )}
                              
                              {quest.rewards.items && quest.rewards.items.map((item, index) => (
                                <div key={index} className="flex items-center bg-sl-dark px-3 py-1.5 rounded-md text-sm">
                                  <Package className="w-4 h-4 mr-1 text-purple-400" />
                                  <span className="text-white">{item}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <button
                            onClick={() => completeQuest(quest.id)}
                            className="sl-button"
                          >
                            <span>Complete Quest</span>
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {completedQuests.length > 0 && (
            <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <h3 className="text-xl font-bold text-white mb-5 flex items-center">
                <Check className="text-green-400 mr-2 w-5 h-5" />
                Completed Quests
              </h3>

              <div className="space-y-4">
                {completedQuests.map((quest) => (
                  <div 
                    key={quest.id}
                    className={`sl-card hover:sl-hover-effect opacity-80 border-l-4 border-green-500 ${
                      expandedQuest === quest.id ? 'sl-border-glow' : ''
                    }`}
                  >
                    <div 
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => toggleQuest(quest.id)}
                    >
                      <div className="flex items-center">
                        <div className="w-12 h-12 flex items-center justify-center rounded mr-4 bg-green-500/20 text-green-500">
                          <Check className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-medium text-white text-lg">{quest.title}</h4>
                          <div className="flex items-center mt-1">
                            <span className="text-xs bg-sl-dark px-2 py-0.5 rounded text-slate-300 flex items-center">
                              <Zap className="w-3 h-3 mr-1 text-sl-blue" />
                              {quest.rewards.exp} EXP
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="text-green-400 text-sm mr-2">Completed</span>
                        {expandedQuest === quest.id ? (
                          <ChevronUp className="w-5 h-5 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                    </div>
                    
                    {expandedQuest === quest.id && (
                      <div className="mt-4 pt-4 border-t border-sl-grey-dark animate-fade-in">
                        <p className="text-slate-300 mb-4">
                          {quest.description}
                        </p>
                        
                        <div className="mb-4">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-slate-300">Progress</span>
                            <span className="text-sm text-green-400">100%</span>
                          </div>
                          <StatBar 
                            name="" 
                            value={100} 
                            max={100} 
                            color="bg-green-500" 
                            showValue={false} 
                          />
                        </div>
                        
                        <div>
                          <h5 className="text-white font-medium mb-1">Rewards Earned:</h5>
                          <div className="flex flex-wrap gap-2">
                            <div className="flex items-center bg-sl-dark px-3 py-1.5 rounded-md text-sm">
                              <Zap className="w-4 h-4 mr-1 text-sl-blue" />
                              <span className="text-white">{quest.rewards.exp} EXP</span>
                            </div>
                            
                            {quest.rewards.gold && (
                              <div className="flex items-center bg-sl-dark px-3 py-1.5 rounded-md text-sm">
                                <Coins className="w-4 h-4 mr-1 text-yellow-400" />
                                <span className="text-white">{quest.rewards.gold} Gold</span>
                              </div>
                            )}
                            
                            {quest.rewards.items && quest.rewards.items.map((item, index) => (
                              <div key={index} className="flex items-center bg-sl-dark px-3 py-1.5 rounded-md text-sm">
                                <Package className="w-4 h-4 mr-1 text-purple-400" />
                                <span className="text-white">{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {availableQuests.length === 0 && completedQuests.length === 0 && (
            <div className="sl-card text-center py-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <XCircle className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No Quests Available</h3>
              <p className="text-slate-400 max-w-md mx-auto">
                There are no quests matching your current filter. Try changing the filter or check back later.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quests;
