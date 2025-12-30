using Application.Common.Interfaces.Identity.Password;
using Application.Common.Models;
using Application.Features.Identity.Password.DTOs.Requests;
using Application.Features.Identity.Password.DTOs.Responses;

namespace Infrastructure.Services.Identity.Password
{
    public class PasswordService : IPasswordService
    {
        // TODO: Implement password management service
        
        public Task<Result> ChangePasswordAsync(string userId, ChangePasswordRequest request)
        {
            throw new NotImplementedException("PasswordService.ChangePasswordAsync needs implementation");
        }

        public Task<Result> ForgotPasswordAsync(ForgotPasswordRequest request)
        {
            throw new NotImplementedException("PasswordService.ForgotPasswordAsync needs implementation");
        }

        public Task<Result> ResetPasswordAsync(ResetPasswordRequest request)
        {
            throw new NotImplementedException("PasswordService.ResetPasswordAsync needs implementation");
        }

        public Task<Result> ValidatePasswordAsync(string password)
        {
            throw new NotImplementedException("PasswordService.ValidatePasswordAsync needs implementation");
        }

        public Task<Result<PasswordStrengthResult>> CheckPasswordStrengthAsync(string password)
        {
            throw new NotImplementedException("PasswordService.CheckPasswordStrengthAsync needs implementation");
        }

        public Task<Result> SetPasswordAsync(string userId, SetPasswordRequest request)
        {
            throw new NotImplementedException("PasswordService.SetPasswordAsync needs implementation");
        }

        public Task<Result<bool>> HasPasswordAsync(string userId)
        {
            throw new NotImplementedException("PasswordService.HasPasswordAsync needs implementation");
        }
    }
}