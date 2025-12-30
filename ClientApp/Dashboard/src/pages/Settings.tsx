import { useState, useEffect, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  User, Shield, Palette, X,
  Loader2, CheckCircle2, AlertCircle, History, Smartphone,
  Globe, Clock, Trash2
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/authService';
import type { UserSessionResponse, SecurityLogResponse } from '../types/auth';

export const Settings = () => {
  const { t } = useTranslation();
  const {
    user, updateProfile, changePassword, logout,
    loading, error, getActiveSessions, revokeSession,
    getTwoFactorStatus, toggleTwoFactor, uploadAvatar,
    deleteAvatar, getPrivacySettings, updatePrivacySettings,
    deactivateAccount, deleteAccount
  } = useAuth();

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showSessionsModal, setShowSessionsModal] = useState(false);
  const [showLogsModal, setShowLogsModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Data state
  const [sessions, setSessions] = useState<UserSessionResponse[]>([]);
  const [logs, setLogs] = useState<SecurityLogResponse[]>([]);
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

        if (privacyRes.succeeded && privacyRes.data) {
          setProfileData(prev => ({
            ...prev,
            isEmailPublic: privacyRes.data.isEmailPublic,
            isPhonePublic: privacyRes.data.isPhonePublic,
            allowDirectMessages: privacyRes.data.allowDirectMessages,
            showOnlineStatus: privacyRes.data.showOnlineStatus
          }));
        }

        if (sessionsRes.succeeded && sessionsRes.data) {
          setSessions(sessionsRes.data);
        }

        if (twoFactorRes.succeeded && twoFactorRes.data) {
          setIs2FAEnabled(twoFactorRes.data.isEnabled);
        }
      } catch (err) {
        console.error('Failed to fetch settings data:', err);
      }
    };
    fetchData();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await authService.getSecurityLogs();
      if (res.succeeded && res.data) {
        setLogs(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch logs:', err);
    }
  };

  useEffect(() => {
    if (showLogsModal) fetchLogs();
  }, [showLogsModal]);

  // Password Form State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

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
      // Revert on error
      setProfileData(profileData);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await changePassword(passwordData);
      setSuccessMessage('Password changed successfully!');
      setShowPasswordModal(false);
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 pb-20"
    >
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">{t('identity.profile.title')}</h1>
          <p className="text-muted-foreground/80 font-medium text-lg">{t('identity.profile.personalinfo')}</p>
        </div>

        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-center gap-2 bg-emerald-500/10 text-emerald-500 px-4 py-2 rounded-xl border border-emerald-500/20 font-bold"
            >
              <CheckCircle2 className="w-4 h-4" />
              {successMessage}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Settings */}
        <div className="lg:col-span-2 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card/40 backdrop-blur-md rounded-3xl border border-border/50 p-8"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-primary/10 rounded-lg">
                <User className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-bold text-xl">{t('identity.profile.personalinfo')}</h3>
            </div>

            <div className="flex flex-col md:flex-row gap-8 mb-8 items-center border-b border-border/50 pb-8">
              <div className="relative group">
                <div className="w-32 h-32 rounded-3xl overflow-hidden bg-muted flex items-center justify-center border-4 border-card shadow-xl group-hover:opacity-75 transition-opacity">
                  {user?.profileImageUrl ? (
                    <img src={user.profileImageUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-12 h-12 opacity-20" />
                  )}
                </div>
                <label className="absolute -bottom-2 -right-2 p-2 bg-primary text-primary-foreground rounded-xl cursor-pointer shadow-lg hover:scale-110 transition-transform">
                  <Smartphone className="w-4 h-4" />
                  <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                </label>
                {user?.profileImageUrl && (
                  <button
                    onClick={handleAvatarDelete}
                    className="absolute -top-2 -right-2 p-2 bg-red-500 text-white rounded-xl shadow-lg hover:scale-110 transition-transform"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div>
                <h4 className="font-black text-2xl mb-1">{user?.firstName} {user?.lastName}</h4>
                <p className="text-muted-foreground font-medium mb-4">{user?.email}</p>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase">User</span>
                  {user?.isEmailConfirmed && (
                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[10px] font-black uppercase">Verified</span>
                  )}
                </div>
              </div>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label={t('identity.profile.firstname')}
                  value={profileData.firstName}
                  onChange={(v: string) => setProfileData({ ...profileData, firstName: v })}
                />
                <Input
                  label={t('identity.profile.lastname')}
                  value={profileData.lastName}
                  onChange={(v: string) => setProfileData({ ...profileData, lastName: v })}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold mb-2 ml-1">{t('identity.profile.bio')}</label>
                <textarea
                  rows={3}
                  placeholder="Tell us about yourself..."
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  className="w-full bg-muted/50 border border-transparent focus:border-primary/20 focus:bg-background p-4 rounded-2xl outline-none transition-all resize-none font-medium h-32"
                />
              </div>

              <div className="flex flex-col gap-4">
                {error && (
                  <div className="flex items-center gap-2 text-red-500 bg-red-500/10 p-4 rounded-2xl border border-red-500/20 text-sm font-bold">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}
                <Button loading={loading} type="submit">{t('identity.profile.updateprofile')}</Button>
              </div>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-red-500/5 rounded-3xl border border-red-500/20 p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-500" />
              </div>
              <h3 className="font-bold text-xl text-red-500">Danger Zone</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 bg-card rounded-2xl border border-border/50">
                <h4 className="font-black mb-1">Deactivate Account</h4>
                <p className="text-xs text-muted-foreground mb-4 font-medium">Temporarily disable your account. You can return later.</p>
                <button
                  onClick={() => setShowDeactivateModal(true)}
                  className="w-full py-2 border border-border hover:bg-muted rounded-xl text-sm font-black transition-all"
                >
                  {t('identity.profile.deactivateAccount')}
                </button>
              </div>
              <div className="p-6 bg-red-500/10 rounded-2xl border border-red-500/20">
                <h4 className="font-black mb-1 text-red-500">Delete Account</h4>
                <p className="text-xs text-red-500/70 mb-4 font-medium">Permanently remove all data. This cannot be undone.</p>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="w-full py-2 bg-red-500 text-white rounded-xl text-sm font-black hover:bg-red-600 transition-all shadow-lg"
                >
                  {t('identity.profile.deleteAccount')}
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Side Panels */}
        <div className="space-y-6">
          {/* Privacy Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card/40 backdrop-blur-md rounded-2xl border border-border/50 p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Shield className="w-4 h-4 text-blue-500" />
              </div>
              <h4 className="font-bold">{t('identity.profile.privacy')}</h4>
            </div>
            <div className="space-y-4">
              <PrivacyToggle
                label="Public Email"
                description="Allow others to see your email"
                active={profileData.isEmailPublic}
                onClick={() => handlePrivacyToggle('isEmailPublic')}
              />
              <PrivacyToggle
                label="Public Phone"
                description="Show phone number to users"
                active={profileData.isPhonePublic}
                onClick={() => handlePrivacyToggle('isPhonePublic')}
              />
              <PrivacyToggle
                label="Direct Messages"
                description="Accept DMs from non-friends"
                active={profileData.allowDirectMessages}
                onClick={() => handlePrivacyToggle('allowDirectMessages')}
              />
              <PrivacyToggle
                label="Online Status"
                description="Show when you are active"
                active={profileData.showOnlineStatus}
                onClick={() => handlePrivacyToggle('showOnlineStatus')}
              />
            </div>
          </motion.div>

          {/* Security */}
          <div className="bg-card/40 backdrop-blur-md rounded-2xl border border-border/50 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Shield className="w-4 h-4 text-primary" />
              </div>
              <h4 className="font-bold">{t('identity.security.title')}</h4>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => setShowPasswordModal(true)}
                className="w-full text-left font-black text-xs hover:text-primary transition-colors flex items-center justify-between group p-3 bg-muted/30 rounded-xl"
              >
                {t('identity.password.changePassword')}
                <div className="bg-muted px-2 py-0.5 rounded text-[10px] group-hover:bg-primary/10 transition-colors uppercase">Update</div>
              </button>

              <div className="flex items-center justify-between group p-3 bg-muted/30 rounded-xl">
                <span className="text-xs font-black uppercase">{t('identity.security.twoFactorAuth')}</span>
                <button
                  onClick={handleToggle2FA}
                  className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${is2FAEnabled ? 'bg-primary' : 'bg-muted'}`}
                >
                  <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${is2FAEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              <button
                onClick={() => setShowSessionsModal(true)}
                className="w-full text-left font-black text-xs hover:text-primary transition-colors flex items-center justify-between group p-3 bg-muted/30 rounded-xl"
              >
                {t('identity.security.sessions')}
                <div className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[10px] uppercase font-black">{sessions.length}</div>
              </button>

              <button
                onClick={() => setShowLogsModal(true)}
                className="w-full text-left font-black text-xs hover:text-primary transition-colors flex items-center justify-between group p-3 bg-muted/30 rounded-xl"
              >
                {t('identity.security.securityLogs')}
                <History className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>
          </div>

          {/* Appearance */}
          <div className="bg-card/40 backdrop-blur-md rounded-2xl border border-border/50 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Palette className="w-4 h-4 text-purple-500" />
              </div>
              <h4 className="font-semibold">Appearance</h4>
            </div>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="radio" name="theme" defaultChecked className="accent-primary" />
                <span className="text-sm font-bold">Light Mode</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="radio" name="theme" className="accent-primary" />
                <span className="text-sm font-bold">Dark Mode</span>
              </label>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to log out?')) {
                logout();
              }
            }}
            className="w-full px-4 py-4 bg-red-500/10 text-red-500 rounded-2xl font-black hover:bg-red-500 hover:text-white transition-all shadow-sm uppercase text-xs tracking-widest"
          >
            {t('shared.common.common.logout')}
          </button>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showPasswordModal && (
          <Modal title={t('identity.password.changePassword')} icon={<Shield className="w-6 h-6 text-primary" />} onClose={() => setShowPasswordModal(false)}>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <Input
                label={t('identity.password.currentPassword')}
                type="password"
                value={passwordData.currentPassword}
                onChange={(v: string) => setPasswordData({ ...passwordData, currentPassword: v })}
                required
              />
              <div className="h-px bg-border/50 my-2" />
              <Input
                label={t('identity.password.newPassword')}
                type="password"
                value={passwordData.newPassword}
                onChange={(v: string) => setPasswordData({ ...passwordData, newPassword: v })}
                required
              />
              <Input
                label={t('identity.password.confirmPassword')}
                type="password"
                value={passwordData.confirmPassword}
                onChange={(v: string) => setPasswordData({ ...passwordData, confirmPassword: v })}
                required
              />
              <Button loading={loading} type="submit">{t('identity.password.changePassword')}</Button>
            </form>
          </Modal>
        )}

        {showSessionsModal && (
          <Modal title={t('identity.security.sessions')} icon={<Smartphone className="w-6 h-6 text-primary" />} onClose={() => setShowSessionsModal(false)}>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              {sessions.map(session => (
                <div key={session.sessionId} className="bg-muted/50 p-4 rounded-2xl border border-transparent hover:border-primary/20 transition-all flex justify-between items-center group">
                  <div className="flex gap-3">
                    <div className="p-2 bg-primary/10 rounded-xl h-fit">
                      <Globe className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <div className="font-bold text-sm flex items-center gap-2">
                        {session.deviceInfo || 'Unknown Device'}
                        {session.isCurrentSession && <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded font-black">CURRENT</span>}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">{session.ipAddress} • {new Date(session.lastActivity).toLocaleDateString()}</div>
                    </div>
                  </div>
                  {!session.isCurrentSession && (
                    <button
                      onClick={() => handleRevokeSession(session.sessionId)}
                      className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </Modal>
        )}

        {showLogsModal && (
          <Modal title="Activity Log" icon={<History className="w-6 h-6 text-primary" />} onClose={() => setShowLogsModal(false)}>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              {logs.map(log => (
                <div key={log.id} className="p-3 rounded-xl border border-border/50 text-xs flex gap-3 bg-muted/20">
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${log.isSuccessful ? 'bg-emerald-500' : 'bg-red-500'}`} />
                  <div>
                    <div className="font-bold flex items-center gap-2">
                      {log.eventType}
                      <span className="text-muted-foreground font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-muted-foreground/80 mt-0.5 font-medium">{log.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Modal>
        )}

        {showDeactivateModal && (
          <Modal title={t('identity.profile.deactivateAccount')} icon={<AlertCircle className="w-6 h-6 text-orange-500" />} onClose={() => setShowDeactivateModal(false)}>
            <div className="space-y-4">
              <p className="text-sm font-medium text-muted-foreground">Please tell us why you are leaving (optional):</p>
              <textarea
                value={deactivateReason}
                onChange={(e) => setDeactivateReason(e.target.value)}
                placeholder="Reason..."
                className="w-full bg-muted/50 p-4 rounded-xl border border-transparent focus:border-primary/20 h-24 outline-none font-medium text-sm"
              />
              <Button loading={loading} onClick={handleDeactivate}>Deactivate now</Button>
            </div>
          </Modal>
        )}

        {showDeleteModal && (
          <Modal title={t('identity.profile.deleteAccount')} icon={<Trash2 className="w-6 h-6 text-red-500" />} onClose={() => setShowDeleteModal(false)}>
            <div className="space-y-4">
              <div className="p-4 bg-red-500/10 rounded-xl border border-red-500/20 text-red-500 text-xs font-black uppercase leading-relaxed">
                Warning: This action is permanent and cannot be undone. All your posts, cars, and data will be deleted.
              </div>
              <Input
                label="Confirm with Password"
                type="password"
                value={deletePassword}
                onChange={(v) => setDeletePassword(v)}
                required
              />
              <button
                disabled={loading || !deletePassword}
                onClick={handleDeleteAccount}
                className="w-full py-4 bg-red-500 text-white rounded-2xl font-black hover:bg-black transition-all shadow-xl disabled:opacity-50 mt-4"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Confirm Permanent Deletion'}
              </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Layout Components
interface ModalProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  onClose: () => void;
}

const Modal = ({ title, icon, children, onClose }: ModalProps) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="absolute inset-0 bg-background/80 backdrop-blur-sm"
    />
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      className="relative w-full max-w-lg bg-card rounded-[2.5rem] border border-border shadow-2xl p-8 overflow-hidden"
    >
      <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-muted rounded-full transition-colors">
        <X className="w-4 h-4" />
      </button>
      <div className="mb-8">
        <div className="p-4 bg-muted/50 rounded-2xl w-fit mb-4">{icon}</div>
        <h3 className="text-3xl font-black">{title}</h3>
      </div>
      {children}
    </motion.div>
  </div>
);

