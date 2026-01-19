using Application.Common.Attributes;
using Application.Features.Community.Maps.Commands;
using Application.Features.Community.Maps.DTOs;
using Application.Features.Community.Maps.Queries;
using Application.Features.Identity.Core.Interfaces;
using Application.Features.Shared.Localization.Interfaces;
using Application.Features.Shared.Notifications.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Asp.Versioning;

namespace WebAPI.Controllers.Community.Maps
{
    /// <summary>
    /// Core CRUD operations for Maps/Locations
    /// </summary>
    [Authorize]
    [ApiVersion("2.0")]
    [Route("api/v{version:apiVersion}/maps")]
    public class MapsController : BaseController
    {
        private readonly ICurrentUserService _currentUserService;
        private readonly ILocalizationProvider _localizationProvider;
        private readonly INotificationService _notificationService;
        private readonly ILogger<MapsController> _logger;

        public MapsController(
            ICurrentUserService currentUserService,
            ILocalizationProvider localizationProvider,
            INotificationService notificationService,
            ILogger<MapsController> logger)
        {
            _currentUserService = currentUserService;
            _localizationProvider = localizationProvider;
            _notificationService = notificationService;
            _logger = logger;
        }

        [HttpGet]
        [AllowAnonymous]
        [Cache(Duration = 300, Tags = new[] { "Maps" })]
        [OutputCache(PolicyName = "MediumCache")]
        public async Task<IActionResult> GetLocations([FromQuery] Application.Features.Community.Maps.Queries.GetLocationsQuery query)
        {
            _logger.LogInformation("Retrieving locations with query: {@Query}", query);
            var result = await Mediator.Send(query);
            return Success(result, await _localizationProvider.GetTranslationAsync("en-US", "Maps.Retrieved"));
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        [Cache(Duration = 300, Tags = new[] { "Maps" })]
        [OutputCache(PolicyName = "MediumCache", VaryByRouteValueNames = new[] { "id" })]
        public async Task<IActionResult> GetLocation(Guid id)
        {
            var query = new GetLocationByIdQuery { LocationId = id };
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Location retrieved successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Location not found");

            return BadRequest("Failed to retrieve location", result.Errors);
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Moderator,User")]
        public async Task<IActionResult> CreateLocation([FromBody] CreateLocationRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
                return Unauthorized("User authentication required");

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
                return Unauthorized("Invalid user context");

            _logger.LogInformation("Creating location for user {UserId}: {LocationName}", userGuid, request.Name);

            var command = new CreateLocationCommand
            {
                Request = request,
                UserId = userGuid
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
            {
                _logger.LogInformation("Location created successfully. Id: {LocationId}", result.Data);
                dynamic resultData = result.Data;
                var location = Url.Action(nameof(GetLocation), new { id = resultData.Id });
                return Created(result.Data, location!, await _localizationProvider.GetTranslationAsync("en-US", "Maps.Created"));
            }

            _logger.LogWarning("Failed to create location. Errors: {Errors}", string.Join(", ", result.Errors));
            return BadRequest(await _localizationProvider.GetTranslationAsync("en-US", "Error"), result.Errors);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Moderator,User")]
        public async Task<IActionResult> UpdateLocation(Guid id, [FromBody] UpdateLocationRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
                return Unauthorized("User authentication required");

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
                return Unauthorized("Invalid user context");

            var command = new UpdateLocationCommand
            {
                LocationId = id,
                Request = request,
                UserId = userGuid
            };

            var result = await Mediator.Send(command);
            
            if (result.Succeeded)
            {
                _logger.LogInformation("Location updated successfully. Id: {LocationId}", id);
                return Success(result, "Location updated successfully");
            }

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Location not found");

            if (result.Errors.Any(e => e.Contains("unauthorized") || e.Contains("permission")))
                return Forbidden("You don't have permission to update this location");

            return BadRequest("Failed to update location", result.Errors);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,Moderator")]
        public async Task<IActionResult> DeleteLocation(Guid id)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
                return Unauthorized("User authentication required");

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
                return Unauthorized("Invalid user context");

            var command = new DeleteLocationCommand
            {
                LocationId = id,
                UserId = userGuid
            };

            var result = await Mediator.Send(command);
            
            if (result.Succeeded)
            {
                _logger.LogInformation("Location deleted successfully. Id: {LocationId}", id);
                return Success("Location deleted successfully");
            }

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Location not found");

            return BadRequest("Failed to delete location", result.Errors);
        }
    }
}
