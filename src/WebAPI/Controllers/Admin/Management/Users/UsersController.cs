using Application.Features.Shared.Logging.Interfaces;
using Application.Features.Admin.Management.Users.Users.Commands;
using Application.Features.Admin.Management.Users.Users.Queries;
using Application.Features.Admin.Management.Users.Users.DTOs.Requests;
using Application.Features.Admin.Management.Users.Users.DTOs.Responses;
using Application.Features.Identity.Core.Interfaces;
using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers.Admin.Management.Users
{
    [AllowAnonymous]
    //[Authorize(Roles = "Admin")]
    [ApiVersion("3.0")]
    [Route("api/v{version:apiVersion}/admin/users")]
    public class UsersController : BaseController
    {
        private readonly ILogger<UsersController> _logger;
        private readonly ICurrentUserService _currentUserService;

        public UsersController(
            ILogger<UsersController> logger,
            ICurrentUserService currentUserService)
        {
            _logger = logger;
            _currentUserService = currentUserService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllUsers(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? status = null,
            [FromQuery] string? search = null,
            [FromQuery] string? role = null,
            [FromQuery] DateTime? joinedAfter = null,
            [FromQuery] DateTime? joinedBefore = null,
            [FromQuery] bool? isVerified = null,
            [FromQuery] string? sortBy = "CreatedAt",
            [FromQuery] string? sortDirection = "desc")
        {
            try
            {
                _logger.LogInformation("Admin {AdminId} requested users list", GetCurrentUserId());

                var query = new GetUsersQuery
                {
                    Page = page,
                    PageSize = pageSize,
                    Status = status,
                    Search = search,
                    Role = role,
                    JoinedAfter = joinedAfter,
                    JoinedBefore = joinedBefore,
                    IsVerified = isVerified,
                    SortBy = sortBy,
                    SortDirection = sortDirection
                };

                var result = await Mediator.Send(query);

                if (result.Succeeded)
                    return Ok(result.Data);

                return BadRequest(result.Errors);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting users list");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(Guid id)
        {
            try
            {
                _logger.LogInformation("Admin {AdminId} requested user details for {UserId}", GetCurrentUserId(), id);

                var query = new GetUserByIdQuery { UserId = id };
                var result = await Mediator.Send(query);

                if (result.Succeeded)
                    return Ok(result.Data);

                return BadRequest(result.Errors);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user details for {UserId}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchUsers(
            [FromQuery] string searchTerm,
            [FromQuery] int limit = 20,
            [FromQuery] string? role = null,
            [FromQuery] bool? isActive = null)
        {
            try
            {
                _logger.LogInformation("Admin {AdminId} searched users with term: {SearchTerm}", GetCurrentUserId(), searchTerm);

                var query = new SearchUsersQuery
                {
                    SearchTerm = searchTerm,
                    Limit = limit,
                    Role = role,
                    IsActive = isActive
                };

                var result = await Mediator.Send(query);

                if (result.Succeeded)
                    return Ok(result.Data);

                return BadRequest(result.Errors);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching users");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost("{id}/suspend")]
        public async Task<IActionResult> SuspendUser(Guid id, [FromBody] SuspendUserRequest request)
        {
            try
            {
                if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
                {
                    return Unauthorized();
                }

                _logger.LogWarning("Admin {AdminId} suspending user {UserId} for reason: {Reason}", 
                    GetCurrentUserId(), id, request.Reason);

                var command = new SuspendUserCommand
                {
                    UserId = id,
                    AdminId = Guid.Parse(_currentUserService.UserId),
                    Request = request
                };

                var result = await Mediator.Send(command);

                if (result.Succeeded)
                    return Ok(result.Data);

                return BadRequest(result.Errors);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error suspending user {UserId}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost("{id}/ban")]
        public async Task<IActionResult> BanUser(Guid id, [FromBody] BanUserRequest request)
        {
            try
            {
                if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
                {
                    return Unauthorized();
                }

                _logger.LogWarning("Admin {AdminId} banning user {UserId} for reason: {Reason}", 
                    GetCurrentUserId(), id, request.Reason);

                var command = new BanUserCommand
                {
                    UserId = id,
                    AdminId = Guid.Parse(_currentUserService.UserId),
                    Request = request
                };

                var result = await Mediator.Send(command);

                if (result.Succeeded)
                    return Ok(result.Data);

                return BadRequest(result.Errors);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error banning user {UserId}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(Guid id, [FromBody] DeleteUserRequest request)
        {
            try
            {
                if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
                {
                    return Unauthorized();
                }

                _logger.LogWarning("Admin {AdminId} deleting user {UserId} for reason: {Reason}", 
                    GetCurrentUserId(), id, request.Reason);

                var command = new DeleteUserCommand
                {
                    UserId = id,
                    AdminId = Guid.Parse(_currentUserService.UserId),
                    Request = request
                };

                var result = await Mediator.Send(command);

                if (result.Succeeded)
                    return Ok(result.Data);

                return BadRequest(result.Errors);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting user {UserId}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost("{id}/message")]
        public async Task<IActionResult> SendMessageToUser(Guid id, [FromBody] SendMessageRequest request)
        {
            try
            {
                if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
                {
                    return Unauthorized();
                }

                _logger.LogInformation("Admin {AdminId} sending message to user {UserId}", GetCurrentUserId(), id);

                var command = new SendMessageToUserCommand
                {
                    UserId = id,
                    AdminId = Guid.Parse(_currentUserService.UserId),
                    Request = request
                };

                var result = await Mediator.Send(command);

                if (result.Succeeded)
                    return Ok(result.Data);

                return BadRequest(result.Errors);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending message to user {UserId}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPut("{id}/roles")]
        public async Task<IActionResult> UpdateUserRoles(Guid id, [FromBody] UpdateUserRolesRequest request)
        {
            try
            {
                if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
                {
                    return Unauthorized();
                }

                _logger.LogInformation("Admin {AdminId} updating roles for user {UserId}", GetCurrentUserId(), id);

                var command = new UpdateUserRolesCommand
                {
                    UserId = id,
                    AdminId = Guid.Parse(_currentUserService.UserId),
                    Request = request
                };

                var result = await Mediator.Send(command);

                if (result.Succeeded)
                    return Ok(result.Data);

                return BadRequest(result.Errors);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating roles for user {UserId}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost("{id}/impersonate")]
        public async Task<IActionResult> ImpersonateUser(Guid id, [FromBody] ImpersonateUserRequest request)
        {
            try
            {
                if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
                {
                    return Unauthorized();
                }

                _logger.LogWarning("Admin {AdminId} impersonating user {UserId} for reason: {Reason}", 
                    GetCurrentUserId(), id, request.Reason);

                var command = new ImpersonateUserCommand
                {
                    UserId = id,
                    AdminId = Guid.Parse(_currentUserService.UserId),
                    Request = request
                };

                var result = await Mediator.Send(command);

                if (result.Succeeded)
                    return Ok(result.Data);

                return BadRequest(result.Errors);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error impersonating user {UserId}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        private string GetCurrentUserId()
        {
            return User?.FindFirst("sub")?.Value ?? User?.FindFirst("id")?.Value ?? "Unknown";
        }
    }
}
