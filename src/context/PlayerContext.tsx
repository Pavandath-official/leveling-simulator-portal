
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
  gainExp: (amount: number) => void;
  completeQuest: (id: string) => void;
  resetDailyQuests: () => void;
  updateQuestDetails: (id: string, title: string, description: string) => void;
  addCustomQuest: (quest: Omit<Quest, 'id' | 'completed' | 'progress'>) => void;
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
  const [notification, setNotification] = useState<string | null>(null);
  const [level, setLevel] = useState(1);
  const [exp, setExp] = useState(0);
  const [gold, setGold] = useState(500);
  const [name, setName] = useState(() => {
    return localStorage.getItem('playerName') || 'Hunter';
  });
  const [rank, setRank] = useState('E');
  
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
  
  // Load quests from localStorage or use defaults
  const [quests, setQuests] = useState<Quest[]>(() => {
    const savedQuests = localStorage.getItem('playerQuests');
    if (savedQuests) {
      return JSON.parse(savedQuests);
    }
    
    // Initialize with default quests
    return defaultQuests.map(quest => ({
      ...quest,
      completed: false,
      progress: 0
    }));
  });
  
  // Save quests to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('playerQuests', JSON.stringify(quests));
  }, [quests]);
  
  // Reset daily quests at midnight
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
    
    // Check on initial load
    checkAndResetDailyQuests();
    
    // Set up interval to check periodically
    const interval = setInterval(checkAndResetDailyQuests, 60 * 60 * 1000); // Check every hour
    
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
  
  const gainExp = (amount: number) => {
    let newExp = exp + amount;
    let newLevel = level;
    
    while (newExp >= expToNextLevel) {
      newExp -= expToNextLevel;
      newLevel++;
      setNotification(`Level Up! You are now level ${newLevel}`);
      
      // Automatically dismiss notification after 3 seconds
      setTimeout(() => setNotification(null), 3000);
    }
    
    setExp(newExp);
    if (newLevel !== level) {
      setLevel(newLevel);
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
    
    // Award rewards
    gainExp(quest.rewards.exp);
    if (quest.rewards.gold) {
      setGold(prevGold => prevGold + quest.rewards.gold!);
    }
    
    setNotification(`Quest Completed: ${quest.title}`);
    setTimeout(() => setNotification(null), 3000);
  };
  
  // Rank up based on level
  useEffect(() => {
    if (level >= 25) setRank('S');
    else if (level >= 20) setRank('A');
    else if (level >= 15) setRank('B');
    else if (level >= 10) setRank('C');
    else if (level >= 5) setRank('D');
    else setRank('E');
  }, [level]);
  
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
        gainExp,
        completeQuest,
        resetDailyQuests,
        updateQuestDetails,
        addCustomQuest
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
