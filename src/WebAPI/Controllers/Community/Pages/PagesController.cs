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
        public async Task<IActionResult> GetPages([FromQuery] GetPagesQuery query)
        {
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Ok(result.Data);

            return BadRequest(result.Errors);
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        [OutputCache(Duration = 300, Tags = new[] { "Pages" })]
        public async Task<IActionResult> GetPage(Guid id)
        {
            var result = await Mediator.Send(new GetPageByIdQuery { Id = id });

            if (result.Succeeded)
                return Ok(result.Data);

            return BadRequest(result.Errors);
        }

        [HttpGet("slug/{slug}")]
        [AllowAnonymous]
        [OutputCache(Duration = 300, Tags = new[] { "Pages" })]
        public async Task<IActionResult> GetPageBySlug(string slug)
        {
            var result = await Mediator.Send(new GetPageBySlugQuery { Slug = slug });

            if (result.Succeeded)
                return Ok(result.Data);

            return BadRequest(result.Errors);
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Editor,Author")]
        public async Task<IActionResult> CreatePage([FromBody] CreatePageRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized();
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized();
            }

            var command = new CreatePageCommand
            {
                Request = request,
                UserId = userGuid
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return CreatedAtAction(nameof(GetPage), new { id = result.Data.Id }, result.Data);

            return BadRequest(result.Errors);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Editor,Author")]
        public async Task<IActionResult> UpdatePage(Guid id, [FromBody] UpdatePageRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized();
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized();
            }

            var result = await Mediator.Send(new UpdatePageCommand
            {
                Id = id,
                UserId = userGuid,
                Request = request
            });

            if (result.Succeeded)
                return Ok(result.Data);

            return BadRequest(result.Errors);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,Editor")]
        public async Task<IActionResult> DeletePage(Guid id)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized();
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized();
            }

            var result = await Mediator.Send(new DeletePageCommand
            {
                PageId = id,
                UserId = userGuid
            });

            if (result.Succeeded)
                return NoContent();

            return BadRequest(result.Errors);
        }

        [HttpPost("{id}/publish")]
        [Authorize(Roles = "Admin,Editor")]
        public async Task<IActionResult> PublishPage(Guid id)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized();
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized();
            }

            var result = await Mediator.Send(new PublishPageCommand
            {
                PageId = id,
                UserId = userGuid
            });

            if (result.Succeeded)
                return Ok(new { Message = "Page published successfully" });

            return BadRequest(result.Errors);
        }

        [HttpPost("{id}/unpublish")]
        [Authorize(Roles = "Admin,Editor")]
        public async Task<IActionResult> UnpublishPage(Guid id)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized();
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized();
            }

            var result = await Mediator.Send(new UnpublishPageCommand
            {
                PageId = id,
                UserId = userGuid
            });

            if (result.Succeeded)
                return Ok(new { Message = "Page unpublished successfully" });

            return BadRequest(result.Errors);
        }

        [HttpGet("{id}/revisions")]
        [Authorize(Roles = "Admin,Editor,Author")]
        [OutputCache(Duration = 60, Tags = new[] { "Pages", "Revisions" })]
        public async Task<IActionResult> GetPageRevisions(Guid id, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var result = await Mediator.Send(new GetPageRevisionsQuery
            {
                PageId = id,
                PageNumber = page,
                PageSize = pageSize
            });

            if (result.Succeeded)
                return Ok(result.Data);

            return BadRequest(result.Errors);
        }

        [HttpPost("{id}/revisions")]
        [Authorize(Roles = "Admin,Editor,Author")]
        public async Task<IActionResult> CreatePageRevision(Guid id, [FromBody] CreatePageRevisionRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized();
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized();
            }

            var result = await Mediator.Send(new CreatePageRevisionCommand
            {
                PageId = id,
                UserId = userGuid,
                Request = request
            });

            if (result.Succeeded)
                return Ok(new { Message = "Page revision created successfully" });

            return BadRequest(result.Errors);
        }

        [HttpGet("{id}/comments")]
        [AllowAnonymous]
        [OutputCache(Duration = 60, Tags = new[] { "Pages", "Comments" })]
        public async Task<IActionResult> GetPageComments(Guid id, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var result = await Mediator.Send(new GetPageCommentsQuery
            {
                PageId = id,
                PageNumber = page,
                PageSize = pageSize
            });

            if (result.Succeeded)
                return Ok(result.Data);

            return BadRequest(result.Errors);
        }

        [HttpPost("{id}/comments")]
        public async Task<IActionResult> AddComment(Guid id, [FromBody] AddPageCommentRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized();
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized();
            }

            var result = await Mediator.Send(new AddPageCommentCommand
            {
                PageId = id,
                UserId = userGuid,
                Request = request
            });

            if (result.Succeeded)
                return Ok(new { Message = "Comment added successfully" });

            return BadRequest(result.Errors);
        }

        [HttpGet("search")]
        [AllowAnonymous]
        [OutputCache(Duration = 60, Tags = new[] { "Pages", "Search" })]
        public async Task<IActionResult> SearchPages([FromQuery] SearchPagesQuery query)
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
            return Ok(new { message = "Pages API is working", timestamp = DateTime.UtcNow });
        }
    }
}