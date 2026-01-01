using Application.Features.Identity.Profile.Interfaces;
using Application.Common.Models;
using Application.Features.Identity.Profile.DTOs.Requests;
using Application.Features.Identity.Security.DTOs.Requests;
using Application.Features.Identity.Profile.DTOs.Responses;
using Microsoft.AspNetCore.Identity;
using Domain.Entities.Identity;

namespace Application.Features.Identity.Profile.Services
{
    public class ProfileService : IProfileService
    {
        private readonly UserManager<ApplicationUser> _userManager;

        public ProfileService(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        public async Task<Result<UserProfileResponse>> GetProfileAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return Result<UserProfileResponse>.Failure(new[] { "User not found" });

            return Result<UserProfileResponse>.Success(new UserProfileResponse
            {
                Id = user.Id,
                Email = user.Email!,
                FirstName = user.FirstName,
                LastName = user.LastName,
                ProfileImageUrl = user.ProfileImageUrl,
                Bio = user.Bio,
                IsEmailConfirmed = user.EmailConfirmed,
                IsTwoFactorEnabled = user.TwoFactorEnabled,
                CreatedAt = user.CreatedAt
            });
        }

        public async Task<Result<UserProfileResponse>> UpdateProfileAsync(string userId, UpdateProfileRequest request)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return Result<UserProfileResponse>.Failure(new[] { "User not found" });

            user.FirstName = request.FirstName;
            user.LastName = request.LastName;
            user.Bio = request.Bio;
            // Note: UpdateProfileRequest doesn't have PhoneNumber, IsEmailPublic, etc.
            // These would be updated via UpdatePrivacySettingsAsync or other methods.

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded) return Result<UserProfileResponse>.Failure(result.Errors.Select(e => e.Description).ToArray());

            return await GetProfileAsync(userId);
        }

        public async Task<Result<string>> UploadAvatarAsync(string userId, Stream fileStream, string fileName, string contentType)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return Result<string>.Failure(new[] { "User not found" });

            // In a real app, upload to blob storage
            user.ProfileImageUrl = $"/images/avatars/{userId}_{fileName}";
            await _userManager.UpdateAsync(user);

            return Result<string>.Success(user.ProfileImageUrl);
        }

        public async Task<Result> DeleteAvatarAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return Result.Failure(new[] { "User not found" });

            user.ProfileImageUrl = null;
            var result = await _userManager.UpdateAsync(user);

            return result.Succeeded ? Result.Success() : Result.Failure(result.Errors.Select(e => e.Description));
        }

        public async Task<Result<UserPrivacySettings>> GetPrivacySettingsAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return Result<UserPrivacySettings>.Failure(new[] { "User not found" });

            return Result<UserPrivacySettings>.Success(new UserPrivacySettings
            {
                IsEmailPublic = user.IsEmailPublic,
                IsPhonePublic = user.IsPhonePublic,
                AllowDirectMessages = user.AllowDirectMessages,
                ShowOnlineStatus = user.ShowOnlineStatus
            });
        }

        public async Task<Result> UpdatePrivacySettingsAsync(string userId, UpdatePrivacySettingsRequest request)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return Result.Failure(new[] { "User not found" });

            user.IsEmailPublic = request.IsEmailPublic;
            user.IsPhonePublic = request.IsPhonePublic;
            user.AllowDirectMessages = request.AllowDirectMessages;
            user.ShowOnlineStatus = request.ShowOnlineStatus;

            var result = await _userManager.UpdateAsync(user);
            return result.Succeeded ? Result.Success() : Result.Failure(result.Errors.Select(e => e.Description).ToArray());
        }

        public async Task<Result> DeactivateAccountAsync(string userId, DeactivateAccountRequest request)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return Result.Failure(new[] { "User not found" });

            user.IsActive = false;
            user.Status = Domain.Enums.Identity.UserStatus.Inactive;

            var result = await _userManager.UpdateAsync(user);
            return result.Succeeded ? Result.Success() : Result.Failure(result.Errors.Select(e => e.Description).ToArray());
        }

        public async Task<Result> DeleteAccountAsync(string userId, DeleteAccountRequest request)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return Result.Failure(new[] { "User not found" });

            var result = await _userManager.DeleteAsync(user);
            return result.Succeeded ? Result.Success() : Result.Failure(result.Errors.Select(e => e.Description).ToArray());
        }
    }
}
