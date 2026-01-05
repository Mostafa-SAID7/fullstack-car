// User Types

export interface UserInfo {
  id: string;
  firstName: string;
  lastName: string;
  name?: string;
  email: string;
  phoneNumber?: string;
  avatar?: string;
  profileImageUrl?: string;
  roles: string[];
  status?: 'active' | 'inactive' | 'pending';
  isActive: boolean;
  isEmailConfirmed: boolean;
  createdAt: string;
}
