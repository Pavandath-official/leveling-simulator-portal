
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PlayerProvider } from "@/context/PlayerContext";
import Navbar from "@/components/Navbar";
import Index from "./pages/Index";
import Skills from "./pages/Skills";
import Quests from "./pages/Quests";
import Login from "./pages/Login";
import Leaderboard from "./pages/Leaderboard";
import NotFound from "./pages/NotFound";
import { useState, useEffect } from "react";

const queryClient = new QueryClient();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Check if user is logged in by checking if player name exists in localStorage
  useEffect(() => {
    const playerName = localStorage.getItem('playerName');
    setIsLoggedIn(!!playerName);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <PlayerProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            {isLoggedIn && <Navbar />}
            <main className={`${isLoggedIn ? 'flex-1' : 'min-h-screen'}`}>
              <Routes>
                <Route path="/login" element={isLoggedIn ? <Navigate to="/" /> : <Login />} />
                <Route path="/" element={isLoggedIn ? <Index /> : <Navigate to="/login" />} />
                <Route path="/skills" element={isLoggedIn ? <Skills /> : <Navigate to="/login" />} />
                <Route path="/quests" element={isLoggedIn ? <Quests /> : <Navigate to="/login" />} />
                <Route path="/leaderboard" element={isLoggedIn ? <Leaderboard /> : <Navigate to="/login" />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </BrowserRouter>
        </TooltipProvider>
      </PlayerProvider>
    </QueryClientProvider>
  );
};

export default App;
