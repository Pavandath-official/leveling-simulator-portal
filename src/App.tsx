
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PlayerProvider } from "@/context/PlayerContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { useState, useEffect } from "react";

import Index from "./pages/Index";
import Skills from "./pages/Skills";
import Quests from "./pages/Quests";
import ShadowArmy from "./pages/ShadowArmy";
import DungeonGates from "./pages/DungeonGates";
import Music from "./pages/Music";
import Chat from "./pages/Chat";
import Leaderboard from "./pages/Leaderboard";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import LevelUpAnimation from "./components/LevelUpAnimation";
import RankUpAnimation from "./components/RankUpAnimation";
import { Particles } from "./components/VisualEffects";

const queryClient = new QueryClient();

const App = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const fakeUser = localStorage.getItem('fakeUser');
        console.log('Checking auth, fakeUser:', fakeUser);
        
        if (fakeUser) {
          const userData = JSON.parse(fakeUser);
          console.log('Setting user:', userData);
          setUser(userData);
        } else {
          console.log('No user found');
          setUser(null);
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        setUser(null);
        localStorage.removeItem('fakeUser');
      } finally {
        setLoading(false);
        setAuthChecked(true);
      }
    };

    checkAuth();

    // Listen for storage changes (for logout from other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'fakeUser') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Show loading screen while checking auth
  if (loading || !authChecked) {
    return (
      <div className="min-h-screen bg-sl-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-sl-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sl-blue">Loading Solo Leveling System...</p>
        </div>
      </div>
    );
  }

  console.log('Auth state - user:', user, 'authChecked:', authChecked);

  // If no user, show login
  if (!user) {
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

  // If user exists, show main app
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
                
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/skills" element={<Skills />} />
                  <Route path="/quests" element={<Quests />} />
                  <Route path="/shadow-army" element={<ShadowArmy />} />
                  <Route path="/dungeon-gates" element={<DungeonGates />} />
                  <Route path="/music" element={<Music />} />
                  <Route path="/chat" element={<Chat />} />
                  <Route path="/leaderboard" element={<Leaderboard />} />
                  <Route path="/login" element={<Navigate to="/" replace />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>

                <LevelUpAnimation />
                <RankUpAnimation />
              </div>
            </BrowserRouter>
          </PlayerProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
