using Application.Features.Admin.Layouts.Commands;
using Application.Features.Admin.Layouts.DTOs;
using Application.Features.Admin.Layouts.Queries;
using Application.Features.Identity.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Asp.Versioning;

namespace WebAPI.Controllers.SiteSettings
{
    [Authorize(Roles = "Admin,SuperAdmin,Designer")]
    [ApiVersion("2.0")]
    [Route("api/v{version:apiVersion}/layouts")]
    public class LayoutsController : BaseController
    {
        private readonly ICurrentUserService _currentUserService;

        public LayoutsController(ICurrentUserService currentUserService)
        {
            _currentUserService = currentUserService;
        }

        [HttpGet]
        [AllowAnonymous]
        [OutputCache(Duration = 1800, Tags = new[] { "Layouts" })]
        public async Task<IActionResult> GetActiveLayouts()
        {
            var query = new GetActiveLayoutsQuery();
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Active layouts retrieved successfully");

            return BadRequest("Failed to retrieve active layouts", result.Errors);
        }

        [HttpGet("all")]
        [OutputCache(Duration = 600, Tags = new[] { "Layouts", "All" })]
        public async Task<IActionResult> GetAllLayouts()
        {
            var query = new GetAllLayoutsQuery();
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "All layouts retrieved successfully");

            return BadRequest("Failed to retrieve layouts", result.Errors);
        }

        [HttpGet("{layoutId}")]
        [OutputCache(Duration = 600, Tags = new[] { "Layouts" })]
        public async Task<IActionResult> GetLayout(Guid layoutId)
        {
            var query = new GetLayoutByIdQuery { LayoutId = layoutId };
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Layout retrieved successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Layout not found");

            return BadRequest("Failed to retrieve layout", result.Errors);
        }

        [HttpGet("by-page/{pageType}")]
        [AllowAnonymous]
        [OutputCache(Duration = 1800, Tags = new[] { "Layouts", "PageType" })]
        public async Task<IActionResult> GetLayoutByPageType(string pageType)
        {
            var query = new GetLayoutByPageTypeQuery { PageType = pageType };
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Layout retrieved successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Layout not found for this page type");

            return BadRequest("Failed to retrieve layout", result.Errors);
        }

