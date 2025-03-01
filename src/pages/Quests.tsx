
import React, { useState } from 'react';
import { usePlayer } from '@/context/PlayerContext';
import { 
  Target, Award, XCircle, Clock, ChevronDown, ChevronUp, 
  Check, Zap, Coins, Package, ArrowRight, Edit2, PlusCircle,
  RefreshCw, Dumbbell, Heart
} from 'lucide-react';
import StatBar from '@/components/StatBar';
import CustomQuestForm from '@/components/CustomQuestForm';
import EditQuestForm from '@/components/EditQuestForm';

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

const exerciseTypeIcons = {
  strength: <Dumbbell className="w-4 h-4 mr-1" />,
  cardio: <Heart className="w-4 h-4 mr-1" />,
  flexibility: <RefreshCw className="w-4 h-4 mr-1" />,
  endurance: <Clock className="w-4 h-4 mr-1" />
};

const Quests = () => {
  const { quests, completeQuest, rank, resetDailyQuests } = usePlayer();
  const [expandedQuest, setExpandedQuest] = useState<string | null>(null);
  const [filter, setFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<'all' | 'daily' | 'normal'>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingQuest, setEditingQuest] = useState<{id: string, title: string, description: string} | null>(null);

  const toggleQuest = (id: string) => {
    if (expandedQuest === id) {
      setExpandedQuest(null);
    } else {
      setExpandedQuest(id);
    }
  };

  // Get the last reset time from localStorage
  const getLastResetTime = () => {
    const lastReset = localStorage.getItem('lastQuestReset');
    if (!lastReset) return 'Never';
    
    const resetDate = new Date(parseInt(lastReset));
    return resetDate.toLocaleString();
  };

  // Calculate time until next reset
  const getTimeUntilReset = () => {
    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const diffMs = tomorrow.getTime() - now.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${diffHrs}h ${diffMins}m`;
  };

  // Handle different filters
  const applyFilters = (quest: typeof quests[0]) => {
    // Filter by quest type (daily/normal)
    const typeFilterMatch = 
      typeFilter === 'all' ? true :
      typeFilter === 'daily' ? quest.isDaily === true :
      quest.isDaily !== true;
    
    // Filter by difficulty if set
    const difficultyFilterMatch = filter === null || quest.difficulty === filter;
    
    return typeFilterMatch && difficultyFilterMatch;
  };

  const filteredQuests = quests.filter(applyFilters);
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

  // Handle quest editing
  const handleEditQuest = (id: string, title: string, description: string) => {
    setEditingQuest({ id, title, description });
  };

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

            <div className="space-y-2 mb-6">
              <button
                onClick={() => setFilter(null)}
                className={`w-full text-left px-4 py-3 rounded-md flex items-center justify-between transition-all duration-200 ${
                  filter === null 
                    ? 'bg-sl-blue text-sl-dark font-medium' 
                    : 'bg-sl-grey-dark/30 text-slate-300 hover:bg-sl-grey-dark/50'
                }`}
              >
                <span>All Difficulties</span>
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

            <h3 className="text-lg font-bold text-white mb-3 flex items-center">
              <Clock className="text-sl-blue mr-2 w-5 h-5" />
              Quest Types
            </h3>

            <div className="space-y-2 mb-6">
              <button
                onClick={() => setTypeFilter('all')}
                className={`w-full text-left px-4 py-3 rounded-md flex items-center justify-between transition-all duration-200 ${
                  typeFilter === 'all' 
                    ? 'bg-sl-blue text-sl-dark font-medium' 
                    : 'bg-sl-grey-dark/30 text-slate-300 hover:bg-sl-grey-dark/50'
                }`}
              >
                <span>All Quests</span>
                {typeFilter === 'all' && <Check className="w-4 h-4" />}
              </button>
              
              <button
                onClick={() => setTypeFilter('daily')}
                className={`w-full text-left px-4 py-3 rounded-md flex items-center justify-between transition-all duration-200 ${
                  typeFilter === 'daily' 
                    ? 'bg-sl-blue text-sl-dark font-medium' 
                    : 'bg-sl-grey-dark/30 text-slate-300 hover:bg-sl-grey-dark/50'
                }`}
              >
                <div className="flex items-center">
                  <RefreshCw className="w-4 h-4 mr-2 text-green-400" />
                  <span>Daily Quests</span>
                </div>
                {typeFilter === 'daily' && <Check className="w-4 h-4" />}
              </button>
              
              <button
                onClick={() => setTypeFilter('normal')}
                className={`w-full text-left px-4 py-3 rounded-md flex items-center justify-between transition-all duration-200 ${
                  typeFilter === 'normal' 
                    ? 'bg-sl-blue text-sl-dark font-medium' 
                    : 'bg-sl-grey-dark/30 text-slate-300 hover:bg-sl-grey-dark/50'
                }`}
              >
                <div className="flex items-center">
                  <Target className="w-4 h-4 mr-2 text-purple-400" />
                  <span>Story Quests</span>
                </div>
                {typeFilter === 'normal' && <Check className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="sl-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <h3 className="text-lg font-bold text-white mb-3 flex items-center">
              <Target className="text-sl-blue mr-2 w-5 h-5" />
              Quest Status
            </h3>
            
            <div className="space-y-4 mb-5">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-slate-300">Available</span>
                  <span className="text-sm text-slate-300">{availableQuests.length}</span>
                </div>
                <div className="h-2 w-full bg-sl-grey-dark rounded-full overflow-hidden">
                  <div
                    className="h-full bg-sl-blue rounded-full"
                    style={{ width: `${(availableQuests.length / filteredQuests.length) * 100}%` }}
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
                    style={{ width: `${(completedQuests.length / filteredQuests.length) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="pt-2 border-t border-sl-grey-dark">
                <div className="flex justify-between text-sm text-slate-300 mb-2">
                  <span>Total Quests Completed</span>
                  <span>{quests.filter(q => q.completed).length}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-300">
                  <span>Completion Rate</span>
                  <span>{Math.round((quests.filter(q => q.completed).length / quests.length) * 100)}%</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-sl-grey-dark">
              <h4 className="text-sm font-semibold text-white mb-2">Daily Quest Reset</h4>
              <div className="text-xs text-slate-400 space-y-1">
                <div className="flex justify-between">
                  <span>Last Reset:</span>
                  <span>{getLastResetTime()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Next Reset:</span>
                  <span>{getTimeUntilReset()}</span>
                </div>
              </div>
              
              <button
                onClick={resetDailyQuests}
                className="mt-3 w-full flex justify-center items-center py-2 px-4 border border-sl-grey-dark rounded-md text-xs font-medium text-slate-300 hover:bg-sl-grey-dark/50 transition-all duration-200"
              >
                <RefreshCw className="mr-1 h-3 w-3" />
                <span>Manual Reset</span>
              </button>
            </div>
          </div>

          <div className="sl-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-lg font-bold text-white mb-3 flex items-center">
              <PlusCircle className="text-sl-blue mr-2 w-5 h-5" />
              Custom Quests
            </h3>
            <p className="text-slate-400 text-sm mb-4">
              Create your own custom exercise quests to track your fitness goals.
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full flex justify-center items-center py-2 px-4 border border-sl-blue rounded-md text-sm font-medium text-sl-blue hover:bg-sl-blue hover:text-sl-dark transition-all duration-200"
            >
              <PlusCircle className="mr-1 h-4 w-4" />
              <span>Create Custom Quest</span>
            </button>
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
                          <div className="flex items-center">
                            <h4 className="font-medium text-white text-lg">{quest.title}</h4>
                            {quest.isDaily && (
                              <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-green-500/20 text-green-400 flex items-center">
                                <RefreshCw className="h-3 w-3 mr-1" />
                                Daily
                              </span>
                            )}
                            {quest.customizable && (
                              <button 
                                className="ml-2 text-slate-400 hover:text-sl-blue transition-colors" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditQuest(quest.id, quest.title, quest.description);
                                }}
                              >
                                <Edit2 className="h-3 w-3" />
                              </button>
                            )}
                          </div>
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
                            {quest.exerciseType && (
                              <span className="text-xs bg-sl-dark px-2 py-0.5 rounded text-slate-300 flex items-center">
                                {exerciseTypeIcons[quest.exerciseType as keyof typeof exerciseTypeIcons]}
                                {quest.exerciseType.charAt(0).toUpperCase() + quest.exerciseType.slice(1)}
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
                          <div className="flex items-center">
                            <h4 className="font-medium text-white text-lg">{quest.title}</h4>
                            {quest.isDaily && (
                              <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-green-500/20 text-green-400 flex items-center">
                                <RefreshCw className="h-3 w-3 mr-1" />
                                Daily
                              </span>
                            )}
                          </div>
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
                          
                          {quest.lastCompletedAt && (
                            <div className="mt-3 text-xs text-slate-400">
                              Completed on: {new Date(quest.lastCompletedAt).toLocaleString()}
                            </div>
                          )}
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

      {/* Add Custom Quest Form Modal */}
      {showAddForm && (
        <CustomQuestForm onClose={() => setShowAddForm(false)} />
      )}

      {/* Edit Quest Form Modal */}
      {editingQuest && (
        <EditQuestForm 
          questId={editingQuest.id}
          initialTitle={editingQuest.title}
          initialDescription={editingQuest.description}
          onClose={() => setEditingQuest(null)}
        />
      )}
    </div>
  );
};

export default Quests;
