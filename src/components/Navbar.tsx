
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, User, Zap, BookOpen, Target, Trophy, LogOut, Ghost, Music, MessageSquare, MapPin, ChevronDown } from 'lucide-react';
import { usePlayer } from '@/context/PlayerContext';
import ThemeToggle from './ThemeToggle';
import { GlowPulse } from './VisualEffects';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { level, rank, name } = usePlayer();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
    setIsDropdownOpen(false);
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

  return (
    <nav className="bg-slate-900/95 backdrop-blur-xl border-b border-blue-500/30 sticky top-0 z-50 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <NavLink to="/" className="flex items-center space-x-2" onClick={closeMenu}>
            <BookOpen className="text-blue-400 w-6 h-6" />
            <div className="hidden sm:block">
              <GlowPulse>
                <span className="font-bold text-lg text-white">System</span>
                <span className="text-blue-400">Interface</span>
              </GlowPulse>
            </div>
          </NavLink>

          {/* Desktop Navigation - Dropdown */}
          <div className="hidden lg:flex items-center relative">
            <motion.button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-3 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-2 border-blue-400/30 text-white hover:border-blue-400/60 transition-all duration-300 backdrop-blur-sm shadow-xl"
              whileHover={{ 
                scale: 1.05, 
                rotateY: 10,
                boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
              style={{ 
                transformStyle: 'preserve-3d',
                perspective: '1000px'
              }}
            >
              <Menu className="w-5 h-5" />
              <span className="font-medium">Navigation</span>
              <motion.div
                animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                transition={{ duration: 0.4, type: "spring" }}
              >
                <ChevronDown className="w-4 h-4" />
              </motion.div>
            </motion.button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ 
                    opacity: 0, 
                    y: -30, 
                    rotateX: -90,
                    scale: 0.8
                  }}
                  animate={{ 
                    opacity: 1, 
                    y: 0, 
                    rotateX: 0,
                    scale: 1
                  }}
                  exit={{ 
                    opacity: 0, 
                    y: -30, 
                    rotateX: -90,
                    scale: 0.8
                  }}
                  transition={{ 
                    duration: 0.5, 
                    type: "spring", 
                    stiffness: 300,
                    damping: 25
                  }}
                  className="absolute top-full left-0 mt-3 w-96 bg-slate-900/95 backdrop-blur-xl border-2 border-blue-400/30 rounded-2xl shadow-2xl z-50 overflow-hidden"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <div className="p-6 grid grid-cols-2 gap-3">
                    {navItems.map((item, index) => (
                      <motion.div
                        key={item.to}
                        initial={{ 
                          opacity: 0, 
                          y: 30, 
                          rotateY: -45,
                          scale: 0.8
                        }}
                        animate={{ 
                          opacity: 1, 
                          y: 0, 
                          rotateY: 0,
                          scale: 1
                        }}
                        transition={{ 
                          delay: index * 0.08, 
                          duration: 0.4,
                          type: "spring"
                        }}
                        whileHover={{ 
                          scale: 1.08, 
                          rotateY: 8, 
                          z: 20,
                          boxShadow: "0 15px 30px rgba(59, 130, 246, 0.4)"
                        }}
                        style={{ transformStyle: 'preserve-3d' }}
                      >
                        <NavLink
                          to={item.to}
                          className={({ isActive }) =>
                            `flex items-center space-x-3 px-4 py-4 rounded-xl transition-all duration-300 ${
                              isActive
                                ? 'text-blue-400 bg-blue-500/20 border-2 border-blue-400/50 shadow-lg'
                                : 'text-slate-300 hover:text-blue-400 hover:bg-slate-800/50 border-2 border-transparent hover:border-blue-400/30'
                            }`
                          }
                          onClick={closeMenu}
                        >
                          <motion.div
                            whileHover={{ 
                              rotate: 360, 
                              scale: 1.3 
                            }}
                            transition={{ 
                              duration: 0.6,
                              type: "spring"
                            }}
                          >
                            {item.icon}
                          </motion.div>
                          <span className="text-sm font-medium">{item.text}</span>
                        </NavLink>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Desktop User Info - Fixed overlapping */}
          <div className="hidden lg:flex items-center space-x-6">
            <ThemeToggle />
            
            <motion.div 
              className="flex items-center space-x-3 px-4 py-2 rounded-xl bg-gradient-to-r from-slate-800 to-slate-700 border-2 border-blue-400/30 backdrop-blur-sm shadow-xl"
              whileHover={{ 
                scale: 1.03, 
                rotateY: 5,
                boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)"
              }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="text-right">
                <p className="text-slate-400 text-xs">Hunter</p>
                <p className="text-white font-medium text-sm">{name}</p>
              </div>
              <motion.div
                whileHover={{ 
                  rotate: 360, 
                  scale: 1.15 
                }}
                transition={{ 
                  duration: 0.8,
                  type: "spring"
                }}
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 border-2 border-blue-400 text-white font-bold text-sm shadow-lg">
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
              className="flex items-center space-x-2 px-4 py-2 rounded-xl text-slate-300 hover:text-red-400 hover:bg-red-400/10 transition-all duration-300 border-2 border-transparent hover:border-red-400/30"
              whileHover={{ 
                scale: 1.05, 
                rotateY: 5,
                boxShadow: "0 8px 20px rgba(248, 113, 113, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Logout</span>
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
            className="lg:hidden bg-slate-800/95 backdrop-blur-sm border-b border-blue-500/30"
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
                          ? 'text-blue-400 bg-blue-500/10 border border-blue-400/30'
                          : 'text-slate-300 hover:bg-slate-700 hover:text-blue-400'
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
              
              <div className="mt-3 pt-3 border-t border-slate-600">
                <motion.div 
                  className="flex items-center space-x-3 px-4 py-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div>
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 border-2 border-blue-400 text-white font-bold">
                      {rank}
                    </div>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Hunter</p>
                    <p className="text-white font-semibold">{name}</p>
                    <p className="text-blue-400 text-sm">Level {level}</p>
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
