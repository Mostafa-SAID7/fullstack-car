import { useState, useEffect, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../../hooks/useSettings';
import { SettingsHeader } from './components/SettingsHeader';
import { ProfileSettings } from './components/ProfileSettings';
import { SecuritySettings } from './components/SecuritySettings';
import { AppearanceSettings } from './components/AppearanceSettings';
import { DangerZone } from './components/DangerZone';
import { SettingsModals } from './components/SettingsModals';

export const Settings = () => {
  const { t } = useTranslation();
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 pb-20"
    >
      <SettingsHeader successMessage={successMessage} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
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
          <DangerZone
            onDeactivate={() => setShowModals(prev => ({ ...prev, deactivate: true }))}
            onDelete={() => setShowModals(prev => ({ ...prev, delete: true }))}
          />
        </div>

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
          <AppearanceSettings />
        </div>
      </div>

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