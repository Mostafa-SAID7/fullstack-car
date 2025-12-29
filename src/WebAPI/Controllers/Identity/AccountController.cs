using Application.Features.Identity.Commands;
using Application.Features.Identity.DTOs.Requests;
using Application.Common.Models;
using Application.Common.Constants;
using Application.Common.Interfaces.Localization;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers.Identity
{
    [ApiController]
    [Route("api/account")]
    [Tags("Identity - Account Management")]
    [Produces("application/json")]
    public class AccountController : BaseController
    {
        private readonly ILocalizationProvider _localizationProvider;
        private readonly ILanguageDetector _languageDetector;

        public AccountController(
            ILocalizationProvider localizationProvider,
            ILanguageDetector languageDetector)
        {
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
        [HttpPost("forgot-password")]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status429TooManyRequests)]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            var command = new ForgotPasswordCommand { Request = request };
            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Ok(new ApiResponse
                {
                    Message = await T(LocalizationKeys.Identity.Auth.ForgotPasswordSuccess),
                    Success = true
                });

            return BadRequest(result.Errors);
        }

        [HttpPost("reset-password")]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status410Gone)]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
        {
            var command = new ResetPasswordCommand { Request = request };
            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Ok(new ApiResponse { Message = await T(LocalizationKeys.Identity.Auth.ResetPasswordSuccess), Success = true });

            return BadRequest(result.Errors);
        }

        [HttpGet("verify-email")]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status410Gone)]
        public async Task<IActionResult> VerifyEmail([FromQuery] string token, [FromQuery] string email)
        {
            if (string.IsNullOrEmpty(token) || string.IsNullOrEmpty(email))
            {
                return BadRequest(new ErrorResponse { Message = await T(LocalizationKeys.Identity.Validation.TokenAndEmailRequired), Success = false });
            }

            var command = new VerifyEmailCommand { Token = token, Email = email };
            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Ok(new ApiResponse { Message = await T(LocalizationKeys.Identity.Auth.EmailVerifiedSuccess), Success = true });

            return BadRequest(result.Errors);
        }
    }
}
