
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, User, Zap, BookOpen, Target, Trophy, LogOut, Ghost, Music, MessageSquare, MapPin } from 'lucide-react';
import { usePlayer } from '@/context/PlayerContext';
import ThemeToggle from './ThemeToggle';
import { GlowPulse } from './VisualEffects';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
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

  return (
    <nav className="bg-sl-dark dark:bg-sl-darker border-b border-sl-grey-dark sticky top-0 z-50">
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

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-3 py-2 rounded-md transition-all duration-300 ${
                    isActive
                      ? 'text-sl-blue bg-sl-grey-dark bg-opacity-30 sl-border-glow'
                      : 'text-slate-300 hover:text-sl-blue'
                  }`
                }
              >
                {item.icon}
                <span className="text-sm">{item.text}</span>
              </NavLink>
            ))}
          </div>

          {/* Desktop User Info */}
          <div className="hidden lg:flex items-center space-x-4">
            <ThemeToggle />
            
            <div className="flex items-center space-x-3 px-3 py-2 rounded bg-sl-dark dark:bg-sl-grey-dark/20 border border-sl-grey-dark/30">
              <div className="text-right">
                <p className="text-slate-400 text-xs">Hunter</p>
                <p className="text-white font-medium text-sm">{name}</p>
              </div>
              <div>
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-sl-grey-dark border border-sl-blue text-sl-blue font-bold text-sm">
                  {rank}
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-slate-400 text-xs">Level</span>
                <span className="text-white font-medium text-sm">{level}</span>
              </div>
            </div>
            
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-2 px-3 py-2 rounded-md text-slate-300 hover:text-red-400 transition-all duration-300"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Logout</span>
            </button>
          </div>

          {/* Mobile Controls */}
          <div className="lg:hidden flex items-center space-x-3">
            <ThemeToggle />
            <button
              onClick={toggleMenu}
              className="flex items-center justify-center p-2 rounded-md text-slate-300 hover:text-white focus:outline-none"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden ${
          isOpen ? 'block' : 'hidden'
        } bg-sl-grey-dark dark:bg-sl-darker bg-opacity-95 border-b border-sl-grey-dark animate-fade-in`}
      >
        <div className="px-4 py-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-md ${
                  isActive
                    ? 'text-sl-blue bg-sl-dark dark:bg-sl-grey-dark/30 sl-border-glow'
                    : 'text-slate-300 hover:bg-sl-dark dark:hover:bg-sl-grey-dark/20 hover:text-sl-blue'
                }`
              }
              onClick={closeMenu}
            >
              {item.icon}
              <span>{item.text}</span>
            </NavLink>
          ))}
          
          <div className="mt-3 pt-3 border-t border-sl-grey-dark">
            <div className="flex items-center space-x-3 px-4 py-3">
              <div>
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-sl-grey-dark border border-sl-blue text-sl-blue font-bold">
                  {rank}
                </div>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Hunter</p>
                <p className="text-white font-semibold">{name}</p>
                <p className="text-sl-blue text-sm">Level {level}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full mt-2 flex items-center space-x-3 px-4 py-3 rounded-md text-red-400 hover:bg-sl-dark dark:hover:bg-sl-grey-dark/20"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
