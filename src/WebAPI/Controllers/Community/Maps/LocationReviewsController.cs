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
    public class LocationReviewsController : BaseController
    {
        private readonly ICurrentUserService _currentUserService;

        public LocationReviewsController(ICurrentUserService currentUserService)
        {
            _currentUserService = currentUserService;
        }

        [HttpPost("{id}/reviews")]
        public async Task<IActionResult> CreateLocationReview(Guid id, [FromBody] CreateLocationReviewRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
                return Unauthorized("User authentication required");

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
                return Unauthorized("Invalid user context");

            var command = new CreateLocationReviewCommand
            {
                LocationId = id,
                UserId = userGuid,
                Request = request
            };

            var result = await Mediator.Send(command);
            
            if (result.Succeeded)
                return Success(result, "Location review created successfully");

            return BadRequest("Failed to create review", result.Errors);
        }

        [HttpGet("{id}/reviews")]
        [AllowAnonymous]
        [Cache(Duration = 300, Tags = new[] { "Maps", "Reviews" }, VaryByParameters = new[] { "page", "pageSize" })]
        [OutputCache(PolicyName = "MediumCache", VaryByQueryKeys = new[] { "page", "pageSize" }, VaryByRouteValueNames = new[] { "id" })]
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
                return Success(result, "Location reviews retrieved successfully");

            return BadRequest("Failed to retrieve reviews", result.Errors);
        }
    }
}
