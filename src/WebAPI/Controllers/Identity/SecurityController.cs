using Application.Common.Interfaces.Identity;
using Application.Common.Interfaces.Localization;
using Application.Common.Constants;
using Application.Features.Identity.DTOs.Requests;
using Application.Features.Identity.Security.Commands;
using Application.Features.Identity.Security.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using Asp.Versioning;

namespace WebAPI.Controllers.Identity
{
    [Authorize]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/identity/security")]
    public class SecurityController : BaseController
    {
        private readonly ICurrentUserService _currentUserService;
        private readonly ILocalizationProvider _localizationProvider;
        private readonly ILanguageDetector _languageDetector;

        public SecurityController(
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

        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
        {
            var userId = Guid.Parse(_currentUserService.UserId!);
            var result = await Mediator.Send(new ChangePasswordCommand { UserId = userId, Request = request });
            return result.Succeeded
                ? Ok(new { Message = await T(LocalizationKeys.Identity.Security.PasswordChangeSuccess) })
                : BadRequest(result.Errors);
        }

        [HttpGet("2fa-status")]
        public async Task<IActionResult> GetTwoFactorStatus()
        {
            var userId = Guid.Parse(_currentUserService.UserId!);
            var isEnabled = await Mediator.Send(new GetTwoFactorStatusQuery { UserId = userId });
            return Ok(new { IsTwoFactorEnabled = isEnabled });
        }

        [HttpPost("2fa/enable")]
        public async Task<IActionResult> EnableTwoFactor()
        {
            var userId = Guid.Parse(_currentUserService.UserId!);
            var result = await Mediator.Send(new EnableTwoFactorCommand { UserId = userId });
            return result.Succeeded
                ? Ok(new { Message = await T(LocalizationKeys.Identity.Security.TwoFactorEnabled) })
                : BadRequest(result.Errors);
        }

        [HttpPost("2fa/disable")]
        public async Task<IActionResult> DisableTwoFactor()
        {
            var userId = Guid.Parse(_currentUserService.UserId!);
            var result = await Mediator.Send(new DisableTwoFactorCommand { UserId = userId });
            return result.Succeeded
                ? Ok(new { Message = await T(LocalizationKeys.Identity.Security.TwoFactorDisabled) })
                : BadRequest(result.Errors);
        }
    }
}
