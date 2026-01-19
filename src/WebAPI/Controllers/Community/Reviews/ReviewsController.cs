using Application.Common.Attributes;
using Application.Features.Community.Reviews.Commands;
using Application.Features.Community.Reviews.DTOs;
using Application.Features.Community.Reviews.Queries;
using Application.Features.Identity.Core.Interfaces;
using Application.Features.Shared.Localization.Interfaces;
using Application.Features.Shared.Notifications.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Asp.Versioning;

namespace WebAPI.Controllers.Community.Reviews
{
    /// <summary>
    /// Core CRUD operations for Reviews
    /// </summary>
    [Authorize]
    [ApiVersion("2.0")]
    [Route("api/v{version:apiVersion}/reviews")]
    public class ReviewsController : BaseController
    {
        private readonly ICurrentUserService _currentUserService;
        private readonly ILocalizationProvider _localizationProvider;
        private readonly INotificationService _notificationService;
        private readonly ILogger<ReviewsController> _logger;

        public ReviewsController(
            ICurrentUserService currentUserService,
            ILocalizationProvider localizationProvider,
            INotificationService notificationService,
            ILogger<ReviewsController> logger)
        {
            _currentUserService = currentUserService;
            _localizationProvider = localizationProvider;
            _notificationService = notificationService;
            _logger = logger;
        }

        [HttpGet]
        [AllowAnonymous]
        [Cache(Duration = 300, Tags = new[] { "Reviews" }, VaryByParameters = new[] { "page", "pageSize", "carBrand", "carModel", "sortBy", "minRating", "maxRating" })]
        [OutputCache(PolicyName = "MediumCache", VaryByQueryKeys = new[] { "page", "pageSize", "carBrand", "carModel", "sortBy", "sortDescending", "minRating", "maxRating" })]
        public async Task<IActionResult> GetReviews(
            [FromQuery] int page = 1, 
            [FromQuery] int pageSize = 10, 
            [FromQuery] string? carBrand = null, 
            [FromQuery] string? carModel = null,
            [FromQuery] string? sortBy = "CreatedAt",
            [FromQuery] bool sortDescending = true,
            [FromQuery] int? minRating = null,
            [FromQuery] int? maxRating = null)
        {
            var query = new GetReviewsQuery
            {
                PageNumber = page,
                PageSize = pageSize,
                CarBrand = carBrand,
                CarModel = carModel,
                SortBy = sortBy,
                SortDescending = sortDescending,
                MinRating = minRating,
                MaxRating = maxRating
            };

            var result = await Mediator.Send(query);
            
            if (result.Succeeded)
                return Success(result.Data, await _localizationProvider.GetTranslationAsync("en-US", "Reviews.Retrieved"));

            return BadRequest(await _localizationProvider.GetTranslationAsync("en-US", "Error"), result.Errors);
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        [Cache(Duration = 300, Tags = new[] { "Reviews" })]
        [OutputCache(PolicyName = "MediumCache", VaryByRouteValueNames = new[] { "id" })]
        public async Task<IActionResult> GetReview(Guid id)
        {
            var query = new GetReviewByIdQuery { Id = id };
            var result = await Mediator.Send(query);
            
            if (result.Succeeded)
                return Success(result.Data, "Review retrieved successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Review not found");

            return BadRequest("Failed to retrieve review", result.Errors);
        }

        [HttpPost]
        public async Task<IActionResult> CreateReview([FromBody] CreateReviewRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
                return Unauthorized("User authentication required");

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
                return Unauthorized("Invalid user context");

            _logger.LogInformation("Creating review for user {UserId}", userGuid);

            var command = new CreateReviewCommand
            {
                Request = request,
                UserId = userGuid
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
            {
                _logger.LogInformation("Review created successfully. Id: {ReviewId}", result.Data);
                return Created(result.Data, $"/reviews/{result.Data}", await _localizationProvider.GetTranslationAsync("en-US", "Reviews.Created"));
            }

            _logger.LogWarning("Failed to create review. Errors: {Errors}", string.Join(", ", result.Errors));
            return BadRequest(await _localizationProvider.GetTranslationAsync("en-US", "Error"), result.Errors);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateReview(Guid id, [FromBody] UpdateReviewRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
                return Unauthorized("User authentication required");

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
                return Unauthorized("Invalid user context");

            var command = new UpdateReviewCommand
            {
                Id = id,
                Request = request,
                UserId = userGuid
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
            {
                _logger.LogInformation("Review updated successfully. Id: {ReviewId}", id);
                return Success(result.Data, "Review updated successfully");
            }

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Review not found");

            if (result.Errors.Any(e => e.Contains("unauthorized") || e.Contains("permission")))
                return Forbidden("You don't have permission to update this review");

            return BadRequest("Failed to update review", result.Errors);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReview(Guid id)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
                return Unauthorized("User authentication required");

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
                return Unauthorized("Invalid user context");

            var command = new DeleteReviewCommand
            {
                ReviewId = id,
                UserId = userGuid
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
            {
                _logger.LogInformation("Review deleted successfully. Id: {ReviewId}", id);
                return Success("Review deleted successfully");
            }

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Review not found");

            if (result.Errors.Any(e => e.Contains("unauthorized") || e.Contains("permission")))
                return Forbidden("You don't have permission to delete this review");

            return BadRequest("Failed to delete review", result.Errors);
        }

        [HttpPost("{id}/helpful")]
        public async Task<IActionResult> MarkReviewHelpful(Guid id)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
                return Unauthorized("User authentication required");

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
                return Unauthorized("Invalid user context");

            var result = await Mediator.Send(new MarkReviewHelpfulCommand 
            { 
                ReviewId = id, 
                UserId = userGuid 
            });

            if (result.Succeeded)
                return Success("Review marked as helpful");

            return BadRequest("Failed to mark review as helpful", result.Errors);
        }
    }
}
