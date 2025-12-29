using Application.Common.Models;
using Application.Features.Identity.DTOs.Requests;

namespace Application.Common.Interfaces.Identity
{
    public interface IUserService
    {
        Task<string?> GetUserNameAsync(Guid userId);
        Task<bool> IsInRoleAsync(Guid userId, string role);
        Task<bool> AuthorizeAsync(Guid userId, string policyName);
        Task<Result> AddToRoleAsync(Guid userId, string role);
        Task<Result> RemoveFromRoleAsync(Guid userId, string role);
        Task<Result> ForgotPasswordAsync(string email);
        Task<Result> ResetPasswordAsync(ResetPasswordRequest request);
        Task<Result> VerifyEmailAsync(string email, string token);
    }
}
