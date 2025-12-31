using Application.Common.Models;
using Application.Features.Identity.Password.DTOs.Requests;
using Application.Features.Identity.Password.DTOs.Responses;

namespace Application.Features.Identity.Password.Interfaces
{
    public interface IPasswordService
    {
        Task<Result> ChangePasswordAsync(string userId, ChangePasswordRequest request);
        Task<Result> ForgotPasswordAsync(ForgotPasswordRequest request);
        Task<Result> ResetPasswordAsync(ResetPasswordRequest request);
        Task<Result> ValidatePasswordAsync(string password);
        Task<Result<PasswordStrengthResult>> CheckPasswordStrengthAsync(string password);
        Task<Result> SetPasswordAsync(string userId, SetPasswordRequest request);
        Task<Result<bool>> HasPasswordAsync(string userId);
    }
}