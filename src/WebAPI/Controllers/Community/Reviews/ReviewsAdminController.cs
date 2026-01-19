using Application.Common.Attributes;
using Application.Features.Community.Reviews.Commands;
using Application.Features.Community.Reviews.DTOs;
using Application.Features.Community.Reviews.Queries;
using Application.Features.Identity.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Asp.Versioning;

namespace WebAPI.Controllers.Community.Reviews
{
    /// <summary>
    /// Admin and moderator operations for Reviews
    /// </summary>
    [Authorize(Roles = "Admin,Moderator")]
    [ApiVersion("2.0")]
    [Route("api/v{version:apiVersion}/reviews")]
    public class ReviewsAdminController : BaseController
    {
        private readonly ICurrentUserService _currentUserService;
        private readonly ILogger<ReviewsAdminController> _logger;

        public ReviewsAdminController(
            ICurrentUserService currentUserService,
            ILogger<ReviewsAdminController> logger)
        {
            _currentUserService = currentUserService;
            _logger = logger;
        }

        [HttpPut("{id}/verify")]
        public async Task<IActionResult> VerifyReview(Guid id)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
                return Unauthorized("User authentication required");

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
                return Unauthorized("Invalid user context");

            _logger.LogInformation("Verifying review {ReviewId} by moderator {ModeratorId}", id, userGuid);

            var result = await Mediator.Send(new VerifyReviewCommand 
            { 
                ReviewId = id, 
                ModeratorId = userGuid 
            });

            if (result.Succeeded)
                return Success("Review verified successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Review not found");

            return BadRequest("Failed to verify review", result.Errors);
        }

        [HttpPut("{id}/flag")]
        public async Task<IActionResult> FlagReview(Guid id, [FromBody] FlagReviewRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
                return Unauthorized("User authentication required");

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
                return Unauthorized("Invalid user context");

            _logger.LogInformation("Flagging review {ReviewId} by moderator {ModeratorId}. Reason: {Reason}", 
                id, userGuid, request.Reason);

            var result = await Mediator.Send(new FlagReviewCommand
            {
                ReviewId = id,
                ModeratorId = userGuid,
                Reason = request.Reason
            });

            if (result.Succeeded)
                return Success("Review flagged successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Review not found");

            return BadRequest("Failed to flag review", result.Errors);
        }

        [HttpGet("{id}/analytics")]
        [Cache(Duration = 300, Tags = new[] { "Reviews", "Analytics" })]
        [OutputCache(PolicyName = "MediumCache", VaryByRouteValueNames = new[] { "id" })]
        public async Task<IActionResult> GetReviewAnalytics(Guid id)
        {
            var result = await Mediator.Send(new GetReviewAnalyticsQuery { ReviewId = id });

            if (result.Succeeded)
                return Success(result.Data, "Review analytics retrieved successfully");

            return BadRequest("Failed to retrieve review analytics", result.Errors);
        }
    }
}
