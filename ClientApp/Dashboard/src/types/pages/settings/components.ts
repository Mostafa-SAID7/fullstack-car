// Settings Page Component Types

export interface SettingsHeaderProps {
  title?: string;
  description?: string;
}

export interface ProfileSettingsProps {
  user: import('../../auth').UserInfo;
  onUpdate: (data: Partial<import('../../auth').UpdateProfileRequest>) => void;
  loading?: boolean;
}

export interface SecuritySettingsProps {
  user: import('../../auth').UserInfo;
  onPasswordChange: (data: import('../../auth').ChangePasswordRequest) => void;
  onTwoFactorToggle: () => void;
  loading?: boolean;
}

export interface DangerZoneProps {
  onDeleteAccount: () => void;
  onDeactivateAccount: () => void;
  loading?: boolean;
}

export interface SettingsModalsProps {
  isOpen: boolean;
  type: 'delete' | 'deactivate' | 'password' | 'twoFactor';
  onClose: () => void;
  onConfirm: (data?: any) => void;
  loading?: boolean;
}
