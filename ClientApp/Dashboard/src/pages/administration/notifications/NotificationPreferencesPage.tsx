import React from 'react';
import { NotificationPreferences } from '../../../components/notification/NotificationPreferences';

/**
 * Notification Preferences Page
 * Standalone page for managing notification preferences in the administration section
 */
export const NotificationPreferencesPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <NotificationPreferences />
    </div>
  );
};

export default NotificationPreferencesPage;
