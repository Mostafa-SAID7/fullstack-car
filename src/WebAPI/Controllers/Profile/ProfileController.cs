using Application.Features.Identity.Profile.Commands;
using Application.Features.Identity.Profile.DTOs;
using Application.Features.Identity.Profile.Queries;
using Application.Features.Identity.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Asp.Versioning;

namespace WebAPI.Controllers.Profile
{
    [Authorize]
    [ApiVersion("2.0")]
    [Route("api/v{version:apiVersion}/profile")]
    public class ProfileController : BaseController
    {
        private readonly ICurrentUserService _currentUserService;

        public ProfileController(ICurrentUserService currentUserService)
        {
            _currentUserService = currentUserService;
        }

        [HttpGet]
        [OutputCache(Duration = 300, Tags = new[] { "Profile" })]
        public async Task<IActionResult> GetProfile()
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var query = new GetUserProfileQuery { UserId = userGuid };
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Profile retrieved successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Profile not found");

            return BadRequest("Failed to retrieve profile", result.Errors);
        }

        [HttpGet("{userId}")]
        [AllowAnonymous]
        [OutputCache(Duration = 600, Tags = new[] { "Profile", "PublicProfile" })]
        public async Task<IActionResult> GetPublicProfile(Guid userId)
        {
            var query = new GetPublicProfileQuery { UserId = userId };
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Public profile retrieved successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("User not found");

            return BadRequest("Failed to retrieve public profile", result.Errors);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateProfile([FromBody] Application.Features.Identity.Profile.DTOs.Requests.UpdateProfileRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new UpdateProfileCommand
            {
                UserId = userGuid,
                Request = request
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success(result.Data, "Profile updated successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Profile not found");

            if (result.Errors.Any(e => e.Contains("email already exists")))
                return BadRequest("Email address is already in use", result.Errors);

            if (result.Errors.Any(e => e.Contains("username already exists")))
                return BadRequest("Username is already taken", result.Errors);

            return BadRequest("Failed to update profile", result.Errors);
        }

        [HttpPost("avatar")]
        public async Task<IActionResult> UploadAvatar([FromForm] UploadAvatarRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new UploadAvatarCommand
            {
                UserId = userGuid,
                Request = request
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success(result.Data, "Avatar uploaded successfully");

            if (result.Errors.Any(e => e.Contains("invalid file")))
                return BadRequest("Invalid file format. Only JPG, PNG, and GIF are allowed", result.Errors);

            if (result.Errors.Any(e => e.Contains("file too large")))
                return BadRequest("File size exceeds the maximum limit of 5MB", result.Errors);

            return BadRequest("Failed to upload avatar", result.Errors);
        }

        [HttpDelete("avatar")]
        public async Task<IActionResult> DeleteAvatar()
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new DeleteAvatarCommand { UserId = userGuid };
            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success("Avatar deleted successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Avatar not found");

            return BadRequest("Failed to delete avatar", result.Errors);
        }

        [HttpPut("privacy")]
        public async Task<IActionResult> UpdatePrivacySettings([FromBody] UpdatePrivacySettingsRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new UpdatePrivacySettingsCommand
            {
                UserId = userGuid,
                Request = request
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success(result.Data, "Privacy settings updated successfully");

            return BadRequest("Failed to update privacy settings", result.Errors);
        }

        [HttpGet("privacy")]
        [OutputCache(Duration = 300, Tags = new[] { "Profile", "Privacy" })]
        public async Task<IActionResult> GetPrivacySettings()
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var query = new GetPrivacySettingsQuery { UserId = userGuid };
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Privacy settings retrieved successfully");

            return BadRequest("Failed to retrieve privacy settings", result.Errors);
        }

        [HttpPut("notifications")]
        public async Task<IActionResult> UpdateNotificationSettings([FromBody] UpdateNotificationSettingsRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new UpdateNotificationSettingsCommand
            {
                UserId = userGuid,
                Request = request
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success(result.Data, "Notification settings updated successfully");

            return BadRequest("Failed to update notification settings", result.Errors);
        }

        [HttpGet("notifications")]
        [OutputCache(Duration = 300, Tags = new[] { "Profile", "Notifications" })]
        public async Task<IActionResult> GetNotificationSettings()
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var query = new GetNotificationSettingsQuery { UserId = userGuid };
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Notification settings retrieved successfully");

            return BadRequest("Failed to retrieve notification settings", result.Errors);
        }

        [HttpPost("deactivate")]
        public async Task<IActionResult> DeactivateAccount([FromBody] DeactivateAccountRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new DeactivateAccountCommand
            {
                UserId = userGuid,
                Request = request
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success("Account deactivated successfully");

            if (result.Errors.Any(e => e.Contains("invalid password")))
                return BadRequest("Invalid password provided", result.Errors);

            return BadRequest("Failed to deactivate account", result.Errors);
        }

        [HttpGet("activity")]
        [OutputCache(Duration = 300, Tags = new[] { "Profile", "Activity" })]
        public async Task<IActionResult> GetUserActivity(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20,
            [FromQuery] string? activityType = null)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var query = new GetUserActivityQuery
            {
                UserId = userGuid,
                PageNumber = page,
                PageSize = pageSize,
                ActivityType = activityType
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "User activity retrieved successfully");

            return BadRequest("Failed to retrieve user activity", result.Errors);
        }

        [HttpGet("stats")]
        [OutputCache(Duration = 600, Tags = new[] { "Profile", "Stats" })]
        public async Task<IActionResult> GetUserStats()
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var query = new GetUserStatsQuery { UserId = userGuid };
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "User statistics retrieved successfully");

            return BadRequest("Failed to retrieve user statistics", result.Errors);
        }
    }
}