        [HttpPost]
        public async Task<IActionResult> CreateLayout([FromBody] CreateLayoutRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new CreateLayoutCommand
            {
                Request = request,
                CreatedBy = userGuid
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
            {
                var location = Url.Action(nameof(GetLayout), new { layoutId = result.Data.Id });
                return Created(result.Data, location!, "Layout created successfully");
            }

            if (result.Errors.Any(e => e.Contains("duplicate name")))
                return BadRequest("A layout with this name already exists", result.Errors);

            return BadRequest("Failed to create layout", result.Errors);
        }

        [HttpPut("{layoutId}")]
        public async Task<IActionResult> UpdateLayout(Guid layoutId, [FromBody] UpdateLayoutRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new UpdateLayoutCommand
            {
                LayoutId = layoutId,
                Request = request,
                UpdatedBy = userGuid
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success(result.Data, "Layout updated successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Layout not found");

            if (result.Errors.Any(e => e.Contains("duplicate name")))
                return BadRequest("A layout with this name already exists", result.Errors);

            return BadRequest("Failed to update layout", result.Errors);
        }

        [HttpDelete("{layoutId}")]
        public async Task<IActionResult> DeleteLayout(Guid layoutId)
        {
            var command = new DeleteLayoutCommand { LayoutId = layoutId };
            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success("Layout deleted successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Layout not found");

            if (result.Errors.Any(e => e.Contains("in use")))
                return BadRequest("Cannot delete layout that is currently in use", result.Errors);

            return BadRequest("Failed to delete layout", result.Errors);
        }

        [HttpPost("{layoutId}/activate")]
        public async Task<IActionResult> ActivateLayout(Guid layoutId, [FromBody] ActivateLayoutRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new ActivateLayoutCommand
            {
                LayoutId = layoutId,
                Request = request,
                ActivatedBy = userGuid
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success("Layout activated successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Layout not found");

            if (result.Errors.Any(e => e.Contains("already active")))
                return BadRequest("Layout is already active for this page type", result.Errors);

            return BadRequest("Failed to activate layout", result.Errors);
        }

        [HttpPost("{layoutId}/duplicate")]
        public async Task<IActionResult> DuplicateLayout(Guid layoutId, [FromBody] DuplicateLayoutRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new DuplicateLayoutCommand
            {
                LayoutId = layoutId,
                Request = request,
                CreatedBy = userGuid
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
            {
                var location = Url.Action(nameof(GetLayout), new { layoutId = result.Data.Id });
                return Created(result.Data, location!, "Layout duplicated successfully");
            }

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Source layout not found");

            if (result.Errors.Any(e => e.Contains("duplicate name")))
                return BadRequest("A layout with this name already exists", result.Errors);

            return BadRequest("Failed to duplicate layout", result.Errors);
        }

        [HttpGet("components")]
        [OutputCache(Duration = 1800, Tags = new[] { "Layouts", "Components" })]
        public async Task<IActionResult> GetAvailableComponents()
        {
            var query = new GetAvailableComponentsQuery();
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Available components retrieved successfully");

            return BadRequest("Failed to retrieve available components", result.Errors);
        }

        [HttpPost("components")]
        public async Task<IActionResult> CreateCustomComponent([FromBody] CreateCustomComponentRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new CreateCustomComponentCommand
            {
                Request = request,
                CreatedBy = userGuid
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success(result.Data, "Custom component created successfully");

            if (result.Errors.Any(e => e.Contains("duplicate name")))
                return BadRequest("A component with this name already exists", result.Errors);

            return BadRequest("Failed to create custom component", result.Errors);
        }

        [HttpPut("components/{componentId}")]
        public async Task<IActionResult> UpdateCustomComponent(Guid componentId, [FromBody] UpdateCustomComponentRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new UpdateCustomComponentCommand
            {
                ComponentId = componentId,
                Request = request,
                UpdatedBy = userGuid
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success(result.Data, "Custom component updated successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Custom component not found");

            return BadRequest("Failed to update custom component", result.Errors);
        }

        [HttpGet("templates")]
        [OutputCache(Duration = 1800, Tags = new[] { "Layouts", "Templates" })]
        public async Task<IActionResult> GetLayoutTemplates()
        {
            var query = new GetLayoutTemplatesQuery();
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Layout templates retrieved successfully");

            return BadRequest("Failed to retrieve layout templates", result.Errors);
        }

        [HttpPost("from-template/{templateId}")]
        public async Task<IActionResult> CreateLayoutFromTemplate(Guid templateId, [FromBody] CreateLayoutFromTemplateRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new CreateLayoutFromTemplateCommand
            {
                TemplateId = templateId,
                Request = request,
                CreatedBy = userGuid
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
            {
                var location = Url.Action(nameof(GetLayout), new { layoutId = result.Data.Id });
                return Created(result.Data, location!, "Layout created from template successfully");
            }

            if (result.Errors.Any(e => e.Contains("template not found")))
                return NotFound("Layout template not found");

            if (result.Errors.Any(e => e.Contains("duplicate name")))
                return BadRequest("A layout with this name already exists", result.Errors);

            return BadRequest("Failed to create layout from template", result.Errors);
        }

        [HttpPost("{layoutId}/preview")]
        public async Task<IActionResult> PreviewLayout(Guid layoutId, [FromBody] PreviewLayoutRequest? request = null)
        {
            var command = new PreviewLayoutCommand
            {
                LayoutId = layoutId,
                Request = request ?? new PreviewLayoutRequest()
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success(result.Data, "Layout preview generated successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Layout not found");

            return BadRequest("Failed to generate layout preview", result.Errors);
        }

        [HttpGet("responsive-breakpoints")]
        [AllowAnonymous]
        [OutputCache(Duration = 3600, Tags = new[] { "Layouts", "Responsive" })]
        public async Task<IActionResult> GetResponsiveBreakpoints()
        {
            var query = new GetResponsiveBreakpointsQuery();
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Responsive breakpoints retrieved successfully");

            return BadRequest("Failed to retrieve responsive breakpoints", result.Errors);
        }

        [HttpPut("responsive-breakpoints")]
        public async Task<IActionResult> UpdateResponsiveBreakpoints([FromBody] UpdateResponsiveBreakpointsRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new UpdateResponsiveBreakpointsCommand
            {
                Request = request,
                UpdatedBy = userGuid
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success(result.Data, "Responsive breakpoints updated successfully");

            return BadRequest("Failed to update responsive breakpoints", result.Errors);
        }
    }
}