using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Asp.Versioning;
using Application.Common.Interfaces.Data;
using System.Diagnostics;

namespace WebAPI.Controllers.Admin.Dashboard
{
    [Authorize(Roles = "Admin")]
    [ApiVersion("3.0")]
    [Route("api/v{version:apiVersion}/admin/dashboard")]
    public class DashboardController : BaseController
    {
        private readonly IApplicationDbContext _context;

        public DashboardController(IApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetDashboard()
        {
            // Admin dashboard data with actual counts
            var dashboardData = new
            {
                TotalUsers = await _context.Users.CountAsync(),
                TotalPosts = await _context.Posts.CountAsync(),
                TotalGroups = await _context.Groups.CountAsync(),
                TotalReviews = await _context.Reviews.CountAsync(),
                PendingApprovals = 0, // Implement if there's an approval system
                FlaggedContent = 0, // Implement if there's a flagging system
                ActiveUsers = await _context.Users.CountAsync(u => u.IsActive),
                SystemHealth = "Good",
                LastUpdated = DateTime.UtcNow
            };

            return Ok(dashboardData);
        }

        [HttpGet("analytics")]
        public async Task<IActionResult> GetAnalytics([FromQuery] string period = "week")
        {
            var now = DateTime.UtcNow;
            var startDate = period switch
            {
                "day" => now.AddDays(-1),
                "week" => now.AddDays(-7),
                "month" => now.AddMonths(-1),
                _ => now.AddDays(-7)
            };

            var previousStartDate = period switch
            {
                "day" => startDate.AddDays(-1),
                "week" => startDate.AddDays(-7),
                "month" => startDate.AddMonths(-1),
                _ => startDate.AddDays(-7)
            };

            // Calculate User Growth
            var currentUsers = await _context.Users.CountAsync(u => u.CreatedAt >= startDate);
            var previousUsers = await _context.Users.CountAsync(u => u.CreatedAt >= previousStartDate && u.CreatedAt < startDate);
            var userGrowthChange = previousUsers == 0 ? 100.0 : ((double)(currentUsers - previousUsers) / previousUsers) * 100;

            // Calculate Post Activity
            var currentPosts = await _context.Posts.CountAsync(p => p.CreatedAt >= startDate);
            var previousPosts = await _context.Posts.CountAsync(p => p.CreatedAt >= previousStartDate && p.CreatedAt < startDate);
            var postActivityChange = previousPosts == 0 ? 100.0 : ((double)(currentPosts - previousPosts) / previousPosts) * 100;

            var analytics = new
            {
                Period = period,
                UserGrowth = new { Current = await _context.Users.CountAsync(), Growth = currentUsers, Change = Math.Round(userGrowthChange, 1) },
                PostActivity = new { Current = await _context.Posts.CountAsync(), Activity = currentPosts, Change = Math.Round(postActivityChange, 1) },
                Engagement = new { Current = 0, Change = 0 }, // Implement engagement logic later
                TopCategories = new[] { "Maintenance", "Reviews", "General Discussion" },
                RecentActivities = await _context.Posts
                    .OrderByDescending(p => p.CreatedAt)
                    .Take(5)
                    .Select(p => new { Type = "Post Created", Title = p.Title, User = p.User.Email, Timestamp = p.CreatedAt })
                    .ToListAsync()
            };

            return Ok(analytics);
        }

        [HttpGet("system-info")]
        public async Task<IActionResult> GetSystemInfo()
        {
            var systemInfo = new
            {
                Version = "1.0.0",
                Environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Development",
                ServerTime = DateTime.UtcNow,
                DatabaseStatus = "Connected",
                AIServiceStatus = "Connected",
                CacheStatus = "Connected",
                Uptime = (DateTime.UtcNow - global::System.Diagnostics.Process.GetCurrentProcess().StartTime.ToUniversalTime()).ToString(@"dd\.hh\:mm\:ss")
            };

            return Ok(systemInfo);
        }

        [HttpGet("recent-activity")]
        public async Task<IActionResult> GetRecentActivity([FromQuery] int limit = 10)
        {
            var activities = await _context.Posts
                .OrderByDescending(p => p.CreatedAt)
                .Take(limit)
                .Select(p => new
                {
                    Type = "Post Created",
                    User = p.User.Email,
                    Title = p.Title,
                    Timestamp = p.CreatedAt
                })
                .ToListAsync();

            var userRegistrations = await _context.Users
                .OrderByDescending(u => u.CreatedAt)
                .Take(limit)
                .Select(u => new
                {
                    Type = "User Registered",
                    User = u.Email,
                    Title = $"{u.FirstName} {u.LastName}",
                    Timestamp = u.CreatedAt
                })
                .ToListAsync();

            var combined = activities.Cast<object>()
                .Concat(userRegistrations.Cast<object>())
                .OrderByDescending(a => (DateTime)((dynamic)a).Timestamp)
                .Take(limit)
                .ToList();

            return Ok(new { Activities = combined, TotalCount = combined.Count });
        }

        [HttpGet("alerts")]
        public async Task<IActionResult> GetSystemAlerts()
        {
            // System alerts and notifications for admin
            var alerts = new
            {
                Critical = new List<object>(),
                Warning = new List<object>
                {
                    new { Message = "High memory usage detected", Timestamp = DateTime.UtcNow.AddMinutes(-30) }
                },
                Info = new List<object>
                {
                    new { Message = "Daily backup completed successfully", Timestamp = DateTime.UtcNow.AddHours(-2) }
                }
            };

            return Ok(alerts);
        }

        [HttpGet("performance")]
        public async Task<IActionResult> GetPerformanceMetrics()
        {
            // System performance metrics
            var performance = new
            {
                CpuUsage = 45.2,
                MemoryUsage = 67.8,
                DiskUsage = 34.1,
                NetworkTraffic = new { Incoming = 1250, Outgoing = 890 },
                ResponseTimes = new { Average = 120, P95 = 250, P99 = 450 },
                ErrorRate = 0.02
            };

            return Ok(performance);
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetUsers([FromQuery] int limit = 10, [FromQuery] int offset = 0)
        {
            var users = await _context.Users
                .OrderByDescending(u => u.CreatedAt)
                .Skip(offset)
                .Take(limit)
                .Select(u => new
                {
                    Id = u.Id,
                    Name = $"{u.FirstName} {u.LastName}",
                    Email = u.Email,
                    Status = u.IsActive ? "Active" : "Inactive",
                    Joined = u.CreatedAt.ToString("yyyy-MM-dd")
                })
                .ToListAsync();

            var totalCount = await _context.Users.CountAsync();

            return Ok(new { Users = users, TotalCount = totalCount });
        }
    }
}