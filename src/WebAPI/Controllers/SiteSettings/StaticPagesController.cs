using Application.Features.Admin.StaticPages.Commands;
using Application.Features.Admin.StaticPages.DTOs;
using Application.Features.Admin.StaticPages.Queries;
using Application.Features.Identity.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Asp.Versioning;

namespace WebAPI.Controllers.SiteSettings
{
    [Authorize(Roles = "Admin,SuperAdmin,Editor")]
    [ApiVersion("2.0")]
    [Route("api/v{version:apiVersion}/static-pages")]
    public class StaticPagesController : BaseController
    {
        private readonly ICurrentUserService _currentUserService;

        public StaticPagesController(ICurrentUserService currentUserService)
        {
            _currentUserService = currentUserService;
        }

        [HttpGet]
        [OutputCache(Duration = 300, Tags = new[] { "StaticPages" })]
        public async Task<IActionResult> GetStaticPages(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? searchTerm = null,
            [FromQuery] bool? isPublished = null,
            [FromQuery] string? sortBy = "CreatedAt",
            [FromQuery] bool sortDescending = true)
        {
            var query = new GetStaticPagesQuery
            {
                PageNumber = page,
                PageSize = pageSize,
                SearchTerm = searchTerm,
                IsPublished = isPublished,
                SortBy = sortBy,
                SortDescending = sortDescending
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Static pages retrieved successfully");

            return BadRequest("Failed to retrieve static pages", result.Errors);
        }

        [HttpGet("published")]
        [AllowAnonymous]
        [OutputCache(Duration = 1800, Tags = new[] { "StaticPages", "Published" })]
        public async Task<IActionResult> GetPublishedStaticPages()
        {
            var query = new GetPublishedStaticPagesQuery();
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Published static pages retrieved successfully");

            return BadRequest("Failed to retrieve published static pages", result.Errors);
        }

        [HttpGet("{id}")]
        [OutputCache(Duration = 600, Tags = new[] { "StaticPages" })]
        public async Task<IActionResult> GetStaticPage(Guid id)
        {
            var query = new GetStaticPageByIdQuery { PageId = id };
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Static page retrieved successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Static page not found");

            return BadRequest("Failed to retrieve static page", result.Errors);
        }

        [HttpGet("slug/{slug}")]
        [AllowAnonymous]
        [OutputCache(Duration = 1800, Tags = new[] { "StaticPages", "Slug" })]
        public async Task<IActionResult> GetStaticPageBySlug(string slug)
        {
            var query = new GetStaticPageBySlugQuery { Slug = slug };
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Static page retrieved successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Static page not found");

            return BadRequest("Failed to retrieve static page", result.Errors);
        }

        [HttpPost]
        public async Task<IActionResult> CreateStaticPage([FromBody] CreateStaticPageRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new CreateStaticPageCommand
            {
                Request = request,
                CreatedBy = userGuid
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
            {
                var location = Url.Action(nameof(GetStaticPage), new { id = result.Data.Id });
                return Created(result.Data, location!, "Static page created successfully");
            }

            if (result.Errors.Any(e => e.Contains("duplicate slug")))
                return BadRequest("A page with this slug already exists", result.Errors);

            if (result.Errors.Any(e => e.Contains("duplicate title")))
                return BadRequest("A page with this title already exists", result.Errors);

            return BadRequest("Failed to create static page", result.Errors);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStaticPage(Guid id, [FromBody] UpdateStaticPageRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new UpdateStaticPageCommand
            {
                PageId = id,
                Request = request,
                UpdatedBy = userGuid
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success(result.Data, "Static page updated successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Static page not found");

            if (result.Errors.Any(e => e.Contains("unauthorized") || e.Contains("permission")))
                return Forbidden("You don't have permission to update this page");

            if (result.Errors.Any(e => e.Contains("duplicate slug")))
                return BadRequest("A page with this slug already exists", result.Errors);

            return BadRequest("Failed to update static page", result.Errors);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<IActionResult> DeleteStaticPage(Guid id)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new DeleteStaticPageCommand
            {
                PageId = id,
                DeletedBy = userGuid
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success("Static page deleted successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Static page not found");

            if (result.Errors.Any(e => e.Contains("system page")))
                return BadRequest("Cannot delete system pages", result.Errors);

            return BadRequest("Failed to delete static page", result.Errors);
        }

        [HttpPost("{id}/publish")]
        public async Task<IActionResult> PublishStaticPage(Guid id)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new PublishStaticPageCommand
            {
                PageId = id,
                PublishedBy = userGuid
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success("Static page published successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Static page not found");

            if (result.Errors.Any(e => e.Contains("already published")))
                return BadRequest("Page is already published", result.Errors);

            return BadRequest("Failed to publish static page", result.Errors);
        }

        [HttpPost("{id}/unpublish")]
        public async Task<IActionResult> UnpublishStaticPage(Guid id)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new UnpublishStaticPageCommand
            {
                PageId = id,
                UnpublishedBy = userGuid
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success("Static page unpublished successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Static page not found");

            if (result.Errors.Any(e => e.Contains("not published")))
                return BadRequest("Page is not published", result.Errors);

            return BadRequest("Failed to unpublish static page", result.Errors);
        }

        [HttpPost("{id}/duplicate")]
        public async Task<IActionResult> DuplicateStaticPage(Guid id, [FromBody] DuplicateStaticPageRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new DuplicateStaticPageCommand
            {
                PageId = id,
                Request = request,
                CreatedBy = userGuid
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
            {
                var location = Url.Action(nameof(GetStaticPage), new { id = result.Data.Id });
                return Created(result.Data, location!, "Static page duplicated successfully");
            }

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Source page not found");

            if (result.Errors.Any(e => e.Contains("duplicate slug")))
                return BadRequest("A page with this slug already exists", result.Errors);

            return BadRequest("Failed to duplicate static page", result.Errors);
        }

        [HttpGet("templates")]
        [OutputCache(Duration = 3600, Tags = new[] { "StaticPages", "Templates" })]
        public async Task<IActionResult> GetPageTemplates()
        {
            var query = new GetPageTemplatesQuery();
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Page templates retrieved successfully");

            return BadRequest("Failed to retrieve page templates", result.Errors);
        }

        [HttpPost("templates")]
        public async Task<IActionResult> CreatePageTemplate([FromBody] CreatePageTemplateRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new CreatePageTemplateCommand
            {
                Request = request,
                CreatedBy = userGuid
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success(result.Data, "Page template created successfully");

            if (result.Errors.Any(e => e.Contains("duplicate name")))
                return BadRequest("A template with this name already exists", result.Errors);

            return BadRequest("Failed to create page template", result.Errors);
        }

        [HttpGet("navigation")]
        [AllowAnonymous]
        [OutputCache(Duration = 1800, Tags = new[] { "StaticPages", "Navigation" })]
        public async Task<IActionResult> GetNavigationPages()
        {
            var query = new GetNavigationPagesQuery();
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Navigation pages retrieved successfully");

            return BadRequest("Failed to retrieve navigation pages", result.Errors);
        }

        [HttpPut("{id}/navigation")]
        public async Task<IActionResult> UpdatePageNavigation(Guid id, [FromBody] UpdatePageNavigationRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new UpdatePageNavigationCommand
            {
                PageId = id,
                Request = request,
                UpdatedBy = userGuid
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success(result.Data, "Page navigation updated successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Static page not found");

            return BadRequest("Failed to update page navigation", result.Errors);
        }

        [HttpGet("seo-analysis/{id}")]
        [OutputCache(Duration = 300, Tags = new[] { "StaticPages", "SEO" })]
        public async Task<IActionResult> GetPageSeoAnalysis(Guid id)
        {
            var query = new GetPageSeoAnalysisQuery { PageId = id };
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Page SEO analysis retrieved successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Static page not found");

            return BadRequest("Failed to retrieve page SEO analysis", result.Errors);
        }

        [HttpGet("my-pages")]
        [OutputCache(Duration = 60, Tags = new[] { "StaticPages", "MyPages" })]
        public async Task<IActionResult> GetMyStaticPages(
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

            var query = new GetUserStaticPagesQuery
            {
                AuthorId = userGuid,
                PageNumber = page,
                PageSize = pageSize
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "My static pages retrieved successfully");

            return BadRequest("Failed to retrieve my static pages", result.Errors);
        }

        [HttpGet("stats")]
        [OutputCache(Duration = 600, Tags = new[] { "StaticPages", "Stats" })]
        public async Task<IActionResult> GetStaticPagesStats()
        {
            var query = new GetStaticPagesStatsQuery();
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Static pages statistics retrieved successfully");

            return BadRequest("Failed to retrieve static pages statistics", result.Errors);
        }
    }
}
   