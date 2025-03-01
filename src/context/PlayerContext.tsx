
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

export const PlayerProvider: React.FC<PlayerProviderProps> = ({ children }) => {
  const [notification, setNotification] = useState<string | null>(null);
  const [level, setLevel] = useState(1);
  const [exp, setExp] = useState(0);
  const [gold, setGold] = useState(500);
  const [name, setName] = useState('Hunter');
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
  
  const [quests, setQuests] = useState<Quest[]>([
    {
      id: '1',
      title: 'The First Hunt',
      description: 'Complete a basic training session in the guild hall.',
      difficulty: 'E',
      rewards: {
        exp: 50,
        gold: 100
      },
      completed: false,
      progress: 0
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
      completed: false,
      progress: 0
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
      completed: false,
      progress: 0
    }
  ]);
  
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
    newQuests[questIndex] = { ...quest, completed: true, progress: 100 };
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
        completeQuest
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
