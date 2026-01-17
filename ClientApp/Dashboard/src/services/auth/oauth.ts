import { apiClient } from '../api';
import type { ApiResult } from '../api';
import type {
  OAuthProvider,
  OAuthLinkRequest,
  OAuthUnlinkRequest,
  OAuthInitiateResponse,
  OAuthLoginResponse,
  OAuthProviderStatus,
  GoogleLoginRequest,
  FacebookLoginRequest,
  MicrosoftLoginRequest,
  GitHubLoginRequest
} from '../../types/auth';
import { API_ENDPOINTS } from '../../config/api';

/**
 * OAuth Service
 * Handles third-party authentication operations
 */
export class OAuthService {
  /**
   * Initiate OAuth flow for a provider
   */
  async initiateOAuth(provider: OAuthProvider, redirectUri: string): Promise<ApiResult<OAuthInitiateResponse>> {
    const response = await apiClient.get<OAuthInitiateResponse>(
      `/v1/oauth/${provider}`,
      { params: { redirectUri } }
    );
    return response;
  }

  /**
   * Handle OAuth callback
   */
  async handleOAuthCallback(
    provider: OAuthProvider, 
    code: string, 
    state?: string
  ): Promise<ApiResult<OAuthLoginResponse>> {
    const response = await apiClient.get<OAuthLoginResponse>(
      `/v1/oauth/${provider}/callback`,
      { params: { code, state } }
    );
    return response;
  }

  /**
   * Login with Google
   */
  async loginWithGoogle(request: GoogleLoginRequest): Promise<ApiResult<OAuthLoginResponse>> {
    const response = await apiClient.post<OAuthLoginResponse>(
      API_ENDPOINTS.OAUTH.GOOGLE,
      request
    );
    return response;
  }

  /**
   * Login with Facebook
   */
  async loginWithFacebook(request: FacebookLoginRequest): Promise<ApiResult<OAuthLoginResponse>> {
    const response = await apiClient.post<OAuthLoginResponse>(
      API_ENDPOINTS.OAUTH.FACEBOOK,
      request
    );
    return response;
  }

  /**
   * Login with Microsoft
   */
  async loginWithMicrosoft(request: MicrosoftLoginRequest): Promise<ApiResult<OAuthLoginResponse>> {
    const response = await apiClient.post<OAuthLoginResponse>(
      '/v1/oauth/microsoft',
      request
    );
    return response;
  }

  /**
   * Login with GitHub
   */
  async loginWithGitHub(request: GitHubLoginRequest): Promise<ApiResult<OAuthLoginResponse>> {
    const response = await apiClient.post<OAuthLoginResponse>(
      API_ENDPOINTS.OAUTH.GITHUB,
      request
    );
    return response;
  }

  /**
   * Link OAuth account to current user
   */
  async linkOAuthAccount(request: OAuthLinkRequest): Promise<ApiResult<void>> {
    const response = await apiClient.post<void>(
      `/v1/oauth/link/${request.provider}`,
      request.code
    );
    return response;
  }

  /**
   * Unlink OAuth account from current user
   */
  async unlinkOAuthAccount(request: OAuthUnlinkRequest): Promise<ApiResult<void>> {
    const response = await apiClient.delete<void>(
      `/v1/oauth/unlink/${request.provider}`
    );
    return response;
  }

  /**
   * Get list of linked OAuth providers
   */
  async getLinkedProviders(): Promise<ApiResult<OAuthProviderStatus[]>> {
    const response = await apiClient.get<OAuthProviderStatus[]>(
      API_ENDPOINTS.OAUTH.EXTERNAL_LOGINS
    );
    return response;
  }

  /**
   * Check if a specific provider is linked
   */
  async isProviderLinked(provider: OAuthProvider): Promise<boolean> {
    try {
      const result = await this.getLinkedProviders();
      if (result.succeeded && result.data) {
        const providerStatus = result.data.find(p => p.provider === provider);
        return providerStatus?.isLinked ?? false;
      }
      return false;
    } catch (error) {
      console.error('Error checking provider link status:', error);
      return false;
    }
  }
}

export const oauthService = new OAuthService();
