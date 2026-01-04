import React from 'react';
import { Camera, Trash2, User } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

interface ProfileSettingsProps {
    user: any; // Replace with proper User type from auth types if available
    profileData: {
        firstName: string;
        lastName: string;
        bio: string;
        // ... other fields if needed for display
    };
    setProfileData: React.Dispatch<React.SetStateAction<any>>;
    onSubmit: (e: React.FormEvent) => void;
    onAvatarUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onAvatarDelete: () => void;
    loading: boolean;
    error: string | null;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({
    user,
    profileData,
    setProfileData,
    onSubmit,
    onAvatarUpload,
    onAvatarDelete,
    loading,
    error
}) => {
    return (
        <Card hover className="border-border/50 shadow-sm hover:shadow-xl transition-all duration-300">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    <CardTitle className="text-xl">Profile Information</CardTitle>
                </div>
                <CardDescription>Update your photo and personal details</CardDescription>
            </CardHeader>

            <CardContent>
                {error && (
                    <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={onSubmit} className="space-y-6">
                    {/* Avatar Section */}
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full overflow-hidden bg-muted border-2 border-border">
                                {user?.avatarUrl ? (
                                    <img
                                        src={user.avatarUrl}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">
                                        <span className="text-2xl font-bold">
                                            {user?.firstName?.[0]}{user?.lastName?.[0]}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <label
                                htmlFor="avatar-upload"
                                className="absolute bottom-0 right-0 p-1.5 bg-primary text-primary-foreground rounded-full cursor-pointer hover:bg-primary/90 transition-colors shadow-sm"
                            >
                                <Camera className="w-4 h-4" />
                                <input
                                    id="avatar-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={onAvatarUpload}
                                />
                            </label>
                        </div>

                        <div className="space-y-1">
                            <h3 className="font-medium">Profile Picture</h3>
                            <p className="text-sm text-muted-foreground">
                                JPG, GIF or PNG. Max size of 800K
                            </p>
                            {user?.avatarUrl && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="text-destructive hover:text-destructive mt-2 h-8"
                                    onClick={onAvatarDelete}
                                >
                                    <Trash2 className="w-3 h-3 mr-2" />
                                    Remove
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="First Name"
                            value={profileData.firstName}
                            onChange={(val) => setProfileData({ ...profileData, firstName: val })}
                            required
                        />
                        <Input
                            label="Last Name"
                            value={profileData.lastName}
                            onChange={(val) => setProfileData({ ...profileData, lastName: val })}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Bio</label>
                        <textarea
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Tell us a little about yourself..."
                            value={profileData.bio}
                            onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                        />
                        <p className="text-xs text-muted-foreground text-right">
                            {profileData.bio?.length || 0}/160 characters
                        </p>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button type="submit" loading={loading} disabled={loading}>
                            Save Changes
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};