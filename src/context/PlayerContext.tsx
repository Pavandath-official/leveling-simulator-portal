import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from "@/hooks/use-toast";

type Stat = {
  name: string;
  value: number;
  max: number;
  color: string;
};

type Skill = {
  id: string;
  name: string;
  description: string;
  level: number;
  type: 'passive' | 'active';
  cooldown?: number;
  unlocked: boolean;
  icon: string;
};

type Quest = {
  id: string;
  title: string;
  description: string;
  difficulty: 'E' | 'D' | 'C' | 'B' | 'A' | 'S';
  rewards: {
    exp: number;
    gold?: number;
    items?: string[];
  };
  completed: boolean;
  progress: number;
  isDaily?: boolean;
  lastCompletedAt?: number;
  exerciseType?: 'strength' | 'cardio' | 'flexibility' | 'endurance';
  customizable?: boolean;
};

type Shadow = {
  id: string;
  name: string;
  level: number;
  type: string;
  power: number;
  arisen: boolean;
  image: string;
};

interface PlayerContextType {
  level: number;
  exp: number;
  expToNextLevel: number;
  stats: Stat[];
  skills: Skill[];
  quests: Quest[];
  gold: number;
  name: string;
  rank: string;
  shadows: Shadow[];
  showLevelUpAnimation: boolean;
  showRankUpAnimation: boolean;
  showExtractionAnimation: boolean;
  shadowTypeToExtract: string | null;
  gainExp: (amount: number) => void;
  completeQuest: (id: string) => void;
  resetDailyQuests: () => void;
  updateQuestDetails: (id: string, title: string, description: string) => void;
  addCustomQuest: (quest: Omit<Quest, 'id' | 'completed' | 'progress'>) => void;
  extractShadow: (type: string) => void;
  ariseShadow: (id: string) => void;
  dismissAnimations: () => void;
  onExtractionComplete: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};

interface PlayerProviderProps {
  children: ReactNode;
}

// Default quests to use when initializing
const defaultQuests: Omit<Quest, 'completed' | 'progress'>[] = [
  {
    id: '1',
    title: 'The First Hunt',
    description: 'Complete a basic training session in the guild hall.',
    difficulty: 'E',
    rewards: {
      exp: 50,
      gold: 100
    },
    isDaily: false
  },
  {
    id: '2',
    title: 'Patrol the Outskirts',
    description: 'Patrol the outskirts of the city for any signs of monsters.',
    difficulty: 'E',
    rewards: {
      exp: 75,
      gold: 150
    },
    isDaily: false
  },
  {
    id: '3',
    title: 'Retrieve Lost Artifact',
    description: 'A valuable artifact has been stolen by goblins. Retrieve it.',
    difficulty: 'D',
    rewards: {
      exp: 120,
      gold: 250,
      items: ['Basic Potion']
    },
    isDaily: false
  },
  // Daily exercise quests
  {
    id: 'daily-1',
    title: 'Morning Training',
    description: 'Complete 20 push-ups to improve your strength.',
    difficulty: 'E',
    rewards: {
      exp: 30,
      gold: 50
    },
    isDaily: true,
    exerciseType: 'strength'
  },
  {
    id: 'daily-2',
    title: 'Cardio Challenge',
    description: 'Run for 15 minutes to increase your stamina.',
    difficulty: 'E',
    rewards: {
      exp: 40,
      gold: 60
    },
    isDaily: true,
    exerciseType: 'cardio'
  },
  {
    id: 'daily-3',
    title: 'Flexibility Training',
    description: 'Do stretching exercises for 10 minutes to improve flexibility.',
    difficulty: 'E',
    rewards: {
      exp: 25,
      gold: 40
    },
    isDaily: true,
    exerciseType: 'flexibility'
  },
  {
    id: 'custom-1',
    title: 'Custom Exercise Quest',
    description: 'Create your own exercise goal and track it here.',
    difficulty: 'E',
    rewards: {
      exp: 50,
      gold: 75
    },
    isDaily: true,
    customizable: true
  }
];

