import React from 'react';
import { NotificationPreferences } from '../../../components/notification/NotificationPreferences';

/**
 * Notification Settings Component
 * Wrapper for NotificationPreferences in the Settings page
 */
export const NotificationSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <NotificationPreferences />
    </div>
  );
};

export default NotificationSettings;
