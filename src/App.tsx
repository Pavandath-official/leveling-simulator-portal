
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PlayerProvider } from "@/context/PlayerContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

import Index from "./pages/Index";
import Skills from "./pages/Skills";
import Quests from "./pages/Quests";
import ShadowArmy from "./pages/ShadowArmy";
import DungeonGates from "./pages/DungeonGates";
import Leaderboard from "./pages/Leaderboard";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import LevelUpAnimation from "./components/LevelUpAnimation";
import RankUpAnimation from "./components/RankUpAnimation";
import ShadowExtractionAnimation from "./components/ShadowExtractionAnimation";
import { Particles } from "./components/VisualEffects";
import CircularLogoutButton from "./components/CircularLogoutButton";
import AudioPlayer from "./components/AudioPlayer";

const queryClient = new QueryClient();

const App = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-sl-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-sl-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sl-blue">Loading Solo Leveling System...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <ThemeProvider>
          <PlayerProvider>
            <BrowserRouter>
              <div className="min-h-screen bg-sl-dark text-white">
                <Particles className="fixed inset-0 z-0" />
                <Navbar />
                <CircularLogoutButton />
                <AudioPlayer className="fixed bottom-4 left-4 z-40" />
                
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/skills" element={<Skills />} />
                  <Route path="/quests" element={<Quests />} />
                  <Route path="/shadow-army" element={<ShadowArmy />} />
                  <Route path="/dungeon-gates" element={<DungeonGates />} />
                  <Route path="/leaderboard" element={<Leaderboard />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>

                <LevelUpAnimation />
                <RankUpAnimation />
                <ShadowExtractionAnimation 
                  shadowType="Igris" 
                  onComplete={() => {}} 
                />
              </div>
            </BrowserRouter>
          </PlayerProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
