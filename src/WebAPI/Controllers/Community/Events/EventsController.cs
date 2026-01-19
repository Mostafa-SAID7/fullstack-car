using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Application.Features.Identity.Core.Interfaces;
using Application.Features.Community.Events.Commands;
using Application.Features.Community.Events.DTOs;
using Application.Features.Community.Events.Queries;
using Application.Common.DTOs;
using Application.Common.Attributes;
using Application.Features.Shared.Localization.Interfaces;
using Application.Features.Shared.Notifications.Interfaces;
using Asp.Versioning;

namespace WebAPI.Controllers.Community.Events
{
    /// <summary>
    /// Core CRUD operations for Events (Main App integration)
    /// </summary>
    [Authorize]
    [ApiVersion("2.0")]
    [Route("api/v{version:apiVersion}/events")]
    public class EventsController : BaseController
    {
        private readonly ICurrentUserService _currentUserService;
        private readonly ILocalizationProvider _localizationProvider;
        private readonly INotificationService _notificationService;
        private readonly ILogger<EventsController> _logger;

        public EventsController(
            ICurrentUserService currentUserService,
            ILocalizationProvider localizationProvider,
            INotificationService notificationService,
            ILogger<EventsController> logger)
        {
            _currentUserService = currentUserService;
            _localizationProvider = localizationProvider;
            _notificationService = notificationService;
            _logger = logger;
        }

        [HttpGet]
        [AllowAnonymous]
        [Cache(Duration = 300, Tags = new[] { "Events" }, VaryByParameters = new[] { "page", "pageSize", "category", "eventType", "location" })]
        [OutputCache(Duration = 300, Tags = new[] { "Events" })]
        public async Task<IActionResult> GetEvents(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? category = null,
            [FromQuery] string? eventType = null,
            [FromQuery] string? searchTerm = null,
            [FromQuery] string? location = null,
            [FromQuery] DateTime? fromDate = null,
            [FromQuery] DateTime? toDate = null,
            [FromQuery] bool? isOnline = null,
            [FromQuery] bool? isFree = null,
            [FromQuery] bool? isPublic = null,
            [FromQuery] string? sortBy = "StartDate",
            [FromQuery] bool sortDescending = false)
        {
            var query = new GetEventsQuery
            {
                PageNumber = page,
                PageSize = pageSize,
                Category = category,
                EventType = eventType,
                SearchTerm = searchTerm,
                Location = location,
                FromDate = fromDate,
                ToDate = toDate,
                IsOnline = isOnline,
                IsFree = isFree,
                IsPublic = isPublic,
                SortBy = sortBy,
                SortDescending = sortDescending
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, await _localizationProvider.GetTranslationAsync("en-US", "Events.Retrieved"));

            return BadRequest(await _localizationProvider.GetTranslationAsync("en-US", "Error"), result.Errors);
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        [Cache(Duration = 300, Tags = new[] { "Events" })]
        [OutputCache(Duration = 300, Tags = new[] { "Events" }, VaryByRouteValueNames = new[] { "id" })]
        public async Task<IActionResult> GetEvent(Guid id)
        {
            var userId = _currentUserService.IsAuthenticated && Guid.TryParse(_currentUserService.UserId, out var userGuid)
                ? userGuid : (Guid?)null;

            var result = await Mediator.Send(new GetEventByIdQuery { Id = id, UserId = userId });

            if (result.Succeeded)
                return Success(result.Data, "Event retrieved successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Event not found");

            return BadRequest("Failed to retrieve event", result.Errors);
        }

        [HttpPost]
        public async Task<IActionResult> CreateEvent([FromBody] CreateEventRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
                return Unauthorized("User authentication required");

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
                return Unauthorized("Invalid user context");

            _logger.LogInformation("Creating event for organizer {UserId}: {Title}", userGuid, request.Title);

            var result = await Mediator.Send(new CreateEventCommand { OrganizerId = userGuid, Request = request });

            if (result.Succeeded)
            {
                var location = Url.Action(nameof(GetEvent), new { id = result.Data.Id });
                return Created(result.Data, location!, "Event created successfully");
            }

            return BadRequest("Failed to create event", result.Errors);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEvent(Guid id, [FromBody] UpdateEventRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
                return Unauthorized("User authentication required");

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
                return Unauthorized("Invalid user context");

            var result = await Mediator.Send(new UpdateEventCommand { Id = id, UserId = userGuid, Request = request });

            if (result.Succeeded)
                return Success(result.Data, "Event updated successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Event not found");

            if (result.Errors.Any(e => e.Contains("permission")))
                return Forbidden("You don't have permission to update this event");

            return BadRequest("Failed to update event", result.Errors);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEvent(Guid id, [FromBody] DeleteEventRequest? request = null)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
                return Unauthorized("User authentication required");

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
                return Unauthorized("Invalid user context");

            var result = await Mediator.Send(new DeleteEventCommand { Id = id, UserId = userGuid, Reason = request?.Reason });

            if (result.Succeeded)
                return Success("Event deleted successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Event not found");

            return BadRequest("Failed to delete event", result.Errors);
        }

        [HttpPost("{id}/attend")]
        public async Task<IActionResult> AttendEvent(Guid id, [FromBody] AttendEventRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
                return Unauthorized("User authentication required");

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
                return Unauthorized("Invalid user context");

            var result = await Mediator.Send(new AttendEventCommand { EventId = id, UserId = userGuid, Request = request });

            if (result.Succeeded)
                return Success(result.Data, "Event attendance updated successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Event not found");

            return BadRequest("Failed to update event attendance", result.Errors);
        }

        [HttpPost("{id}/updates")]
        public async Task<IActionResult> CreateEventUpdate(Guid id, [FromBody] CreateEventUpdateRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
                return Unauthorized("User authentication required");

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
                return Unauthorized("Invalid user context");

            var result = await Mediator.Send(new CreateEventUpdateCommand { EventId = id, UserId = userGuid, Request = request });

            if (result.Succeeded)
                return Success(result.Data, "Event update created successfully");

            return BadRequest("Failed to create event update", result.Errors);
        }
    }

    public class DeleteEventRequest
    {
        public string? Reason { get; set; }
    }
}