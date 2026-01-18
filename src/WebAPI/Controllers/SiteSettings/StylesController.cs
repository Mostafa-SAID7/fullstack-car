using Application.Features.Admin.Styles.Commands;
using Application.Features.Admin.Styles.DTOs;
using Application.Features.Admin.Styles.Queries;
using Application.Features.Identity.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Asp.Versioning;

namespace WebAPI.Controllers.SiteSettings
{
    [Authorize(Roles = "Admin,SuperAdmin,Designer")]
    [ApiVersion("2.0")]
    [Route("api/v{version:apiVersion}/styles")]
    public class StylesController : BaseController
    {
        private readonly ICurrentUserService _currentUserService;

        public StylesController(ICurrentUserService currentUserService)
        {
            _currentUserService = currentUserService;
        }

        [HttpGet("predefined")]
        [AllowAnonymous]
        [OutputCache(Duration = 3600, Tags = new[] { "Styles", "Predefined" })]
        public async Task<IActionResult> GetPredefinedStyles()
        {
            var query = new GetPredefinedStylesQuery();
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Predefined styles retrieved successfully");

            return BadRequest("Failed to retrieve predefined styles", result.Errors);
        }

        [HttpGet("predefined/{styleName}")]
        [AllowAnonymous]
        [OutputCache(Duration = 3600, Tags = new[] { "Styles", "Predefined" })]
        public async Task<IActionResult> GetPredefinedStyle(string styleName)
        {
            var query = new GetPredefinedStyleQuery { StyleName = styleName };
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Predefined style retrieved successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Predefined style not found");

            return BadRequest("Failed to retrieve predefined style", result.Errors);
        }

        [HttpPost("apply-predefined")]
        public async Task<IActionResult> ApplyPredefinedStyle([FromBody] ApplyPredefinedStyleRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new ApplyPredefinedStyleCommand
            {
                Request = request,
                AppliedBy = userGuid
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success(result.Data, "Predefined style applied successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Predefined style not found");

            return BadRequest("Failed to apply predefined style", result.Errors);
        }

        [HttpGet]
        [AllowAnonymous]
        [OutputCache(Duration = 1800, Tags = new[] { "Styles" })]
        public async Task<IActionResult> GetActiveStyles()
        {
            var query = new GetActiveStylesQuery();
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Active styles retrieved successfully");

            return BadRequest("Failed to retrieve active styles", result.Errors);
        }

        [HttpGet("all")]
        [OutputCache(Duration = 600, Tags = new[] { "Styles", "All" })]
        public async Task<IActionResult> GetAllStyles()
        {
            var query = new GetAllStylesQuery();
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "All styles retrieved successfully");

            return BadRequest("Failed to retrieve styles", result.Errors);
        }

        [HttpGet("css")]
        [AllowAnonymous]
        [OutputCache(Duration = 3600, Tags = new[] { "Styles", "CSS" })]
        public async Task<IActionResult> GetCompiledCss()
        {
            var query = new GetCompiledCssQuery();
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Content(result.Data.CssContent, "text/css");

            return BadRequest("Failed to retrieve compiled CSS", result.Errors);
        }

        [HttpGet("variables")]
        [AllowAnonymous]
        [OutputCache(Duration = 1800, Tags = new[] { "Styles", "Variables" })]
        public async Task<IActionResult> GetCssVariables()
        {
            var query = new GetCssVariablesQuery();
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "CSS variables retrieved successfully");

            return BadRequest("Failed to retrieve CSS variables", result.Errors);
        }

