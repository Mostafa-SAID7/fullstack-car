using Application.Common.Models;
using Application.Features.Identity.DTOs.Requests;
using Application.Features.Identity.DTOs.Responses;
using System.IO;

namespace Application.Common.Interfaces.Identity
{
    public interface IUserService
    {
        Task<string?> GetUserNameAsync(Guid userId);
        Task<bool> IsInRoleAsync(Guid userId, string role);
        Task<bool> AuthorizeAsync(Guid userId, string policyName);
        Task<Result> AddToRoleAsync(Guid userId, string role);
        Task<Result> RemoveFromRoleAsync(Guid userId, string role);

        // Account Flow
        Task<Result> ForgotPasswordAsync(string email);
        Task<Result> ResetPasswordAsync(ResetPasswordRequest request);
        Task<Result> VerifyEmailAsync(string email, string token);

        // Profile
        Task<Result<UserProfileResponse>> GetProfileAsync(Guid userId);
        Task<Result<UserProfileResponse>> UpdateProfileAsync(Guid userId, UpdateProfileRequest request);
        Task<Result<string>> UploadAvatarAsync(Guid userId, Stream fileStream, string fileName, string contentType);

        // Security
        Task<Result> ChangePasswordAsync(Guid userId, ChangePasswordRequest request);
        Task<bool> GetTwoFactorStatusAsync(Guid userId);
        Task<Result> EnableTwoFactorAsync(Guid userId);
        Task<Result> DisableTwoFactorAsync(Guid userId);
    }
}
