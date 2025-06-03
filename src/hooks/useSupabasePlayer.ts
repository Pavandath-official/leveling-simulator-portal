
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Load profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      // Load stats
      const { data: statsData } = await supabase
        .from('player_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // Load shadows
      const { data: shadowsData } = await supabase
        .from('shadows')
        .select('*')
        .eq('user_id', user.id);

      setProfile(profileData);
      setStats(statsData);
      setShadows(shadowsData || []);
    } catch (error) {
      console.error('Error loading player data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<PlayerProfile>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;
      
      setProfile(prev => prev ? { ...prev, ...updates } : null);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const createShadow = async (shadow: Omit<Shadow, 'id'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('shadows')
        .insert([{ ...shadow, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      
      setShadows(prev => [...prev, data]);
      return data;
    } catch (error) {
      console.error('Error creating shadow:', error);
    }
  };

  const updateShadow = async (id: string, updates: Partial<Shadow>) => {
    try {
      const { error } = await supabase
        .from('shadows')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('dungeon_battles')
        .insert([{ ...battleData, user_id: user.id }]);

      if (error) throw error;
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
