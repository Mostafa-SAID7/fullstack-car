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
    [Route("api/v{version:apiVersion}/events/{eventId}/invitations")]
    public class EventInvitationsController : BaseController
    {
        private readonly ICurrentUserService _currentUserService;
        private readonly ILocalizationProvider _localizationProvider;
        private readonly INotificationService _notificationService;

        public EventInvitationsController(
            ICurrentUserService currentUserService,
            ILocalizationProvider localizationProvider,
            INotificationService notificationService)
        {
            _currentUserService = currentUserService;
            _localizationProvider = localizationProvider;
            _notificationService = notificationService;
        }

        [HttpGet]
        [OutputCache(Duration = 180, Tags = new[] { "Events", "Invitations" })]
        public async Task<IActionResult> GetEventInvitations(
            Guid eventId,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20,
            [FromQuery] string? status = null,
            [FromQuery] string? sortBy = "InvitedAt",
            [FromQuery] bool sortDescending = true)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var query = new GetEventInvitationsQuery
            {
                EventId = eventId,
                UserId = userGuid,
                PageNumber = page,
                PageSize = pageSize,
                Status = status,
                SortBy = sortBy,
                SortDescending = sortDescending
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Event invitations retrieved successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Event not found");

            if (result.Errors.Any(e => e.Contains("permission")))
                return Forbid("You don't have permission to view invitations for this event");

            return BadRequest("Failed to retrieve event invitations", result.Errors);
        }

        [HttpGet("{invitationId}")]
        [OutputCache(Duration = 300, Tags = new[] { "Events", "Invitations" })]
        public async Task<IActionResult> GetInvitation(Guid eventId, Guid invitationId)
        {
            var query = new GetEventInvitationByIdQuery
            {
                EventId = eventId,
                InvitationId = invitationId
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Invitation retrieved successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Invitation not found");

            return BadRequest("Failed to retrieve invitation", result.Errors);
        }

        [HttpPost]
        public async Task<IActionResult> SendInvitations(Guid eventId, [FromBody] InviteToEventRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new InviteToEventCommand
            {
                EventId = eventId,
                InvitedBy = userGuid,
                Request = request
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success(result.Data, $"Successfully sent {result.Data.Count} invitations");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Event not found");

            if (result.Errors.Any(e => e.Contains("permission")))
                return Forbid("You don't have permission to invite people to this event");

            return BadRequest("Failed to send invitations", result.Errors);
        }

        [HttpPost("{invitationId}/accept")]
        [AllowAnonymous]
        public async Task<IActionResult> AcceptInvitation(Guid eventId, Guid invitationId)
        {
            var command = new AcceptEventInvitationCommand
            {
                EventId = eventId,
                InvitationId = invitationId
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success(result.Data, "Invitation accepted successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Invitation not found");

            if (result.Errors.Any(e => e.Contains("expired")))
                return BadRequest("Invitation has expired", result.Errors);

            if (result.Errors.Any(e => e.Contains("already responded")))
                return BadRequest("You have already responded to this invitation", result.Errors);

            return BadRequest("Failed to accept invitation", result.Errors);
        }

        [HttpPost("{invitationId}/decline")]
        [AllowAnonymous]
        public async Task<IActionResult> DeclineInvitation(Guid eventId, Guid invitationId)
        {
            var command = new DeclineEventInvitationCommand
            {
                EventId = eventId,
                InvitationId = invitationId
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success(result.Data, "Invitation declined successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Invitation not found");

            if (result.Errors.Any(e => e.Contains("expired")))
                return BadRequest("Invitation has expired", result.Errors);

            if (result.Errors.Any(e => e.Contains("already responded")))
                return BadRequest("You have already responded to this invitation", result.Errors);

            return BadRequest("Failed to decline invitation", result.Errors);
        }

        [HttpDelete("{invitationId}")]
        public async Task<IActionResult> CancelInvitation(Guid eventId, Guid invitationId)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new CancelEventInvitationCommand
            {
                EventId = eventId,
                InvitationId = invitationId,
                CancelledBy = userGuid
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success(result.Data, "Invitation cancelled successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Invitation not found");

            if (result.Errors.Any(e => e.Contains("permission")))
                return Forbid("You don't have permission to cancel this invitation");

            if (result.Errors.Any(e => e.Contains("already responded")))
                return BadRequest("Cannot cancel invitation that has already been responded to", result.Errors);

            return BadRequest("Failed to cancel invitation", result.Errors);
        }

        [HttpPost("{invitationId}/resend")]
        public async Task<IActionResult> ResendInvitation(Guid eventId, Guid invitationId)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new ResendEventInvitationCommand
            {
                EventId = eventId,
                InvitationId = invitationId,
                ResentBy = userGuid
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success(result.Data, "Invitation resent successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Invitation not found");

            if (result.Errors.Any(e => e.Contains("permission")))
                return Forbid("You don't have permission to resend this invitation");

            if (result.Errors.Any(e => e.Contains("already responded")))
                return BadRequest("Cannot resend invitation that has already been responded to", result.Errors);

            return BadRequest("Failed to resend invitation", result.Errors);
        }

        [HttpGet("stats")]
        [OutputCache(Duration = 300, Tags = new[] { "Events", "Invitations", "Stats" })]
        public async Task<IActionResult> GetInvitationStats(Guid eventId)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var query = new GetEventInvitationStatsQuery
            {
                EventId = eventId,
                UserId = userGuid
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Invitation statistics retrieved successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Event not found");

            if (result.Errors.Any(e => e.Contains("permission")))
                return Forbid("You don't have permission to view invitation statistics for this event");

            return BadRequest("Failed to retrieve invitation statistics", result.Errors);
        }

        [HttpPost("bulk-cancel")]
        public async Task<IActionResult> BulkCancelInvitations(Guid eventId, [FromBody] BulkCancelInvitationsRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new BulkCancelEventInvitationsCommand
            {
                EventId = eventId,
                InvitationIds = request.InvitationIds,
                CancelledBy = userGuid,
                Reason = request.Reason
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success(result.Data, $"Successfully cancelled {result.Data.CancelledCount} invitations");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Event not found");

            if (result.Errors.Any(e => e.Contains("permission")))
                return Forbid("You don't have permission to cancel invitations for this event");

            return BadRequest("Failed to bulk cancel invitations", result.Errors);
        }

        [HttpPost("cleanup-expired")]
        public async Task<IActionResult> CleanupExpiredInvitations(Guid eventId)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new CleanupExpiredEventInvitationsCommand
            {
                EventId = eventId,
                UserId = userGuid
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success(result.Data, $"Successfully cleaned up {result.Data.CleanedUpCount} expired invitations");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Event not found");

            if (result.Errors.Any(e => e.Contains("permission")))
                return Forbid("You don't have permission to cleanup invitations for this event");

            return BadRequest("Failed to cleanup expired invitations", result.Errors);
        }

        [HttpGet("my")]
        [OutputCache(Duration = 60, Tags = new[] { "Events", "Invitations", "My" })]
        public async Task<IActionResult> GetMyInvitations(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20,
            [FromQuery] string? status = null,
            [FromQuery] string? sortBy = "InvitedAt",
            [FromQuery] bool sortDescending = true)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            // Get user email for invitation lookup
            var userEmail = _currentUserService.Email;
            if (string.IsNullOrEmpty(userEmail))
            {
                return BadRequest("User email not found");
            }

            var query = new GetUserEventInvitationsQuery
            {
                Email = userEmail,
                PageNumber = page,
                PageSize = pageSize,
                Status = status,
                SortBy = sortBy,
                SortDescending = sortDescending
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "My invitations retrieved successfully");

            return BadRequest("Failed to retrieve my invitations", result.Errors);
        }
    }

    // Request DTOs
    public class BulkCancelInvitationsRequest
    {
        public List<Guid> InvitationIds { get; set; } = new();
        public string? Reason { get; set; }
    }
}