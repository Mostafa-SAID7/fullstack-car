using Application.Common.Attributes;
using Application.Features.Community.Events.Queries;
using Application.Features.Identity.Core.Interfaces;
using Application.Features.Shared.Localization.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Asp.Versioning;

namespace WebAPI.Controllers.Community.Events
{
    /// <summary>
    /// Discovery and query operations for Events
    /// </summary>
    [Authorize]
    [ApiVersion("2.0")]
    [Route("api/v{version:apiVersion}/events")]
    public class EventsQueriesController : BaseController
    {
        private readonly ICurrentUserService _currentUserService;
        private readonly ILocalizationProvider _localizationProvider;

        public EventsQueriesController(
            ICurrentUserService currentUserService,
            ILocalizationProvider localizationProvider)
        {
            _currentUserService = currentUserService;
            _localizationProvider = localizationProvider;
        }

        [HttpGet("featured")]
        [AllowAnonymous]
        [Cache(Duration = 1800, Tags = new[] { "Events", "Featured" })]
        [OutputCache(Duration = 1800, Tags = new[] { "Events", "Featured" })]
        public async Task<IActionResult> GetFeaturedEvents([FromQuery] int pageSize = 6)
        {
            var result = await Mediator.Send(new GetFeaturedEventsQuery { Count = pageSize });
            if (result.Succeeded)
                return Success(result.Data, "Featured events retrieved successfully");

            return BadRequest("Failed to retrieve featured events", result.Errors);
        }

        [HttpGet("trending")]
        [AllowAnonymous]
        [Cache(Duration = 600, Tags = new[] { "Events", "Trending" }, VaryByParameters = new[] { "pageSize", "timeframe" })]
        [OutputCache(Duration = 600, Tags = new[] { "Events", "Trending" })]
        public async Task<IActionResult> GetTrendingEvents(
            [FromQuery] int pageSize = 10,
            [FromQuery] string timeframe = "week")
        {
            var result = await Mediator.Send(new GetTrendingEventsQuery { Count = pageSize, Timeframe = timeframe });
            if (result.Succeeded)
                return Success(result.Data, "Trending events retrieved successfully");

            return BadRequest("Failed to retrieve trending events", result.Errors);
        }

        [HttpGet("upcoming")]
        [AllowAnonymous]
        [Cache(Duration = 300, Tags = new[] { "Events", "Upcoming" }, VaryByParameters = new[] { "pageSize" })]
        [OutputCache(Duration = 300, Tags = new[] { "Events", "Upcoming" })]
        public async Task<IActionResult> GetUpcomingEvents([FromQuery] int pageSize = 10)
        {
            var result = await Mediator.Send(new GetUpcomingEventsQuery { Count = pageSize });
            if (result.Succeeded)
                return Success(result.Data, "Upcoming events retrieved successfully");

            return BadRequest("Failed to retrieve upcoming events", result.Errors);
        }

        [HttpGet("categories")]
        [AllowAnonymous]
        [Cache(Duration = 3600, Tags = new[] { "Events", "Categories" })]
        [OutputCache(Duration = 3600, Tags = new[] { "Events", "Categories" })]
        public async Task<IActionResult> GetEventCategories()
        {
            var result = await Mediator.Send(new GetEventCategoriesQuery { IncludeEventCounts = true });
            if (result.Succeeded)
                return Success(result.Data, "Event categories retrieved successfully");

            return BadRequest("Failed to retrieve event categories", result.Errors);
        }

        [HttpGet("my")]
        [Cache(Duration = 60, Tags = new[] { "Events", "MyEvents" }, VaryByParameters = new[] { "page", "pageSize", "type" })]
        [OutputCache(Duration = 60, Tags = new[] { "Events", "MyEvents" })]
        public async Task<IActionResult> GetMyEvents(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? type = null)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
                return Unauthorized("User authentication required");

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
                return Unauthorized("Invalid user context");

            var result = await Mediator.Send(new GetUserEventsQuery
            {
                UserId = userGuid,
                PageNumber = page,
                PageSize = pageSize,
                Type = type
            });

            if (result.Succeeded)
                return Success(result.Data, "My events retrieved successfully");

            return BadRequest("Failed to retrieve user events", result.Errors);
        }

        [HttpGet("search")]
        [AllowAnonymous]
        [Cache(Duration = 180, Tags = new[] { "Events", "Search" }, VaryByParameters = new[] { "query", "page", "pageSize", "category", "location" })]
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
            var result = await Mediator.Send(new GetEventsQuery
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
            });

            if (result.Succeeded)
                return Success(result.Data, "Event search completed successfully");

            return BadRequest("Failed to search events", result.Errors);
        }

        [HttpGet("calendar")]
        [AllowAnonymous]
        [Cache(Duration = 300, Tags = new[] { "Events", "Calendar" }, VaryByParameters = new[] { "year", "month" })]
        [OutputCache(Duration = 300, Tags = new[] { "Events", "Calendar" })]
        public async Task<IActionResult> GetEventCalendar(
            [FromQuery] int year = 0,
            [FromQuery] int month = 0)
        {
            if (year == 0) year = DateTime.UtcNow.Year;
            if (month == 0) month = DateTime.UtcNow.Month;

            var result = await Mediator.Send(new GetEventCalendarQuery { Year = year, Month = month });
            if (result.Succeeded)
                return Success(result.Data, "Event calendar retrieved successfully");

            return BadRequest("Failed to retrieve event calendar", result.Errors);
        }

        [HttpGet("{id}/updates")]
        [AllowAnonymous]
        [Cache(Duration = 180, Tags = new[] { "Events", "Updates" }, VaryByParameters = new[] { "page", "pageSize", "updateType" })]
        [OutputCache(Duration = 180, Tags = new[] { "Events", "Updates" })]
        public async Task<IActionResult> GetEventUpdates(
            Guid id,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? updateType = null)
        {
            var result = await Mediator.Send(new GetEventUpdatesQuery
            {
                EventId = id,
                PageNumber = page,
                PageSize = pageSize,
                UpdateType = updateType
            });

            if (result.Succeeded)
                return Success(result.Data, "Event updates retrieved successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Event not found");

            return BadRequest("Failed to retrieve event updates", result.Errors);
        }
    }
}
