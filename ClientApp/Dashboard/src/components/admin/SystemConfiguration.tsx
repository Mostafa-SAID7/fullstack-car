/**
 * SystemConfiguration Component
 * System settings and configuration management for Super Administrators
 */

import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { AdminRole } from '../../types/admin';
import { 
  Settings,
  Shield,
  Save,
  RefreshCw,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle,
  Lock,
  Globe,
  Mail,
  Database,
  Server,
  Clock,
  Eye,
  EyeOff,
  Key,
  Zap,
  Bell,
  Users,
  FileText,
  Monitor
} from 'lucide-react';

interface SystemConfig {
  general: {
    siteName: string;
    siteUrl: string;
    adminEmail: string;
    timezone: string;
    language: string;
    maintenanceMode: boolean;
  };
  security: {
    sessionTimeout: number;
    maxLoginAttempts: number;
    passwordMinLength: number;
    requireTwoFactor: boolean;
    allowedIpRanges: string[];
    encryptionEnabled: boolean;
  };
  database: {
    connectionString: string;
    backupFrequency: string;
    retentionDays: number;
    performanceMode: string;
  };
  notifications: {
    emailEnabled: boolean;
    smtpServer: string;
    smtpPort: number;
    smtpUsername: string;
    smtpPassword: string;
    systemAlerts: boolean;
    userNotifications: boolean;
  };
  performance: {
    cacheEnabled: boolean;
    cacheDuration: number;
    compressionEnabled: boolean;
    cdnEnabled: boolean;
    maxConcurrentUsers: number;
  };
  monitoring: {
    loggingLevel: string;
    auditTrail: boolean;
    performanceMetrics: boolean;
    errorReporting: boolean;
    analyticsEnabled: boolean;
  };
}

