import React from 'react';
import { Modal } from '../../../components/layout/modals/Modal';
import { Button } from '../../../components/forms/buttons/Button';
import { Input } from '../../../components/forms/inputs/Input';
import { AlertTriangle, Smartphone, Globe, Clock, Shield } from 'lucide-react';

interface SettingsModalsProps {
    showModals: {
        password: boolean;
        sessions: boolean;
        logs: boolean;
        deactivate: boolean;
        delete: boolean;
    };
    setShowModals: React.Dispatch<React.SetStateAction<{
        password: boolean;
        sessions: boolean;
        logs: boolean;
        deactivate: boolean;
        delete: boolean;
    }>>;
    passwordData: any;
    setPasswordData: (data: any) => void;
    deactivateReason: string;
    setDeactivateReason: (reason: string) => void;
    deletePassword: string;
    setDeletePassword: (password: string) => void;
    sessions: any[];
    logs: any[];
    loading: boolean;
    onPasswordSubmit: (e: React.FormEvent) => void;
    onRevokeSession: (id: string) => void;
    onDeactivate: () => void;
    onDeleteAccount: () => void;
}

export const SettingsModals: React.FC<SettingsModalsProps> = ({
    showModals,
    setShowModals,
    passwordData,
    setPasswordData,
    deactivateReason,
    setDeactivateReason,
    deletePassword,
    setDeletePassword,
    sessions,
    logs,
    loading,
    onPasswordSubmit,
    onRevokeSession,
    onDeactivate,
    onDeleteAccount
}) => {
    const closeModal = (key: keyof typeof showModals) => {
        setShowModals(prev => ({ ...prev, [key]: false }));
    };

    return (
        <>
            {/* Change Password Modal */}
            <Modal
                isOpen={showModals.password}
                onClose={() => closeModal('password')}
                title="Change Password"
            >
                <p className="text-sm text-muted-foreground mb-4">Ensure your account is using a long, random password to stay secure.</p>
                <form onSubmit={onPasswordSubmit} className="space-y-4">
                    <Input
                        type="password"
                        label="Current Password"
                        value={passwordData.currentPassword}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        required
                    />
                    <Input
                        type="password"
                        label="New Password"
                        value={passwordData.newPassword}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        required
                        helperText="Minimum 8 characters"
                    />
                    <Input
                        type="password"
                        label="Confirm New Password"
                        value={passwordData.confirmPassword}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        required
                    />
                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="ghost" onClick={() => closeModal('password')}>
                            Cancel
                        </Button>
                        <Button loading={loading} variant="primary" onClick={() => onPasswordSubmit({ preventDefault: () => { } } as React.FormEvent)}>
                            Change Password
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Sessions Modal */}
            <Modal
                isOpen={showModals.sessions}
                onClose={() => closeModal('sessions')}
                title="Active Sessions"
            >
                <p className="text-sm text-muted-foreground mb-4">Manage the devices where you are currently logged in.</p>
                <div className="space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {sessions.map((session) => (
                        <div key={session.sessionId} className="flex items-center justify-between p-4 rounded-lg border bg-card">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-primary/10 rounded-full">
                                    <Smartphone className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <div className="font-medium flex items-center gap-2">
                                        {session.deviceType || 'Unknown Device'} • {session.os || 'Unknown OS'}
                                        {session.isCurrent && (
                                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                                                Current
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-sm text-muted-foreground flex items-center gap-3 mt-1">
                                        <span className="flex items-center gap-1">
                                            <Globe className="w-3 h-3" /> {session.ipAddress || 'Unknown IP'}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" /> {session.lastActiveAt ? new Date(session.lastActiveAt).toLocaleString() : 'Unknown'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            {!session.isCurrent && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600 hover:text-red-700"
                                    onClick={() => onRevokeSession(session.sessionId)}
                                >
                                    Revoke
                                </Button>
                            )}
                        </div>
                    ))}
                    {sessions.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                            No active sessions found.
                        </div>
                    )}
                </div>
            </Modal>

            {/* Logs Modal */}
            <Modal
                isOpen={showModals.logs}
                onClose={() => closeModal('logs')}
                title="Security Activity"
            >
                <p className="text-sm text-muted-foreground mb-4">Recent security events and sign-in attempts.</p>
                <div className="space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {logs && logs.length > 0 ? (
                        logs.map((log, i) => (
                            <div key={i} className="text-sm p-2 border-b">
                                {JSON.stringify(log)}
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            <Shield className="w-12 h-12 mx-auto mb-3 opacity-20" />
                            No recent security activity found.
                        </div>
                    )}
                </div>
            </Modal>

            {/* Deactivate Modal */}
            <Modal
                isOpen={showModals.deactivate}
                onClose={() => closeModal('deactivate')}
                title="Deactivate Account"
            >
                <p className="text-sm text-muted-foreground mb-4">Your account will be disabled and your profile will be hidden. You can reactivate it anytime by logging in.</p>
                <div className="space-y-4">
                    <Input
                        label="Reason for deactivating (Optional)"
                        placeholder="I'm taking a break..."
                        value={deactivateReason}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDeactivateReason(e.target.value)}
                    />
                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="ghost" onClick={() => closeModal('deactivate')}>
                            Cancel
                        </Button>
                        <Button variant="outline" className="text-orange-600 border-orange-200" onClick={onDeactivate}>
                            Deactivate Account
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Delete Modal */}
            <Modal
                isOpen={showModals.delete}
                onClose={() => closeModal('delete')}
                title="Delete Account"
            >
                <p className="text-sm text-muted-foreground mb-4">This action is permanent and cannot be undone. All your data will be erased.</p>
                <div className="space-y-4">
                    <div className="bg-red-50 text-red-800 p-4 rounded-lg text-sm border border-red-100 flex gap-2">
                        <AlertTriangle className="w-5 h-5 shrink-0" />
                        <p>Warning: This will permanently delete your account, posts, comments, and all associated data.</p>
                    </div>
                    <Input
                        type="password"
                        label="Confirm Password"
                        placeholder="Enter your password to confirm"
                        value={deletePassword}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDeletePassword(e.target.value)}
                        required
                    />
                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="ghost" onClick={() => closeModal('delete')}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={onDeleteAccount} disabled={!deletePassword}>
                            Delete Permanently
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
};
