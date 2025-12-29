using Application.Common.Models;
using Application.Features.Identity.DTOs.Requests;
using Application.Features.Identity.DTOs.Responses;

namespace Application.Common.Interfaces.Identity
{
    public interface IAuthService
    {
        Task<Result<AuthResponse>> RegisterAsync(RegisterRequest request);
        Task<Result<AuthResponse>> LoginAsync(LoginRequest request);
        Task<Result<AuthResponse>> RefreshTokenAsync(string accessToken, string refreshToken);
        Task<Result<AuthResponse>> ExternalLoginCallBackAsync();
        Task<Result> RevokeTokenAsync(string refreshToken);
        Task<Result> RevokeAllUserTokensAsync(Guid userId);
        Task<Result> LogoutAsync(Guid userId);
    }
}
