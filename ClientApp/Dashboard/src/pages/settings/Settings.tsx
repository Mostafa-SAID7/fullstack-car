import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Shield, Palette, AlertTriangle } from 'lucide-react';
import { useSettings } from '../../hooks';
import { SettingsHeader } from './components/SettingsHeader';
import { ProfileSettings } from './components/ProfileSettings';
import { SecuritySettings } from './components/SecuritySettings';
import { AppearanceSettings } from './components/AppearanceSettings';
import { DangerZone } from './components/DangerZone';
import { SettingsModals } from './components/SettingsModals';
import { TabNavigation, TabContent } from '../../components/layout/tabs/TabNavigation';
import { ThemeManager } from '../../components/special/theme-provider/ThemeManager';

export const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const {
    user,
    profileData,
    setProfileData,
    successMessage,
    loading,
    error,
    sessions,
    logs,
    is2FAEnabled,
    showModals,
    setShowModals,
    handleProfileSubmit,
    handleAvatarUpload,
    handleAvatarDelete,
    handlePrivacyToggle,
    handlePasswordSubmit,
    handleRevokeSession,
    handleToggle2FA,
    handleDeactivate,
    handleDeleteAccount,
    passwordData,
    setPasswordData,
    deactivateReason,
    setDeactivateReason,
    deletePassword,
    setDeletePassword
  } = useSettings();

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
    { id: 'security', label: 'Security', icon: <Shield className="w-4 h-4" /> },
    { id: 'appearance', label: 'Appearance', icon: <Palette className="w-4 h-4" /> },
    { id: 'theme', label: 'Theme Manager', icon: <Palette className="w-4 h-4" /> },
    { id: 'danger', label: 'Danger Zone', icon: <AlertTriangle className="w-4 h-4" /> }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <ProfileSettings
              user={user}
              profileData={profileData}
              setProfileData={setProfileData}
              onSubmit={handleProfileSubmit}
              onAvatarUpload={handleAvatarUpload}
              onAvatarDelete={handleAvatarDelete}
              loading={loading}
              error={error}
            />
          </div>
        );
      case 'security':
        return (
          <div className="space-y-6">
            <SecuritySettings
              profileData={profileData}
              onPrivacyToggle={handlePrivacyToggle}
              onPasswordChange={() => setShowModals(prev => ({ ...prev, password: true }))}
              onSessionsView={() => setShowModals(prev => ({ ...prev, sessions: true }))}
              onLogsView={() => setShowModals(prev => ({ ...prev, logs: true }))}
              is2FAEnabled={is2FAEnabled}
              onToggle2FA={handleToggle2FA}
              sessionsCount={sessions.length}
            />
          </div>
        );
      case 'appearance':
        return (
          <div className="space-y-6">
            <AppearanceSettings />
          </div>
        );
      case 'theme':
        return <ThemeManager />;
      case 'danger':
        return (
          <div className="space-y-6">
            <DangerZone
              onDeactivate={() => setShowModals(prev => ({ ...prev, deactivate: true }))}
              onDelete={() => setShowModals(prev => ({ ...prev, delete: true }))}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 pb-20"
    >
      <SettingsHeader successMessage={successMessage || undefined} />

      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <TabContent activeTab={activeTab}>
        {renderTabContent()}
      </TabContent>

      <SettingsModals
        showModals={showModals}
        setShowModals={setShowModals}
        passwordData={passwordData}
        setPasswordData={setPasswordData}
        deactivateReason={deactivateReason}
        setDeactivateReason={setDeactivateReason}
        deletePassword={deletePassword}
        setDeletePassword={setDeletePassword}
        sessions={sessions}
        logs={logs}
        loading={loading}
        onPasswordSubmit={handlePasswordSubmit}
        onRevokeSession={handleRevokeSession}
        onDeactivate={handleDeactivate}
        onDeleteAccount={handleDeleteAccount}
      />
    </motion.div>
  );
};