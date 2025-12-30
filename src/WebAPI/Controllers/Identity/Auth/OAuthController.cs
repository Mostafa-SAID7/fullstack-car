using Application.Common.Interfaces.Identity.Auth;
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

        public OAuthController(IOAuthService oauthService)
        {
            _oauthService = oauthService;
        }

        [HttpPost("google")]
        public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginRequest request)
        {
            var result = await _oauthService.GoogleLoginAsync(request);
            return result.Succeeded ? Ok(result.Data) : BadRequest(result.Errors);
        }

        [HttpPost("github")]
        public async Task<IActionResult> GitHubLogin([FromBody] GitHubLoginRequest request)
        {
            var result = await _oauthService.GitHubLoginAsync(request);
            return result.Succeeded ? Ok(result.Data) : BadRequest(result.Errors);
        }

        [HttpPost("facebook")]
        public async Task<IActionResult> FacebookLogin([FromBody] FacebookLoginRequest request)
        {
            var result = await _oauthService.FacebookLoginAsync(request);
            return result.Succeeded ? Ok(result.Data) : BadRequest(result.Errors);
        }

        [HttpPost("callback")]
        public async Task<IActionResult> ExternalLoginCallback([FromBody] ExternalLoginCallbackRequest request)
        {
            var result = await _oauthService.ExternalLoginCallbackAsync(request);
            return result.Succeeded ? Ok(result.Data) : BadRequest(result.Errors);
        }

        [Authorize]
        [HttpPost("link/{provider}")]
        public async Task<IActionResult> LinkExternalAccount(string provider, [FromBody] string providerKey)
        {
            var userId = User.FindFirst("sub")?.Value ?? User.FindFirst("id")?.Value;
            if (userId == null) return Unauthorized();

            var result = await _oauthService.LinkExternalAccountAsync(userId, provider, providerKey);
            return result.Succeeded ? Ok(new { Message = "Account linked successfully" }) : BadRequest(result.Errors);
        }

        [Authorize]
        [HttpDelete("unlink/{provider}")]
        public async Task<IActionResult> UnlinkExternalAccount(string provider)
        {
            var userId = User.FindFirst("sub")?.Value ?? User.FindFirst("id")?.Value;
            if (userId == null) return Unauthorized();

            var result = await _oauthService.UnlinkExternalAccountAsync(userId, provider);
            return result.Succeeded ? Ok(new { Message = "Account unlinked successfully" }) : BadRequest(result.Errors);
        }

        [Authorize]
        [HttpGet("external-logins")]
        public async Task<IActionResult> GetExternalLogins()
        {
            var userId = User.FindFirst("sub")?.Value ?? User.FindFirst("id")?.Value;
            if (userId == null) return Unauthorized();

            var result = await _oauthService.GetExternalLoginsAsync(userId);
            return result.Succeeded ? Ok(result.Data) : BadRequest(result.Errors);
        }
    }
}