const SystemConfiguration: React.FC = () => {
  const { adminUser, hasRole } = useAdminAuth();
  const [config, setConfig] = useState<SystemConfig>({
    general: {
      siteName: '',
      siteUrl: '',
      adminEmail: '',
      timezone: 'UTC',
      language: 'en',
      maintenanceMode: false,
    },
    security: {
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      passwordMinLength: 8,
      requireTwoFactor: false,
      allowedIpRanges: [],
      encryptionEnabled: true,
    },
    database: {
      connectionString: '',
      backupFrequency: 'daily',
      retentionDays: 30,
      performanceMode: 'balanced',
    },
    notifications: {
      emailEnabled: false,
      smtpServer: '',
      smtpPort: 587,
      smtpUsername: '',
      smtpPassword: '',
      systemAlerts: true,
      userNotifications: true,
    },
    performance: {
      cacheEnabled: true,
      cacheDuration: 3600,
      compressionEnabled: true,
      cdnEnabled: false,
      maxConcurrentUsers: 1000,
    },
    monitoring: {
      loggingLevel: 'info',
      auditTrail: true,
      performanceMetrics: true,
      errorReporting: true,
      analyticsEnabled: false,
    },
  });

  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Check if user has super admin role
  if (!hasRole(AdminRole.SUPER_ADMIN)) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
          <p className="text-gray-600">You need Super Administrator privileges to access system configuration.</p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    loadConfiguration();
  }, []);

  const loadConfiguration = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/admin/system/config');
      if (response.ok) {
        const data = await response.json();
        setConfig(data);
      }
    } catch (error) {
      console.error('Failed to load configuration:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveConfiguration = async () => {
    setSaving(true);
    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/admin/system/config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      if (response.ok) {
        setLastSaved(new Date());
        setHasChanges(false);
      }
    } catch (error) {
      console.error('Failed to save configuration:', error);
    } finally {
      setSaving(false);
    }
  };

  const exportConfiguration = () => {
    const dataStr = JSON.stringify(config, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `system-config-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importConfiguration = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedConfig = JSON.parse(e.target?.result as string);
          setConfig(importedConfig);
          setHasChanges(true);
        } catch (error) {
          console.error('Failed to import configuration:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  const updateConfig = (section: keyof SystemConfig, field: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
    setHasChanges(true);
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'database', label: 'Database', icon: Database },
    { id: 'notifications', label: 'Notifications', icon: Mail },
    { id: 'performance', label: 'Performance', icon: Zap },
    { id: 'monitoring', label: 'Monitoring', icon: Monitor },
  ];

  const renderGeneralTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Globe className="h-4 w-4 inline mr-2" />
            Site Name
          </label>
          <input
            type="text"
            value={config.general.siteName}
            onChange={(e) => updateConfig('general', 'siteName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter site name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Globe className="h-4 w-4 inline mr-2" />
            Site URL
          </label>
          <input
            type="url"
            value={config.general.siteUrl}
            onChange={(e) => updateConfig('general', 'siteUrl', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Mail className="h-4 w-4 inline mr-2" />
            Admin Email
          </label>
          <input
            type="email"
            value={config.general.adminEmail}
            onChange={(e) => updateConfig('general', 'adminEmail', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="admin@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Clock className="h-4 w-4 inline mr-2" />
            Timezone
          </label>
          <select
            value={config.general.timezone}
            onChange={(e) => updateConfig('general', 'timezone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="UTC">UTC</option>
            <option value="America/New_York">Eastern Time</option>
            <option value="America/Chicago">Central Time</option>
            <option value="America/Denver">Mountain Time</option>
            <option value="America/Los_Angeles">Pacific Time</option>
            <option value="Europe/London">London</option>
            <option value="Europe/Paris">Paris</option>
            <option value="Asia/Tokyo">Tokyo</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Globe className="h-4 w-4 inline mr-2" />
            Language
          </label>
          <select
            value={config.general.language}
            onChange={(e) => updateConfig('general', 'language', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="it">Italian</option>
            <option value="pt">Portuguese</option>
          </select>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="maintenanceMode"
            checked={config.general.maintenanceMode}
            onChange={(e) => updateConfig('general', 'maintenanceMode', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="maintenanceMode" className="ml-2 block text-sm text-gray-700">
            <AlertTriangle className="h-4 w-4 inline mr-1 text-orange-500" />
            Maintenance Mode
          </label>
        </div>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Clock className="h-4 w-4 inline mr-2" />
            Session Timeout (minutes)
          </label>
          <input
            type="number"
            value={config.security.sessionTimeout}
            onChange={(e) => updateConfig('security', 'sessionTimeout', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="5"
            max="480"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Shield className="h-4 w-4 inline mr-2" />
            Max Login Attempts
          </label>
          <input
            type="number"
            value={config.security.maxLoginAttempts}
            onChange={(e) => updateConfig('security', 'maxLoginAttempts', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="3"
            max="10"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Key className="h-4 w-4 inline mr-2" />
            Password Min Length
          </label>
          <input
            type="number"
            value={config.security.passwordMinLength}
            onChange={(e) => updateConfig('security', 'passwordMinLength', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="6"
            max="32"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="requireTwoFactor"
            checked={config.security.requireTwoFactor}
            onChange={(e) => updateConfig('security', 'requireTwoFactor', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="requireTwoFactor" className="ml-2 block text-sm text-gray-700">
            <Shield className="h-4 w-4 inline mr-1" />
            Require Two-Factor Authentication
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="encryptionEnabled"
            checked={config.security.encryptionEnabled}
            onChange={(e) => updateConfig('security', 'encryptionEnabled', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="encryptionEnabled" className="ml-2 block text-sm text-gray-700">
            <Lock className="h-4 w-4 inline mr-1" />
            Enable Encryption
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Globe className="h-4 w-4 inline mr-2" />
          Allowed IP Ranges (one per line)
        </label>
        <textarea
          value={config.security.allowedIpRanges.join('\n')}
          onChange={(e) => updateConfig('security', 'allowedIpRanges', e.target.value.split('\n').filter(ip => ip.trim()))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
          placeholder="192.168.1.0/24&#10;10.0.0.0/8"
        />
      </div>
    </div>
  );

  const renderDatabaseTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Database className="h-4 w-4 inline mr-2" />
            Connection String
          </label>
          <div className="relative">
            <input
              type={showPasswords ? 'text' : 'password'}
              value={config.database.connectionString}
              onChange={(e) => updateConfig('database', 'connectionString', e.target.value)}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Server=localhost;Database=mydb;..."
            />
            <button
              type="button"
              onClick={() => setShowPasswords(!showPasswords)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <RefreshCw className="h-4 w-4 inline mr-2" />
            Backup Frequency
          </label>
          <select
            value={config.database.backupFrequency}
            onChange={(e) => updateConfig('database', 'backupFrequency', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="hourly">Hourly</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Clock className="h-4 w-4 inline mr-2" />
            Retention Days
          </label>
          <input
            type="number"
            value={config.database.retentionDays}
            onChange={(e) => updateConfig('database', 'retentionDays', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="1"
            max="365"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Zap className="h-4 w-4 inline mr-2" />
            Performance Mode
          </label>
          <select
            value={config.database.performanceMode}
            onChange={(e) => updateConfig('database', 'performanceMode', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="conservative">Conservative</option>
            <option value="balanced">Balanced</option>
            <option value="aggressive">Aggressive</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center mb-4">
        <input
          type="checkbox"
          id="emailEnabled"
          checked={config.notifications.emailEnabled}
          onChange={(e) => updateConfig('notifications', 'emailEnabled', e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="emailEnabled" className="ml-2 block text-sm font-medium text-gray-700">
          <Mail className="h-4 w-4 inline mr-1" />
          Enable Email Notifications
        </label>
      </div>

      {config.notifications.emailEnabled && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Server className="h-4 w-4 inline mr-2" />
              SMTP Server
            </label>
            <input
              type="text"
              value={config.notifications.smtpServer}
              onChange={(e) => updateConfig('notifications', 'smtpServer', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="smtp.gmail.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Server className="h-4 w-4 inline mr-2" />
              SMTP Port
            </label>
            <input
              type="number"
              value={config.notifications.smtpPort}
              onChange={(e) => updateConfig('notifications', 'smtpPort', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="587"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Users className="h-4 w-4 inline mr-2" />
              SMTP Username
            </label>
            <input
              type="text"
              value={config.notifications.smtpUsername}
              onChange={(e) => updateConfig('notifications', 'smtpUsername', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="username@gmail.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Key className="h-4 w-4 inline mr-2" />
              SMTP Password
            </label>
            <div className="relative">
              <input
                type={showPasswords ? 'text' : 'password'}
                value={config.notifications.smtpPassword}
                onChange={(e) => updateConfig('notifications', 'smtpPassword', e.target.value)}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter password"
              />
              <button
                type="button"
                onClick={() => setShowPasswords(!showPasswords)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="systemAlerts"
            checked={config.notifications.systemAlerts}
            onChange={(e) => updateConfig('notifications', 'systemAlerts', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="systemAlerts" className="ml-2 block text-sm text-gray-700">
            <Bell className="h-4 w-4 inline mr-1" />
            System Alerts
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="userNotifications"
            checked={config.notifications.userNotifications}
            onChange={(e) => updateConfig('notifications', 'userNotifications', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="userNotifications" className="ml-2 block text-sm text-gray-700">
            <Users className="h-4 w-4 inline mr-1" />
            User Notifications
          </label>
        </div>
      </div>
    </div>
  );

  const renderPerformanceTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Clock className="h-4 w-4 inline mr-2" />
            Cache Duration (seconds)
          </label>
          <input
            type="number"
            value={config.performance.cacheDuration}
            onChange={(e) => updateConfig('performance', 'cacheDuration', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="60"
            max="86400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Users className="h-4 w-4 inline mr-2" />
            Max Concurrent Users
          </label>
          <input
            type="number"
            value={config.performance.maxConcurrentUsers}
            onChange={(e) => updateConfig('performance', 'maxConcurrentUsers', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="100"
            max="10000"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="cacheEnabled"
            checked={config.performance.cacheEnabled}
            onChange={(e) => updateConfig('performance', 'cacheEnabled', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="cacheEnabled" className="ml-2 block text-sm text-gray-700">
            <Zap className="h-4 w-4 inline mr-1" />
            Enable Caching
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="compressionEnabled"
            checked={config.performance.compressionEnabled}
            onChange={(e) => updateConfig('performance', 'compressionEnabled', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="compressionEnabled" className="ml-2 block text-sm text-gray-700">
            <Zap className="h-4 w-4 inline mr-1" />
            Enable Compression
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="cdnEnabled"
            checked={config.performance.cdnEnabled}
            onChange={(e) => updateConfig('performance', 'cdnEnabled', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="cdnEnabled" className="ml-2 block text-sm text-gray-700">
            <Globe className="h-4 w-4 inline mr-1" />
            Enable CDN
          </label>
        </div>
      </div>
    </div>
  );

  const renderMonitoringTab = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <FileText className="h-4 w-4 inline mr-2" />
          Logging Level
        </label>
        <select
          value={config.monitoring.loggingLevel}
          onChange={(e) => updateConfig('monitoring', 'loggingLevel', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="debug">Debug</option>
          <option value="info">Info</option>
          <option value="warn">Warning</option>
          <option value="error">Error</option>
        </select>
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="auditTrail"
            checked={config.monitoring.auditTrail}
            onChange={(e) => updateConfig('monitoring', 'auditTrail', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="auditTrail" className="ml-2 block text-sm text-gray-700">
            <FileText className="h-4 w-4 inline mr-1" />
            Audit Trail
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="performanceMetrics"
            checked={config.monitoring.performanceMetrics}
            onChange={(e) => updateConfig('monitoring', 'performanceMetrics', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="performanceMetrics" className="ml-2 block text-sm text-gray-700">
            <Monitor className="h-4 w-4 inline mr-1" />
            Performance Metrics
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="errorReporting"
            checked={config.monitoring.errorReporting}
            onChange={(e) => updateConfig('monitoring', 'errorReporting', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="errorReporting" className="ml-2 block text-sm text-gray-700">
            <AlertTriangle className="h-4 w-4 inline mr-1" />
            Error Reporting
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="analyticsEnabled"
            checked={config.monitoring.analyticsEnabled}
            onChange={(e) => updateConfig('monitoring', 'analyticsEnabled', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="analyticsEnabled" className="ml-2 block text-sm text-gray-700">
            <Monitor className="h-4 w-4 inline mr-1" />
            Analytics
          </label>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralTab();
      case 'security':
        return renderSecurityTab();
      case 'database':
        return renderDatabaseTab();
      case 'notifications':
        return renderNotificationsTab();
      case 'performance':
        return renderPerformanceTab();
      case 'monitoring':
        return renderMonitoringTab();
      default:
        return renderGeneralTab();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">System Configuration</h1>
        <p className="text-gray-600">Manage system-wide settings and configuration options.</p>
      </div>

      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={saveConfiguration}
            disabled={saving || !hasChanges}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>

          <button
            onClick={loadConfiguration}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reload
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={exportConfiguration}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>

          <label className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 cursor-pointer">
            <Upload className="h-4 w-4 mr-2" />
            Import
            <input
              type="file"
              accept=".json"
              onChange={importConfiguration}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Status Bar */}
      {(hasChanges || lastSaved) && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            {hasChanges && (
              <div className="flex items-center text-orange-600">
                <AlertTriangle className="h-4 w-4 mr-2" />
                <span className="text-sm">You have unsaved changes</span>
              </div>
            )}
            {lastSaved && !hasChanges && (
              <div className="flex items-center text-green-600">
                <CheckCircle className="h-4 w-4 mr-2" />
                <span className="text-sm">
                  Last saved: {lastSaved.toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default SystemConfiguration;