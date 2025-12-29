using Application.Common.Interfaces.Identity;
using Application.Common.Models;
using Application.Features.Identity.DTOs.Requests;
using Domain.Entities.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Application.Common.Interfaces.Communication;
using Application.Common.Interfaces.Storage;
using Application.Common.Interfaces.Localization;
using Application.Common.Constants;
using Application.Features.Identity.DTOs.Responses;
using Microsoft.AspNetCore.Http;
using Infrastructure.Identity;

namespace Infrastructure.Services.Identity
{
    public class UserService : IUserService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole<Guid>> _roleManager;
        private readonly IUserClaimsPrincipalFactory<ApplicationUser> _userClaimsPrincipalFactory;
        private readonly IAuthorizationService _authorizationService;
        private readonly IEmailService _emailService;
        private readonly IFileService _fileService;
        private readonly ILocalizationProvider _localizationProvider;
        private readonly ILanguageDetector _languageDetector;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public UserService(
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole<Guid>> roleManager,
            IUserClaimsPrincipalFactory<ApplicationUser> userClaimsPrincipalFactory,
            IAuthorizationService authorizationService,
            IEmailService emailService,
            IFileService fileService,
            ILocalizationProvider localizationProvider,
            ILanguageDetector languageDetector,
            IHttpContextAccessor httpContextAccessor)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _userClaimsPrincipalFactory = userClaimsPrincipalFactory;
            _authorizationService = authorizationService;
            _emailService = emailService;
            _fileService = fileService;
            _localizationProvider = localizationProvider;
            _languageDetector = languageDetector;
            _httpContextAccessor = httpContextAccessor;
        }

        private async Task<string> T(string key)
        {
            var acceptLanguage = _httpContextAccessor.HttpContext?.Request.Headers["Accept-Language"].ToString() ?? "en-US";
            var userAgent = _httpContextAccessor.HttpContext?.Request.Headers["User-Agent"].ToString() ?? "";
            var language = await _languageDetector.DetectLanguageAsync(acceptLanguage, userAgent);
            return await _localizationProvider.GetTranslationAsync(language, key);
        }

        public async Task<string?> GetUserNameAsync(Guid userId)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());
            return user?.UserName;
        }

        public async Task<bool> IsInRoleAsync(Guid userId, string role)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());
            return user != null && await _userManager.IsInRoleAsync(user, role);
        }

        public async Task<bool> AuthorizeAsync(Guid userId, string policyName)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user == null) return false;

            var principal = await _userClaimsPrincipalFactory.CreateAsync(user);
            var result = await _authorizationService.AuthorizeAsync(principal, policyName);

            return result.Succeeded;
        }

        public async Task<Result> AddToRoleAsync(Guid userId, string role)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user == null) return Result.Failure(new[] { "User not found." });

            if (!await _roleManager.RoleExistsAsync(role))
            {
                await _roleManager.CreateAsync(new IdentityRole<Guid> { Name = role });
            }

            var result = await _userManager.AddToRoleAsync(user, role);
            return result.Succeeded ? Result.Success() : Result.Failure(result.Errors.Select(e => e.Description));
        }

        public async Task<Result> RemoveFromRoleAsync(Guid userId, string role)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user == null) return Result.Failure(new[] { "User not found." });

            var result = await _userManager.RemoveFromRoleAsync(user, role);
            return result.Succeeded ? Result.Success() : Result.Failure(result.Errors.Select(e => e.Description));
        }

        public async Task<Result> ForgotPasswordAsync(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null || !(await _userManager.IsEmailConfirmedAsync(user)))
            {
                // Don't reveal that the user does not exist or is not confirmed
                return Result.Success();
            }

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            await _emailService.SendPasswordResetEmailAsync(user.Email!, token);

            return Result.Success();
        }

        public async Task<Result> ResetPasswordAsync(ResetPasswordRequest request)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null)
            {
                return Result.Failure(new[] { "Invalid request" });
            }

            var result = await _userManager.ResetPasswordAsync(user, request.Token, request.Password);
            return result.Succeeded ? Result.Success() : Result.Failure(result.Errors.Select(e => e.Description));
        }

        public async Task<Result> VerifyEmailAsync(string email, string token)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
            {
                return Result.Failure(new[] { "User not found" });
            }

            var result = await _userManager.ConfirmEmailAsync(user, token);
            return result.Succeeded ? Result.Success() : Result.Failure(result.Errors.Select(e => e.Description));
        }

        // Profile Methods
        public async Task<Result<UserProfileResponse>> GetProfileAsync(Guid userId)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user == null) return Result<UserProfileResponse>.Failure(new[] { await T(LocalizationKeys.Identity.Validation.UserNotFound) });

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

        public async Task<Result<UserProfileResponse>> UpdateProfileAsync(Guid userId, UpdateProfileRequest request)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user == null) return Result<UserProfileResponse>.Failure(new[] { await T(LocalizationKeys.Identity.Validation.UserNotFound) });

            user.FirstName = request.FirstName;
            user.LastName = request.LastName;
            user.Bio = request.Bio;

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded) return Result<UserProfileResponse>.Failure(result.Errors.Select(e => e.Description));

            return await GetProfileAsync(userId);
        }

        public async Task<Result<string>> UploadAvatarAsync(Guid userId, Stream fileStream, string fileName, string contentType)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user == null) return Result<string>.Failure(new[] { await T(LocalizationKeys.Identity.Validation.UserNotFound) });

            try
            {
                // Delete old avatar logic could go here
                var uniqueFileName = $"avatars/{userId}/{Guid.NewGuid()}{Path.GetExtension(fileName)}";
                var fileUrl = await _fileService.UploadFileAsync(fileStream, uniqueFileName, contentType);

                user.ProfileImageUrl = fileUrl;
                var result = await _userManager.UpdateAsync(user);

                return result.Succeeded
                    ? Result<string>.Success(fileUrl)
                    : Result<string>.Failure(result.Errors.Select(e => e.Description));
            }
            catch (Exception ex)
            {
                return Result<string>.Failure(new[] { $"Upload failed: {ex.Message}" });
            }
        }

        // Security Methods
        public async Task<Result> ChangePasswordAsync(Guid userId, ChangePasswordRequest request)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user == null) return Result.Failure(new[] { await T(LocalizationKeys.Identity.Validation.UserNotFound) });

            var result = await _userManager.ChangePasswordAsync(user, request.CurrentPassword, request.NewPassword);
            return result.Succeeded ? Result.Success() : Result.Failure(result.Errors.Select(e => e.Description));
        }

        public async Task<bool> GetTwoFactorStatusAsync(Guid userId)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());
            return user != null && await _userManager.GetTwoFactorEnabledAsync(user);
        }

        public async Task<Result> EnableTwoFactorAsync(Guid userId)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user == null) return Result.Failure(new[] { await T(LocalizationKeys.Identity.Validation.UserNotFound) });

            var result = await _userManager.SetTwoFactorEnabledAsync(user, true);
            return result.Succeeded ? Result.Success() : Result.Failure(result.Errors.Select(e => e.Description));
        }

        public async Task<Result> DisableTwoFactorAsync(Guid userId)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user == null) return Result.Failure(new[] { await T(LocalizationKeys.Identity.Validation.UserNotFound) });

            var result = await _userManager.SetTwoFactorEnabledAsync(user, false);
            return result.Succeeded ? Result.Success() : Result.Failure(result.Errors.Select(e => e.Description));
        }
    }
}
