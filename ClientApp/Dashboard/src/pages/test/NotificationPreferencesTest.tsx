import React from 'react';
import { NotificationPreferences } from '../../components/notification/NotificationPreferences';

/**
 * Notification Preferences Test Page
 * Test page for the NotificationPreferences component
 */
export const NotificationPreferencesTest: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Notification Preferences Component Test
        </h1>
        <p className="text-gray-600">
          This page demonstrates the NotificationPreferences component functionality.
        </p>
      </div>

      <NotificationPreferences 
        onSave={() => {
          console.log('Preferences saved!');
        }}
      />
    </div>
  );
};

export default NotificationPreferencesTest;
