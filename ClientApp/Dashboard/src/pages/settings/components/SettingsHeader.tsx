import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Settings, CheckCircle } from 'lucide-react';

interface SettingsHeaderProps {
  successMessage?: string;
}

export const SettingsHeader: React.FC<SettingsHeaderProps> = ({ successMessage }) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-card to-card/80 border border-border/50 p-6 md:p-8 shadow-xl">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-42 h-42 md:w-56 md:h-56 bg-indigo-500/5 rounded-full blur-xl md:blur-2xl -translate-y-21 md:-translate-y-28 translate-x-21 md:translate-x-28" />
        <div className="absolute bottom-0 left-0 w-36 h-36 md:w-48 md:h-48 bg-purple-500/5 rounded-full blur-xl md:blur-xl translate-y-18 md:translate-y-24 -translate-x-18 md:-translate-x-24" />

        <div className="relative flex items-center gap-4 md:gap-6">
          <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-3xl flex items-center justify-center shadow-xl">
            <Settings className="w-7 h-7 md:w-8 md:h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-1">
              {t('settings', 'Settings')}
            </h1>
            <div className="w-20 h-1 md:w-24 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mb-3" />
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
              {t('settings_description', 'Manage your account settings, security preferences, and system configuration')}
            </p>
            <div className="flex items-center gap-2 mt-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm text-muted-foreground font-medium">All Settings Synced</span>
            </div>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-6 flex items-center gap-4 shadow-sm"
        >
          <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h4 className="font-semibold text-green-800 dark:text-green-200">Success!</h4>
            <p className="text-green-700 dark:text-green-300 text-sm">{successMessage}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};