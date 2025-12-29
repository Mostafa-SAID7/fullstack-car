using Application.Features.Identity.Commands;
using Application.Features.Identity.DTOs.Requests;
using Application.Features.Identity.DTOs.Responses;
using Application.Common.Models;
using Application.Common.Interfaces.Localization;
using Application.Common.Constants;
using Application.Common.Interfaces.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers.Identity
{
    [ApiController]
    [Route("api/auth")]
    [Tags("Identity - Authentication")]
    [Produces("application/json")]
    public class AuthenticationController : BaseController
    {
        private readonly ICurrentUserService _currentUserService;
        private readonly ILocalizationProvider _localizationProvider;
        private readonly ILanguageDetector _languageDetector;

        public AuthenticationController(
            ICurrentUserService currentUserService,
            ILocalizationProvider localizationProvider,
            ILanguageDetector languageDetector)
        {
            _currentUserService = currentUserService;
            _localizationProvider = localizationProvider;
            _languageDetector = languageDetector;
        }

        private async Task<string> T(string key)
        {
            var acceptLanguage = Request.Headers["Accept-Language"].ToString() ?? "en-US";
            var userAgent = Request.Headers["User-Agent"].ToString() ?? "";
            var language = await _languageDetector.DetectLanguageAsync(acceptLanguage, userAgent);
            return await _localizationProvider.GetTranslationAsync(language, key);
        }

        [HttpPost("register")]
        [ProducesResponseType(typeof(AuthResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status422UnprocessableEntity)]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            var command = new RegisterCommand { Request = request };
            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Ok(result.Data);

            return BadRequest(result.Errors);
        }

        [HttpPost("login")]
        [ProducesResponseType(typeof(AuthResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status423Locked)]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var command = new LoginCommand { Request = request };
            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Ok(result.Data);

            return BadRequest(result.Errors);
        }

        [HttpPost("refresh")]
        [ProducesResponseType(typeof(TokenResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest request)
        {
            var command = new RefreshTokenCommand { Request = request };
            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Ok(result.Data);

            return BadRequest(result.Errors);
        }

        [HttpGet("external-login")]
        public IActionResult ExternalLogin(string provider, string returnUrl = "/")
        {
            var redirectUrl = Url.Action(nameof(ExternalLoginCallback), "Authentication", new { returnUrl });
            var properties = new Microsoft.AspNetCore.Authentication.AuthenticationProperties { RedirectUri = redirectUrl };
            return Challenge(properties, provider);
        }

        [HttpGet("external-login-callback")]
        public async Task<IActionResult> ExternalLoginCallback(string returnUrl = "/", string remoteError = null!)
        {
            if (remoteError != null)
            {
                return BadRequest(new { Message = $"Error from external provider: {remoteError}" });
            }

            var command = new ExternalLoginCallbackCommand();
            var result = await Mediator.Send(command);

            if (result.Succeeded)
            {
                // In a real API, we might redirect to a client-side URL with the token as a query param or fragment
                // for this demo, we'll just return the AuthResponse
                return Ok(result.Data);
            }

            return BadRequest(result.Errors);
        }

        [Authorize]
        [HttpPost("logout")]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> Logout()
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized();
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized();
            }

            var command = new LogoutCommand { UserId = userGuid };
            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Ok(new ApiResponse { Message = await T(LocalizationKeys.Identity.Auth.LogoutSuccess), Success = true });

            return BadRequest(result.Errors);
        }
    }
}
