using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Application.Features.Identity.Core.Interfaces;
using Application.Features.Community.Events.Commands;
using Application.Features.Community.Events.DTOs;
using Application.Features.Community.Events.Queries;
using Application.Common.DTOs;
using Application.Features.Shared.Localization.Interfaces;
using Application.Features.Shared.Notifications.Interfaces;
using Asp.Versioning;

namespace WebAPI.Controllers.Community.Events
{
    [Authorize]
    [ApiVersion("2.0")]
    [Route("api/v{version:apiVersion}/events/{eventId}/comments")]
    public class EventCommentsController : BaseController
    {
        private readonly ICurrentUserService _currentUserService;
        private readonly ILocalizationProvider _localizationProvider;
        private readonly INotificationService _notificationService;

        public EventCommentsController(
            ICurrentUserService currentUserService,
            ILocalizationProvider localizationProvider,
            INotificationService notificationService)
        {
            _currentUserService = currentUserService;
            _localizationProvider = localizationProvider;
            _notificationService = notificationService;
        }

        [HttpGet]
        [AllowAnonymous]
        [OutputCache(Duration = 180, Tags = new[] { "Events", "Comments" })]
        public async Task<IActionResult> GetEventComments(
            Guid eventId,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20,
            [FromQuery] string? sortBy = "CreatedAt",
            [FromQuery] bool sortDescending = true,
            [FromQuery] bool includeReplies = true)
        {
            var query = new GetEventCommentsQuery
            {
                EventId = eventId,
                PageNumber = page,
                PageSize = pageSize,
                SortBy = sortBy,
                SortDescending = sortDescending,
                IncludeReplies = includeReplies
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Event comments retrieved successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Event not found");

            return BadRequest("Failed to retrieve event comments", result.Errors);
        }

        [HttpGet("{commentId}")]
        [AllowAnonymous]
        [OutputCache(Duration = 300, Tags = new[] { "Events", "Comments" })]
        public async Task<IActionResult> GetComment(Guid eventId, Guid commentId)
        {
            var query = new GetEventCommentByIdQuery
            {
                EventId = eventId,
                CommentId = commentId,
                IncludeReplies = true
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Comment retrieved successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Comment not found");

            return BadRequest("Failed to retrieve comment", result.Errors);
        }

        [HttpPost]
        public async Task<IActionResult> CreateComment(Guid eventId, [FromBody] CreateEventCommentRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new CreateEventCommentCommand
            {
                EventId = eventId,
                UserId = userGuid,
                Request = request
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
            {
                var location = Url.Action(nameof(GetComment), new { eventId, commentId = result.Data.Id });
                return Created(result.Data, location!, "Comment created successfully");
            }

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Event not found");

            if (result.Errors.Any(e => e.Contains("inactive")))
                return BadRequest("Cannot comment on inactive events", result.Errors);

            return BadRequest("Failed to create comment", result.Errors);
        }

        [HttpPut("{commentId}")]
        public async Task<IActionResult> UpdateComment(Guid eventId, Guid commentId, [FromBody] UpdateEventCommentRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new UpdateEventCommentCommand
            {
                CommentId = commentId,
                UserId = userGuid,
                Request = request
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success(result.Data, "Comment updated successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Comment not found");

            if (result.Errors.Any(e => e.Contains("permission")))
                return Forbid("You can only edit your own comments");

            if (result.Errors.Any(e => e.Contains("deleted")))
                return BadRequest("Cannot edit deleted comments", result.Errors);

            return BadRequest("Failed to update comment", result.Errors);
        }

        [HttpDelete("{commentId}")]
        public async Task<IActionResult> DeleteComment(Guid eventId, Guid commentId)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new DeleteEventCommentCommand
            {
                CommentId = commentId,
                UserId = userGuid
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success(result.Data, "Comment deleted successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Comment not found");

            if (result.Errors.Any(e => e.Contains("permission")))
                return Forbid("You can only delete your own comments");

            return BadRequest("Failed to delete comment", result.Errors);
        }

        [HttpPost("{commentId}/like")]
        public async Task<IActionResult> LikeComment(Guid eventId, Guid commentId)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new LikeEventCommentCommand
            {
                CommentId = commentId,
                UserId = userGuid
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success(result.Data, "Comment liked successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Comment not found");

            if (result.Errors.Any(e => e.Contains("already liked")))
                return BadRequest("You have already liked this comment", result.Errors);

            return BadRequest("Failed to like comment", result.Errors);
        }

        [HttpDelete("{commentId}/like")]
        public async Task<IActionResult> UnlikeComment(Guid eventId, Guid commentId)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new UnlikeEventCommentCommand
            {
                CommentId = commentId,
                UserId = userGuid
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success(result.Data, "Comment unliked successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Comment not found");

            if (result.Errors.Any(e => e.Contains("not liked")))
                return BadRequest("You have not liked this comment", result.Errors);

            return BadRequest("Failed to unlike comment", result.Errors);
        }

        [HttpGet("{commentId}/replies")]
        [AllowAnonymous]
        [OutputCache(Duration = 180, Tags = new[] { "Events", "Comments", "Replies" })]
        public async Task<IActionResult> GetCommentReplies(
            Guid eventId,
            Guid commentId,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? sortBy = "CreatedAt",
            [FromQuery] bool sortDescending = false)
        {
            var query = new GetEventCommentRepliesQuery
            {
                EventId = eventId,
                ParentCommentId = commentId,
                PageNumber = page,
                PageSize = pageSize,
                SortBy = sortBy,
                SortDescending = sortDescending
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Comment replies retrieved successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Comment not found");

            return BadRequest("Failed to retrieve comment replies", result.Errors);
        }

        [HttpPost("{commentId}/replies")]
        public async Task<IActionResult> ReplyToComment(Guid eventId, Guid commentId, [FromBody] CreateEventCommentRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            // Set the parent comment ID for the reply
            request.ParentCommentId = commentId;

            var command = new CreateEventCommentCommand
            {
                EventId = eventId,
                UserId = userGuid,
                Request = request
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
            {
                var location = Url.Action(nameof(GetComment), new { eventId, commentId = result.Data.Id });
                return Created(result.Data, location!, "Reply created successfully");
            }

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Event or parent comment not found");

            if (result.Errors.Any(e => e.Contains("inactive")))
                return BadRequest("Cannot reply to comments on inactive events", result.Errors);

            return BadRequest("Failed to create reply", result.Errors);
        }

        [HttpGet("stats")]
        [AllowAnonymous]
        [OutputCache(Duration = 300, Tags = new[] { "Events", "Comments", "Stats" })]
        public async Task<IActionResult> GetCommentStats(Guid eventId)
        {
            var query = new GetEventCommentStatsQuery
            {
                EventId = eventId
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Comment statistics retrieved successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Event not found");

            return BadRequest("Failed to retrieve comment statistics", result.Errors);
        }

        [HttpPost("moderate")]
        public async Task<IActionResult> ModerateComments(Guid eventId, [FromBody] ModerateCommentsRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new ModerateEventCommentsCommand
            {
                EventId = eventId,
                CommentIds = request.CommentIds,
                Action = request.Action,
                Reason = request.Reason,
                ModeratedBy = userGuid
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success(result.Data, $"Successfully {request.Action.ToLower()}ed {result.Data.ProcessedCount} comments");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Event not found");

            if (result.Errors.Any(e => e.Contains("permission")))
                return Forbid("You don't have permission to moderate comments for this event");

            return BadRequest("Failed to moderate comments", result.Errors);
        }
    }

    // Request DTOs
    public class ModerateCommentsRequest
    {
        public List<Guid> CommentIds { get; set; } = new();
        public string Action { get; set; } = string.Empty; // Delete, Hide, Approve
        public string? Reason { get; set; }
    }
}