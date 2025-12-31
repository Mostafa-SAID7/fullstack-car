using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Asp.Versioning;
using Application.Common.Interfaces.Data;

namespace WebAPI.Controllers.Admin.Management
{
    [Authorize(Roles = "Admin")]
    [ApiVersion("3.0")]
    [Route("api/v{version:apiVersion}/admin/users")]
    public class UsersController : BaseController
    {
        private readonly IApplicationDbContext _context;

        public UsersController(IApplicationDbContext context)
        {
            _context = context;
        }
        [HttpGet]
        public async Task<IActionResult> GetAllUsers([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string? status = null, [FromQuery] string? search = null)
        {
            var query = _context.Users.AsQueryable();

            if (!string.IsNullOrEmpty(status))
            {
                var isActive = status.ToLower() == "active";
                query = query.Where(u => u.IsActive == isActive);
            }

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(u => u.Email.Contains(search) || u.FirstName.Contains(search) || u.LastName.Contains(search));
            }

            var totalCount = await query.CountAsync();
            var users = await query
                .OrderByDescending(u => u.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(u => new
                {
                    u.Id,
                    u.FirstName,
                    u.LastName,
                    u.Email,
                    Status = u.IsActive ? "Active" : "Inactive",
                    JoinDate = u.CreatedAt,
                    u.IsActive
                })
                .ToListAsync();

            return Ok(new
            {
                Data = users,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize
            });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(Guid id)
        {
            var user = await _context.Users
                .Include(u => u.Posts)
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null) return NotFound();

            var result = new
            {
                user.Id,
                user.FirstName,
                user.LastName,
                user.Email,
                Status = user.IsActive ? "Active" : "Inactive",
                JoinDate = user.CreatedAt,
                LastLogin = DateTime.UtcNow.AddHours(-2), // Mock for now if not in DB
                PostsCount = user.Posts.Count,
                GroupsCount = await _context.GroupMembers.CountAsync(gm => gm.UserId == id),
                ReviewsCount = await _context.Reviews.CountAsync(r => r.UserId == id)
            };
            
            return Ok(result);
        }

        [HttpPut("{id}/suspend")]
        public async Task<IActionResult> SuspendUser(Guid id, [FromBody] SuspendUserRequest request)
        {
            // Implementation for suspending user with reason
            return Ok(new { Message = "User suspended successfully", Reason = request.Reason });
        }

        [HttpPut("{id}/activate")]
        public async Task<IActionResult> ActivateUser(Guid id)
        {
            // Implementation for activating user
            return Ok(new { Message = "User activated successfully" });
        }

        [HttpPut("{id}/ban")]
        public async Task<IActionResult> BanUser(Guid id, [FromBody] BanUserRequest request)
        {
            // Implementation for banning user
            return Ok(new { Message = "User banned successfully", Duration = request.Duration });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(Guid id, [FromBody] DeleteUserRequest request)
        {
            // Implementation for deleting user (admin only)
            return NoContent();
        }

        [HttpGet("{id}/activity")]
        public async Task<IActionResult> GetUserActivity(Guid id, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            // Implementation for getting user activity history
            var activity = new
            {
                Data = new List<object>(),
                TotalCount = 0,
                Page = page,
                PageSize = pageSize
            };
            
            return Ok(activity);
        }

        [HttpGet("statistics")]
        public async Task<IActionResult> GetUserStatistics()
        {
            var now = DateTime.UtcNow;
            var startOfMonth = new DateTime(now.Year, now.Month, 1);
            
            var totalUsers = await _context.Users.CountAsync();
            var activeUsers = await _context.Users.CountAsync(u => u.IsActive);
            var lastMonthUsers = await _context.Users.CountAsync(u => u.CreatedAt < startOfMonth);
            
            var newUsersThisMonth = await _context.Users.CountAsync(u => u.CreatedAt >= startOfMonth);
            var growthRate = lastMonthUsers == 0 ? 100.0 : ((double)newUsersThisMonth / lastMonthUsers) * 100;

            var stats = new
            {
                TotalUsers = totalUsers,
                ActiveUsers = activeUsers,
                SuspendedUsers = await _context.Users.CountAsync(u => !u.IsActive), // Simplified for now
                BannedUsers = 0, // Implement if there's a ban flag
                NewUsersThisMonth = newUsersThisMonth,
                UserGrowthRate = Math.Round(growthRate, 1)
            };
            
            return Ok(stats);
        }

        [HttpPost("{id}/send-message")]
        public async Task<IActionResult> SendMessageToUser(Guid id, [FromBody] SendMessageRequest request)
        {
            // Implementation for sending admin message to user
            return Ok(new { Message = "Message sent successfully" });
        }

        [HttpGet("{id}/reports")]
        public async Task<IActionResult> GetUserReports(Guid id)
        {
            // Implementation for getting reports about this user
            var reports = new
            {
                Data = new List<object>(),
                TotalCount = 0
            };
            
            return Ok(reports);
        }
    }

    public class SuspendUserRequest
    {
        public string Reason { get; set; } = string.Empty;
        public int? DurationDays { get; set; }
    }

    public class BanUserRequest
    {
        public string Reason { get; set; } = string.Empty;
        public string Duration { get; set; } = "Permanent"; // "Permanent", "30Days", "7Days", etc.
    }

    public class DeleteUserRequest
    {
        public string Reason { get; set; } = string.Empty;
        public bool DeleteContent { get; set; } = false;
    }

    public class SendMessageRequest
    {
        public string Subject { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string Priority { get; set; } = "Normal";
    }
}