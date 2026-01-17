using Application.Features.Shared.Notifications.Interfaces;
using Application.Features.Identity.Core.Interfaces;
using Application.Common.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Asp.Versioning;
using Domain.Entities.Shared.Notifications;

namespace WebAPI.Controllers.Shared
{
    /// <summary>
    /// Controller for managing user notifications
    /// </summary>
    [Authorize]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/notifications")]
    public class NotificationController : BaseController
    {
        private readonly INotificationService _notificationService;
        private readonly ICurrentUserService _currentUserService;
        private readonly ILogger<NotificationController> _logger;

        public NotificationController(
            INotificationService notificationService,
            ICurrentUserService currentUserService,
            ILogger<NotificationController> logger)
        {
            _notificationService = notificationService;
            _currentUserService = currentUserService;
            _logger = logger;
        }

        /// <summary>
        /// Get paginated notifications for the current user
        /// </summary>
        /// <param name="page">Page number (default: 1)</param>
        /// <param name="pageSize">Page size (default: 20)</param>
        /// <param name="type">Filter by notification type</param>
        /// <param name="category">Filter by notification category</param>
        /// <param name="isRead">Filter by read status</param>
        [HttpGet]
        public async Task<IActionResult> GetNotifications(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20,
            [FromQuery] string? type = null,
            [FromQuery] string? category = null,
            [FromQuery] bool? isRead = null)
        {
            try
            {
                var userId = _currentUserService.UserId;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized("User not authenticated");
                }

                var allNotifications = await _notificationService.GetUserNotificationsAsync(userId);
                var notificationsList = allNotifications.ToList();

                // Apply filters
                if (!string.IsNullOrEmpty(type))
                {
                    notificationsList = notificationsList
                        .Where(n => ((dynamic)n).type?.ToString()?.Equals(type, StringComparison.OrdinalIgnoreCase) == true)
                        .ToList();
                }

                if (!string.IsNullOrEmpty(category))
                {
                    notificationsList = notificationsList
                        .Where(n => ((dynamic)n).category?.ToString()?.Equals(category, StringComparison.OrdinalIgnoreCase) == true)
                        .ToList();
                }

                if (isRead.HasValue)
                {
                    notificationsList = notificationsList
                        .Where(n => ((dynamic)n).read == isRead.Value)
                        .ToList();
                }

                // Calculate pagination
                var totalCount = notificationsList.Count;
                var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);
                var skip = (page - 1) * pageSize;
                var paginatedNotifications = notificationsList.Skip(skip).Take(pageSize).ToList();

                var response = new
                {
                    notifications = paginatedNotifications,
                    totalCount,
                    unreadCount = notificationsList.Count(n => !((dynamic)n).read),
                    page,
                    pageSize,
                    totalPages
                };

