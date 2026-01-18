using Application.Features.Admin.Management.Users.Permissions.Queries;
using Application.Features.Admin.Management.Users.Permissions.Commands;
using Application.Features.Admin.Management.Users.Permissions.DTOs.Requests;
using Application.Features.Admin.Management.Users.Permissions.DTOs.Responses;
using Application.Features.Identity.Core.Interfaces;
using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers.Admin.Management.Users.Permissions
{
    [Authorize(Roles = "Admin")]
    [ApiVersion("3.0")]
    [Route("api/v{version:apiVersion}/admin/permissions")]
    public class PermissionsController : BaseController
    {
        private readonly ILogger<PermissionsController> _logger;
        private readonly ICurrentUserService _currentUserService;

        public PermissionsController(
            ILogger<PermissionsController> logger,
            ICurrentUserService currentUserService)
        {
            _logger = logger;
            _currentUserService = currentUserService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllPermissions(
            [FromQuery] string? category = null,
            [FromQuery] bool? isSystemPermission = null)
        {
            try
            {
                _logger.LogInformation("Admin requested permissions list");

                var query = new GetAvailablePermissionsQuery
                {
                    Category = category
                };

                var result = await Mediator.Send(query);

                if (result.Succeeded)
                {
                    var filteredPermissions = result.Data;
                    if (isSystemPermission.HasValue)
                    {
                        filteredPermissions = filteredPermissions
                            .Where(p => p.IsSystemPermission == isSystemPermission.Value)
                            .ToList();
                    }

                    return Ok(filteredPermissions);
                }

                return BadRequest(result.Errors);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting permissions list");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("categories")]
        public async Task<IActionResult> GetPermissionCategories()
        {
            try
            {
                _logger.LogInformation("Admin requested permission categories");

                var query = new GetPermissionCategoriesQuery();
                var result = await Mediator.Send(query);

                if (result.Succeeded)
                    return Ok(result.Data);

                return BadRequest(result.Errors);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting permission categories");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("{permissionName}")]
        public async Task<IActionResult> GetPermission(string permissionName)
        {
            try
            {
                _logger.LogInformation("Admin requested permission details for {PermissionName}", permissionName);

                var query = new GetPermissionByNameQuery { PermissionName = permissionName };
                var result = await Mediator.Send(query);

                if (result.Succeeded)
                    return Ok(result.Data);

                return BadRequest(result.Errors);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting permission {PermissionName}", permissionName);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreatePermission([FromBody] CreatePermissionRequest request)
        {
            try
            {
                if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
                {
                    return Unauthorized();
                }

                _logger.LogInformation("Admin {AdminId} creating permission {PermissionName}", 
                    GetCurrentUserId(), request.Name);

                var command = new CreatePermissionCommand
                {
                    AdminId = Guid.Parse(_currentUserService.UserId),
                    Name = request.Name,
                    Description = request.Description,
                    Category = request.Category,
                    IsSystemPermission = request.IsSystemPermission
                };

                var result = await Mediator.Send(command);

                if (result.Succeeded)
                    return CreatedAtAction(nameof(GetPermission), new { permissionName = request.Name }, result.Data);

                return BadRequest(result.Errors);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating permission");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPut("{permissionName}")]
        public async Task<IActionResult> UpdatePermission(string permissionName, [FromBody] UpdatePermissionRequest request)
        {
            try
            {
                if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
                {
                    return Unauthorized();
                }

                _logger.LogInformation("Admin {AdminId} updating permission {PermissionName}", 
                    GetCurrentUserId(), permissionName);

                var command = new UpdatePermissionCommand
                {
                    AdminId = Guid.Parse(_currentUserService.UserId),
                    PermissionName = permissionName,
                    Description = request.Description,
                    Category = request.Category
                };

                var result = await Mediator.Send(command);

                if (result.Succeeded)
                    return Ok(new { Message = "Permission updated successfully" });

                return BadRequest(result.Errors);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating permission {PermissionName}", permissionName);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpDelete("{permissionName}")]
        public async Task<IActionResult> DeletePermission(string permissionName)
        {
            try
            {
                if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
                {
                    return Unauthorized();
                }

                _logger.LogWarning("Admin {AdminId} deleting permission {PermissionName}", 
                    GetCurrentUserId(), permissionName);

                var command = new DeletePermissionCommand
                {
                    AdminId = Guid.Parse(_currentUserService.UserId),
                    PermissionName = permissionName
                };

                var result = await Mediator.Send(command);

                if (result.Succeeded)
                    return NoContent();

                return BadRequest(result.Errors);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting permission {PermissionName}", permissionName);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("{permissionName}/roles")]
        public async Task<IActionResult> GetRolesWithPermission(string permissionName)
        {
            try
            {
                _logger.LogInformation("Admin requested roles with permission {PermissionName}", permissionName);

                var query = new GetRolesWithPermissionQuery { PermissionName = permissionName };
                var result = await Mediator.Send(query);

                if (result.Succeeded)
                    return Ok(result.Data);

                return BadRequest(result.Errors);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting roles with permission {PermissionName}", permissionName);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("{permissionName}/users")]
        public async Task<IActionResult> GetUsersWithPermission(
            string permissionName,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            try
            {
                _logger.LogInformation("Admin requested users with permission {PermissionName}", permissionName);

                var query = new GetUsersWithPermissionQuery 
                { 
                    PermissionName = permissionName,
                    Page = page,
                    PageSize = pageSize
                };
                var result = await Mediator.Send(query);

                if (result.Succeeded)
                    return Ok(result.Data);

                return BadRequest(result.Errors);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting users with permission {PermissionName}", permissionName);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("matrix")]
        public async Task<IActionResult> GetPermissionMatrix()
        {
            try
            {
                _logger.LogInformation("Admin requested permission matrix");

                var query = new GetPermissionMatrixQuery();
                var result = await Mediator.Send(query);

                if (result.Succeeded)
                    return Ok(result.Data);

                return BadRequest(result.Errors);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting permission matrix");
                return StatusCode(500, "Internal server error");
            }
        }

        private string GetCurrentUserId()
        {
            return User?.FindFirst("sub")?.Value ?? User?.FindFirst("id")?.Value ?? "Unknown";
        }
    }
}


