using Application.Features.Shared.Notifications.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Asp.Versioning;

namespace WebAPI.Controllers.Shared.Notifications
{
    [Authorize]
    [ApiVersion("4.0")]
    [Route("api/v{version:apiVersion}/shared/notifications")]
    [Tags("Shared - Notifications")]
    public class NotificationsController : BaseController
    {
        private readonly INotificationService _notificationService;

        public NotificationsController(INotificationService notificationService)
        {
            _notificationService = notificationService;
        }
        [HttpGet]
        public async Task<IActionResult> GetNotifications(
            [FromQuery] string? type = null,
            [FromQuery] string? category = null,
            [FromQuery] bool? isRead = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == Guid.Empty) return Unauthorized();

                var notifications = await _notificationService.GetUserNotificationsAsync(userId.ToString());
                
                // Apply filters
                var filteredNotifications = notifications.AsEnumerable();
                
                if (!string.IsNullOrEmpty(type))
                {
                    filteredNotifications = filteredNotifications.Where(n => 
                        ((dynamic)n).Type?.ToString().Equals(type, StringComparison.OrdinalIgnoreCase) == true);
                }
                
                if (!string.IsNullOrEmpty(category))
                {
                    filteredNotifications = filteredNotifications.Where(n => 
                        ((dynamic)n).Category?.ToString().Equals(category, StringComparison.OrdinalIgnoreCase) == true);
                }
                
                if (isRead.HasValue)
                {
                    filteredNotifications = filteredNotifications.Where(n => 
                        ((dynamic)n).IsRead == isRead.Value);
                }

                var totalCount = filteredNotifications.Count();
                var unreadCount = filteredNotifications.Count(n => !((dynamic)n).IsRead);
                
                var pagedNotifications = filteredNotifications
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToList();

