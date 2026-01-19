using Application.Features.Community.Maps.Commands;
using Application.Features.Community.Maps.DTOs;
using Application.Features.Community.Maps.Queries;
using Application.Features.Identity.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Asp.Versioning;

namespace WebAPI.Controllers.Community.Maps
{
    [Authorize]
    [ApiVersion("2.0")]
    [Route("api/v{version:apiVersion}/maps")]
    public class MapsController : BaseController
    {
        private readonly ICurrentUserService _currentUserService;

        public MapsController(ICurrentUserService currentUserService)
        {
            _currentUserService = currentUserService;
        }

        [HttpGet]
        [AllowAnonymous]
        [OutputCache(Duration = 300, Tags = new[] { "Maps" })]
        public async Task<IActionResult> GetLocations([FromQuery] Application.Features.Community.Maps.Queries.GetLocationsQuery query)
        {
            var result = await Mediator.Send(query);
            return Success(result, "Locations retrieved successfully");
        }

        [HttpGet("nearby")]
        [AllowAnonymous]
        [OutputCache(Duration = 180, Tags = new[] { "Maps", "Nearby" })]
        public async Task<IActionResult> GetNearbyLocations(
            [FromQuery] double latitude,
            [FromQuery] double longitude,
            [FromQuery] double radiusKm = 10,
            [FromQuery] string? category = null,
            [FromQuery] int pageSize = 20)
        {
            var query = new GetNearbyLocationsQuery
            {
                Latitude = latitude,
                Longitude = longitude,
                RadiusKm = radiusKm,
                Category = category,
                PageSize = pageSize
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Nearby locations retrieved successfully");

            return BadRequest("Failed to retrieve nearby locations", result.Errors);
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        [OutputCache(Duration = 300, Tags = new[] { "Maps" })]
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
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new CreateLocationCommand
            {
                Request = request,
                UserId = userGuid
            };

            var result = await Mediator.Send(command);

            dynamic resultData = result;
            var location = Url.Action(nameof(GetLocation), new { id = resultData.Id });
            return Created(result, location!, "Location created successfully");
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Moderator,User")]
        public async Task<IActionResult> UpdateLocation(Guid id, [FromBody] UpdateLocationRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new UpdateLocationCommand
            {
                LocationId = id,
                Request = request,
                UserId = userGuid
            };

            var result = await Mediator.Send(command);
            return Success(result, "Location updated successfully");
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,Moderator")]
        public async Task<IActionResult> DeleteLocation(Guid id)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new DeleteLocationCommand
            {
                LocationId = id,
                UserId = userGuid
            };

            var result = await Mediator.Send(command);
            return Success("Location deleted successfully");
        }

        [HttpPost("{id}/checkin")]
        [Authorize]
        public async Task<IActionResult> CheckIn(Guid id, [FromBody] CheckInRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new CheckInCommand
            {
                LocationId = id,
                UserId = userGuid,
                Request = request
            };

            var result = await Mediator.Send(command);
            return Success(result, "Check-in successful");
        }

        [HttpGet("{id}/checkins")]
        [AllowAnonymous]
        [OutputCache(Duration = 300, Tags = new[] { "Maps", "CheckIns" })]
        public async Task<IActionResult> GetLocationCheckIns(
            Guid id,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            var query = new GetLocationCheckInsQuery
            {
                LocationId = id,
                PageNumber = page,
                PageSize = pageSize
            };

            var result = await Mediator.Send(query);
            return Success(result, "Location check-ins retrieved successfully");
        }

        [HttpPost("{id}/reviews")]
        [Authorize]
        public async Task<IActionResult> CreateLocationReview(Guid id, [FromBody] CreateLocationReviewRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new CreateLocationReviewCommand
            {
                LocationId = id,
                UserId = userGuid,
                Request = request
            };

            var result = await Mediator.Send(command);
            return Success(result, "Location review created successfully");
        }

        [HttpGet("{id}/reviews")]
        [AllowAnonymous]
        [OutputCache(Duration = 300, Tags = new[] { "Maps", "Reviews" })]
        public async Task<IActionResult> GetLocationReviews(
            Guid id,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            var query = new GetLocationReviewsQuery
            {
                LocationId = id,
                PageNumber = page,
                PageSize = pageSize
            };

            var result = await Mediator.Send(query);
            return Success(result, "Location reviews retrieved successfully");
        }

        [HttpGet("search")]
        [AllowAnonymous]
        [OutputCache(Duration = 180, Tags = new[] { "Maps", "Search" })]
        public async Task<IActionResult> SearchLocations([FromQuery] Application.Features.Community.Maps.Queries.SearchLocationsQuery query)
        {
            var result = await Mediator.Send(query);
            return Success(result, "Location search completed successfully");
        }

        [HttpGet("categories")]
        [AllowAnonymous]
        [OutputCache(Duration = 3600, Tags = new[] { "Maps", "Categories" })]
        public async Task<IActionResult> GetLocationCategories()
        {
            var query = new GetLocationCategoriesQuery();
            var result = await Mediator.Send(query);
            return Success(result, "Location categories retrieved successfully");
        }

        [HttpGet("my-checkins")]
        [OutputCache(Duration = 60, Tags = new[] { "Maps", "MyCheckIns" })]
        public async Task<IActionResult> GetMyCheckIns(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var query = new GetUserCheckInsQuery
            {
                UserId = userGuid,
                PageNumber = page,
                PageSize = pageSize
            };

            var result = await Mediator.Send(query);
            return Success(result, "My check-ins retrieved successfully");
        }

        [HttpGet("stats")]
        [AllowAnonymous]
        [OutputCache(Duration = 1800, Tags = new[] { "Maps", "Stats" })]
        public async Task<IActionResult> GetMapStats()
        {
            var query = new GetMapStatsQuery();
            var result = await Mediator.Send(query);
            return Success(result, "Map statistics retrieved successfully");
        }
    }
}


