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
    [Route("api/v{version:apiVersion}/profile/preferences")]
    public class PreferencesController : BaseController
    {
        private readonly ICurrentUserService _currentUserService;

        public PreferencesController(ICurrentUserService currentUserService)
        {
            _currentUserService = currentUserService;
        }

        [HttpGet]
        [OutputCache(Duration = 300, Tags = new[] { "Profile", "Preferences" })]
        public async Task<IActionResult> GetPreferences()
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var query = new GetUserPreferencesQuery { UserId = userGuid };
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "User preferences retrieved successfully");

            return BadRequest("Failed to retrieve user preferences", result.Errors);
        }

        [HttpPut]
        public async Task<IActionResult> UpdatePreferences([FromBody] UpdateUserPreferencesRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new UpdateUserPreferencesCommand
            {
                UserId = userGuid,
                Request = request
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success(result.Data, "User preferences updated successfully");

            return BadRequest("Failed to update user preferences", result.Errors);
        }

        [HttpPut("theme")]
        public async Task<IActionResult> UpdateThemePreference([FromBody] UpdateThemePreferenceRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new UpdateThemePreferenceCommand
            {
                UserId = userGuid,
                Request = request
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success(result.Data, "Theme preference updated successfully");

            return BadRequest("Failed to update theme preference", result.Errors);
        }

        [HttpPut("language")]
        public async Task<IActionResult> UpdateLanguagePreference([FromBody] UpdateLanguagePreferenceRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new UpdateLanguagePreferenceCommand
            {
                UserId = userGuid,
                Request = request
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success(result.Data, "Language preference updated successfully");

            return BadRequest("Failed to update language preference", result.Errors);
        }

        [HttpPut("car-interests")]
        public async Task<IActionResult> UpdateCarInterests([FromBody] UpdateCarInterestsRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new UpdateCarInterestsCommand
            {
                UserId = userGuid,
                Request = request
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success(result.Data, "Car interests updated successfully");

            return BadRequest("Failed to update car interests", result.Errors);
        }

        [HttpGet("car-interests")]
        [OutputCache(Duration = 300, Tags = new[] { "Profile", "CarInterests" })]
        public async Task<IActionResult> GetCarInterests()
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var query = new GetUserCarInterestsQuery { UserId = userGuid };
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Car interests retrieved successfully");

            return BadRequest("Failed to retrieve car interests", result.Errors);
        }

        [HttpPost("reset")]
        public async Task<IActionResult> ResetPreferences()
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new ResetUserPreferencesCommand { UserId = userGuid };
            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success("User preferences reset to defaults successfully");

            return BadRequest("Failed to reset user preferences", result.Errors);
        }
    }
}