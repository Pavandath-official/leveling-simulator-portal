import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PlayerProvider } from "@/context/PlayerContext";
import { ThemeProvider } from "@/context/ThemeContext";
import Navbar from "@/components/Navbar";
import Index from "./pages/Index";
import Skills from "./pages/Skills";
import Quests from "./pages/Quests";
import Login from "./pages/Login";
import Leaderboard from "./pages/Leaderboard";
import NotFound from "./pages/NotFound";
import ShadowArmy from "./pages/ShadowArmy";
import Music from "./pages/Music";
import Chat from "./pages/Chat";
import LevelUpAnimation from "./components/LevelUpAnimation";
import RankUpAnimation from "./components/RankUpAnimation";
import ShadowExtractionAnimation from "./components/ShadowExtractionAnimation";
import { useState, useEffect } from "react";
import { usePlayer } from "@/context/PlayerContext";

// Configure the Query Client with proper settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Create a separate animation component to avoid context issues
const AnimationsContainer = () => {
  const { 
    showLevelUpAnimation, 
    showRankUpAnimation, 
    showExtractionAnimation, 
    shadowTypeToExtract,
    onExtractionComplete,
    dismissAnimations 
  } = usePlayer();
  
  return (
    <>
      {showLevelUpAnimation && <LevelUpAnimation />}
      {showRankUpAnimation && <RankUpAnimation />}
      {showExtractionAnimation && shadowTypeToExtract && (
        <ShadowExtractionAnimation 
          shadowType={shadowTypeToExtract} 
          onComplete={onExtractionComplete} 
        />
      )}
    </>
  );
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Check if user is logged in by checking if player name exists in localStorage
  useEffect(() => {
    const playerName = localStorage.getItem('playerName');
    setIsLoggedIn(!!playerName);
    setIsLoading(false);
  }, []);

  // If still loading, show nothing to prevent flicker
  if (isLoading) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <PlayerProvider>
          <TooltipProvider>
            <div className="min-h-screen flex flex-col bg-sl-darker relative overflow-hidden">
              {/* Background pattern */}
              <div className="fixed inset-0 sl-hex-bg pointer-events-none"></div>
              
              <Toaster />
              <Sonner />
              <BrowserRouter>
                {isLoggedIn && <Navbar />}
                <main className={`${isLoggedIn ? 'flex-1' : 'min-h-screen'} relative z-10`}>
                  <Routes>
                    <Route path="/login" element={isLoggedIn ? <Navigate to="/" /> : <Login />} />
                    <Route path="/" element={isLoggedIn ? <Index /> : <Navigate to="/login" />} />
                    <Route path="/skills" element={isLoggedIn ? <Skills /> : <Navigate to="/login" />} />
                    <Route path="/quests" element={isLoggedIn ? <Quests /> : <Navigate to="/login" />} />
                    <Route path="/leaderboard" element={isLoggedIn ? <Leaderboard /> : <Navigate to="/login" />} />
                    <Route path="/shadow-army" element={isLoggedIn ? <ShadowArmy /> : <Navigate to="/login" />} />
                    <Route path="/music" element={isLoggedIn ? <Music /> : <Navigate to="/login" />} />
                    <Route path="/chat" element={isLoggedIn ? <Chat /> : <Navigate to="/login" />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                {/* Animations */}
                <AnimationsContainer />
              </BrowserRouter>
            </div>
          </TooltipProvider>
        </PlayerProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
