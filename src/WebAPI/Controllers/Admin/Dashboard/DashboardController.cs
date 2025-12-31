using Application.Common.Interfaces.Data;
using Application.Common.Interfaces.AIAgent;
using Application.Common.Interfaces.Logging;
using Application.Features.Admin.Analytics.Queries;
using Domain.Enums.Community.Posts;
using System.Diagnostics;
using System.Net.Http;
using Application.Features.AIAgent.DTOs;
using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace WebAPI.Controllers.Admin.Dashboard
{
    [Authorize(Roles = "Admin")]
    [ApiVersion("3.0")]
    [Route("api/v{version:apiVersion}/admin/dashboard")]
    public class DashboardController : BaseController
    {
        private readonly IApplicationDbContext _context;
        private readonly IAIAgentService _aiService;
        private readonly IAdvancedLogger<DashboardController> _logger;

        public DashboardController(
            IApplicationDbContext context, 
            IAIAgentService aiService,
            IAdvancedLogger<DashboardController> logger)
        {
            _context = context;
            _aiService = aiService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetDashboard()
        {
            var startTime = DateTime.UtcNow;
            
            try
            {
                _logger.LogUserAction(GetCurrentUserId(), "ViewAdminDashboard");

                // Admin dashboard data with actual counts
                var dashboardData = new
                {
                    TotalUsers = await _context.Users.CountAsync(),
                    TotalPosts = await _context.Posts.CountAsync(),
                    TotalGroups = await _context.Groups.CountAsync(),
                    TotalReviews = await _context.Reviews.CountAsync(),
                    PendingApprovals = await _context.Posts.CountAsync(p => p.Status == PostStatus.UnderReview),
                    FlaggedContent = await _context.PostReports.CountAsync(r => !r.IsResolved),
                    ActiveUsers = await _context.Users.CountAsync(u => u.IsActive),
                    SystemHealth = await GetSystemHealthStatus(),
                    LastUpdated = DateTime.UtcNow,
                    QuickStats = new
                    {
                        NewUsersToday = await _context.Users.CountAsync(u => u.CreatedAt.Date == DateTime.UtcNow.Date),
                        PostsToday = await _context.Posts.CountAsync(p => p.CreatedAt.Date == DateTime.UtcNow.Date),
                        CommentsToday = await _context.Comments.CountAsync(c => c.CreatedAt.Date == DateTime.UtcNow.Date),
                        ReportsToday = await _context.PostReports.CountAsync(r => r.CreatedAt.Date == DateTime.UtcNow.Date)
                    }
                };

                var duration = DateTime.UtcNow - startTime;
                _logger.LogPerformance("GetAdminDashboard", duration);

                return Ok(dashboardData);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting admin dashboard");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("analytics")]
        public async Task<IActionResult> GetAnalytics([FromQuery] GetAdvancedAnalyticsQuery query)
        {
            try
            {
                _logger.LogUserAction(GetCurrentUserId(), "ViewAdvancedAnalytics", query);
                
                var analytics = await Mediator.Send(query);
                return Ok(analytics);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting advanced analytics");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("system-info")]
        public async Task<IActionResult> GetSystemInfo()
        {
            try
            {
                _logger.LogUserAction(GetCurrentUserId(), "ViewSystemInfo");

                var isAiHealthy = await CheckAIServiceHealth();
                var process = Process.GetCurrentProcess();
                var startTime = process.StartTime.ToUniversalTime();

                var systemInfo = new
                {
                    Version = "1.0.0",
                    Environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Development",
                    ServerTime = DateTime.UtcNow,
                    DatabaseStatus = await CheckDatabaseHealth(),
                    AIServiceStatus = isAiHealthy ? "Connected" : "Disconnected",
                    CacheStatus = "Connected", // Implement cache health check
                    Uptime = (DateTime.UtcNow - startTime).ToString(@"dd\.hh\:mm\:ss"),
                    SystemMetrics = new
                    {
                        WorkingSet = process.WorkingSet64 / (1024 * 1024), // MB
                        PrivateMemory = process.PrivateMemorySize64 / (1024 * 1024), // MB
                        ThreadCount = process.Threads.Count,
                        HandleCount = process.HandleCount
                    },
                    DatabaseMetrics = await GetDatabaseMetrics()
                };

                return Ok(systemInfo);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting system info");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("recent-activity")]
        public async Task<IActionResult> GetRecentActivity([FromQuery] int limit = 10)
        {
            try
            {
                _logger.LogUserAction(GetCurrentUserId(), "ViewRecentActivity", new { Limit = limit });

                var activities = new List<object>();

                // Recent posts
                var recentPosts = await _context.Posts
                    .OrderByDescending(p => p.CreatedAt)
                    .Take(limit / 2)
                    .Select(p => new
                    {
                        Type = "Post Created",
                        User = p.User.Email,
                        Title = p.Title,
                        Timestamp = p.CreatedAt,
                        Icon = "📝",
                        Priority = "normal"
                    })
                    .ToListAsync();

                activities.AddRange(recentPosts);

                // Recent user registrations
                var recentUsers = await _context.Users
                    .OrderByDescending(u => u.CreatedAt)
                    .Take(limit / 2)
                    .Select(u => new
                    {
                        Type = "User Registered",
                        User = u.Email,
                        Title = $"{u.FirstName} {u.LastName}",
                        Timestamp = u.CreatedAt,
                        Icon = "👤",
                        Priority = "normal"
                    })
                    .ToListAsync();

                activities.AddRange(recentUsers);

                // Recent reports (high priority)
                var recentReports = await _context.PostReports
                    .Where(r => !r.IsResolved)
                    .OrderByDescending(r => r.CreatedAt)
                    .Take(5)
                    .Select(r => new
                    {
                        Type = "Content Reported",
                        User = r.ReportedBy.Email,
                        Title = $"Report: {r.Reason}",
                        Timestamp = r.CreatedAt,
                        Icon = "⚠️",
                        Priority = "high"
                    })
                    .ToListAsync();

                activities.AddRange(recentReports);

                var sortedActivities = activities
                    .OrderByDescending(a => ((dynamic)a).Timestamp)
                    .Take(limit)
                    .ToList();

                return Ok(new { Activities = sortedActivities, TotalCount = sortedActivities.Count });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting recent activity");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("alerts")]
        public async Task<IActionResult> GetSystemAlerts()
        {
            try
            {
                _logger.LogUserAction(GetCurrentUserId(), "ViewSystemAlerts");

                var alerts = new
                {
                    Critical = await GetCriticalAlerts(),
                    Warning = await GetWarningAlerts(),
                    Info = await GetInfoAlerts()
                };

                return Ok(alerts);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting system alerts");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("performance")]
        public async Task<IActionResult> GetPerformanceMetrics()
        {
            try
            {
                _logger.LogUserAction(GetCurrentUserId(), "ViewPerformanceMetrics");

                var process = Process.GetCurrentProcess();
                var performance = new
                {
                    CpuUsage = await GetCpuUsage(),
                    MemoryUsage = new
                    {
                        WorkingSet = process.WorkingSet64 / (1024 * 1024),
                        PrivateMemory = process.PrivateMemorySize64 / (1024 * 1024),
                        GCMemory = GC.GetTotalMemory(false) / (1024 * 1024)
                    },
                    DiskUsage = await GetDiskUsage(),
                    NetworkTraffic = new { Incoming = 1250, Outgoing = 890 }, // Mock data
                    ResponseTimes = await GetResponseTimes(),
                    ErrorRate = await GetErrorRate(),
                    DatabaseMetrics = await GetDatabaseMetrics(),
                    CacheMetrics = await GetCacheMetrics()
                };

                return Ok(performance);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting performance metrics");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetUsers([FromQuery] int limit = 10, [FromQuery] int offset = 0, [FromQuery] string? search = null)
        {
            try
            {
                _logger.LogUserAction(GetCurrentUserId(), "ViewUsersList", new { Limit = limit, Offset = offset, Search = search });

                var query = _context.Users.AsQueryable();

                if (!string.IsNullOrEmpty(search))
                {
                    query = query.Where(u => u.Email.Contains(search) || 
                                           u.FirstName.Contains(search) || 
                                           u.LastName.Contains(search));
                }

                var users = await query
                    .OrderByDescending(u => u.CreatedAt)
                    .Skip(offset)
                    .Take(limit)
                    .Select(u => new
                    {
                        Id = u.Id,
                        Name = $"{u.FirstName} {u.LastName}",
                        Email = u.Email,
                        Status = u.IsActive ? "Active" : "Inactive",
                        Joined = u.CreatedAt.ToString("yyyy-MM-dd"),
                        LastLogin = u.LastLoginAt?.ToString("yyyy-MM-dd HH:mm"),
                        PostCount = u.Posts.Count(),
                        Role = "User" // Implement role system
                    })
                    .ToListAsync();

                var totalCount = await query.CountAsync();

                return Ok(new { Users = users, TotalCount = totalCount });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting users list");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("content-moderation")]
        public async Task<IActionResult> GetContentModeration([FromQuery] int limit = 10, [FromQuery] int offset = 0)
        {
            try
            {
                _logger.LogUserAction(GetCurrentUserId(), "ViewContentModeration", new { Limit = limit, Offset = offset });

                var pendingPosts = await _context.Posts
                    .Where(p => p.Status == PostStatus.UnderReview)
                    .OrderByDescending(p => p.CreatedAt)
                    .Skip(offset)
                    .Take(limit)
                    .Select(p => new
                    {
                        Id = p.Id,
                        Title = p.Title,
                        Author = $"{p.User.FirstName} {p.User.LastName}",
                        AuthorEmail = p.User.Email,
                        CreatedAt = p.CreatedAt,
                        Status = p.Status.ToString(),
                        ReportCount = p.Reports.Count(),
                        Type = "Post"
                    })
                    .ToListAsync();

                var flaggedReports = await _context.PostReports
                    .Where(r => !r.IsResolved)
                    .OrderByDescending(r => r.CreatedAt)
                    .Skip(offset)
                    .Take(limit)
                    .Select(r => new
                    {
                        Id = r.Id,
                        Title = $"Report: {r.Reason}",
                        Author = $"{r.ReportedBy.FirstName} {r.ReportedBy.LastName}",
                        AuthorEmail = r.ReportedBy.Email,
                        CreatedAt = r.CreatedAt,
                        Status = "Pending",
                        ReportCount = 1,
                        Type = "Report",
                        PostTitle = r.Post.Title
                    })
                    .ToListAsync();

                var totalPending = await _context.Posts.CountAsync(p => p.Status == PostStatus.UnderReview);
                var totalReports = await _context.PostReports.CountAsync(r => !r.IsResolved);

                return Ok(new 
                { 
                    PendingPosts = pendingPosts,
                    FlaggedReports = flaggedReports,
                    TotalPending = totalPending,
                    TotalReports = totalReports
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting content moderation data");
                return StatusCode(500, "Internal server error");
            }
        }

        // Helper methods
        private async Task<string> GetSystemHealthStatus()
        {
            try
            {
                var dbHealthy = await CheckDatabaseHealth() == "Connected";
                var aiHealthy = await CheckAIServiceHealth();
                
                if (dbHealthy && aiHealthy) return "Excellent";
                if (dbHealthy) return "Good";
                return "Warning";
            }
            catch
            {
                return "Critical";
            }
        }

        private async Task<bool> CheckAIServiceHealth()
        {
            try
            {
                var response = await _aiService.ChatAsync(new ChatRequestDTO { Message = "Health Check" });
                return !string.IsNullOrEmpty(response.Message);
            }
            catch
            {
                return false;
            }
        }

        private async Task<string> CheckDatabaseHealth()
        {
            try
            {
                await _context.Users.CountAsync();
                return "Connected";
            }
            catch
            {
                return "Disconnected";
            }
        }

        private async Task<List<object>> GetCriticalAlerts()
        {
            var alerts = new List<object>();
            
            // Check for unresolved reports older than 24 hours
            var oldReports = await _context.PostReports
                .Where(r => !r.IsResolved && r.CreatedAt < DateTime.UtcNow.AddHours(-24))
                .CountAsync();
            
            if (oldReports > 0)
            {
                alerts.Add(new 
                { 
                    Message = $"{oldReports} unresolved reports older than 24 hours", 
                    Timestamp = DateTime.UtcNow,
                    Type = "ContentModeration"
                });
            }

            return alerts;
        }

        private async Task<List<object>> GetWarningAlerts()
        {
            var alerts = new List<object>
            {
                new { Message = "High memory usage detected", Timestamp = DateTime.UtcNow.AddMinutes(-30), Type = "Performance" }
            };

            // Check for pending posts
            var pendingPosts = await _context.Posts.CountAsync(p => p.Status == PostStatus.UnderReview);
            if (pendingPosts > 10)
            {
                alerts.Add(new 
                { 
                    Message = $"{pendingPosts} posts pending approval", 
                    Timestamp = DateTime.UtcNow,
                    Type = "ContentModeration"
                });
            }

            return alerts;
        }

        private async Task<List<object>> GetInfoAlerts()
        {
            return new List<object>
            {
                new { Message = "Daily backup completed successfully", Timestamp = DateTime.UtcNow.AddHours(-2), Type = "System" },
                new { Message = "Cache optimization completed", Timestamp = DateTime.UtcNow.AddHours(-1), Type = "Performance" }
            };
        }

        private async Task<double> GetCpuUsage()
        {
            // Mock CPU usage - implement actual CPU monitoring
            return Random.Shared.NextDouble() * 100;
        }

        private async Task<object> GetDiskUsage()
        {
            // Mock disk usage - implement actual disk monitoring
            return new { Used = 34.1, Available = 65.9, Total = 100.0 };
        }

        private async Task<object> GetResponseTimes()
        {
            // Mock response times - implement actual response time monitoring
            return new { Average = 120, P95 = 250, P99 = 450 };
        }

        private async Task<double> GetErrorRate()
        {
            // Mock error rate - implement actual error rate monitoring
            return 0.02;
        }

        private async Task<object> GetDatabaseMetrics()
        {
            try
            {
                var userCount = await _context.Users.CountAsync();
                var postCount = await _context.Posts.CountAsync();
                
                return new
                {
                    TotalTables = 15, // Mock data
                    TotalRecords = userCount + postCount,
                    DatabaseSize = "125 MB", // Mock data
                    ConnectionCount = 5 // Mock data
                };
            }
            catch
            {
                return new { Error = "Unable to retrieve database metrics" };
            }
        }

        private async Task<object> GetCacheMetrics()
        {
            // Mock cache metrics - implement actual cache monitoring
            return new
            {
                HitRate = 85.5,
                MissRate = 14.5,
                TotalKeys = 1250,
                MemoryUsage = "45 MB"
            };
        }

        private string GetCurrentUserId()
        {
            return User?.FindFirst("sub")?.Value ?? User?.FindFirst("id")?.Value ?? "Unknown";
        }
    }
}