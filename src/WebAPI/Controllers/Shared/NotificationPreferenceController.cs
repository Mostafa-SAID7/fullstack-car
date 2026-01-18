using Application.Features.Shared.Notifications.Interfaces;
using Application.Features.Identity.Core.Interfaces;
using Domain.Entities.Shared.Notifications;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Asp.Versioning;

namespace WebAPI.Controllers.Shared
{
    [Authorize]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/notifications/preferences")]
    public class NotificationPreferenceController : BaseController
    {
        private readonly INotificationPreferenceService _preferenceService;
        private readonly ICurrentUserService _currentUserService;
        private readonly ILogger<NotificationPreferenceController> _logger;

        public NotificationPreferenceController(
            INotificationPreferenceService preferenceService,
            ICurrentUserService currentUserService,
            ILogger<NotificationPreferenceController> logger)
        {
            _preferenceService = preferenceService;
            _currentUserService = currentUserService;
            _logger = logger;
        }
        [HttpGet]
        public async Task<IActionResult> GetPreferences()
        {
            try
            {
                var userId = _currentUserService.UserId;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized("User not authenticated");
                }

                var preferences = await _preferenceService.GetUserPreferencesAsync(userId);
                return Success(preferences, "Preferences retrieved successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving notification preferences");
                return InternalServerError("Failed to retrieve preferences");
            }
        }
        [HttpPut]
        public async Task<IActionResult> UpdatePreferences([FromBody] UpdatePreferencesRequest request)
        {
            try
            {
                var userId = _currentUserService.UserId;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized("User not authenticated");
                }

                if (!ModelState.IsValid)
                {
                    var errors = ModelState.SelectMany(x => x.Value.Errors).Select(x => x.ErrorMessage).ToList();
                    return BadRequest("Invalid preference data", errors);
                }

                // Convert request to preferences
                var preferences = request.Preferences.Select(p => new NotificationPreference
                {
                    NotificationType = p.NotificationType,
                    EmailEnabled = p.EmailEnabled,
                    PushEnabled = p.PushEnabled,
                    SmsEnabled = p.SmsEnabled,
                    InAppEnabled = p.InAppEnabled,
                    Frequency = p.Frequency
                });

                await _preferenceService.UpdatePreferencesAsync(userId, preferences);
                return Success("Preferences updated successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating notification preferences");
                return InternalServerError("Failed to update preferences");
            }
        }
        [HttpPost("device")]
        public async Task<IActionResult> RegisterDevice([FromBody] RegisterDeviceRequest request)
        {
            try
            {
                var userId = _currentUserService.UserId;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized("User not authenticated");
                }

                if (!ModelState.IsValid)
                {
                    var errors = ModelState.SelectMany(x => x.Value.Errors).Select(x => x.ErrorMessage).ToList();
                    return BadRequest("Invalid device data", errors);
                }

                await _preferenceService.RegisterDeviceTokenAsync(userId, request.DeviceToken, request.Platform);
                return Success("Device registered successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error registering device");
                return InternalServerError("Failed to register device");
            }
        }
        [HttpDelete("device/{token}")]
        public async Task<IActionResult> UnregisterDevice(string token)
        {
            try
            {
                var userId = _currentUserService.UserId;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized("User not authenticated");
                }

                await _preferenceService.UnregisterDeviceTokenAsync(token);
                return Success("Device unregistered successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error unregistering device");
                return InternalServerError("Failed to unregister device");
            }
        }
        [HttpGet("devices")]
        public async Task<IActionResult> GetDevices()
        {
            try
            {
                var userId = _currentUserService.UserId;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized("User not authenticated");
                }

                var tokens = await _preferenceService.GetUserDeviceTokensAsync(userId);
                return Success(new { tokens }, "Devices retrieved successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving devices");
                return InternalServerError("Failed to retrieve devices");
            }
        }
    }
    public class UpdatePreferencesRequest
    {
        public List<PreferenceDto> Preferences { get; set; } = new();
    }
    public class PreferenceDto
    {
        public string NotificationType { get; set; } = string.Empty;
        public bool EmailEnabled { get; set; }
        public bool PushEnabled { get; set; }
        public bool SmsEnabled { get; set; }
        public bool InAppEnabled { get; set; }
        public string Frequency { get; set; } = "immediate";
    }
    public class RegisterDeviceRequest
    {
        public string DeviceToken { get; set; } = string.Empty;
        public string Platform { get; set; } = string.Empty; // iOS, Android, Web
    }
}


