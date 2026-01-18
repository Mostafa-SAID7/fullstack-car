using Application.Features.Admin.Theme.Commands;
using Application.Features.Admin.Theme.DTOs;
using Application.Features.Admin.Theme.Queries;
using Application.Features.Identity.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Asp.Versioning;

namespace WebAPI.Controllers.SiteSettings
{
    [Authorize(Roles = "Admin,SuperAdmin")]
    [ApiVersion("2.0")]
    [Route("api/v{version:apiVersion}/theme")]
    public class ThemeController : BaseController
    {
        private readonly ICurrentUserService _currentUserService;

        public ThemeController(ICurrentUserService currentUserService)
        {
            _currentUserService = currentUserService;
        }

        [HttpGet]
        [AllowAnonymous]
        [OutputCache(Duration = 1800, Tags = new[] { "Theme" })]
        public async Task<IActionResult> GetActiveTheme()
        {
            var query = new GetActiveThemeQuery();
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Active theme retrieved successfully");

            return BadRequest("Failed to retrieve active theme", result.Errors);
        }

        [HttpGet("all")]
        [OutputCache(Duration = 600, Tags = new[] { "Theme", "All" })]
        public async Task<IActionResult> GetAllThemes()
        {
            var query = new GetAllThemesQuery();
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "All themes retrieved successfully");

            return BadRequest("Failed to retrieve themes", result.Errors);
        }

        [HttpGet("{themeId}")]
        [OutputCache(Duration = 600, Tags = new[] { "Theme" })]
        public async Task<IActionResult> GetTheme(Guid themeId)
        {
            var query = new GetThemeByIdQuery { ThemeId = themeId };
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Theme retrieved successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Theme not found");

            return BadRequest("Failed to retrieve theme", result.Errors);
        }

        [HttpPost]
        public async Task<IActionResult> CreateTheme([FromBody] CreateThemeRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new CreateThemeCommand
            {
                Request = request,
                CreatedBy = userGuid
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
            {
                var location = Url.Action(nameof(GetTheme), new { themeId = result.Data.Id });
                return Created(result.Data, location!, "Theme created successfully");
            }

            if (result.Errors.Any(e => e.Contains("duplicate name")))
                return BadRequest("A theme with this name already exists", result.Errors);

            return BadRequest("Failed to create theme", result.Errors);
        }

        [HttpPut("{themeId}")]
        public async Task<IActionResult> UpdateTheme(Guid themeId, [FromBody] UpdateThemeRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new UpdateThemeCommand
            {
                ThemeId = themeId,
                Request = request,
                UpdatedBy = userGuid
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success(result.Data, "Theme updated successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Theme not found");

            if (result.Errors.Any(e => e.Contains("duplicate name")))
                return BadRequest("A theme with this name already exists", result.Errors);

            return BadRequest("Failed to update theme", result.Errors);
        }

        [HttpDelete("{themeId}")]
        public async Task<IActionResult> DeleteTheme(Guid themeId)
        {
            var command = new DeleteThemeCommand { ThemeId = themeId };
            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success("Theme deleted successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Theme not found");

            if (result.Errors.Any(e => e.Contains("active theme")))
                return BadRequest("Cannot delete the active theme", result.Errors);

            return BadRequest("Failed to delete theme", result.Errors);
        }

        [HttpPost("{themeId}/activate")]
        public async Task<IActionResult> ActivateTheme(Guid themeId)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new ActivateThemeCommand
            {
                ThemeId = themeId,
                ActivatedBy = userGuid
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success("Theme activated successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Theme not found");

            if (result.Errors.Any(e => e.Contains("already active")))
                return BadRequest("Theme is already active", result.Errors);

            return BadRequest("Failed to activate theme", result.Errors);
        }

        [HttpPost("{themeId}/duplicate")]
        public async Task<IActionResult> DuplicateTheme(Guid themeId, [FromBody] DuplicateThemeRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new DuplicateThemeCommand
            {
                ThemeId = themeId,
                Request = request,
                CreatedBy = userGuid
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
            {
                var location = Url.Action(nameof(GetTheme), new { themeId = result.Data.Id });
                return Created(result.Data, location!, "Theme duplicated successfully");
            }

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Source theme not found");

            if (result.Errors.Any(e => e.Contains("duplicate name")))
                return BadRequest("A theme with this name already exists", result.Errors);

            return BadRequest("Failed to duplicate theme", result.Errors);
        }

        [HttpPost("{themeId}/export")]
        public async Task<IActionResult> ExportTheme(Guid themeId)
        {
            var command = new ExportThemeCommand { ThemeId = themeId };
            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return File(result.Data.FileContent, "application/json", result.Data.FileName);

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Theme not found");

            return BadRequest("Failed to export theme", result.Errors);
        }

        [HttpPost("import")]
        public async Task<IActionResult> ImportTheme([FromForm] ImportThemeRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new ImportThemeCommand
            {
                Request = request,
                ImportedBy = userGuid
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
            {
                var location = Url.Action(nameof(GetTheme), new { themeId = result.Data.Id });
                return Created(result.Data, location!, "Theme imported successfully");
            }

            if (result.Errors.Any(e => e.Contains("invalid file")))
                return BadRequest("Invalid theme file format", result.Errors);

            if (result.Errors.Any(e => e.Contains("duplicate name")))
                return BadRequest("A theme with this name already exists", result.Errors);

            return BadRequest("Failed to import theme", result.Errors);
        }

        [HttpGet("{themeId}/preview")]
        [OutputCache(Duration = 300, Tags = new[] { "Theme", "Preview" })]
        public async Task<IActionResult> PreviewTheme(Guid themeId)
        {
            var query = new GetThemePreviewQuery { ThemeId = themeId };
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Theme preview generated successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Theme not found");

            return BadRequest("Failed to generate theme preview", result.Errors);
        }

        [HttpPost("reset-to-default")]
        public async Task<IActionResult> ResetToDefaultTheme()
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new ResetToDefaultThemeCommand { ResetBy = userGuid };
            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success("Theme reset to default successfully");

            return BadRequest("Failed to reset theme to default", result.Errors);
        }
    }
}