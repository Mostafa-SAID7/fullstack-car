using Application.Features.Admin.Interfaces.Identity.Auth;
using Application.Common.Models;
using Application.Features.Identity.OAuth.DTOs.Requests;
using Application.Features.Identity.Auth.DTOs.Responses;
using Application.Features.Identity.OAuth.DTOs.Responses;

namespace Application.Features.Identity.Auth.Services
{
    public class OAuthService : IOAuthService
    {
        // TODO: Implement OAuth service for Google, GitHub, Facebook
        
        public Task<Result<AuthResponse>> GoogleLoginAsync(GoogleLoginRequest request)
        {
            throw new NotImplementedException("OAuthService.GoogleLoginAsync needs implementation");
        }

        public Task<Result<AuthResponse>> GitHubLoginAsync(GitHubLoginRequest request)
        {
            throw new NotImplementedException("OAuthService.GitHubLoginAsync needs implementation");
        }

        public Task<Result<AuthResponse>> FacebookLoginAsync(FacebookLoginRequest request)
        {
            throw new NotImplementedException("OAuthService.FacebookLoginAsync needs implementation");
        }

        public Task<Result<AuthResponse>> ExternalLoginCallbackAsync(ExternalLoginCallbackRequest request)
        {
            throw new NotImplementedException("OAuthService.ExternalLoginCallbackAsync needs implementation");
        }

        public Task<Result> LinkExternalAccountAsync(string userId, string provider, string providerKey)
        {
            throw new NotImplementedException("OAuthService.LinkExternalAccountAsync needs implementation");
        }

        public Task<Result> UnlinkExternalAccountAsync(string userId, string provider)
        {
            throw new NotImplementedException("OAuthService.UnlinkExternalAccountAsync needs implementation");
        }

        public Task<Result<IEnumerable<Application.Features.Identity.OAuth.DTOs.Responses.ExternalLoginInfo>>> GetExternalLoginsAsync(string userId)
        {
            throw new NotImplementedException("OAuthService.GetExternalLoginsAsync needs implementation");
        }
    }
}