export const PlayerProvider: React.FC<PlayerProviderProps> = ({ children }) => {
  const { toast } = useToast();
  const [notification, setNotification] = useState<string | null>(null);
  const [level, setLevel] = useState(1);
  const [exp, setExp] = useState(0);
  const [gold, setGold] = useState(500);
  const [name, setName] = useState(() => {
    return localStorage.getItem('playerName') || 'Hunter';
  });
  const [rank, setRank] = useState('E');
  const [shadows, setShadows] = useState<Shadow[]>(() => {
    const savedShadows = localStorage.getItem('shadows');
    return savedShadows ? JSON.parse(savedShadows) : [];
  });
  const [showLevelUpAnimation, setShowLevelUpAnimation] = useState(false);
  const [showRankUpAnimation, setShowRankUpAnimation] = useState(false);
  const [previousRank, setPreviousRank] = useState(rank);
  
  const [showExtractionAnimation, setShowExtractionAnimation] = useState(false);
  const [shadowTypeToExtract, setShadowTypeToExtract] = useState<string | null>(null);
  
  const expToNextLevel = level * 100;
  
  const [stats, setStats] = useState<Stat[]>([
    { name: 'Strength', value: 10, max: 100, color: 'bg-red-500' },
    { name: 'Agility', value: 8, max: 100, color: 'bg-green-500' },
    { name: 'Intelligence', value: 12, max: 100, color: 'bg-blue-500' },
    { name: 'Vitality', value: 15, max: 100, color: 'bg-yellow-500' },
    { name: 'Endurance', value: 11, max: 100, color: 'bg-purple-500' }
  ]);
  
  const [skills, setSkills] = useState<Skill[]>([
    {
      id: '1',
      name: 'Basic Strike',
      description: 'A simple attack with your weapon.',
      level: 1,
      type: 'active',
      cooldown: 0,
      unlocked: true,
      icon: 'sword'
    },
    {
      id: '2',
      name: 'Quick Dash',
      description: 'Quickly move a short distance.',
      level: 1,
      type: 'active',
      cooldown: 5,
      unlocked: true,
      icon: 'move'
    },
    {
      id: '3',
      name: 'Enhanced Perception',
      description: 'Passive ability to detect hidden dangers.',
      level: 1,
      type: 'passive',
      unlocked: true,
      icon: 'eye'
    },
    {
      id: '4',
      name: 'Shadow Strike',
      description: 'Attack from the shadows for increased damage.',
      level: 0,
      type: 'active',
      cooldown: 10,
      unlocked: false,
      icon: 'cloud-lightning'
    }
  ]);
  
  const [quests, setQuests] = useState<Quest[]>(() => {
    const savedQuests = localStorage.getItem('playerQuests');
    if (savedQuests) {
      return JSON.parse(savedQuests);
    }
    
    return defaultQuests.map(quest => ({
      ...quest,
      completed: false,
      progress: 0
    }));
  });
  
  useEffect(() => {
    localStorage.setItem('playerQuests', JSON.stringify(quests));
  }, [quests]);
  
  useEffect(() => {
    const checkAndResetDailyQuests = () => {
      const lastReset = localStorage.getItem('lastQuestReset');
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      
      if (!lastReset || parseInt(lastReset) < today) {
        resetDailyQuests();
        localStorage.setItem('lastQuestReset', today.toString());
      }
    };
    
    checkAndResetDailyQuests();
    
    const interval = setInterval(checkAndResetDailyQuests, 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  const resetDailyQuests = () => {
    setQuests(prevQuests => 
      prevQuests.map(quest => 
        quest.isDaily 
          ? { ...quest, completed: false, progress: 0 }
          : quest
      )
    );
    setNotification('Daily quests have been reset!');
    setTimeout(() => setNotification(null), 3000);
  };
  
  const updateQuestDetails = (id: string, title: string, description: string) => {
    setQuests(prevQuests => 
      prevQuests.map(quest => 
        quest.id === id 
          ? { ...quest, title, description }
          : quest
      )
    );
  };
  
  const addCustomQuest = (quest: Omit<Quest, 'id' | 'completed' | 'progress'>) => {
    const newQuest: Quest = {
      ...quest,
      id: `custom-${Date.now()}`,
      completed: false,
      progress: 0
    };
    
    setQuests(prevQuests => [...prevQuests, newQuest]);
    setNotification('New quest added!');
    setTimeout(() => setNotification(null), 3000);
  };
  
  const extractShadow = (type: string) => {
    setShadowTypeToExtract(type);
    setShowExtractionAnimation(true);
    
    // The actual extraction logic will be called when the animation completes
    // This is handled in the onExtractionComplete callback
  };
  
  const onExtractionComplete = () => {
    if (!shadowTypeToExtract) return;
    
    const powerBase = Math.floor(Math.random() * 10) + 1;
    const power = powerBase + Math.floor(level / 2);
    
    const shadowNames = [
      "Grímr", "Skuggr", "Nóttr", "Dökk", "Myrkr", "Svartir", 
      "Tánios", "Erebus", "Umbra", "Tenebris", "Nyx", "Skia"
    ];
    const randomNameIndex = Math.floor(Math.random() * shadowNames.length);
    const shadowName = `${shadowNames[randomNameIndex]} the ${shadowTypeToExtract.charAt(0).toUpperCase() + shadowTypeToExtract.slice(1)}`;
    
    const newShadow: Shadow = {
      id: `shadow-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: shadowName,
      level: Math.max(1, Math.floor(level / 2)),
      type: shadowTypeToExtract,
      power,
      arisen: false,
      image: shadowTypeToExtract.toLowerCase(),
    };
    
    setShadows(prev => [...prev, newShadow]);
    setShowExtractionAnimation(false);
    setShadowTypeToExtract(null);
    
    toast({
      title: "Shadow Extracted!",
      description: `You have extracted ${shadowName} from the defeated enemy.`,
      variant: "default",
    });
  };
  
  const ariseShadow = (id: string) => {
    setShadows(prev => 
      prev.map(shadow => 
        shadow.id === id 
          ? { ...shadow, arisen: true, power: shadow.power + 5 }
          : shadow
      )
    );
    
    const arisenShadow = shadows.find(s => s.id === id);
    
    if (arisenShadow) {
      toast({
        title: "ARISE!",
        description: `${arisenShadow.name} has joined your shadow army!`,
        variant: "destructive",
      });
    }
  };
  
  const gainExp = (amount: number) => {
    let newExp = exp + amount;
    let newLevel = level;
    let leveledUp = false;
    
    while (newExp >= expToNextLevel) {
      newExp -= expToNextLevel;
      newLevel++;
      leveledUp = true;
      
      if (Math.random() < 0.7) {
        const shadowTypes = ["soldier", "knight", "mage", "beast", "assassin"];
        const randomType = shadowTypes[Math.floor(Math.random() * shadowTypes.length)];
        setTimeout(() => extractShadow(randomType), 1500);
      }
    }
    
    setExp(newExp);
    
    if (newLevel !== level) {
      setLevel(newLevel);
      setShowLevelUpAnimation(true);
      
      setTimeout(() => {
        setShowLevelUpAnimation(false);
      }, 3000);
    }
  };
  
  const completeQuest = (id: string) => {
    const questIndex = quests.findIndex(q => q.id === id);
    if (questIndex === -1 || quests[questIndex].completed) return;
    
    const quest = quests[questIndex];
    const newQuests = [...quests];
    const completionTime = Date.now();
    
    newQuests[questIndex] = { 
      ...quest, 
      completed: true, 
      progress: 100,
      lastCompletedAt: completionTime
    };
    
    setQuests(newQuests);
    
    gainExp(quest.rewards.exp);
    if (quest.rewards.gold) {
      setGold(prevGold => prevGold + quest.rewards.gold!);
    }
    
    setNotification(`Quest Completed: ${quest.title}`);
    setTimeout(() => setNotification(null), 3000);
  };
  
  useEffect(() => {
    const newRank = level >= 25 ? 'S' : 
                  level >= 20 ? 'A' : 
                  level >= 15 ? 'B' : 
                  level >= 10 ? 'C' : 
                  level >= 5 ? 'D' : 'E';
    
    if (newRank !== rank) {
      setPreviousRank(rank);
      setRank(newRank);
      setShowRankUpAnimation(true);
      
      toast({
        title: "Rank Up!",
        description: `You have been promoted from ${rank} to ${newRank} rank!`,
        variant: "default",
      });
      
      setTimeout(() => {
        setShowRankUpAnimation(false);
      }, 4000);
    }
  }, [level, rank]);
  
  const dismissAnimations = () => {
    setShowLevelUpAnimation(false);
    setShowRankUpAnimation(false);
    setShowExtractionAnimation(false);
  };
  
  return (
    <PlayerContext.Provider
      value={{
        level,
        exp,
        expToNextLevel,
        stats,
        skills,
        quests,
        gold,
        name,
        rank,
        shadows,
        showLevelUpAnimation,
        showRankUpAnimation,
        showExtractionAnimation,
        shadowTypeToExtract,
        gainExp,
        completeQuest,
        resetDailyQuests,
        updateQuestDetails,
        addCustomQuest,
        extractShadow,
        ariseShadow,
        dismissAnimations,
        onExtractionComplete
      }}
    >
      {notification && (
        <div className="fixed bottom-4 right-4 z-50 bg-sl-blue text-sl-dark px-5 py-3 rounded-md shadow-lg animate-fade-in">
          {notification}
        </div>
      )}
      {children}
    </PlayerContext.Provider>
  );
};
