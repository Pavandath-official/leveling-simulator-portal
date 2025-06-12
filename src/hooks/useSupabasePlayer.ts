
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface PlayerProfile {
  id: string;
  username: string;
  level: number;
  exp: number;
  gold: number;
  rank: string;
}

export interface PlayerStats {
  strength: number;
  agility: number;
  intelligence: number;
  vitality: number;
  endurance: number;
}

export interface Shadow {
  id: string;
  name: string;
  type: string;
  level: number;
  power: number;
  arisen: boolean;
}

export const useSupabasePlayer = () => {
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [shadows, setShadows] = useState<Shadow[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadPlayerData();
  }, []);

  const loadPlayerData = async () => {
    try {
      // Use fake data instead of Supabase
      const fakeUser = localStorage.getItem('fakeUser');
      if (!fakeUser) return;

      const userData = JSON.parse(fakeUser);

      // Load fake profile
      const fakeProfile: PlayerProfile = {
        id: userData.id || '1',
        username: userData.username || 'Shadow Monarch',
        level: userData.level || 15,
        exp: 2500,
        gold: 5000,
        rank: 'S'
      };

      // Load fake stats
      const fakeStats: PlayerStats = {
        strength: 45,
        agility: 38,
        intelligence: 42,
        vitality: 35,
        endurance: 40
      };

      // Load fake shadows
      const fakeShadows: Shadow[] = [
        { id: '1', name: 'Igris', type: 'Knight', level: 50, power: 1200, arisen: true },
        { id: '2', name: 'Iron', type: 'Soldier', level: 30, power: 800, arisen: true },
        { id: '3', name: 'Tank', type: 'Tank', level: 25, power: 600, arisen: false }
      ];

      setProfile(fakeProfile);
      setStats(fakeStats);
      setShadows(fakeShadows);
    } catch (error) {
      console.error('Error loading player data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<PlayerProfile>) => {
    try {
      setProfile(prev => prev ? { ...prev, ...updates } : null);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const createShadow = async (shadow: Omit<Shadow, 'id'>) => {
    try {
      const newShadow: Shadow = {
        ...shadow,
        id: Date.now().toString()
      };
      
      setShadows(prev => [...prev, newShadow]);
      return newShadow;
    } catch (error) {
      console.error('Error creating shadow:', error);
    }
  };

  const updateShadow = async (id: string, updates: Partial<Shadow>) => {
    try {
      setShadows(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    } catch (error) {
      console.error('Error updating shadow:', error);
    }
  };

  const recordBattle = async (battleData: {
    gate_name: string;
    gate_rank: string;
    team_power: number;
    success: boolean;
    exp_gained: number;
    gold_gained: number;
    artifacts: string[];
  }) => {
    try {
      console.log('Battle recorded:', battleData);
      // In a real app, this would save to database
    } catch (error) {
      console.error('Error recording battle:', error);
    }
  };

  return {
    profile,
    stats,
    shadows,
    loading,
    updateProfile,
    createShadow,
    updateShadow,
    recordBattle,
    reloadData: loadPlayerData
  };
};
