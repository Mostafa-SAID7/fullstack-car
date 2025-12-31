using Application.Features.Admin.DTOs.Management;
using Application.Features.Admin.Commands.Management;
using Application.Features.Admin.Queries.Management;
using Application.Common.Interfaces.Identity.Core;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Asp.Versioning;

namespace WebAPI.Controllers.Admin.Management
{
    [Authorize(Roles = "Admin")]
    [ApiVersion("3.0")]
    [Route("api/v{version:apiVersion}/admin/management/roles")]
    public class RolesController : BaseController
    {
        private readonly ICurrentUserService _currentUserService;

        public RolesController(ICurrentUserService currentUserService)
        {
            _currentUserService = currentUserService;
        }

        [HttpGet]
        public async Task<IActionResult> GetRoles(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? searchTerm = null)
        {
            var query = new GetRolesQuery
            {
                Page = page,
                PageSize = pageSize,
                SearchTerm = searchTerm
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Ok(result.Data);

            return BadRequest(result.Errors);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetRole(Guid id)
        {
            var query = new GetRoleByIdQuery { RoleId = id };
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Ok(result.Data);

            return BadRequest(result.Errors);
        }

        [HttpPost]
        public async Task<IActionResult> CreateRole([FromBody] CreateRoleRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized();
            }

            var command = new CreateRoleCommand
            {
                AdminId = Guid.Parse(_currentUserService.UserId),
                Name = request.Name,
                Description = request.Description,
                Permissions = request.Permissions
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return CreatedAtAction(nameof(GetRole), new { id = result.Data }, result.Data);

            return BadRequest(result.Errors);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRole(Guid id, [FromBody] UpdateRoleRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized();
            }

            var command = new UpdateRoleCommand
            {
                RoleId = id,
                AdminId = Guid.Parse(_currentUserService.UserId),
                Name = request.Name,
                Description = request.Description,
                Permissions = request.Permissions
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Ok(new { Message = "Role updated successfully" });

            return BadRequest(result.Errors);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRole(Guid id)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized();
            }

            var command = new DeleteRoleCommand
            {
                RoleId = id,
                AdminId = Guid.Parse(_currentUserService.UserId)
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return NoContent();

            return BadRequest(result.Errors);
        }

        [HttpGet("{id}/users")]
        public async Task<IActionResult> GetRoleUsers(
            Guid id,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            var query = new GetRoleUsersQuery
            {
                RoleId = id,
                Page = page,
                PageSize = pageSize
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Ok(result.Data);

            return BadRequest(result.Errors);
        }

        [HttpPost("{id}/users/{userId}")]
        public async Task<IActionResult> AssignUserToRole(Guid id, Guid userId)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized();
            }

            var command = new AssignUserToRoleCommand
            {
                RoleId = id,
                UserId = userId,
                AdminId = Guid.Parse(_currentUserService.UserId)
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Ok(new { Message = "User assigned to role successfully" });

            return BadRequest(result.Errors);
        }

        [HttpDelete("{id}/users/{userId}")]
        public async Task<IActionResult> RemoveUserFromRole(Guid id, Guid userId)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized();
            }

            var command = new RemoveUserFromRoleCommand
            {
                RoleId = id,
                UserId = userId,
                AdminId = Guid.Parse(_currentUserService.UserId)
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Ok(new { Message = "User removed from role successfully" });

            return BadRequest(result.Errors);
        }

        [HttpGet("permissions")]
        public async Task<IActionResult> GetAvailablePermissions()
        {
            var query = new GetAvailablePermissionsQuery();
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Ok(result.Data);

            return BadRequest(result.Errors);
        }
    }
}