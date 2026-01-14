import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Calendar, Clock, Sparkles } from 'lucide-react';
import type { DashboardHeaderProps } from '../../../types/pages/dashboard/main';

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ user }) => {
  const { t } = useTranslation('dashboard');

  const currentTime = new Date();
  const greetingKey = currentTime.getHours() < 12 ? 'good_morning' :
    currentTime.getHours() < 18 ? 'good_afternoon' : 'good_evening';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="relative overflow-hidden rounded-3xl bg-card border border-border p-8 shadow-lg">
        {/* Background decoration */}

        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-3xl flex items-center justify-center shadow-xl">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
              </svg>
            </div>
            <div>
              <motion.h1
                className="text-3xl lg:text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                {t('overview')}
              </motion.h1>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-green-500 rounded-full mb-3" />
              <motion.p
                className="text-muted-foreground text-lg leading-relaxed"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                {t(greetingKey)}, {user?.firstName || 'Admin'}! Welcome to your Community Car dashboard overview. 👋
              </motion.p>
              <div className="flex items-center gap-2 mt-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm text-muted-foreground font-medium">{t('system_online')}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
            <motion.div
              className="bg-card border border-border/30 rounded-2xl p-4 md:p-5 flex items-center gap-3 md:gap-4 shadow-sm hover:shadow-md transition-all"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-card-foreground truncate">
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
            </motion.div>

            <motion.div
              className="bg-card border border-border/30 rounded-2xl p-4 md:p-5 flex items-center gap-3 md:gap-4 shadow-sm hover:shadow-md transition-all"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-card-foreground">
                  {currentTime.toLocaleTimeString(undefined, {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t('local_time')}
                </p>
              </div>
            </motion.div>

            <motion.div
              className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 rounded-2xl p-4 md:p-5 flex items-center gap-3 md:gap-4 shadow-sm hover:shadow-md transition-all"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-pink-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-pink-600">
                  {t('ai_powered')}
                </p>
                <p className="text-xs text-pink-500/70">
                  {t('smart_insights')}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};