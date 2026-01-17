using Application.Features.Identity.OAuth.Interfaces;
using Application.Features.Identity.Core.Interfaces;
using Application.Features.Identity.OAuth.DTOs.Requests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Asp.Versioning;

namespace WebAPI.Controllers.Identity.Auth
{

    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/oauth")]
    public class OAuthController : BaseController
    {
        private readonly IOAuthService _oauthService;
        private readonly ICurrentUserService _currentUserService;

        public OAuthController(
            IOAuthService oauthService,
            ICurrentUserService currentUserService)
        {
            _oauthService = oauthService;
            _currentUserService = currentUserService;
        }

        [HttpPost("google")]
        public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginRequest request)
        {
            var result = await _oauthService.GoogleLoginAsync(request);
            return Ok(result);
        }

        [HttpPost("github")]
        public async Task<IActionResult> GitHubLogin([FromBody] GitHubLoginRequest request)
        {
            var result = await _oauthService.GitHubLoginAsync(request);
            return Ok(result);
        }

        [HttpPost("facebook")]
        public async Task<IActionResult> FacebookLogin([FromBody] FacebookLoginRequest request)
        {
            var result = await _oauthService.FacebookLoginAsync(request);
            return Ok(result);
        }

        [HttpPost("microsoft")]
        public async Task<IActionResult> MicrosoftLogin([FromBody] MicrosoftLoginRequest request)
        {
            var result = await _oauthService.MicrosoftLoginAsync(request);
            return Ok(result);
        }

        [HttpPost("callback")]
        public async Task<IActionResult> ExternalLoginCallback([FromBody] ExternalLoginCallbackRequest request)
        {
            var result = await _oauthService.ExternalLoginCallbackAsync(request);
            return Ok(result);
        }

        [HttpGet("{provider}")]
        public async Task<IActionResult> InitiateOAuth(string provider, [FromQuery] string redirectUri)
        {
            var result = await _oauthService.InitiateOAuthAsync(provider, redirectUri);
            return Ok(result);
        }

        [HttpGet("{provider}/callback")]
        public async Task<IActionResult> OAuthCallback(string provider, [FromQuery] string code, [FromQuery] string? state, [FromQuery] string? error)
        {
            if (!string.IsNullOrEmpty(error))
            {
                return BadRequest(new { Error = error });
            }

            var request = new ExternalLoginCallbackRequest
            {
                Provider = provider,
                Code = code,
                State = state
            };

            var result = await _oauthService.ExternalLoginCallbackAsync(request);
            return Ok(result);
        }

        [Authorize]
        [HttpPost("link/{provider}")]
        public async Task<IActionResult> LinkExternalAccount(string provider, [FromBody] string providerKey)
        {
            if (string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized();
            }

            var result = await _oauthService.LinkExternalAccountAsync(_currentUserService.UserId, provider, providerKey);
            return Ok(result);
        }

        [Authorize]
        [HttpDelete("unlink/{provider}")]
        public async Task<IActionResult> UnlinkExternalAccount(string provider)
        {
            if (string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized();
            }

            var result = await _oauthService.UnlinkExternalAccountAsync(_currentUserService.UserId, provider);
            return Ok(result);
        }

        [Authorize]
        [HttpGet("external-logins")]
        public async Task<IActionResult> GetExternalLogins()
        {
            if (string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized();
            }

            var result = await _oauthService.GetExternalLoginsAsync(_currentUserService.UserId);
            return Ok(result);
        }
    }
}
