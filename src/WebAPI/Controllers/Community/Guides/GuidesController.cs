using Application.Features.Community.Guides.Commands;
using Application.Features.Community.Guides.DTOs.Requests;
using Application.Features.Community.Guides.DTOs;
using Application.Features.Community.Guides.Queries;
using Application.Features.Common.Bookmarks.Commands;
using Application.Features.Common.Bookmarks.DTOs.Requests;
using Application.Features.Common.Bookmarks.Queries;
using Application.Features.Identity.Core.Interfaces;
using Asp.Versioning;
using Domain.Enums.Community.Guides;
using Domain.Enums.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;

namespace WebAPI.Controllers.Community.Guides
{
    [ApiController]
    [ApiVersion("2.0")]
    [Route("api/v{version:apiVersion}/guides")]
    [Authorize]
    public class GuidesController : BaseController
    {
        private readonly ICurrentUserService _currentUserService;

        public GuidesController(ICurrentUserService currentUserService)
        {
            _currentUserService = currentUserService;
        }

        private Guid? GetCurrentUserIdNullable() 
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
                return null;
            
            return Guid.TryParse(_currentUserService.UserId, out var userId) ? userId : null;
        }

        private Guid GetCurrentUserId() 
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
                throw new UnauthorizedAccessException("User authentication required");
            
            if (!Guid.TryParse(_currentUserService.UserId, out var userId))
                throw new UnauthorizedAccessException("Invalid user context");
                
