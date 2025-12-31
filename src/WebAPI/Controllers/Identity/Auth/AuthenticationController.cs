using Application.Features.Admin.Interfaces.Identity.Auth;
using Application.Features.Identity.Core.Interfaces;
using Application.Features.Shared.Localization.Interfaces;
using Application.Features.Identity.Auth.DTOs.Requests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Asp.Versioning;

namespace WebAPI.Controllers.Identity.Auth
{
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/auth")]
    public class AuthenticationController : BaseController
    {
        private readonly IAuthenticationService _authenticationService;
        private readonly ICurrentUserService _currentUserService;
        private readonly ILocalizationProvider _localizationProvider;
        private readonly ILanguageDetector _languageDetector;

        public AuthenticationController(
            IAuthenticationService authenticationService,
            ICurrentUserService currentUserService,
            ILocalizationProvider localizationProvider,
            ILanguageDetector languageDetector)
        {
            _authenticationService = authenticationService;
            _currentUserService = currentUserService;
            _localizationProvider = localizationProvider;
            _languageDetector = languageDetector;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var result = await _authenticationService.LoginAsync(request);
            return result.Succeeded ? Ok(result.Data) : BadRequest(result.Errors);
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            var result = await _authenticationService.RegisterAsync(request);
            return result.Succeeded ? Ok(result.Data) : BadRequest(result.Errors);
        }

        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest request)
        {
            var result = await _authenticationService.RefreshTokenAsync(request);
            return result.Succeeded ? Ok(result.Data) : BadRequest(result.Errors);
        }

        [HttpPost("confirm-email")]
        public async Task<IActionResult> ConfirmEmail([FromBody] ConfirmEmailRequest request)
        {
            var result = await _authenticationService.ConfirmEmailAsync(request);
            return result.Succeeded ? Ok(new { Message = "Email confirmed successfully" }) : BadRequest(result.Errors);
        }

        [HttpPost("resend-email-confirmation")]
        public async Task<IActionResult> ResendEmailConfirmation([FromBody] string email)
        {
            var result = await _authenticationService.ResendEmailConfirmationAsync(email);
            return result.Succeeded ? Ok(new { Message = "Confirmation email sent" }) : BadRequest(result.Errors);
        }

        [Authorize]
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            var result = await _authenticationService.LogoutAsync(_currentUserService.UserId!);
            return result.Succeeded ? Ok(new { Message = "Logged out successfully" }) : BadRequest(result.Errors);
        }

        [Authorize]
        [HttpPost("revoke-token")]
        public async Task<IActionResult> RevokeToken([FromBody] string token)
        {
            var result = await _authenticationService.RevokeTokenAsync(token);
            return result.Succeeded ? Ok(new { Message = "Token revoked successfully" }) : BadRequest(result.Errors);
        }
    }
}