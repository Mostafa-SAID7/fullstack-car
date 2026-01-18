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

        [HttpGet("locations")]
        [AllowAnonymous]
        [OutputCache(Duration = 300, Tags = new[] { "Maps", "Locations" })]
        public async Task<IActionResult> GetLocations([FromQuery] GetLocationsQuery query)
        {
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Ok(result.Data);

            return BadRequest(result.Errors);
        }

        [HttpGet("locations/{id}")]
        [AllowAnonymous]
        [OutputCache(Duration = 300, Tags = new[] { "Maps", "Locations" })]
        public async Task<IActionResult> GetLocation(Guid id)
        {
            var result = await Mediator.Send(new GetLocationByIdQuery { Id = id });

            if (result.Succeeded)
                return Ok(result.Data);

            return BadRequest(result.Errors);
        }

        [HttpPost("locations")]
        public async Task<IActionResult> CreateLocation([FromBody] CreateLocationRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized();
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized();
            }

            var command = new CreateLocationCommand
            {
                Request = request,
                UserId = userGuid
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return CreatedAtAction(nameof(GetLocation), new { id = result.Data.Id }, result.Data);

            return BadRequest(result.Errors);
        }

        [HttpPut("locations/{id}")]
        public async Task<IActionResult> UpdateLocation(Guid id, [FromBody] UpdateLocationRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized();
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized();
            }

            var result = await Mediator.Send(new UpdateLocationCommand
            {
                Id = id,
                UserId = userGuid,
                Request = request
            });

            if (result.Succeeded)
                return Ok(result.Data);

            return BadRequest(result.Errors);
        }

        [HttpDelete("locations/{id}")]
        public async Task<IActionResult> DeleteLocation(Guid id)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized();
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized();
            }

            var result = await Mediator.Send(new DeleteLocationCommand
            {
                LocationId = id,
                UserId = userGuid
            });

            if (result.Succeeded)
                return NoContent();

            return BadRequest(result.Errors);
        }

        [HttpGet("locations/{id}/checkins")]
        [AllowAnonymous]
        [OutputCache(Duration = 60, Tags = new[] { "Maps", "CheckIns" })]
        public async Task<IActionResult> GetLocationCheckIns(Guid id, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var result = await Mediator.Send(new GetLocationCheckInsQuery
            {
                LocationId = id,
                PageNumber = page,
                PageSize = pageSize
            });

            if (result.Succeeded)
                return Ok(result.Data);

            return BadRequest(result.Errors);
        }

        [HttpPost("locations/{id}/checkin")]
        public async Task<IActionResult> CheckIn(Guid id, [FromBody] CheckInRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized();
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized();
            }

            var result = await Mediator.Send(new CheckInCommand
            {
                LocationId = id,
                UserId = userGuid,
                Request = request
            });

            if (result.Succeeded)
                return Ok(new { Message = "Check-in successful" });

            return BadRequest(result.Errors);
        }

        [HttpGet("locations/{id}/reviews")]
        [AllowAnonymous]
        [OutputCache(Duration = 120, Tags = new[] { "Maps", "Reviews" })]
        public async Task<IActionResult> GetLocationReviews(Guid id, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var result = await Mediator.Send(new GetLocationReviewsQuery
            {
                LocationId = id,
                PageNumber = page,
                PageSize = pageSize
            });

            if (result.Succeeded)
                return Ok(result.Data);

            return BadRequest(result.Errors);
        }

        [HttpPost("locations/{id}/reviews")]
        public async Task<IActionResult> CreateLocationReview(Guid id, [FromBody] CreateLocationReviewRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized();
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized();
            }

            var result = await Mediator.Send(new CreateLocationReviewCommand
            {
                LocationId = id,
                UserId = userGuid,
                Request = request
            });

            if (result.Succeeded)
                return Ok(new { Message = "Review created successfully" });

            return BadRequest(result.Errors);
        }

        [HttpGet("categories")]
        [AllowAnonymous]
        [OutputCache(Duration = 3600, Tags = new[] { "Maps", "Categories" })]
        public async Task<IActionResult> GetLocationCategories()
        {
            var result = await Mediator.Send(new GetLocationCategoriesQuery());

            if (result.Succeeded)
                return Ok(result.Data);

            return BadRequest(result.Errors);
        }

        [HttpGet("search")]
        [AllowAnonymous]
        [OutputCache(Duration = 60, Tags = new[] { "Maps", "Search" })]
        public async Task<IActionResult> SearchLocations([FromQuery] SearchLocationsQuery query)
        {
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Ok(result.Data);

            return BadRequest(result.Errors);
        }

        [HttpGet("test")]
        [AllowAnonymous]
        public IActionResult Test()
        {
            return Ok(new { message = "Maps API is working", timestamp = DateTime.UtcNow });
        }
    }
}