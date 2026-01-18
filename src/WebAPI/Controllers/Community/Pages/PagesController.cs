using Application.Features.Identity.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Asp.Versioning;
using WebAPI.Extensions;
using Application.Features.Community.Pages.DTOs;

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
        public async Task<IActionResult> GetPages([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            try
            {
                return Success(new List<PageDto>(), "Pages retrieved successfully");
            }
            catch (Exception ex)
            {
                return BadRequest("Error occurred", new[] { "Failed to retrieve pages" });
            }
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        [OutputCache(Duration = 300, Tags = new[] { "Pages" })]
        public async Task<IActionResult> GetPage(Guid id)
        {
            try
            {
                return Success(new PageDto { Id = id }, "Page retrieved successfully");
            }
            catch (Exception ex)
            {
                return BadRequest("Error occurred", new[] { "Page not found" });
            }
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Moderator,Editor")]
        public async Task<IActionResult> CreatePage([FromBody] CreatePageRequest request)
        {
            try
            {
                return Success(new PageDto { Title = request.Title }, "Page created successfully");
            }
            catch (Exception ex)
            {
                return BadRequest("Error occurred", new[] { "Failed to create page" });
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Moderator,Editor")]
        public async Task<IActionResult> UpdatePage(Guid id, [FromBody] UpdatePageRequest request)
        {
            try
            {
                return Success(new PageDto { Id = id, Title = request.Title }, "Page updated successfully");
            }
            catch (Exception ex)
            {
                return BadRequest("Error occurred", new[] { "Failed to update page" });
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,Moderator")]
        public async Task<IActionResult> DeletePage(Guid id)
        {
            try
            {
                return Success(new { Id = id }, "Page deleted successfully");
            }
            catch (Exception ex)
            {
                return BadRequest("Error occurred", new[] { "Failed to delete page" });
            }
        }
    }
}


