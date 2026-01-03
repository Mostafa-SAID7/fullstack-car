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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Settings className="w-8 h-8" />
            {t('settings', 'Settings')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t('settings_description', 'Manage your account settings and preferences')}
          </p>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3"
        >
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-green-800">{successMessage}</span>
        </motion.div>
      )}
    </div>
  );
};