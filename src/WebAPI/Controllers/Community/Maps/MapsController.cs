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

            if (result.Succeeded)
                return Success(result.Data, "Locations retrieved successfully");

            return BadRequest("Failed to retrieve locations", result.Errors);
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

            if (result.Succeeded)
            {
                var location = Url.Action(nameof(GetLocation), new { id = result.Data.Id });
                return Created(result.Data, location!, "Location created successfully");
            }

            if (result.Errors.Any(e => e.Contains("duplicate")))
                return BadRequest("A location with this name already exists at this address", result.Errors);

            return BadRequest("Failed to create location", result.Errors);
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

            if (result.Succeeded)
                return Success(result.Data, "Location updated successfully");

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

            if (result.Succeeded)
                return Success("Location deleted successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Location not found");

            if (result.Errors.Any(e => e.Contains("unauthorized") || e.Contains("permission")))
                return Forbidden("You don't have permission to delete this location");

            return BadRequest("Failed to delete location", result.Errors);
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

            if (result.Succeeded)
                return Success(result.Data, "Check-in successful");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Location not found");

            if (result.Errors.Any(e => e.Contains("already checked in")))
                return BadRequest("You have already checked in at this location today", result.Errors);

            return BadRequest("Failed to check in", result.Errors);
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

            if (result.Succeeded)
                return Success(result.Data, "Location check-ins retrieved successfully");

            return BadRequest("Failed to retrieve location check-ins", result.Errors);
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

            if (result.Succeeded)
                return Success(result.Data, "Location review created successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Location not found");

            if (result.Errors.Any(e => e.Contains("already reviewed")))
                return BadRequest("You have already reviewed this location", result.Errors);

            return BadRequest("Failed to create location review", result.Errors);
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

            if (result.Succeeded)
                return Success(result.Data, "Location reviews retrieved successfully");

            return BadRequest("Failed to retrieve location reviews", result.Errors);
        }

        [HttpGet("search")]
        [AllowAnonymous]
        [OutputCache(Duration = 180, Tags = new[] { "Maps", "Search" })]
        public async Task<IActionResult> SearchLocations([FromQuery] Application.Features.Community.Maps.Queries.SearchLocationsQuery query)
        {
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Location search completed successfully");

            return BadRequest("Failed to search locations", result.Errors);
        }

        [HttpGet("categories")]
        [AllowAnonymous]
        [OutputCache(Duration = 3600, Tags = new[] { "Maps", "Categories" })]
        public async Task<IActionResult> GetLocationCategories()
        {
            var query = new GetLocationCategoriesQuery();
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Location categories retrieved successfully");

            return BadRequest("Failed to retrieve location categories", result.Errors);
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

            if (result.Succeeded)
                return Success(result.Data, "My check-ins retrieved successfully");

            return BadRequest("Failed to retrieve my check-ins", result.Errors);
        }

        [HttpGet("stats")]
        [AllowAnonymous]
        [OutputCache(Duration = 1800, Tags = new[] { "Maps", "Stats" })]
        public async Task<IActionResult> GetMapStats()
        {
            var query = new GetMapStatsQuery();
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Map statistics retrieved successfully");

            return BadRequest("Failed to retrieve map statistics", result.Errors);
        }
    }
}


