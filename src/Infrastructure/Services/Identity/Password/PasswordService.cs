using Application.Common.Interfaces.Identity.Password;
using Application.Common.Models;
using Application.Features.Identity.Password.DTOs.Requests;
using Application.Features.Identity.Password.DTOs.Responses;

namespace Infrastructure.Services.Identity.Password
{
    public class PasswordService : IPasswordService
    {
        private readonly UserManager<ApplicationUser> _userManager;

        public PasswordService(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }
        
        public async Task<Result> ChangePasswordAsync(string userId, ChangePasswordRequest request)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return Result.Failure(new[] { "User not found" });

            var result = await _userManager.ChangePasswordAsync(user, request.CurrentPassword, request.NewPassword);
            return result.Succeeded ? Result.Success() : Result.Failure(result.Errors.Select(e => e.Description));
        }

        public async Task<Result> ForgotPasswordAsync(ForgotPasswordRequest request)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null) return Result.Success(); // Don't reveal user existence

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            // TODO: Send email with token
            return Result.Success();
        }

        public async Task<Result> ResetPasswordAsync(ResetPasswordRequest request)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null) return Result.Failure(new[] { "User not found" });

            var result = await _userManager.ResetPasswordAsync(user, request.Token, request.NewPassword);
            return result.Succeeded ? Result.Success() : Result.Failure(result.Errors.Select(e => e.Description));
        }

        public async Task<Result> ValidatePasswordAsync(string password)
        {
            // Simple validation for now
            if (string.IsNullOrEmpty(password) || password.Length < 6)
                return Result.Failure(new[] { "Password must be at least 6 characters" });
            
            return Result.Success();
        }

        public async Task<Result<PasswordStrengthResult>> CheckPasswordStrengthAsync(string password)
        {
            var score = 0;
            if (password.Length >= 8) score++;
            if (password.Any(char.IsUpper)) score++;
            if (password.Any(char.IsLower)) score++;
            if (password.Any(char.IsDigit)) score++;
            if (password.Any(c => !char.IsLetterOrDigit(c))) score++;

            return Result<PasswordStrengthResult>.Success(new PasswordStrengthResult
            {
                Score = score,
                Suggestions = score < 4 ? new[] { "Use a longer password with mix of cases, numbers and symbols" } : Array.Empty<string>()
            });
        }

        public async Task<Result> SetPasswordAsync(string userId, SetPasswordRequest request)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return Result.Failure(new[] { "User not found" });

            var result = await _userManager.AddPasswordAsync(user, request.NewPassword);
            return result.Succeeded ? Result.Success() : Result.Failure(result.Errors.Select(e => e.Description));
        }

        public async Task<Result<bool>> HasPasswordAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return Result<bool>.Failure(new[] { "User not found" });

            return Result<bool>.Success(await _userManager.HasPasswordAsync(user));
        }
    }
}