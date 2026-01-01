using Application.Common.Models;
using Application.Features.Identity.OAuth.DTOs.Requests;
using Application.Features.Identity.Auth.DTOs.Responses;
using Application.Features.Identity.OAuth.DTOs.Responses;

namespace Application.Features.Identity.OAuth.Interfaces
{
    public interface IOAuthService
    {
        // Google OAuth
        Task<Result<AuthResponse>> GoogleLoginAsync(GoogleLoginRequest request);
        
        // GitHub OAuth
        Task<Result<AuthResponse>> GitHubLoginAsync(GitHubLoginRequest request);
        
        // Facebook OAuth
        Task<Result<AuthResponse>> FacebookLoginAsync(FacebookLoginRequest request);
        
        // Generic External Login
        Task<Result<AuthResponse>> ExternalLoginCallbackAsync(ExternalLoginCallbackRequest request);
        
        // Account Linking
        Task<Result> LinkExternalAccountAsync(string userId, string provider, string providerKey);
        Task<Result> UnlinkExternalAccountAsync(string userId, string provider);
        
        // External Login Management
        Task<Result<IEnumerable<Application.Features.Identity.OAuth.DTOs.Responses.ExternalLoginInfo>>> GetExternalLoginsAsync(string userId);
    }
}