const Input = ({ label, type = 'text', value, onChange, required }: { label: string; type?: string; value: string; onChange: (v: string) => void; required?: boolean }) => (
  <div>
    <label className="block text-sm font-bold mb-2 ml-1">{label}</label>
    <input
      type={type}
      required={required}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-muted/50 border border-transparent focus:border-primary/20 focus:bg-background h-12 px-4 rounded-2xl outline-none transition-all"
    />
  </div>
);

interface ButtonProps {
  loading?: boolean;
  children: ReactNode;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
}

const Button = ({ loading, children, type = 'button', onClick }: ButtonProps) => (
  <button
    type={type}
    onClick={onClick}
    disabled={loading}
    className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-black hover:bg-primary/90 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
  >
    {loading && <Loader2 className="w-5 h-5 animate-spin" />}
    {children}
  </button>
);

const PrivacyToggle = ({ label, description, active, onClick }: { label: string; description: string; active: boolean; onClick: () => void }) => (
  <div className="flex items-center justify-between group p-3 bg-muted/30 rounded-2xl hover:bg-muted/50 transition-all">
    <div>
      <h5 className="text-xs font-black uppercase mb-0.5">{label}</h5>
      <p className="text-[10px] text-muted-foreground font-medium">{description}</p>
    </div>
    <button
      onClick={onClick}
      className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${active ? 'bg-primary' : 'bg-muted-foreground/20'}`}
    >
      <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${active ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  </div>
);