                return Ok(new
                {
                    succeeded = true,
                    data = pagedNotifications,
                    totalCount = totalCount,
                    unreadCount = unreadCount,
                    page = page,
                    pageSize = pageSize,
                    totalPages = (int)Math.Ceiling((double)totalCount / pageSize)
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { succeeded = false, message = "Failed to retrieve notifications", error = ex.Message });
            }
        }
        [HttpGet("stats")]
        public async Task<IActionResult> GetNotificationStats()
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == Guid.Empty) return Unauthorized();

                var notifications = await _notificationService.GetUserNotificationsAsync(userId.ToString());
                var notificationList = notifications.ToList();

                var stats = new
                {
                    total = notificationList.Count,
                    unread = notificationList.Count(n => !((dynamic)n).IsRead),
                    byType = new
                    {
                        success = notificationList.Count(n => ((dynamic)n).Type?.ToString() == "Success"),
                        warning = notificationList.Count(n => ((dynamic)n).Type?.ToString() == "Warning"),
                        error = notificationList.Count(n => ((dynamic)n).Type?.ToString() == "Error"),
                        info = notificationList.Count(n => ((dynamic)n).Type?.ToString() == "Info")
                    },
                    byCategory = new
                    {
                        system = notificationList.Count(n => ((dynamic)n).Category?.ToString() == "System"),
                        marketplace = notificationList.Count(n => ((dynamic)n).Category?.ToString() == "Marketplace"),
                        user = notificationList.Count(n => ((dynamic)n).Category?.ToString() == "User"),
                        security = notificationList.Count(n => ((dynamic)n).Category?.ToString() == "Security")
                    },
                    recent = notificationList
                        .Where(n => !((dynamic)n).IsRead)
                        .Take(5)
                        .ToList()
                };

                return Ok(new { succeeded = true, data = stats });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { succeeded = false, message = "Failed to retrieve notification stats", error = ex.Message });
            }
        }
        [HttpPatch("{id}/read")]
        public async Task<IActionResult> MarkAsRead(string id)
        {
            try
            {
                await _notificationService.MarkAsReadAsync(id);
                return Ok(new { succeeded = true, message = "Notification marked as read" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { succeeded = false, message = "Failed to mark notification as read", error = ex.Message });
            }
        }
        [HttpPatch("mark-all-read")]
        public async Task<IActionResult> MarkAllAsRead()
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == Guid.Empty) return Unauthorized();

                await _notificationService.MarkAllAsReadAsync(userId.ToString());
                return Ok(new { succeeded = true, message = "All notifications marked as read" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { succeeded = false, message = "Failed to mark all notifications as read", error = ex.Message });
            }
        }
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateNotification([FromBody] CreateNotificationRequest request)
        {
            try
            {
                if (request.UserIds?.Any() == true)
                {
                    await _notificationService.SendBulkNotificationAsync(request.UserIds, request.Title, request.Message);
                }
                else if (!string.IsNullOrEmpty(request.UserId))
                {
                    await _notificationService.SendNotificationAsync(request.UserId, request.Title, request.Message, request.TargetUrl);
                }
                else
                {
                    return BadRequest(new { succeeded = false, message = "Either UserId or UserIds must be provided" });
                }

                return Ok(new { succeeded = true, message = "Notification sent successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { succeeded = false, message = "Failed to send notification", error = ex.Message });
            }
        }
        [HttpGet("by-type/{type}")]
        public async Task<IActionResult> GetNotificationsByType(string type, [FromQuery] int limit = 10)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == Guid.Empty) return Unauthorized();

                var notifications = await _notificationService.GetNotificationsByTypeAsync(userId.ToString(), type, limit);
                
                return Ok(new
                {
                    succeeded = true,
                    data = notifications,
                    type = type,
                    count = notifications.Count()
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { succeeded = false, message = $"Failed to retrieve {type} notifications", error = ex.Message });
            }
        }
        [HttpGet("by-category/{category}")]
        public async Task<IActionResult> GetNotificationsByCategory(string category, [FromQuery] int limit = 10)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == Guid.Empty) return Unauthorized();

                var notifications = await _notificationService.GetNotificationsByCategoryAsync(userId.ToString(), category, limit);
                
                return Ok(new
                {
                    succeeded = true,
                    data = notifications,
                    category = category,
                    count = notifications.Count()
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { succeeded = false, message = $"Failed to retrieve {category} notifications", error = ex.Message });
            }
        }
        [HttpPost("marketplace")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> SendMarketplaceNotification([FromBody] MarketplaceNotificationRequest request)
        {
            try
            {
                if (request.UserIds?.Any() == true)
                {
                    await _notificationService.SendBulkMarketplaceNotificationAsync(
                        request.UserIds, 
                        request.Title, 
                        request.Message, 
                        request.Type ?? "Info", 
                        request.Priority ?? "Medium", 
                        request.TargetUrl);
                }
                else if (!string.IsNullOrEmpty(request.UserId))
                {
                    await _notificationService.SendMarketplaceNotificationAsync(
                        request.UserId, 
                        request.Title, 
                        request.Message, 
                        request.Type ?? "Info", 
                        request.Priority ?? "Medium", 
                        request.TargetUrl, 
                        request.RelatedEntityId, 
                        request.RelatedEntityType);
                }
                else
                {
                    return BadRequest(new { succeeded = false, message = "Either UserId or UserIds must be provided" });
                }

                return Ok(new { succeeded = true, message = "Marketplace notification sent successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { succeeded = false, message = "Failed to send marketplace notification", error = ex.Message });
            }
        }
        [HttpPost("broadcast")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> SendSystemBroadcast([FromBody] SystemBroadcastRequest request)
        {
            try
            {
                await _notificationService.SendSystemBroadcastAsync(request.Title, request.Message, request.Priority ?? "Medium");
                return Ok(new { succeeded = true, message = "System broadcast sent successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { succeeded = false, message = "Failed to send system broadcast", error = ex.Message });
            }
        }
        [HttpGet("unread-count")]
        public async Task<IActionResult> GetUnreadCount()
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == Guid.Empty) return Unauthorized();

                var count = await _notificationService.GetUnreadCountAsync(userId.ToString());
                
                return Ok(new
                {
                    succeeded = true,
                    data = new { unreadCount = count }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { succeeded = false, message = "Failed to retrieve unread count", error = ex.Message });
            }
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNotification(string id)
        {
            try
            {
                await _notificationService.DeleteNotificationAsync(id);
                return Ok(new { succeeded = true, message = "Notification deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { succeeded = false, message = "Failed to delete notification", error = ex.Message });
            }
        }

        private Guid GetCurrentUserId()
        {
            var userIdClaim = User?.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? User?.FindFirst("sub")?.Value ?? User?.FindFirst("id")?.Value;
            return Guid.TryParse(userIdClaim, out var userId) ? userId : Guid.Empty;
        }
    }

    public class CreateNotificationRequest
    {
        public string? UserId { get; set; }
        public string[]? UserIds { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string? TargetUrl { get; set; }
        public string Type { get; set; } = "Info";
        public string Category { get; set; } = "System";
        public string Priority { get; set; } = "Medium";
    }

    public class MarketplaceNotificationRequest
    {
        public string? UserId { get; set; }
        public string[]? UserIds { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string? Type { get; set; } = "Info";
        public string? Priority { get; set; } = "Medium";
        public string? TargetUrl { get; set; }
        public Guid? RelatedEntityId { get; set; }
        public string? RelatedEntityType { get; set; }
    }

    public class SystemBroadcastRequest
    {
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string? Priority { get; set; } = "Medium";
    }
}


