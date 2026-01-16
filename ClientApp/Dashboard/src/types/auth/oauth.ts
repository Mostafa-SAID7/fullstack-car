/**
 * OAuth Authentication Types
 * Types for third-party authentication providers
 */

/**
 * OAuth Provider
 * Supported OAuth authentication providers
 */
export type OAuthProvider = 'google' | 'facebook' | 'microsoft' | 'github';

/**
 * Google Login Request
 * Request to authenticate with Google
 */
export interface GoogleLoginRequest {
  idToken: string;
  accessToken?: string;
}

/**
 * GitHub Login Request
 * Request to authenticate with GitHub
 */
export interface GitHubLoginRequest {
  code: string;
  state?: string;
}

/**
 * Facebook Login Request
 * Request to authenticate with Facebook
 */
export interface FacebookLoginRequest {
  accessToken: string;
  userId?: string;
}

/**
 * Microsoft Login Request
 * Request to authenticate with Microsoft
 */
export interface MicrosoftLoginRequest {
  code: string;
  state?: string;
}

/**
 * OAuth Callback Request
 * Generic OAuth callback request
 */
export interface OAuthCallbackRequest {
  provider: OAuthProvider;
  code: string;
  state?: string;
  error?: string;
  errorDescription?: string;
}

/**
 * OAuth Initiate Request
 * Request to initiate OAuth flow
 */
export interface OAuthInitiateRequest {
  provider: OAuthProvider;
  redirectUri: string;
  state?: string;
}

/**
 * OAuth Initiate Response
 * Response with OAuth authorization URL
 */
export interface OAuthInitiateResponse {
  authorizationUrl: string;
  state: string;
  provider: OAuthProvider;
}

/**
 * External Login Info
 * Information about linked external login provider
 */
export interface ExternalLoginInfo {
  provider: OAuthProvider;
  providerKey: string;
  displayName?: string;
  email?: string;
  linkedAt: string;
  isActive: boolean;
}

/**
 * OAuth Link Request
 * Request to link an OAuth account to existing user
 */
export interface OAuthLinkRequest {
  provider: OAuthProvider;
  code: string;
  state?: string;
}

/**
 * OAuth Link Response
 * Response after linking OAuth account
 */
export interface OAuthLinkResponse {
  success: boolean;
  message: string;
  provider: OAuthProvider;
  linkedAt: string;
}

/**
 * OAuth Unlink Request
 * Request to unlink an OAuth account
 */
export interface OAuthUnlinkRequest {
  provider: OAuthProvider;
}

/**
 * OAuth Unlink Response
 * Response after unlinking OAuth account
 */
export interface OAuthUnlinkResponse {
  success: boolean;
  message: string;
  provider: OAuthProvider;
}

/**
 * OAuth Login Response
 * Response after successful OAuth login
 */
export interface OAuthLoginResponse {
  token: string;
  refreshToken: string;
  expiresAt: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    profileImageUrl?: string;
  };
  isNewUser: boolean;
}

/**
 * OAuth Provider Status
 * Status of an OAuth provider for current user
 */
export interface OAuthProviderStatus {
  provider: OAuthProvider;
  isLinked: boolean;
  isEnabled: boolean;
  linkedAt?: string;
  email?: string;
  displayName?: string;
}

/**
 * OAuth Providers List
 * List of all OAuth provider statuses
 */
export interface OAuthProvidersList {
  providers: OAuthProviderStatus[];
}

/**
 * OAuth Error Response
 * Error response from OAuth provider
 */
export interface OAuthErrorResponse {
  error: string;
  errorDescription?: string;
  errorUri?: string;
  state?: string;
}

/**
 * OAuth User Info
 * User information from OAuth provider
 */
export interface OAuthUserInfo {
  id: string;
  email: string;
  emailVerified: boolean;
  name: string;
  givenName?: string;
  familyName?: string;
  picture?: string;
  locale?: string;
}

/**
 * OAuth Token Info
 * Token information from OAuth provider
 */
export interface OAuthTokenInfo {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  refreshToken?: string;
  scope?: string;
  idToken?: string;
}