                return Success(response, "Notifications retrieved successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving notifications");
                return InternalServerError("Failed to retrieve notifications");
            }
        }

        /// <summary>
        /// Get a single notification by ID
        /// </summary>
        /// <param name="id">Notification ID</param>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetNotification(Guid id)
        {
            try
            {
                var userId = _currentUserService.UserId;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized("User not authenticated");
                }

                var notifications = await _notificationService.GetUserNotificationsAsync(userId);
                var notification = notifications.FirstOrDefault(n => ((dynamic)n).id == id.ToString());

                if (notification == null)
                {
                    return NotFound("Notification not found");
                }

                return Success(notification, "Notification retrieved successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving notification {NotificationId}", id);
                return InternalServerError("Failed to retrieve notification");
            }
        }

        /// <summary>
        /// Create a new notification (admin only)
        /// </summary>
        /// <param name="request">Notification creation request</param>
        [HttpPost]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<IActionResult> CreateNotification([FromBody] CreateNotificationRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var errors = ModelState.SelectMany(x => x.Value.Errors).Select(x => x.ErrorMessage).ToList();
                    return BadRequest("Invalid notification data", errors);
                }

                // Send to single user or multiple users
                if (!string.IsNullOrEmpty(request.UserId))
                {
                    await _notificationService.SendNotificationAsync(
                        request.UserId,
                        request.Title,
                        request.Message,
                        request.TargetUrl,
                        request.SourceUserId);
                }
                else if (request.UserIds != null && request.UserIds.Any())
                {
                    await _notificationService.SendBulkNotificationAsync(
                        request.UserIds,
                        request.Title,
                        request.Message);
                }
                else
                {
                    return BadRequest("Either UserId or UserIds must be provided");
                }

                return Success("Notification created successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating notification");
                return InternalServerError("Failed to create notification");
            }
        }

        /// <summary>
        /// Mark a notification as read
        /// </summary>
        /// <param name="id">Notification ID</param>
        [HttpPut("{id}/read")]
        public async Task<IActionResult> MarkAsRead(Guid id)
        {
            try
            {
                var userId = _currentUserService.UserId;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized("User not authenticated");
                }

                // Verify notification belongs to user
                var notifications = await _notificationService.GetUserNotificationsAsync(userId);
                var notification = notifications.FirstOrDefault(n => ((dynamic)n).id == id.ToString());

                if (notification == null)
                {
                    return NotFound("Notification not found");
                }

                await _notificationService.MarkAsReadAsync(id.ToString());
                return Success("Notification marked as read");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error marking notification as read {NotificationId}", id);
                return InternalServerError("Failed to mark notification as read");
            }
        }

        /// <summary>
        /// Mark all notifications as read for the current user
        /// </summary>
        [HttpPut("read-all")]
        public async Task<IActionResult> MarkAllAsRead()
        {
            try
            {
                var userId = _currentUserService.UserId;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized("User not authenticated");
                }

                await _notificationService.MarkAllAsReadAsync(userId);
                return Success("All notifications marked as read");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error marking all notifications as read");
                return InternalServerError("Failed to mark all notifications as read");
            }
        }

        /// <summary>
        /// Delete a notification
        /// </summary>
        /// <param name="id">Notification ID</param>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNotification(Guid id)
        {
            try
            {
                var userId = _currentUserService.UserId;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized("User not authenticated");
                }

                // Verify notification belongs to user
                var notifications = await _notificationService.GetUserNotificationsAsync(userId);
                var notification = notifications.FirstOrDefault(n => ((dynamic)n).id == id.ToString());

                if (notification == null)
                {
                    return NotFound("Notification not found");
                }

                await _notificationService.DeleteNotificationAsync(id.ToString());
                return Success("Notification deleted successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting notification {NotificationId}", id);
                return InternalServerError("Failed to delete notification");
            }
        }

        /// <summary>
        /// Get unread notification count for the current user
        /// </summary>
        [HttpGet("unread-count")]
        public async Task<IActionResult> GetUnreadCount()
        {
            try
            {
                var userId = _currentUserService.UserId;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized("User not authenticated");
                }

                var count = await _notificationService.GetUnreadCountAsync(userId);
                return Success(new { count }, "Unread count retrieved successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving unread count");
                return InternalServerError("Failed to retrieve unread count");
            }
        }

        /// <summary>
        /// Get notification statistics for the current user
        /// </summary>
        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            try
            {
                var userId = _currentUserService.UserId;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized("User not authenticated");
                }

                var notifications = await _notificationService.GetUserNotificationsAsync(userId);
                var notificationsList = notifications.ToList();

                var stats = new
                {
                    total = notificationsList.Count,
                    unread = notificationsList.Count(n => !((dynamic)n).read),
                    byType = notificationsList
                        .GroupBy(n => ((dynamic)n).type?.ToString() ?? "unknown")
                        .ToDictionary(g => g.Key, g => g.Count()),
                    byCategory = notificationsList
                        .GroupBy(n => ((dynamic)n).category?.ToString() ?? "unknown")
                        .ToDictionary(g => g.Key, g => g.Count()),
                    byPriority = notificationsList
                        .GroupBy(n => ((dynamic)n).priority?.ToString() ?? "medium")
                        .ToDictionary(g => g.Key, g => g.Count())
                };

                return Success(stats, "Notification stats retrieved successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving notification stats");
                return InternalServerError("Failed to retrieve notification stats");
            }
        }
    }

    /// <summary>
    /// Request model for creating notifications
    /// </summary>
    public class CreateNotificationRequest
    {
        public string? UserId { get; set; }
        public List<string>? UserIds { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string? TargetUrl { get; set; }
        public Guid? SourceUserId { get; set; }
    }
}
