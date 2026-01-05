// OAuth Types

export interface GoogleLoginRequest {
  idToken: string;
}

export interface GitHubLoginRequest {
  code: string;
  state?: string;
}

export interface FacebookLoginRequest {
  accessToken: string;
}

export interface ExternalLoginInfo {
  provider: string;
  providerKey: string;
  displayName?: string;
  email?: string;
  linkedAt: string;
  isActive: boolean;
}
