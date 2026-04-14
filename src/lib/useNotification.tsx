import React, { createContext, useContext, useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';

type NotificationType = 'success' | 'error' | 'info';

interface NotificationContextType {
  showNotification: (message: string, type?: NotificationType) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notification, setNotification] = useState<{ message: string, type: NotificationType } | null>(null);

  const showNotification = (message: string, type: NotificationType = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className={`fixed bottom-8 left-1/2 z-[100] px-6 py-3 rounded-2xl shadow-2xl font-bold text-sm flex items-center gap-3 border ${
              notification.type === 'error' ? 'bg-red-50 text-red-600 border-red-100' : 
              notification.type === 'success' ? 'bg-green-50 text-green-600 border-green-100' : 
              'bg-white text-zinc-900 border-zinc-100'
            }`}
          >
            {notification.type === 'error' ? <AlertCircle className="w-4 h-4" /> : 
             notification.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : 
             <Info className="w-4 h-4" />}
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}
