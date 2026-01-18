using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Application.Features.Identity.Core.Interfaces;
using Application.Features.Community.Events.Commands;
using Application.Features.Community.Events.DTOs;
using Application.Features.Community.Events.Queries;
using Application.Common.DTOs;
using Application.Features.Shared.Localization.Interfaces;
using Application.Features.Shared.Notifications.Interfaces;
using Asp.Versioning;

namespace WebAPI.Controllers.Community.Events
{
    [Authorize]
    [ApiVersion("2.0")]
    [Route("api/v{version:apiVersion}/events")]
    public class EventsController : BaseController
    {
        private readonly ICurrentUserService _currentUserService;
        private readonly ILocalizationProvider _localizationProvider;
        private readonly INotificationService _notificationService;

        public EventsController(
            ICurrentUserService currentUserService,
            ILocalizationProvider localizationProvider,
            INotificationService notificationService)
        {
            _currentUserService = currentUserService;
            _localizationProvider = localizationProvider;
            _notificationService = notificationService;
        }

        [HttpGet]
        [AllowAnonymous]
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
        [OutputCache(Duration = 300, Tags = new[] { "Events" })]
        public async Task<IActionResult> GetEvent(Guid id)
        {
            var userId = _currentUserService.IsAuthenticated && Guid.TryParse(_currentUserService.UserId, out var userGuid)
                ? userGuid : (Guid?)null;

            var query = new GetEventByIdQuery
            {
                Id = id,
                UserId = userId
            };

            var result = await Mediator.Send(query);

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
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new CreateEventCommand
            {
                OrganizerId = userGuid,
                Request = request
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
            {
                var location = Url.Action(nameof(GetEvent), new { id = result.Data.Id });
                return Created(result.Data, location!, "Event created successfully");
            }

            if (result.Errors.Any(e => e.Contains("future")))
                return BadRequest("Event start date must be in the future", result.Errors);

            if (result.Errors.Any(e => e.Contains("end date")))
                return BadRequest("Event end date must be after start date", result.Errors);

            return BadRequest("Failed to create event", result.Errors);
        }

        [HttpPost("{id}/attend")]
        public async Task<IActionResult> AttendEvent(Guid id, [FromBody] AttendEventRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new AttendEventCommand
            {
                EventId = id,
                UserId = userGuid,
                Request = request
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success(result.Data, "Event attendance updated successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Event not found");

            if (result.Errors.Any(e => e.Contains("not active")))
                return BadRequest("Event is not active", result.Errors);

            if (result.Errors.Any(e => e.Contains("past events")))
                return BadRequest("Cannot attend past events", result.Errors);

            if (result.Errors.Any(e => e.Contains("full")))
                return BadRequest("Event is full", result.Errors);

            return BadRequest("Failed to update event attendance", result.Errors);
        }

        [HttpGet("featured")]
        [AllowAnonymous]
        [OutputCache(Duration = 1800, Tags = new[] { "Events", "Featured" })]
        public async Task<IActionResult> GetFeaturedEvents([FromQuery] int pageSize = 6)
        {
            var query = new GetFeaturedEventsQuery
            {
                Count = pageSize
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Featured events retrieved successfully");

            return BadRequest("Failed to retrieve featured events", result.Errors);
        }

        [HttpGet("trending")]
        [AllowAnonymous]
        [OutputCache(Duration = 600, Tags = new[] { "Events", "Trending" })]
        public async Task<IActionResult> GetTrendingEvents(
            [FromQuery] int pageSize = 10,
            [FromQuery] string timeframe = "week")
        {
            var query = new GetTrendingEventsQuery
            {
                Count = pageSize,
                Timeframe = timeframe
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Trending events retrieved successfully");

            return BadRequest("Failed to retrieve trending events", result.Errors);
        }

        [HttpGet("upcoming")]
        [AllowAnonymous]
        [OutputCache(Duration = 300, Tags = new[] { "Events", "Upcoming" })]
        public async Task<IActionResult> GetUpcomingEvents([FromQuery] int pageSize = 10)
        {
            var query = new GetUpcomingEventsQuery
            {
                Count = pageSize
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Upcoming events retrieved successfully");

            return BadRequest("Failed to retrieve upcoming events", result.Errors);
        }

        [HttpGet("categories")]
        [AllowAnonymous]
        [OutputCache(Duration = 3600, Tags = new[] { "Events", "Categories" })]
        public async Task<IActionResult> GetEventCategories()
        {
            var query = new GetEventCategoriesQuery
            {
                IncludeEventCounts = true
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Event categories retrieved successfully");

            return BadRequest("Failed to retrieve event categories", result.Errors);
        }

        [HttpGet("my")]
        [OutputCache(Duration = 60, Tags = new[] { "Events", "MyEvents" })]
        public async Task<IActionResult> GetMyEvents(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? type = null) // organized, attending, maybe
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var query = new GetUserEventsQuery
            {
                UserId = userGuid,
                PageNumber = page,
                PageSize = pageSize,
                Type = type
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "My events retrieved successfully");

            return BadRequest("Failed to retrieve user events", result.Errors);
        }

        [HttpGet("search")]
        [AllowAnonymous]
        [OutputCache(Duration = 180, Tags = new[] { "Events", "Search" })]
        public async Task<IActionResult> SearchEvents(
            [FromQuery] string query,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? category = null,
            [FromQuery] string? location = null,
            [FromQuery] DateTime? fromDate = null,
            [FromQuery] DateTime? toDate = null)
        {
            var searchQuery = new GetEventsQuery
            {
                SearchTerm = query,
                PageNumber = page,
                PageSize = pageSize,
                Category = category,
                Location = location,
                FromDate = fromDate,
                ToDate = toDate,
                SortBy = "StartDate",
                SortDescending = false
            };

            var result = await Mediator.Send(searchQuery);

            if (result.Succeeded)
                return Success(result.Data, "Event search completed successfully");

            return BadRequest("Failed to search events", result.Errors);
        }

        [HttpGet("calendar")]
        [AllowAnonymous]
        [OutputCache(Duration = 300, Tags = new[] { "Events", "Calendar" })]
        public async Task<IActionResult> GetEventCalendar(
            [FromQuery] int year = 0,
            [FromQuery] int month = 0)
        {
            if (year == 0) year = DateTime.UtcNow.Year;
            if (month == 0) month = DateTime.UtcNow.Month;

            var query = new GetEventCalendarQuery
            {
                Year = year,
                Month = month
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Event calendar retrieved successfully");

            return BadRequest("Failed to retrieve event calendar", result.Errors);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEvent(Guid id, [FromBody] UpdateEventRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new UpdateEventCommand
            {
                Id = id,
                UserId = userGuid,
                Request = request
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success(result.Data, "Event updated successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Event not found");

            if (result.Errors.Any(e => e.Contains("permission")))
                return Forbid("You don't have permission to update this event");

            if (result.Errors.Any(e => e.Contains("future")))
                return BadRequest("Event start date must be in the future", result.Errors);

            if (result.Errors.Any(e => e.Contains("end date")))
                return BadRequest("Event end date must be after start date", result.Errors);

            return BadRequest("Failed to update event", result.Errors);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEvent(Guid id, [FromBody] DeleteEventRequest? request = null)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new DeleteEventCommand
            {
                Id = id,
                UserId = userGuid,
                Reason = request?.Reason
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success(result.Data, "Event deleted successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Event not found");

            if (result.Errors.Any(e => e.Contains("permission")))
                return Forbid("You don't have permission to delete this event");

            return BadRequest("Failed to delete event", result.Errors);
        }

        [HttpPost("{id}/feature")]
        [Authorize(Roles = "Admin,Moderator")]
        public async Task<IActionResult> FeatureEvent(Guid id)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

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

            if (result.Errors.Any(e => e.Contains("inactive")))
                return BadRequest("Cannot feature inactive events", result.Errors);

            if (result.Errors.Any(e => e.Contains("private")))
                return BadRequest("Cannot feature private events", result.Errors);

            return BadRequest("Failed to feature event", result.Errors);
        }

        [HttpDelete("{id}/feature")]
        [Authorize(Roles = "Admin,Moderator")]
        public async Task<IActionResult> UnfeatureEvent(Guid id)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

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

        [HttpPost("{id}/updates")]
        public async Task<IActionResult> CreateEventUpdate(Guid id, [FromBody] CreateEventUpdateRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new CreateEventUpdateCommand
            {
                EventId = id,
                UserId = userGuid,
                Request = request
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success(result.Data, "Event update created successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Event not found");

            if (result.Errors.Any(e => e.Contains("permission")))
                return Forbid("Only event organizers can post updates");

            return BadRequest("Failed to create event update", result.Errors);
        }

        [HttpGet("{id}/updates")]
        [AllowAnonymous]
        [OutputCache(Duration = 180, Tags = new[] { "Events", "Updates" })]
        public async Task<IActionResult> GetEventUpdates(
            Guid id,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? updateType = null)
        {
            var query = new GetEventUpdatesQuery
            {
                EventId = id,
                PageNumber = page,
                PageSize = pageSize,
                UpdateType = updateType
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Event updates retrieved successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Event not found");

            return BadRequest("Failed to retrieve event updates", result.Errors);
        }

        [HttpGet("stats")]
        [AllowAnonymous]
        [OutputCache(Duration = 1800, Tags = new[] { "Events", "Stats" })]
        public async Task<IActionResult> GetEventsStats()
        {
            var query = new GetEventsStatsQuery();

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Events statistics retrieved successfully");

            return BadRequest("Failed to retrieve events statistics", result.Errors);
        }
    }

    // Request DTOs
    public class DeleteEventRequest
    {
        public string? Reason { get; set; }
    }
}