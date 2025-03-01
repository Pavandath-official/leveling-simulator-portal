
import React, { useState, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface SystemNotificationProps {
  title?: string;
  children: ReactNode;
  type?: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
  onClose?: () => void;
}

const SystemNotification: React.FC<SystemNotificationProps> = ({
  title,
  children,
  type = 'info',
  duration = 5000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) setTimeout(onClose, 300);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) setTimeout(onClose, 300);
  };

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-500/10',
          border: 'border-green-500',
          text: 'text-green-400',
        };
      case 'warning':
        return {
          bg: 'bg-yellow-500/10',
          border: 'border-yellow-500',
          text: 'text-yellow-400',
        };
      case 'error':
        return {
          bg: 'bg-red-500/10',
          border: 'border-red-500',
          text: 'text-red-400',
        };
      default:
        return {
          bg: 'bg-sl-blue/10',
          border: 'border-sl-blue',
          text: 'text-sl-blue',
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={`fixed z-50 rounded-lg border px-4 py-3 shadow-lg ${styles.bg} ${styles.border} max-w-md`}
        >
          <div className="flex justify-between items-start">
            <div>
              {title && <h3 className={`font-bold mb-1 ${styles.text}`}>{title}</h3>}
              <div className="text-slate-200 text-sm">{children}</div>
            </div>
            <button
              onClick={handleClose}
              className="ml-4 text-slate-400 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SystemNotification;
