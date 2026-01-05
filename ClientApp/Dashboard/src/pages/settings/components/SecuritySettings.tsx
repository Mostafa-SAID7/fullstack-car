import React from 'react';
import { Shield, Key, Smartphone, History, Lock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/layout/cards/Card';
import { Button } from '../../../components/forms/buttons/Button';

interface SecuritySettingsProps {
    profileData: {
        isEmailPublic: boolean;
        isPhonePublic: boolean;
        allowDirectMessages: boolean;
        showOnlineStatus: boolean;
    };
    is2FAEnabled: boolean;
    sessionsCount: number;
    onPrivacyToggle: (key: keyof SecuritySettingsProps['profileData']) => void;
    onPasswordChange: () => void;
    onSessionsView: () => void;
    onLogsView: () => void;
    onToggle2FA: () => void;
}

export const SecuritySettings: React.FC<SecuritySettingsProps> = ({
    profileData,
    is2FAEnabled,
    sessionsCount,
    onPrivacyToggle,
    onPasswordChange,
    onSessionsView,
    onLogsView,
    onToggle2FA
}) => {
    return (
        <div className="space-y-6">
            <Card hover className="border-border/50 shadow-sm hover:shadow-xl transition-all duration-300">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-primary" />
                        <CardTitle className="text-xl">Security & Privacy</CardTitle>
                    </div>
                    <CardDescription>Manage your account security and privacy preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Two-Factor Authentication */}
                    <div className="flex items-center justify-between py-2">
                        <div className="space-y-0.5">
                            <div className="font-medium">Two-Factor Authentication</div>
                            <div className="text-sm text-muted-foreground">Add an extra layer of security to your account</div>
                        </div>
                        <Button
                            variant={is2FAEnabled ? 'outline' : 'primary'}
                            onClick={onToggle2FA}
                            className={is2FAEnabled ? 'text-green-600 border-green-200 bg-green-50' : ''}
                            size="sm"
                        >
                            {is2FAEnabled ? 'Enabled' : 'Enable 2FA'}
                        </Button>
                    </div>

                    <div className="h-px bg-border my-4" />

                    {/* Password */}
                    <div className="flex items-center justify-between py-2">
                        <div className="space-y-0.5">
                            <div className="font-medium">Password</div>
                            <div className="text-sm text-muted-foreground">Last changed 3 months ago</div>
                        </div>
                        <Button variant="outline" size="sm" onClick={onPasswordChange}>
                            <Key className="w-4 h-4 mr-2" />
                            Change Password
                        </Button>
                    </div>

                    <div className="h-px bg-border my-4" />

                    {/* Active Sessions */}
                    <div className="flex items-center justify-between py-2">
                        <div className="space-y-0.5">
                            <div className="font-medium">Active Sessions</div>
                            <div className="text-sm text-muted-foreground">{sessionsCount} active session{sessionsCount !== 1 ? 's' : ''}</div>
                        </div>
                        <Button variant="outline" size="sm" onClick={onSessionsView}>
                            <Smartphone className="w-4 h-4 mr-2" />
                            Manage Sessions
                        </Button>
                    </div>

                    <div className="h-px bg-border my-4" />

                    {/* Security Logs */}
                    <div className="flex items-center justify-between py-2">
                        <div className="space-y-0.5">
                            <div className="font-medium">Security Activity</div>
                            <div className="text-sm text-muted-foreground">View recent sign-ins and security events</div>
                        </div>
                        <Button variant="outline" size="sm" onClick={onLogsView}>
                            <History className="w-4 h-4 mr-2" />
                            View Logs
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Lock className="w-5 h-5 text-primary" />
                        <CardTitle className="text-xl">Privacy Settings</CardTitle>
                    </div>
                    <CardDescription>Control who can see your profile information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <div className="font-medium">Public Email</div>
                            <div className="text-sm text-muted-foreground">Allow others to see your email address</div>
                        </div>
                        <Switch
                            checked={profileData.isEmailPublic}
                            onCheckedChange={() => onPrivacyToggle('isEmailPublic')}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <div className="font-medium">Public Phone Number</div>
                            <div className="text-sm text-muted-foreground">Allow others to see your phone number</div>
                        </div>
                        <Switch
                            checked={profileData.isPhonePublic}
                            onCheckedChange={() => onPrivacyToggle('isPhonePublic')}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <div className="font-medium">Direct Messages</div>
                            <div className="text-sm text-muted-foreground">Allow others to send you direct messages</div>
                        </div>
                        <Switch
                            checked={profileData.allowDirectMessages}
                            onCheckedChange={() => onPrivacyToggle('allowDirectMessages')}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <div className="font-medium">Online Status</div>
                            <div className="text-sm text-muted-foreground">Show when you are active</div>
                        </div>
                        <Switch
                            checked={profileData.showOnlineStatus}
                            onCheckedChange={() => onPrivacyToggle('showOnlineStatus')}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

// Simple Switch Component for internal use
const Switch = ({ checked, onCheckedChange }: { checked: boolean; onCheckedChange: () => void }) => (
    <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onCheckedChange}
        className={`
      peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background
      ${checked ? 'bg-primary' : 'bg-input'}
    `}
    >
        <span
            className={`
        pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform
        ${checked ? 'translate-x-5' : 'translate-x-0'}
      `}
        />
    </button>
);
