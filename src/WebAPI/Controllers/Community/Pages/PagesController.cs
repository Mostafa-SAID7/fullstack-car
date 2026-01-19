using Application.Features.Community.Pages.Commands;
using Application.Features.Community.Pages.DTOs;
using Application.Features.Community.Pages.Queries;
using Application.Features.Identity.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Asp.Versioning;

namespace WebAPI.Controllers.Community.Pages
{
    [Authorize]
    [ApiVersion("2.0")]
    [Route("api/v{version:apiVersion}/pages")]
    public class PagesController : BaseController
    {
        private readonly ICurrentUserService _currentUserService;

        public PagesController(ICurrentUserService currentUserService)
        {
            _currentUserService = currentUserService;
        }

        [HttpGet]
        [AllowAnonymous]
        [OutputCache(Duration = 300, Tags = new[] { "Pages" })]
        public async Task<IActionResult> GetPages(
            [FromQuery] int page = 1, 
            [FromQuery] int pageSize = 10,
            [FromQuery] string? category = null,
            [FromQuery] string? searchTerm = null,
            [FromQuery] string? sortBy = "CreatedAt",
            [FromQuery] bool sortDescending = true,
            [FromQuery] bool? isPublished = true)
        {
            var query = new GetPagesQuery
            {
                PageNumber = page,
                PageSize = pageSize,
                Category = category,
                SearchTerm = searchTerm,
                SortBy = sortBy,
                SortDescending = sortDescending,
                IsPublished = isPublished
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Pages retrieved successfully");

            return BadRequest("Failed to retrieve pages", result.Errors);
        }

        [HttpGet("menu")]
        [AllowAnonymous]
        [OutputCache(Duration = 1800, Tags = new[] { "Pages", "Menu" })]
        public async Task<IActionResult> GetMenuPages()
        {
            var query = new GetMenuPagesQuery();
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Menu pages retrieved successfully");

            return BadRequest("Failed to retrieve menu pages", result.Errors);
        }

        [HttpGet("slug/{slug}")]
        [AllowAnonymous]
        [OutputCache(Duration = 600, Tags = new[] { "Pages" })]
        public async Task<IActionResult> GetPageBySlug(string slug)
        {
            var query = new GetPageBySlugQuery { Slug = slug };
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Page retrieved successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Page not found");

            return BadRequest("Failed to retrieve page", result.Errors);
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        [OutputCache(Duration = 300, Tags = new[] { "Pages" })]
        public async Task<IActionResult> GetPage(Guid id)
        {
            var query = new GetPageByIdQuery { PageId = id };
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Page retrieved successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Page not found");

            return BadRequest("Failed to retrieve page", result.Errors);
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Moderator,Editor")]
        public async Task<IActionResult> CreatePage([FromBody] CreatePageRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new CreatePageCommand
            {
                Request = request,
                AuthorId = userGuid
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
            {
                dynamic pageData = result.Data;
                var location = Url.Action(nameof(GetPage), new { id = pageData.Id });
                return Created(result.Data, location!, "Page created successfully");
            }

            if (result.Errors.Any(e => e.Contains("duplicate slug")))
                return BadRequest("A page with this slug already exists", result.Errors);

            if (result.Errors.Any(e => e.Contains("duplicate title")))
                return BadRequest("A page with this title already exists", result.Errors);

            return BadRequest("Failed to create page", result.Errors);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Moderator,Editor")]
        public async Task<IActionResult> UpdatePage(Guid id, [FromBody] UpdatePageRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new UpdatePageCommand
            {
                PageId = id,
                Request = request,
                UserId = userGuid
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success(result.Data, "Page updated successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Page not found");

            if (result.Errors.Any(e => e.Contains("unauthorized") || e.Contains("permission")))
                return Forbidden("You don't have permission to update this page");

            if (result.Errors.Any(e => e.Contains("duplicate slug")))
                return BadRequest("A page with this slug already exists", result.Errors);

            return BadRequest("Failed to update page", result.Errors);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,Moderator")]
        public async Task<IActionResult> DeletePage(Guid id)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new DeletePageCommand
            {
                PageId = id,
                UserId = userGuid
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success("Page deleted successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Page not found");

            if (result.Errors.Any(e => e.Contains("unauthorized") || e.Contains("permission")))
                return Forbidden("You don't have permission to delete this page");

            return BadRequest("Failed to delete page", result.Errors);
        }

        [HttpPost("{id}/publish")]
        [Authorize(Roles = "Admin,Moderator,Editor")]
        public async Task<IActionResult> PublishPage(Guid id)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new PublishPageCommand
            {
                PageId = id,
                UserId = userGuid
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success("Page published successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Page not found");

            if (result.Errors.Any(e => e.Contains("already published")))
                return BadRequest("Page is already published", result.Errors);

            if (result.Errors.Any(e => e.Contains("unauthorized") || e.Contains("permission")))
                return Forbidden("You don't have permission to publish this page");

            return BadRequest("Failed to publish page", result.Errors);
        }

        [HttpPost("{id}/unpublish")]
        [Authorize(Roles = "Admin,Moderator")]
        public async Task<IActionResult> UnpublishPage(Guid id)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new UnpublishPageCommand
            {
                PageId = id,
                UserId = userGuid
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success("Page unpublished successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Page not found");

            if (result.Errors.Any(e => e.Contains("not published")))
                return BadRequest("Page is not published", result.Errors);

            return BadRequest("Failed to unpublish page", result.Errors);
        }

        [HttpGet("categories")]
        [AllowAnonymous]
        [OutputCache(Duration = 3600, Tags = new[] { "Pages", "Categories" })]
        public async Task<IActionResult> GetCategories()
        {
            var query = new GetPageCategoriesQuery();
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Page categories retrieved successfully");

            return BadRequest("Failed to retrieve page categories", result.Errors);
        }

        [HttpGet("my-pages")]
        [Authorize(Roles = "Admin,Moderator,Editor")]
        [OutputCache(Duration = 60, Tags = new[] { "Pages", "MyPages" })]
        public async Task<IActionResult> GetMyPages(
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

            var query = new GetUserPagesQuery
            {
                AuthorId = userGuid,
                PageNumber = page,
                PageSize = pageSize
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "My pages retrieved successfully");

            return BadRequest("Failed to retrieve my pages", result.Errors);
        }

        [HttpGet("stats")]
        [AllowAnonymous]
        [OutputCache(Duration = 1800, Tags = new[] { "Pages", "Stats" })]
        public async Task<IActionResult> GetPageStats()
        {
            var query = new GetPageStatsQuery();
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Page statistics retrieved successfully");

            return BadRequest("Failed to retrieve page statistics", result.Errors);
        }
    }
}


