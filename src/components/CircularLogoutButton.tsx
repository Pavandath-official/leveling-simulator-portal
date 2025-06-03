
import React, { useState } from 'react';
import { LogOut, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const CircularLogoutButton = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear fake user data
    localStorage.removeItem('fakeUser');
    navigate('/login');
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <motion.div
        className="relative"
        onHoverStart={() => setIsExpanded(true)}
        onHoverEnd={() => setIsExpanded(false)}
      >
        <motion.button
          className="w-12 h-12 bg-sl-dark border-2 border-sl-blue rounded-full flex items-center justify-center text-sl-blue hover:bg-sl-blue hover:text-sl-dark transition-colors shadow-lg"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <User className="w-5 h-5" />
        </motion.button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: 20 }}
              className="absolute right-0 top-full mt-2 bg-sl-dark border border-sl-grey-dark rounded-lg shadow-xl overflow-hidden min-w-32"
            >
              <button
                onClick={handleLogout}
                className="w-full px-4 py-3 text-left text-white hover:bg-sl-grey-dark/50 transition-colors flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Logout</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default CircularLogoutButton;
