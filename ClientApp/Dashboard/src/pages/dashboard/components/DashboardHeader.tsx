import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Calendar, Clock, Sparkles } from 'lucide-react';
import type { User } from '../../../types/auth';

interface DashboardHeaderProps {
  user: User | null;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ user }) => {
  const { t } = useTranslation();
  
  const currentTime = new Date();
  const greeting = currentTime.getHours() < 12 ? 'Good morning' : 
                  currentTime.getHours() < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <motion.h1 
            className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            {greeting}, {user?.firstName || 'Admin'}! 👋
          </motion.h1>
          <motion.p 
            className="text-muted-foreground text-lg"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {t('dashboard_welcome', 'Welcome back to your Community Car dashboard')}
          </motion.p>
        </div>

        <motion.div 
          className="flex flex-col sm:flex-row gap-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="glass rounded-2xl p-4 flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">
                {currentTime.toLocaleDateString('en-US', { 
                  weekday: 'long',
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
              <p className="text-xs text-muted-foreground">
                {currentTime.getFullYear()}
              </p>
            </div>
          </div>

          <div className="glass rounded-2xl p-4 flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-green-500" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">
                {currentTime.toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
              <p className="text-xs text-muted-foreground">
                Local time
              </p>
            </div>
          </div>

          <div className="glass rounded-2xl p-4 flex items-center gap-3 min-w-0 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-primary">
                AI Powered
              </p>
              <p className="text-xs text-primary/70">
                Smart insights
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};