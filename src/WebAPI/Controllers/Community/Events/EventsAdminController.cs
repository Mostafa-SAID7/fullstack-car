using Application.Common.Attributes;
using Application.Features.Community.Events.Commands;
using Application.Features.Community.Events.Queries;
using Application.Features.Identity.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Asp.Versioning;

namespace WebAPI.Controllers.Community.Events
{
    /// <summary>
    /// Admin and moderator operations for Events (Dashboard integration)
    /// </summary>
    [Authorize(Roles = "Admin,Moderator")]
    [ApiVersion("2.0")]
    [Route("api/v{version:apiVersion}/events")]
    public class EventsAdminController : BaseController
    {
        private readonly ICurrentUserService _currentUserService;
        private readonly ILogger<EventsAdminController> _logger;

        public EventsAdminController(
            ICurrentUserService currentUserService,
            ILogger<EventsAdminController> logger)
        {
            _currentUserService = currentUserService;
            _logger = logger;
        }

        [HttpPost("{id}/feature")]
        public async Task<IActionResult> FeatureEvent(Guid id)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
                return Unauthorized("User authentication required");

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
                return Unauthorized("Invalid user context");

            _logger.LogInformation("Moderator {UserId} is featuring event {EventId}", userGuid, id);

            var command = new FeatureEventCommand
            {
                EventId = id,
                UserId = userGuid,
                IsFeatured = true
            };

            var result = await Mediator.Send(command);
            if (result.Succeeded)
                return Success(result.Data, "Event featured successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Event not found");

            return BadRequest("Failed to feature event", result.Errors);
        }

        [HttpDelete("{id}/feature")]
        public async Task<IActionResult> UnfeatureEvent(Guid id)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
                return Unauthorized("User authentication required");

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
                return Unauthorized("Invalid user context");

            _logger.LogInformation("Moderator {UserId} is unfeaturing event {EventId}", userGuid, id);

            var command = new FeatureEventCommand
            {
                EventId = id,
                UserId = userGuid,
                IsFeatured = false
            };

            var result = await Mediator.Send(command);
            if (result.Succeeded)
                return Success(result.Data, "Event unfeatured successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Event not found");

            return BadRequest("Failed to unfeature event", result.Errors);
        }

        [HttpGet("stats")]
        [AllowAnonymous]
        [Cache(Duration = 1800, Tags = new[] { "Events", "Stats" })]
        [OutputCache(Duration = 1800, Tags = new[] { "Events", "Stats" })]
        public async Task<IActionResult> GetEventsStats()
        {
            _logger.LogInformation("Retrieving global events statistics");
            var result = await Mediator.Send(new GetEventsStatsQuery());
            if (result.Succeeded)
                return Success(result.Data, "Events statistics retrieved successfully");

            return BadRequest("Failed to retrieve events statistics", result.Errors);
        }

        [HttpGet("{id}/analytics")]
        [Cache(Duration = 300, Tags = new[] { "Events", "Analytics" })]
        [OutputCache(Duration = 300, Tags = new[] { "Events", "Analytics" })]
        public async Task<IActionResult> GetEventAnalytics(Guid id)
        {
            _logger.LogInformation("Retrieving analytics for event {EventId}", id);
            // Reusing GetEventAttendanceStatsQuery for basic analytics as it provides attendance breakdown
            // A more comprehensive analytics query could be created if needed.
            var result = await Mediator.Send(new GetEventAttendanceStatsQuery { EventId = id });
            if (result.Succeeded)
                return Success(result.Data, "Event analytics retrieved successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Event not found");

            return BadRequest("Failed to retrieve event analytics", result.Errors);
        }
    }
}
