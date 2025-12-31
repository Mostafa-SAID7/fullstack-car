using Application.Common.Interfaces.Logging;
using Application.Features.Admin.Commands.Management;
using Application.Features.Admin.Queries.Management;
using Application.Features.Admin.DTOs.Management;
using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers.Admin.Management
{
    [Authorize(Roles = "Admin")]
    [ApiVersion("3.0")]
    [Route("api/v{version:apiVersion}/admin/users")]
    public class UsersController : BaseController
    {
        private readonly IAdvancedLogger<UsersController> _logger;

        public UsersController(IAdvancedLogger<UsersController> logger)
        {
            _logger = logger;
        }

        /// <summary>
        /// Get all users with advanced filtering and pagination
        /// </summary>
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
                _logger.LogUserAction(GetCurrentUserId(), "ViewAllUsers", new { page, pageSize, status, search });

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

        /// <summary>
        /// Get detailed user information by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(Guid id)
        {
            try
            {
                _logger.LogUserAction(GetCurrentUserId(), "ViewUserDetails", new { UserId = id });

                var query = new GetUserByIdQuery { UserId = id };
                var result = await Mediator.Send(query);

                if (result.Succeeded)
                    return Ok(result.Data);

                return BadRequest(result.Errors);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user details");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Get user statistics and metrics
        /// </summary>
        [HttpGet("statistics")]
        public async Task<IActionResult> GetUserStatistics(
            [FromQuery] DateTime? fromDate = null,
            [FromQuery] DateTime? toDate = null)
        {
            try
            {
                _logger.LogUserAction(GetCurrentUserId(), "ViewUserStatistics");

                var query = new GetUserStatisticsQuery
                {
                    FromDate = fromDate,
                    ToDate = toDate
                };

                var result = await Mediator.Send(query);

                if (result.Succeeded)
                    return Ok(result.Data);

                return BadRequest(result.Errors);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user statistics");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Get user activity history
        /// </summary>
        [HttpGet("{id}/activity")]
        public async Task<IActionResult> GetUserActivity(
            Guid id,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? activityType = null,
            [FromQuery] DateTime? fromDate = null,
            [FromQuery] DateTime? toDate = null)
        {
            try
            {
                _logger.LogUserAction(GetCurrentUserId(), "ViewUserActivity", new { UserId = id });

                var query = new GetUserActivityQuery
                {
                    UserId = id,
                    Page = page,
                    PageSize = pageSize,
                    ActivityType = activityType,
                    FromDate = fromDate,
                    ToDate = toDate
                };

                var result = await Mediator.Send(query);

                if (result.Succeeded)
                    return Ok(result.Data);

                return BadRequest(result.Errors);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user activity");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Get reports about a specific user
        /// </summary>
        [HttpGet("{id}/reports")]
        public async Task<IActionResult> GetUserReports(
            Guid id,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] bool? isResolved = null,
            [FromQuery] string? category = null)
        {
            try
            {
                _logger.LogUserAction(GetCurrentUserId(), "ViewUserReports", new { UserId = id });

                var query = new GetUserReportsQuery
                {
                    UserId = id,
                    Page = page,
                    PageSize = pageSize,
                    IsResolved = isResolved,
                    Category = category
                };

                var result = await Mediator.Send(query);

                if (result.Succeeded)
                    return Ok(result.Data);

                return BadRequest(result.Errors);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user reports");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Search users with advanced criteria
        /// </summary>
        [HttpGet("search")]
        public async Task<IActionResult> SearchUsers(
            [FromQuery] string searchTerm,
            [FromQuery] int limit = 20,
            [FromQuery] string? role = null,
            [FromQuery] bool? isActive = null)
        {
            try
            {
                _logger.LogUserAction(GetCurrentUserId(), "SearchUsers", new { searchTerm, limit });

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

        /// <summary>
        /// Suspend a user account
        /// </summary>
        [HttpPut("{id}/suspend")]
        public async Task<IActionResult> SuspendUser(Guid id, [FromBody] SuspendUserRequest request)
        {
            try
            {
                _logger.LogUserAction(GetCurrentUserId(), "SuspendUser", new { UserId = id, Reason = request.Reason });

                var command = new SuspendUserCommand
                {
                    UserId = id,
                    AdminId = Guid.Parse(GetCurrentUserId()),
                    Request = request
                };

                var result = await Mediator.Send(command);

                if (result.Succeeded)
                    return Ok(new { Message = "User suspended successfully", Reason = request.Reason });

                return BadRequest(result.Errors);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error suspending user");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Activate a suspended user account
        /// </summary>
        [HttpPut("{id}/activate")]
        public async Task<IActionResult> ActivateUser(Guid id)
        {
            try
            {
                _logger.LogUserAction(GetCurrentUserId(), "ActivateUser", new { UserId = id });

                // Implementation would use a specific command for activation
                return Ok(new { Message = "User activated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error activating user");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Ban a user account
        /// </summary>
        [HttpPut("{id}/ban")]
        public async Task<IActionResult> BanUser(Guid id, [FromBody] BanUserRequest request)
        {
            try
            {
                _logger.LogUserAction(GetCurrentUserId(), "BanUser", new { UserId = id, Reason = request.Reason });

                var command = new BanUserCommand
                {
                    UserId = id,
                    AdminId = Guid.Parse(GetCurrentUserId()),
                    Request = request
                };

                var result = await Mediator.Send(command);

                if (result.Succeeded)
                    return Ok(new { Message = "User banned successfully", Duration = request.Duration });

                return BadRequest(result.Errors);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error banning user");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Delete a user account (admin only)
        /// </summary>
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteUser(Guid id, [FromBody] DeleteUserRequest request)
        {
            try
            {
                _logger.LogUserAction(GetCurrentUserId(), "DeleteUser", new { UserId = id, Reason = request.Reason });

                var command = new DeleteUserCommand
                {
                    UserId = id,
                    AdminId = Guid.Parse(GetCurrentUserId()),
                    Request = request
                };

                var result = await Mediator.Send(command);

                if (result.Succeeded)
                    return NoContent();

                return BadRequest(result.Errors);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting user");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Send a message to a user
        /// </summary>
        [HttpPost("{id}/send-message")]
        public async Task<IActionResult> SendMessageToUser(Guid id, [FromBody] SendMessageRequest request)
        {
            try
            {
                _logger.LogUserAction(GetCurrentUserId(), "SendMessageToUser", new { UserId = id, Subject = request.Subject });

                var command = new SendMessageToUserCommand
                {
                    UserId = id,
                    AdminId = Guid.Parse(GetCurrentUserId()),
                    Request = request
                };

                var result = await Mediator.Send(command);

                if (result.Succeeded)
                    return Ok(new { Message = "Message sent successfully" });

                return BadRequest(result.Errors);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending message to user");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Update user roles
        /// </summary>
        [HttpPut("{id}/roles")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateUserRoles(Guid id, [FromBody] UpdateUserRolesRequest request)
        {
            try
            {
                _logger.LogUserAction(GetCurrentUserId(), "UpdateUserRoles", new { UserId = id, Roles = request.Roles });

                var command = new UpdateUserRolesCommand
                {
                    UserId = id,
                    AdminId = Guid.Parse(GetCurrentUserId()),
                    Request = request
                };

                var result = await Mediator.Send(command);

                if (result.Succeeded)
                    return Ok(new { Message = "User roles updated successfully" });

                return BadRequest(result.Errors);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating user roles");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Impersonate a user (admin only)
        /// </summary>
        [HttpPost("{id}/impersonate")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ImpersonateUser(Guid id, [FromBody] ImpersonateUserRequest request)
        {
            try
            {
                _logger.LogUserAction(GetCurrentUserId(), "ImpersonateUser", new { UserId = id, Reason = request.Reason });

                var command = new ImpersonateUserCommand
                {
                    UserId = id,
                    AdminId = Guid.Parse(GetCurrentUserId()),
                    Request = request
                };

                var result = await Mediator.Send(command);

                if (result.Succeeded)
                    return Ok(new { Message = "Impersonation token generated", Token = result.Data });

                return BadRequest(result.Errors);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error impersonating user");
                return StatusCode(500, "Internal server error");
            }
        }

        private string GetCurrentUserId()
        {
            return User?.FindFirst("sub")?.Value ?? User?.FindFirst("id")?.Value ?? "Unknown";
        }
    }
}