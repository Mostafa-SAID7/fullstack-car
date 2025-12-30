using Application.Common.Interfaces.Identity.Profile;
using Application.Common.Models;
using Application.Features.Identity.Profile.DTOs.Requests;
using Application.Features.Identity.Security.DTOs.Requests;
using Application.Features.Identity.Profile.DTOs.Responses;

namespace Infrastructure.Services.Identity.Profile
{
    public class ProfileService : IProfileService
    {
        // TODO: Implement profile management service
        
        public Task<Result<UserProfileResponse>> GetProfileAsync(string userId)
        {
            throw new NotImplementedException("ProfileService.GetProfileAsync needs implementation");
        }

        public Task<Result<UserProfileResponse>> UpdateProfileAsync(string userId, UpdateProfileRequest request)
        {
            throw new NotImplementedException("ProfileService.UpdateProfileAsync needs implementation");
        }

        public Task<Result<string>> UploadAvatarAsync(string userId, Stream fileStream, string fileName, string contentType)
        {
            throw new NotImplementedException("ProfileService.UploadAvatarAsync needs implementation");
        }

        public Task<Result> DeleteAvatarAsync(string userId)
        {
            throw new NotImplementedException("ProfileService.DeleteAvatarAsync needs implementation");
        }

        public Task<Result<UserPrivacySettings>> GetPrivacySettingsAsync(string userId)
        {
            throw new NotImplementedException("ProfileService.GetPrivacySettingsAsync needs implementation");
        }

        public Task<Result> UpdatePrivacySettingsAsync(string userId, UpdatePrivacySettingsRequest request)
        {
            throw new NotImplementedException("ProfileService.UpdatePrivacySettingsAsync needs implementation");
        }

        public Task<Result> DeactivateAccountAsync(string userId, DeactivateAccountRequest request)
        {
            throw new NotImplementedException("ProfileService.DeactivateAccountAsync needs implementation");
        }

        public Task<Result> DeleteAccountAsync(string userId, DeleteAccountRequest request)
        {
            throw new NotImplementedException("ProfileService.DeleteAccountAsync needs implementation");
        }
    }
}