            return userId;
        }

        [HttpGet]
        [AllowAnonymous]
        [OutputCache(Duration = 300, Tags = new[] { "Guides" })]
        public async Task<IActionResult> GetGuides(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] GuideCategory? category = null,
            [FromQuery] GuideDifficulty? difficulty = null,
            [FromQuery] string? searchTerm = null,
            [FromQuery] bool? isFeatured = null,
            [FromQuery] string? sortBy = "CreatedAt",
            [FromQuery] bool sortDescending = true)
        {
            var userId = GetCurrentUserIdNullable();
            var query = new GetGuidesQuery(page, pageSize, category, difficulty, searchTerm, isFeatured, sortBy, sortDescending, userId);
            var result = await Mediator.Send(query);

            return Success(result, "Guides retrieved successfully");
        }

        [HttpGet("trending")]
        [AllowAnonymous]
        [OutputCache(Duration = 600, Tags = new[] { "Guides", "Trending" })]
        public async Task<IActionResult> GetTrendingGuides([FromQuery] int pageSize = 10)
        {
            var query = new GetTrendingGuidesQuery
            {
                PageSize = pageSize,
                Days = 7
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Trending guides retrieved successfully");

            return BadRequest("Failed to retrieve trending guides", result.Errors);
        }

        [HttpGet("featured")]
        [AllowAnonymous]
        [OutputCache(Duration = 1800, Tags = new[] { "Guides", "Featured" })]
        public async Task<IActionResult> GetFeaturedGuides([FromQuery] int pageSize = 5)
        {
            var query = new GetFeaturedGuidesQuery
            {
                PageSize = pageSize
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Featured guides retrieved successfully");

            return BadRequest("Failed to retrieve featured guides", result.Errors);
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        [OutputCache(Duration = 300, Tags = new[] { "Guides" })]
        public async Task<IActionResult> GetGuideById(Guid id)
        {
            var userId = GetCurrentUserIdNullable();
            var query = new GetGuideByIdQuery(id, userId);
            var result = await Mediator.Send(query);
            
            if (result != null)
                return Success(result, "Guide retrieved successfully");

            return NotFound("Guide not found");
        }

        [HttpPost]
        public async Task<IActionResult> CreateGuide([FromBody] CreateGuideRequest request)
        {
            try
            {
                var userId = GetCurrentUserId();
                var command = new CreateGuideCommand(request, userId);
                var result = await Mediator.Send(command);

                dynamic resultData = result;
                var location = Url.Action(nameof(GetGuideById), new { id = resultData.Id });
                return Created(result, location!, "Guide created successfully");
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateGuide(Guid id, [FromBody] UpdateGuideRequest request)
        {
            if (id != request.Id)
                return BadRequest("ID mismatch");

            try
            {
                var userId = GetCurrentUserId();
                var command = new UpdateGuideCommand(request, userId);
                var result = await Mediator.Send(command);

                return Success(result, "Guide updated successfully");
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGuide(Guid id)
        {
            try
            {
                var userId = GetCurrentUserId();
                var command = new DeleteGuideCommand
                {
                    GuideId = id,
                    UserId = userId
                };

                var result = await Mediator.Send(command);
                return Success("Guide deleted successfully");
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }
        }

        [HttpPost("{id}/rate")]
        public async Task<IActionResult> RateGuide(Guid id, [FromBody] RateGuideRequest request)
        {
            if (id != request.GuideId)
                return BadRequest("ID mismatch");

            if (request.Rating < 1 || request.Rating > 5)
                return BadRequest("Rating must be between 1 and 5");

            try
            {
                var userId = GetCurrentUserId();
                var command = new RateGuideCommand(request, userId);
                var result = await Mediator.Send(command);
                
                return Success("Guide rated successfully");
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }
        }

        [HttpPost("{id}/bookmark")]
        public async Task<IActionResult> BookmarkGuide(Guid id, [FromBody] BookmarkRequest? request = null)
        {
            try
            {
                var userId = GetCurrentUserId();
                var command = new BookmarkCommand(id, ContentType.Guide, userId, request?.Notes);
                var result = await Mediator.Send(command);
                
                return Success("Guide bookmarked successfully");
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }
        }

        [HttpDelete("{id}/bookmark")]
        public async Task<IActionResult> RemoveBookmark(Guid id)
        {
            try
            {
                var userId = GetCurrentUserId();
                var command = new RemoveBookmarkCommand
                {
                    GuideId = id,
                    UserId = userId
                };

                var result = await Mediator.Send(command);
                
                return Success("Bookmark removed successfully");
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }
        }

        [HttpGet("bookmarks")]
        [OutputCache(Duration = 300, Tags = new[] { "Guides", "Bookmarks" })]
        public async Task<IActionResult> GetBookmarkedGuides(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            try
            {
                var userId = GetCurrentUserId();
                var query = new GetUserBookmarksQuery(userId, ContentType.Guide, page, pageSize);
                var result = await Mediator.Send(query);

                return Success(result, "Bookmarked guides retrieved successfully");
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }
        }

        [HttpGet("my-guides")]
        [OutputCache(Duration = 60, Tags = new[] { "Guides", "MyGuides" })]
        public async Task<IActionResult> GetMyGuides(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            try
            {
                var userId = GetCurrentUserId();
                var query = new GetUserGuidesQuery
                {
                    UserId = userId,
                    PageNumber = page,
                    PageSize = pageSize
                };

                var result = await Mediator.Send(query);
                return Success(result, "My guides retrieved successfully");
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }
        }

        [HttpGet("categories")]
        [AllowAnonymous]
        [OutputCache(Duration = 3600, Tags = new[] { "Guides", "Categories" })]
        public IActionResult GetCategories()
        {
            var categories = Enum.GetValues<GuideCategory>()
                .Select(c => new { Value = (int)c, Name = c.ToString() })
                .ToList();
            return Success(categories, "Categories retrieved successfully");
        }

        [HttpGet("difficulties")]
        [AllowAnonymous]
        [OutputCache(Duration = 3600, Tags = new[] { "Guides", "Difficulties" })]
        public IActionResult GetDifficulties()
        {
            var difficulties = Enum.GetValues<GuideDifficulty>()
                .Select(d => new { Value = (int)d, Name = d.ToString() })
                .ToList();
            return Success(difficulties, "Difficulties retrieved successfully");
        }

        [HttpGet("stats")]
        [AllowAnonymous]
        [OutputCache(Duration = 1800, Tags = new[] { "Guides", "Stats" })]
        public async Task<IActionResult> GetGuideStats()
        {
            var query = new GetGuideStatsQuery();
            var result = await Mediator.Send(query);
            return Success(result, "Guide statistics retrieved successfully");
        }
    }
}


