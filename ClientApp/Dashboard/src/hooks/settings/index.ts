import { useState, useEffect } from 'react';
import { useAuth } from '../auth';
import { authService } from '../../services/auth';
import type { UserSessionResponse, SecurityLogResponse } from '../../types/auth/responses';

export const useSettings = () => {
  const {
    user, updateProfile, changePassword,
    loading, error, getActiveSessions, revokeSession,
    getTwoFactorStatus, toggleTwoFactor, uploadAvatar,
    deleteAvatar, getPrivacySettings, updatePrivacySettings,
    deactivateAccount, deleteAccount
  } = useAuth();

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showModals, setShowModals] = useState({
    password: false,
    sessions: false,
    logs: false,
    deactivate: false,
    delete: false
  });

  // Data state
  const [sessions, setSessions] = useState<UserSessionResponse[]>([]);
  const [logs] = useState<SecurityLogResponse[]>([]);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [deactivateReason, setDeactivateReason] = useState('');
  const [deletePassword, setDeletePassword] = useState('');

  // Profile Form State
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    bio: '',
    isEmailPublic: true,
    isPhonePublic: false,
    allowDirectMessages: true,
    showOnlineStatus: true
  });

  // Password Form State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Initialize data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, sessionsRes, twoFactorRes, privacyRes] = await Promise.all([
          authService.getProfile(),
          getActiveSessions(),
          getTwoFactorStatus(),
          getPrivacySettings()
        ]);

        if (profileRes.succeeded && profileRes.data) {
          setProfileData(prev => ({
            ...prev,
            firstName: profileRes.data!.firstName,
            lastName: profileRes.data!.lastName,
            bio: profileRes.data!.bio || '',
          }));
        }

        if (privacyRes) {
          setProfileData(prev => ({
            ...prev,
            isEmailPublic: privacyRes.isEmailPublic,
            isPhonePublic: privacyRes.isPhonePublic,
            allowDirectMessages: privacyRes.allowDirectMessages,
            showOnlineStatus: privacyRes.showOnlineStatus
          }));
        }

        if (sessionsRes.succeeded && sessionsRes.data) {
          setSessions(sessionsRes.data);
        }

        if (twoFactorRes) {
          setIs2FAEnabled(twoFactorRes.enabled);
        }
      } catch (err) {
        console.error('Failed to fetch settings data:', err);
      }
    };
    fetchData();
  }, []);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(profileData);
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      // Error handled by useAuth
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await uploadAvatar(file);
      setSuccessMessage('Avatar uploaded successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      // Error handled
    }
  };

  const handleAvatarDelete = async () => {
    if (window.confirm('Delete profile picture?')) {
      try {
        await deleteAvatar();
        setSuccessMessage('Avatar removed');
        setTimeout(() => setSuccessMessage(null), 3000);
      } catch (err) { }
    }
  };

  const handlePrivacyToggle = async (key: keyof typeof profileData) => {
    const newData = { ...profileData, [key]: !profileData[key] };
    setProfileData(newData);
    try {
      await updatePrivacySettings(newData);
    } catch (err) {
      setProfileData(profileData);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await changePassword(passwordData);
      setSuccessMessage('Password changed successfully!');
      setShowModals(prev => ({ ...prev, password: false }));
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      // Error handled by useAuth
    }
  };

  const handleRevokeSession = async (sessionId: string) => {
    if (window.confirm('Are you sure you want to revoke this session?')) {
      try {
        await revokeSession(sessionId);
        setSessions(sessions.filter(s => s.sessionId !== sessionId));
        setSuccessMessage('Session revoked successfully');
        setTimeout(() => setSuccessMessage(null), 3000);
      } catch (err) {
        // Error handled by useAuth
      }
    }
  };

  const handleToggle2FA = async () => {
    const nextValue = !is2FAEnabled;
    const action = nextValue ? 'enable' : 'disable';
    if (window.confirm(`Are you sure you want to ${action} Two-Factor Authentication?`)) {
      try {
        await toggleTwoFactor(nextValue);
        setIs2FAEnabled(nextValue);
        setSuccessMessage(`2FA ${nextValue ? 'enabled' : 'disabled'} successfully`);
        setTimeout(() => setSuccessMessage(null), 3000);
      } catch (err) {
        // Error handled by useAuth
      }
    }
  };

  const handleDeactivate = async () => {
    try {
      await deactivateAccount(deactivateReason);
      setSuccessMessage('Account deactivated. Logging out...');
    } catch (err) { }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount(deletePassword);
      setSuccessMessage('Account deleted. Logging out...');
    } catch (err) { }
  };

  return {
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
  };
};