        [HttpPut("variables")]
        public async Task<IActionResult> UpdateCssVariables([FromBody] UpdateCssVariablesRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new UpdateCssVariablesCommand
            {
                Request = request,
                UpdatedBy = userGuid
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success(result.Data, "CSS variables updated successfully");

            return BadRequest("Failed to update CSS variables", result.Errors);
        }

        [HttpPost("custom")]
        public async Task<IActionResult> CreateCustomStyle([FromBody] CreateCustomStyleRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new CreateCustomStyleCommand
            {
                Request = request,
                CreatedBy = userGuid
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success(result.Data, "Custom style created successfully");

            if (result.Errors.Any(e => e.Contains("duplicate name")))
                return BadRequest("A style with this name already exists", result.Errors);

            return BadRequest("Failed to create custom style", result.Errors);
        }

        [HttpPut("custom/{styleId}")]
        public async Task<IActionResult> UpdateCustomStyle(Guid styleId, [FromBody] UpdateCustomStyleRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new UpdateCustomStyleCommand
            {
                StyleId = styleId,
                Request = request,
                UpdatedBy = userGuid
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success(result.Data, "Custom style updated successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Custom style not found");

            return BadRequest("Failed to update custom style", result.Errors);
        }

        [HttpDelete("custom/{styleId}")]
        public async Task<IActionResult> DeleteCustomStyle(Guid styleId)
        {
            var command = new DeleteCustomStyleCommand { StyleId = styleId };
            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success("Custom style deleted successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Custom style not found");

            if (result.Errors.Any(e => e.Contains("in use")))
                return BadRequest("Cannot delete style that is currently in use", result.Errors);

            return BadRequest("Failed to delete custom style", result.Errors);
        }

        [HttpPost("compile")]
        public async Task<IActionResult> CompileStyles()
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new CompileStylesCommand { CompiledBy = userGuid };
            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success(result.Data, "Styles compiled successfully");

            return BadRequest("Failed to compile styles", result.Errors);
        }

        [HttpGet("fonts")]
        [AllowAnonymous]
        [OutputCache(Duration = 3600, Tags = new[] { "Styles", "Fonts" })]
        public async Task<IActionResult> GetAvailableFonts()
        {
            var query = new GetAvailableFontsQuery();
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Available fonts retrieved successfully");

            return BadRequest("Failed to retrieve available fonts", result.Errors);
        }

        [HttpPost("fonts/upload")]
        public async Task<IActionResult> UploadCustomFont([FromForm] UploadCustomFontRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new UploadCustomFontCommand
            {
                Request = request,
                UploadedBy = userGuid
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success(result.Data, "Custom font uploaded successfully");

            if (result.Errors.Any(e => e.Contains("invalid format")))
                return BadRequest("Invalid font format. Only TTF, OTF, WOFF, and WOFF2 are allowed", result.Errors);

            if (result.Errors.Any(e => e.Contains("file too large")))
                return BadRequest("Font file size exceeds the maximum limit", result.Errors);

            return BadRequest("Failed to upload custom font", result.Errors);
        }

        [HttpGet("color-schemes")]
        [AllowAnonymous]
        [OutputCache(Duration = 1800, Tags = new[] { "Styles", "ColorSchemes" })]
        public async Task<IActionResult> GetColorSchemes()
        {
            var query = new GetColorSchemesQuery();
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Color schemes retrieved successfully");

            return BadRequest("Failed to retrieve color schemes", result.Errors);
        }

        [HttpPost("color-schemes")]
        public async Task<IActionResult> CreateColorScheme([FromBody] CreateColorSchemeRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new CreateColorSchemeCommand
            {
                Request = request,
                CreatedBy = userGuid
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success(result.Data, "Color scheme created successfully");

            if (result.Errors.Any(e => e.Contains("duplicate name")))
                return BadRequest("A color scheme with this name already exists", result.Errors);

            return BadRequest("Failed to create color scheme", result.Errors);
        }

        [HttpPut("color-schemes/{schemeId}")]
        public async Task<IActionResult> UpdateColorScheme(Guid schemeId, [FromBody] UpdateColorSchemeRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new UpdateColorSchemeCommand
            {
                SchemeId = schemeId,
                Request = request,
                UpdatedBy = userGuid
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success(result.Data, "Color scheme updated successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Color scheme not found");

            return BadRequest("Failed to update color scheme", result.Errors);
        }

        [HttpPost("preview")]
        public async Task<IActionResult> PreviewStyles([FromBody] PreviewStylesRequest request)
        {
            var command = new PreviewStylesCommand { Request = request };
            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success(result.Data, "Style preview generated successfully");

            return BadRequest("Failed to generate style preview", result.Errors);
        }

        [HttpPost("reset-to-default")]
        public async Task<IActionResult> ResetStylesToDefault()
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new ResetStylesToDefaultCommand { ResetBy = userGuid };
            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success("Styles reset to default successfully");

            return BadRequest("Failed to reset styles to default", result.Errors);
        }
    }
}