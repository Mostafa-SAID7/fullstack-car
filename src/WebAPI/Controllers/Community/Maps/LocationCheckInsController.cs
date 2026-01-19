using Application.Common.Attributes;
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
    public class LocationCheckInsController : BaseController
    {
        private readonly ICurrentUserService _currentUserService;

        public LocationCheckInsController(ICurrentUserService currentUserService)
        {
            _currentUserService = currentUserService;
        }

        [HttpPost("{id}/checkin")]
        public async Task<IActionResult> CheckIn(Guid id, [FromBody] CheckInRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
                return Unauthorized("User authentication required");

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
                return Unauthorized("Invalid user context");

            var command = new CheckInCommand
            {
                LocationId = id,
                UserId = userGuid,
                Request = request
            };

            var result = await Mediator.Send(command);
            
            if (result.Succeeded)
                return Success(result, "Check-in successful");

            return BadRequest("Failed to check in", result.Errors);
        }

        [HttpGet("{id}/checkins")]
        [AllowAnonymous]
        [Cache(Duration = 300, Tags = new[] { "Maps", "CheckIns" }, VaryByParameters = new[] { "page", "pageSize" })]
        [OutputCache(PolicyName = "MediumCache", VaryByQueryKeys = new[] { "page", "pageSize" }, VaryByRouteValueNames = new[] { "id" })]
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
                return Success(result, "Location check-ins retrieved successfully");

            return BadRequest("Failed to retrieve check-ins", result.Errors);
        }

        [HttpGet("my-checkins")]
        [Cache(Duration = 60, Tags = new[] { "Maps", "MyCheckIns" }, VaryByParameters = new[] { "page", "pageSize" })]
        [OutputCache(PolicyName = "ShortCache", VaryByQueryKeys = new[] { "page", "pageSize" })]
        public async Task<IActionResult> GetMyCheckIns(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
                return Unauthorized("User authentication required");

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
                return Unauthorized("Invalid user context");

            var query = new GetUserCheckInsQuery
            {
                UserId = userGuid,
                PageNumber = page,
                PageSize = pageSize
            };

            var result = await Mediator.Send(query);
            
            if (result.Succeeded)
                return Success(result, "My check-ins retrieved successfully");

            return BadRequest("Failed to retrieve my check-ins", result.Errors);
        }
    }
}
