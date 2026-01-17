import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Mail, Smartphone, MessageSquare, Save, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card, Button } from '../ui';
import { Switch } from '../forms/switches/Switch';
import { notificationPreferenceService } from '../../services/notification/preferences';
import type { NotificationPreferenceDto } from '../../types/notification';

interface NotificationPreferencesProps {
  userId?: string;
  onSave?: () => void;
}

/**
 * Notification Preferences Component
 * Allows users to manage their notification preferences across different channels
 * Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7
 */
export const NotificationPreferences: React.FC<NotificationPreferencesProps> = ({ userId, onSave }) => {
  const [preferences, setPreferences] = useState<NotificationPreferenceDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchPreferences();
  }, [userId]);

  const fetchPreferences = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await notificationPreferenceService.getPreferences();
      setPreferences(data);
    } catch (err) {
      setError('Failed to load notification preferences');
      console.error('Failed to fetch preferences:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleChannel = (preferenceId: string, channel: 'emailEnabled' | 'pushEnabled' | 'smsEnabled' | 'inAppEnabled') => {
    setPreferences(prev =>
      prev.map(pref =>
        pref.id === preferenceId
          ? { ...pref, [channel]: !pref[channel] }
          : pref
      )
    );
  };

  const handleFrequencyChange = (preferenceId: string, frequency: 'immediate' | 'daily' | 'weekly') => {
    setPreferences(prev =>
      prev.map(pref =>
        pref.id === preferenceId
          ? { ...pref, frequency }
          : pref
      )
    );
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      await notificationPreferenceService.updatePreferences(preferences);
      setSuccess(true);
      onSave?.();
      
      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to save notification preferences');
      console.error('Failed to save preferences:', err);
    } finally {
      setSaving(false);
    }
  };

  const getNotificationTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      system: 'System Notifications',
      marketplace: 'Marketplace Updates',
      user: 'User Activity',
      security: 'Security Alerts',
      maintenance: 'Maintenance Notices',
      promotion: 'Promotions & Offers',
      community: 'Community Updates'
    };
    return labels[type.toLowerCase()] || type;
  };

  const getNotificationTypeDescription = (type: string): string => {
    const descriptions: Record<string, string> = {
      system: 'Important system updates and announcements',
      marketplace: 'New listings, price changes, and marketplace activity',
      user: 'Messages, mentions, and user interactions',
      security: 'Security alerts and account activity',
      maintenance: 'Scheduled maintenance and downtime notifications',
      promotion: 'Special offers, discounts, and promotional content',
      community: 'Community posts, comments, and discussions'
    };
    return descriptions[type.toLowerCase()] || 'Notification updates';
  };

  if (loading) {
    return (
      <Card className="p-8">
        <div className="flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
          <p className="text-gray-600">Loading preferences...</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Bell className="w-6 h-6" />
            Notification Preferences
          </h2>
          <p className="text-gray-600 mt-1">
            Manage how you receive notifications across different channels
          </p>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3"
        >
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          <p className="text-green-800 font-medium">Preferences saved successfully!</p>
        </motion.div>
      )}

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3"
        >
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-red-800 font-medium">{error}</p>
        </motion.div>
      )}

      {/* Channel Legend */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Channels</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">Email</p>
              <p className="text-xs text-gray-500">Receive via email</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Smartphone className="w-5 h-5 text-green-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">Push</p>
              <p className="text-xs text-gray-500">Mobile & browser push</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MessageSquare className="w-5 h-5 text-purple-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">SMS</p>
              <p className="text-xs text-gray-500">Text messages</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-orange-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">In-App</p>
              <p className="text-xs text-gray-500">Within the application</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Preferences List */}
      <div className="space-y-4">
        {preferences.length > 0 ? (
          preferences.map((preference, index) => (
            <motion.div
              key={preference.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-6">
                <div className="space-y-4">
                  {/* Notification Type Header */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">
                      {getNotificationTypeLabel(preference.notificationType)}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {getNotificationTypeDescription(preference.notificationType)}
                    </p>
                  </div>

                  {/* Channel Toggles */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                    {/* Email */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-medium text-gray-700">Email</span>
                      </div>
                      <Switch
                        checked={preference.emailEnabled}
                        onCheckedChange={() => handleToggleChannel(preference.id, 'emailEnabled')}
                        aria-label={`Toggle email notifications for ${preference.notificationType}`}
                      />
                    </div>

                    {/* Push */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-medium text-gray-700">Push</span>
                      </div>
                      <Switch
                        checked={preference.pushEnabled}
                        onCheckedChange={() => handleToggleChannel(preference.id, 'pushEnabled')}
                        aria-label={`Toggle push notifications for ${preference.notificationType}`}
                      />
                    </div>

                    {/* SMS */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-purple-500" />
                        <span className="text-sm font-medium text-gray-700">SMS</span>
                      </div>
                      <Switch
                        checked={preference.smsEnabled}
                        onCheckedChange={() => handleToggleChannel(preference.id, 'smsEnabled')}
                        aria-label={`Toggle SMS notifications for ${preference.notificationType}`}
                      />
                    </div>

                    {/* In-App */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-orange-500" />
                        <span className="text-sm font-medium text-gray-700">In-App</span>
                      </div>
                      <Switch
                        checked={preference.inAppEnabled}
                        onCheckedChange={() => handleToggleChannel(preference.id, 'inAppEnabled')}
                        aria-label={`Toggle in-app notifications for ${preference.notificationType}`}
                      />
                    </div>
                  </div>

                  {/* Frequency Selector */}
                  <div className="pt-4 border-t border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notification Frequency
                    </label>
                    <div className="flex gap-2">
                      {(['immediate', 'daily', 'weekly'] as const).map((freq) => (
                        <button
                          key={freq}
                          onClick={() => handleFrequencyChange(preference.id, freq)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            preference.frequency === freq
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                          aria-label={`Set frequency to ${freq}`}
                        >
                          {freq.charAt(0).toUpperCase() + freq.slice(1)}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {preference.frequency === 'immediate' && 'Receive notifications as they happen'}
                      {preference.frequency === 'daily' && 'Receive a daily digest of notifications'}
                      {preference.frequency === 'weekly' && 'Receive a weekly summary of notifications'}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        ) : (
          <Card className="p-8">
            <div className="text-center">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">No notification preferences found</p>
              <p className="text-sm text-gray-500">
                Preferences will be created automatically when you receive your first notification
              </p>
            </div>
          </Card>
        )}
      </div>

      {/* Save Button */}
      {preferences.length > 0 && (
        <div className="flex justify-end gap-3 pt-4">
          <Button
            onClick={fetchPreferences}
            variant="outline"
            disabled={saving}
          >
            Reset
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Preferences
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default NotificationPreferences;
