
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, User, Zap, BookOpen, Target, Trophy, LogOut, Ghost, Music, MessageSquare, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { usePlayer } from '@/context/PlayerContext';
import ThemeToggle from './ThemeToggle';
import { GlowPulse } from './VisualEffects';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const { level, rank, name } = usePlayer();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('fakeUser');
    window.location.href = '/login';
  };

  const navItems = [
    { to: '/', icon: <User className="w-5 h-5" />, text: 'Status' },
    { to: '/skills', icon: <Zap className="w-5 h-5" />, text: 'Skills' },
    { to: '/quests', icon: <Target className="w-5 h-5" />, text: 'Quests' },
    { to: '/shadow-army', icon: <Ghost className="w-5 h-5" />, text: 'Shadows' },
    { to: '/dungeon-gates', icon: <MapPin className="w-5 h-5" />, text: 'Dungeons' },
    { to: '/music', icon: <Music className="w-5 h-5" />, text: 'Music' },
    { to: '/chat', icon: <MessageSquare className="w-5 h-5" />, text: 'Chat' },
    { to: '/leaderboard', icon: <Trophy className="w-5 h-5" />, text: 'Leaderboard' },
  ];

  const scrollNav = (direction: 'left' | 'right') => {
    const scrollAmount = 200;
    setScrollPosition(prev => {
      if (direction === 'left') {
        return Math.max(0, prev - scrollAmount);
      } else {
        return Math.min(prev + scrollAmount, (navItems.length * 150) - 800);
      }
    });
  };

  return (
    <nav className="bg-sl-dark dark:bg-sl-darker border-b border-sl-grey-dark sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <NavLink to="/" className="flex items-center space-x-2" onClick={closeMenu}>
            <BookOpen className="text-sl-blue w-6 h-6" />
            <div className="hidden sm:block">
              <GlowPulse>
                <span className="font-bold text-lg text-white">System</span>
                <span className="text-sl-blue">Interface</span>
              </GlowPulse>
            </div>
          </NavLink>

          {/* Desktop Navigation - Horizontal Scrollable */}
          <div className="hidden lg:flex items-center flex-1 mx-8 relative">
            {/* Left scroll button */}
            <button
              onClick={() => scrollNav('left')}
              className="absolute left-0 z-10 p-2 bg-sl-dark/80 hover:bg-sl-grey-dark/50 rounded-full transition-colors"
              disabled={scrollPosition <= 0}
            >
              <ChevronLeft className="w-4 h-4 text-slate-300" />
            </button>

            {/* Scrollable navigation container */}
            <div className="overflow-hidden mx-8 flex-1">
              <motion.div 
                className="flex space-x-2"
                animate={{ x: -scrollPosition }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.to}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <NavLink
                      to={item.to}
                      className={({ isActive }) =>
                        `flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 whitespace-nowrap min-w-fit ${
                          isActive
                            ? 'text-sl-blue bg-sl-blue/10 border border-sl-blue/30 shadow-lg shadow-sl-blue/20'
                            : 'text-slate-300 hover:text-sl-blue hover:bg-sl-grey-dark/30'
                        }`
                      }
                    >
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        {item.icon}
                      </motion.div>
                      <span className="text-sm font-medium">{item.text}</span>
                    </NavLink>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Right scroll button */}
            <button
              onClick={() => scrollNav('right')}
              className="absolute right-0 z-10 p-2 bg-sl-dark/80 hover:bg-sl-grey-dark/50 rounded-full transition-colors"
              disabled={scrollPosition >= (navItems.length * 150) - 800}
            >
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </button>
          </div>

          {/* Desktop User Info */}
          <div className="hidden lg:flex items-center space-x-4">
            <ThemeToggle />
            
            <motion.div 
              className="flex items-center space-x-3 px-4 py-2 rounded-lg bg-gradient-to-r from-sl-dark to-sl-grey-dark/50 border border-sl-grey-dark/30 backdrop-blur-sm"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <div className="text-right">
                <p className="text-slate-400 text-xs">Hunter</p>
                <p className="text-white font-medium text-sm">{name}</p>
              </div>
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.8 }}
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-sl-blue to-sl-purple border-2 border-sl-blue text-white font-bold text-sm shadow-lg">
                  {rank}
                </div>
              </motion.div>
              <div className="flex flex-col">
                <span className="text-slate-400 text-xs">Level</span>
                <span className="text-white font-medium text-sm">{level}</span>
              </div>
            </motion.div>
            
            <motion.button 
              onClick={handleLogout}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-slate-300 hover:text-red-400 hover:bg-red-400/10 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Logout</span>
            </motion.button>
          </div>

          {/* Mobile Controls */}
          <div className="lg:hidden flex items-center space-x-3">
            <ThemeToggle />
            <motion.button
              onClick={toggleMenu}
              className="flex items-center justify-center p-2 rounded-md text-slate-300 hover:text-white focus:outline-none"
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 180 }}
                    exit={{ rotate: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 180 }}
                    animate={{ rotate: 0 }}
                    exit={{ rotate: 180 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-6 h-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-sl-grey-dark/95 backdrop-blur-sm border-b border-sl-grey-dark"
          >
            <div className="px-4 py-3 space-y-1">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.to}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                        isActive
                          ? 'text-sl-blue bg-sl-blue/10 border border-sl-blue/30'
                          : 'text-slate-300 hover:bg-sl-dark hover:text-sl-blue'
                      }`
                    }
                    onClick={closeMenu}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      {item.icon}
                    </motion.div>
                    <span>{item.text}</span>
                  </NavLink>
                </motion.div>
              ))}
              
              <div className="mt-3 pt-3 border-t border-sl-grey-dark">
                <motion.div 
                  className="flex items-center space-x-3 px-4 py-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div>
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-sl-blue to-sl-purple border-2 border-sl-blue text-white font-bold">
                      {rank}
                    </div>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Hunter</p>
                    <p className="text-white font-semibold">{name}</p>
                    <p className="text-sl-blue text-sm">Level {level}</p>
                  </div>
                </motion.div>
                <motion.button
                  onClick={handleLogout}
                  className="w-full mt-2 flex items-center space-x-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-400/10 transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
