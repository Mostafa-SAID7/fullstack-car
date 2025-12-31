using Application.Features.Identity.Password.Interfaces;
using Application.Features.Identity.Core.Interfaces;
using Application.Features.Identity.Password.DTOs.Requests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Asp.Versioning;

namespace WebAPI.Controllers.Identity.Password
{
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/password")]
    public class PasswordController : BaseController
    {
        private readonly IPasswordService _passwordService;
        private readonly ICurrentUserService _currentUserService;

        public PasswordController(
            IPasswordService passwordService,
            ICurrentUserService currentUserService)
        {
            _passwordService = passwordService;
            _currentUserService = currentUserService;
        }

        [Authorize]
        [HttpPost("change")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
        {
            var result = await _passwordService.ChangePasswordAsync(_currentUserService.UserId!, request);
            return result.Succeeded ? Ok(new { Message = "Password changed successfully" }) : BadRequest(result.Errors);
        }

        [HttpPost("forgot")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            var result = await _passwordService.ForgotPasswordAsync(request);
            return result.Succeeded ? Ok(new { Message = "Password reset email sent" }) : BadRequest(result.Errors);
        }

        [HttpPost("reset")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
        {
            var result = await _passwordService.ResetPasswordAsync(request);
            return result.Succeeded ? Ok(new { Message = "Password reset successfully" }) : BadRequest(result.Errors);
        }

        [HttpPost("validate")]
        public async Task<IActionResult> ValidatePassword([FromBody] string password)
        {
            var result = await _passwordService.ValidatePasswordAsync(password);
            return result.Succeeded ? Ok(new { Message = "Password is valid" }) : BadRequest(result.Errors);
        }

        [HttpPost("strength")]
        public async Task<IActionResult> CheckPasswordStrength([FromBody] string password)
        {
            var result = await _passwordService.CheckPasswordStrengthAsync(password);
            return result.Succeeded ? Ok(result.Data) : BadRequest(result.Errors);
        }

        [Authorize]
        [HttpPost("set")]
        public async Task<IActionResult> SetPassword([FromBody] SetPasswordRequest request)
        {
            var result = await _passwordService.SetPasswordAsync(_currentUserService.UserId!, request);
            return result.Succeeded ? Ok(new { Message = "Password set successfully" }) : BadRequest(result.Errors);
        }

        [Authorize]
        [HttpGet("has-password")]
        public async Task<IActionResult> HasPassword()
        {
            var result = await _passwordService.HasPasswordAsync(_currentUserService.UserId!);
            return result.Succeeded ? Ok(new { HasPassword = result.Data }) : BadRequest(result.Errors);
        }
    }
}