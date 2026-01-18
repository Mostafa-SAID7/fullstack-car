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
    [Authorize]
    [ApiVersion("2.0")]
    [Route("api/v{version:apiVersion}/reviews")]
    public class ReviewsController : BaseController
    {
        private readonly ICurrentUserService _currentUserService;

        public ReviewsController(ICurrentUserService currentUserService)
        {
            _currentUserService = currentUserService;
        }

        [HttpGet]
        [AllowAnonymous]
        [OutputCache(Duration = 300, Tags = new[] { "Reviews" })]
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
                return Success(result.Data, "Reviews retrieved successfully");

            return BadRequest("Failed to retrieve reviews", result.Errors);
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        [OutputCache(Duration = 300, Tags = new[] { "Reviews" })]
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
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new CreateReviewCommand { Request = request, UserId = userGuid };
            var result = await Mediator.Send(command);

            if (result.Succeeded)
            {
                var location = Url.Action(nameof(GetReview), new { id = result.Data });
                return Created(result.Data, location!, "Review created successfully");
            }

            if (result.Errors.Any(e => e.Contains("already reviewed")))
                return BadRequest("You have already reviewed this car", result.Errors);

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Car not found");

            return BadRequest("Failed to create review", result.Errors);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateReview(Guid id, [FromBody] UpdateReviewRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new UpdateReviewCommand { Id = id, Request = request, UserId = userGuid };
            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success(result.Data, "Review updated successfully");

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
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var isAdmin = User.IsInRole("Admin") || User.IsInRole("Moderator");
            var command = new DeleteReviewCommand { Id = id, UserId = userGuid, IsAdmin = isAdmin };
            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success("Review deleted successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Review not found");

            if (result.Errors.Any(e => e.Contains("unauthorized") || e.Contains("permission")))
                return Forbidden("You don't have permission to delete this review");

            return BadRequest("Failed to delete review", result.Errors);
        }

        [HttpPost("{id}/helpful")]
        public async Task<IActionResult> MarkHelpful(Guid id)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            var result = await Mediator.Send(new MarkReviewHelpfulCommand { Id = id });

            if (result.Succeeded)
                return Success("Review marked as helpful");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Review not found");

            if (result.Errors.Any(e => e.Contains("already marked")))
                return BadRequest("You have already marked this review as helpful", result.Errors);

            return BadRequest("Failed to mark review as helpful", result.Errors);
        }

        [HttpGet("trending")]
        [AllowAnonymous]
        [OutputCache(Duration = 600, Tags = new[] { "Reviews", "Trending" })]
        public async Task<IActionResult> GetTrendingReviews([FromQuery] int pageSize = 10)
        {
            var query = new GetTrendingReviewsQuery
            {
                PageSize = pageSize,
                Days = 7
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Trending reviews retrieved successfully");

            return BadRequest("Failed to retrieve trending reviews", result.Errors);
        }

        [HttpGet("car/{brand}/{model}")]
        [AllowAnonymous]
        [OutputCache(Duration = 300, Tags = new[] { "Reviews", "CarReviews" })]
        public async Task<IActionResult> GetCarReviews(
            string brand, 
            string model, 
            [FromQuery] int page = 1, 
            [FromQuery] int pageSize = 10,
            [FromQuery] string? sortBy = "CreatedAt",
            [FromQuery] bool sortDescending = true)
        {
            var query = new GetReviewsQuery
            {
                PageNumber = page,
                PageSize = pageSize,
                CarBrand = brand,
                CarModel = model,
                SortBy = sortBy,
                SortDescending = sortDescending
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Car reviews retrieved successfully");

            return BadRequest("Failed to retrieve car reviews", result.Errors);
        }

        [HttpGet("user/{userId}")]
        [AllowAnonymous]
        [OutputCache(Duration = 300, Tags = new[] { "Reviews", "UserReviews" })]
        public async Task<IActionResult> GetUserReviews(
            Guid userId, 
            [FromQuery] int page = 1, 
            [FromQuery] int pageSize = 10)
        {
            var query = new GetReviewsQuery
            {
                PageNumber = page,
                PageSize = pageSize,
                UserId = userId
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "User reviews retrieved successfully");

            return BadRequest("Failed to retrieve user reviews", result.Errors);
        }

        [HttpGet("my-reviews")]
        [OutputCache(Duration = 60, Tags = new[] { "Reviews", "MyReviews" })]
        public async Task<IActionResult> GetMyReviews([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var query = new GetReviewsQuery
            {
                PageNumber = page,
                PageSize = pageSize,
                UserId = userGuid
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "My reviews retrieved successfully");

            return BadRequest("Failed to retrieve my reviews", result.Errors);
        }

        [Authorize(Roles = "Admin,Moderator")]
        [HttpPut("{id}/verify")]
        public async Task<IActionResult> VerifyReview(Guid id)
        {
            var result = await Mediator.Send(new VerifyReviewCommand { Id = id });

            if (result.Succeeded)
                return Success("Review verified successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Review not found");

            if (result.Errors.Any(e => e.Contains("already verified")))
                return BadRequest("Review is already verified", result.Errors);

            return BadRequest("Failed to verify review", result.Errors);
        }

        [Authorize(Roles = "Admin,Moderator")]
        [HttpPut("{id}/flag")]
        public async Task<IActionResult> FlagReview(Guid id, [FromBody] FlagReviewRequest request)
        {
            var command = new FlagReviewCommand { Id = id, Request = request };
            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success("Review flagged successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Review not found");

            if (result.Errors.Any(e => e.Contains("already flagged")))
                return BadRequest("Review is already flagged", result.Errors);

            return BadRequest("Failed to flag review", result.Errors);
        }

        [HttpGet("stats")]
        [AllowAnonymous]
        [OutputCache(Duration = 3600, Tags = new[] { "Reviews", "Stats" })]
        public async Task<IActionResult> GetReviewStats()
        {
            var query = new GetReviewStatsQuery();
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Review statistics retrieved successfully");

            return BadRequest("Failed to retrieve review statistics", result.Errors);
        }
    }
}


