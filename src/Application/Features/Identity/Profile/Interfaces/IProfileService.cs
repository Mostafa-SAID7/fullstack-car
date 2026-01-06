using Application.Common.Models;
using Application.Features.Identity.Profile.DTOs.Requests;
using Application.Features.Identity.Security.DTOs.Requests;
using Application.Features.Identity.Profile.DTOs.Responses;

namespace Application.Features.Identity.Profile.Interfaces
{
    public interface IProfileService
    {
        Task<Result<UserProfileResponse>> GetProfileAsync(string userId);
        Task<Result<UserProfileResponse>> UpdateProfileAsync(string userId, UpdateProfileRequest request);
        Task<Result<string>> UploadAvatarAsync(string userId, Stream fileStream, string fileName, string contentType);
        Task<Result> DeleteAvatarAsync(string userId);
        Task<Result<UserPrivacySettings>> GetPrivacySettingsAsync(string userId);
        Task<Result> UpdatePrivacySettingsAsync(string userId, UpdatePrivacySettingsRequest request);
        Task<Result> DeactivateAccountAsync(string userId, DeactivateAccountRequest request);
        Task<Result> DeleteAccountAsync(string userId, DeleteAccountRequest request);
    }
}
