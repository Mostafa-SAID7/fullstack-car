using Application.Features.Community.Reviews.Commands;
using Application.Features.Community.Reviews.DTOs;
using Application.Features.Community.Reviews.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

using Asp.Versioning;

namespace WebAPI.Controllers.Community.Reviews
{
    [Authorize]
    [ApiVersion("2.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    public class ReviewsController : BaseController
    {
        [HttpGet]
        [AllowAnonymous] // Temporarily allow anonymous access for testing
        public async Task<IActionResult> GetReviews([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string? carBrand = null, [FromQuery] string? carModel = null)
        {
            var query = new GetReviewsQuery
            {
                PageNumber = page,
                PageSize = pageSize,
                CarBrand = carBrand,
                CarModel = carModel
            };
            var result = await Mediator.Send(query);
            return Ok(result);
        }

        [HttpGet("test")]
        [AllowAnonymous]
        public IActionResult Test()
        {
            return Ok(new { message = "Reviews API is working", timestamp = DateTime.UtcNow });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetReview(Guid id)
        {
            var query = new GetReviewByIdQuery { Id = id };
            var result = await Mediator.Send(query);
            return result.IsSuccess ? Ok(result) : NotFound(result.ErrorMessage);
        }

        [HttpPost]
        public async Task<IActionResult> CreateReview([FromBody] CreateReviewRequest request)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out var userGuid))
            {
                return Unauthorized();
            }

            var command = new CreateReviewCommand { Request = request, UserId = userGuid };
            var result = await Mediator.Send(command);
            return result.IsSuccess ? Ok(result) : BadRequest(result.ErrorMessage);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateReview(Guid id, [FromBody] UpdateReviewRequest request)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out var userGuid))
            {
                return Unauthorized();
            }

            var command = new UpdateReviewCommand { Id = id, Request = request, UserId = userGuid };
            var result = await Mediator.Send(command);
            return result.IsSuccess ? Ok(result) : BadRequest(result.ErrorMessage);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReview(Guid id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out var userGuid))
            {
                return Unauthorized();
            }

            var isAdmin = User.IsInRole("Admin");
            var command = new DeleteReviewCommand { Id = id, UserId = userGuid, IsAdmin = isAdmin };
            var result = await Mediator.Send(command);
            return result.IsSuccess ? NoContent() : BadRequest(result.ErrorMessage);
        }

        [HttpPost("{id}/helpful")]
        public async Task<IActionResult> MarkHelpful(Guid id)
        {
            var result = await Mediator.Send(new MarkReviewHelpfulCommand { Id = id });
            return result.IsSuccess ? Ok(result) : BadRequest(result.ErrorMessage);
        }

        [HttpGet("car/{brand}/{model}")]
        public async Task<IActionResult> GetCarReviews(string brand, string model, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var query = new GetReviewsQuery
            {
                PageNumber = page,
                PageSize = pageSize,
                CarBrand = brand,
                CarModel = model
            };
            var result = await Mediator.Send(query);
            return Ok(result);
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserReviews(Guid userId, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var query = new GetReviewsQuery
            {
                PageNumber = page,
                PageSize = pageSize,
                UserId = userId
            };
            var result = await Mediator.Send(query);
            return Ok(result);
        }

        // Admin functionality for reviews
        [Authorize(Roles = "Admin,Moderator")]
        [HttpPut("{id}/verify")]
        public async Task<IActionResult> VerifyReview(Guid id)
        {
            var result = await Mediator.Send(new VerifyReviewCommand { Id = id });
            return result.IsSuccess ? Ok(result) : BadRequest(result.ErrorMessage);
        }

        [Authorize(Roles = "Admin,Moderator")]
        [HttpPut("{id}/flag")]
        public async Task<IActionResult> FlagReview(Guid id, [FromBody] FlagReviewRequest request)
        {
            var command = new FlagReviewCommand { Id = id, Request = request };
            var result = await Mediator.Send(command);
            return result.IsSuccess ? Ok(result) : BadRequest(result.ErrorMessage);
        }
    }
}


