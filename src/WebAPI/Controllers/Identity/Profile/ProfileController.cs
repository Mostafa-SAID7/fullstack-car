using Application.Features.Identity.Profile.Interfaces;
using Application.Features.Identity.Core.Interfaces;
using Application.Features.Identity.Profile.DTOs.Requests;
using Application.Features.Identity.Security.DTOs.Requests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Asp.Versioning;

namespace WebAPI.Controllers.Identity.Profile
{
    [Authorize]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/profile")]
    public class ProfileController : BaseController
    {
        private readonly IProfileService _profileService;
        private readonly ICurrentUserService _currentUserService;

        public ProfileController(
            IProfileService profileService,
            ICurrentUserService currentUserService)
        {
            _profileService = profileService;
            _currentUserService = currentUserService;
        }

        [HttpGet]
        public async Task<IActionResult> GetProfile()
        {
            var result = await _profileService.GetProfileAsync(_currentUserService.UserId!);
            return result.Succeeded ? Ok(result.Data) : BadRequest(result.Errors);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
        {
            var result = await _profileService.UpdateProfileAsync(_currentUserService.UserId!, request);
            return result.Succeeded ? Ok(result.Data) : BadRequest(result.Errors);
        }

        [HttpPost("avatar")]
        public async Task<IActionResult> UploadAvatar(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest(new { Message = "No file uploaded" });

            using var stream = file.OpenReadStream();
            var result = await _profileService.UploadAvatarAsync(_currentUserService.UserId!, stream, file.FileName, file.ContentType);
            return result.Succeeded ? Ok(new { Url = result.Data }) : BadRequest(result.Errors);
        }

        [HttpDelete("avatar")]
        public async Task<IActionResult> DeleteAvatar()
        {
            var result = await _profileService.DeleteAvatarAsync(_currentUserService.UserId!);
            return result.Succeeded ? Ok(new { Message = "Avatar deleted successfully" }) : BadRequest(result.Errors);
        }

        [HttpGet("privacy")]
        public async Task<IActionResult> GetPrivacySettings()
        {
            var result = await _profileService.GetPrivacySettingsAsync(_currentUserService.UserId!);
            return result.Succeeded ? Ok(result.Data) : BadRequest(result.Errors);
        }

        [HttpPut("privacy")]
        public async Task<IActionResult> UpdatePrivacySettings([FromBody] UpdatePrivacySettingsRequest request)
        {
            var result = await _profileService.UpdatePrivacySettingsAsync(_currentUserService.UserId!, request);
            return result.Succeeded ? Ok(new { Message = "Privacy settings updated successfully" }) : BadRequest(result.Errors);
        }

        [HttpPost("deactivate")]
        public async Task<IActionResult> DeactivateAccount([FromBody] DeactivateAccountRequest request)
        {
            var result = await _profileService.DeactivateAccountAsync(_currentUserService.UserId!, request);
            return result.Succeeded ? Ok(new { Message = "Account deactivated successfully" }) : BadRequest(result.Errors);
        }

        [HttpDelete("delete")]
        public async Task<IActionResult> DeleteAccount([FromBody] DeleteAccountRequest request)
        {
            var result = await _profileService.DeleteAccountAsync(_currentUserService.UserId!, request);
            return result.Succeeded ? Ok(new { Message = "Account deleted successfully" }) : BadRequest(result.Errors);
        }
    }
}