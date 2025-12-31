using Application.Common.Models;
using Application.Features.Identity.Auth.DTOs.Requests;
using Application.Features.Identity.Auth.DTOs.Responses;

namespace Application.Features.Identity.Auth.Interfaces
{
    public interface IAuthenticationService
    {
        Task<Result<AuthResponse>> LoginAsync(LoginRequest request);
        Task<Result<AuthResponse>> RegisterAsync(RegisterRequest request);
        Task<Result<AuthResponse>> RefreshTokenAsync(RefreshTokenRequest request);
        Task<Result> LogoutAsync(string userId);
        Task<Result> RevokeTokenAsync(string token);
        Task<Result> RevokeAllUserTokensAsync(string userId);
        Task<Result<AuthResponse>> ConfirmEmailAsync(ConfirmEmailRequest request);
        Task<Result> ResendEmailConfirmationAsync(string email);
    }
}