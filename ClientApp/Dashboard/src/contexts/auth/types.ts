// Auth Context Types

import type { LoginRequest, LoginResponse, UserInfo } from '../../types/auth';

export interface AuthContextType {
  user: UserInfo | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<LoginResponse>;
  logout: () => void;
  refreshToken: () => Promise<boolean>;
  updateUser: (user: Partial<UserInfo>) => void;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}

export type { LoginRequest, LoginResponse, UserInfo };

