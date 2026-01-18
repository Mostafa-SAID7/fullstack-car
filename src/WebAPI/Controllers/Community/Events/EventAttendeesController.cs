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
    [Route("api/v{version:apiVersion}/events/{eventId}/attendees")]
    public class EventAttendeesController : BaseController
    {
        private readonly ICurrentUserService _currentUserService;
        private readonly ILocalizationProvider _localizationProvider;
        private readonly INotificationService _notificationService;

        public EventAttendeesController(
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
        [OutputCache(Duration = 180, Tags = new[] { "Events", "Attendees" })]
        public async Task<IActionResult> GetEventAttendees(
            Guid eventId,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20,
            [FromQuery] string? attendanceType = null,
            [FromQuery] bool? isApproved = null,
            [FromQuery] bool? checkedIn = null,
            [FromQuery] string? searchTerm = null,
            [FromQuery] string? sortBy = "ResponseDate",
            [FromQuery] bool sortDescending = false)
        {
            var query = new GetEventAttendeesQuery
            {
                EventId = eventId,
                PageNumber = page,
                PageSize = pageSize,
                AttendanceType = attendanceType,
                IsApproved = isApproved,
                CheckedIn = checkedIn,
                SearchTerm = searchTerm,
                SortBy = sortBy,
                SortDescending = sortDescending
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Event attendees retrieved successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Event not found");

            return BadRequest("Failed to retrieve event attendees", result.Errors);
        }

        [HttpPost("{attendeeId}/approve")]
        public async Task<IActionResult> ApproveAttendance(Guid eventId, Guid attendeeId)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new ApproveEventAttendanceCommand
            {
                EventId = eventId,
                AttendeeId = attendeeId,
                ApprovedBy = userGuid
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success(result.Data, "Attendance approved successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Event or attendee not found");

            if (result.Errors.Any(e => e.Contains("permission")))
                return Forbid("You don't have permission to approve attendees for this event");

            return BadRequest("Failed to approve attendance", result.Errors);
        }

        [HttpPost("{attendeeId}/reject")]
        public async Task<IActionResult> RejectAttendance(Guid eventId, Guid attendeeId, [FromBody] RejectAttendanceRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new RejectEventAttendanceCommand
            {
                EventId = eventId,
                AttendeeId = attendeeId,
                RejectedBy = userGuid,
                Reason = request.Reason
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success(result.Data, "Attendance rejected successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Event or attendee not found");

            if (result.Errors.Any(e => e.Contains("permission")))
                return Forbid("You don't have permission to reject attendees for this event");

            return BadRequest("Failed to reject attendance", result.Errors);
        }

        [HttpPost("{attendeeId}/check-in")]
        public async Task<IActionResult> CheckInAttendee(Guid eventId, Guid attendeeId)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new CheckInEventAttendeeCommand
            {
                EventId = eventId,
                AttendeeId = attendeeId,
                CheckedInBy = userGuid
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success(result.Data, "Attendee checked in successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Event or attendee not found");

            if (result.Errors.Any(e => e.Contains("permission")))
                return Forbid("You don't have permission to check in attendees for this event");

            if (result.Errors.Any(e => e.Contains("already checked in")))
                return BadRequest("Attendee is already checked in", result.Errors);

            return BadRequest("Failed to check in attendee", result.Errors);
        }

        [HttpDelete("{attendeeId}")]
        public async Task<IActionResult> RemoveAttendee(Guid eventId, Guid attendeeId)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new RemoveEventAttendeeCommand
            {
                EventId = eventId,
                AttendeeId = attendeeId,
                RemovedBy = userGuid
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success(result.Data, "Attendee removed successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Event or attendee not found");

            if (result.Errors.Any(e => e.Contains("permission")))
                return Forbid("You don't have permission to remove attendees from this event");

            return BadRequest("Failed to remove attendee", result.Errors);
        }

        [HttpGet("stats")]
        [AllowAnonymous]
        [OutputCache(Duration = 300, Tags = new[] { "Events", "Attendees", "Stats" })]
        public async Task<IActionResult> GetAttendanceStats(Guid eventId)
        {
            var query = new GetEventAttendanceStatsQuery
            {
                EventId = eventId
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Attendance statistics retrieved successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Event not found");

            return BadRequest("Failed to retrieve attendance statistics", result.Errors);
        }

        [HttpGet("pending")]
        [OutputCache(Duration = 60, Tags = new[] { "Events", "Attendees", "Pending" })]
        public async Task<IActionResult> GetPendingApprovals(
            Guid eventId,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var query = new GetPendingEventApprovalsQuery
            {
                EventId = eventId,
                UserId = userGuid,
                PageNumber = page,
                PageSize = pageSize
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Pending approvals retrieved successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Event not found");

            if (result.Errors.Any(e => e.Contains("permission")))
                return Forbid("You don't have permission to view pending approvals for this event");

            return BadRequest("Failed to retrieve pending approvals", result.Errors);
        }

        [HttpPost("bulk-approve")]
        public async Task<IActionResult> BulkApproveAttendees(Guid eventId, [FromBody] BulkApproveAttendeesRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new BulkApproveEventAttendeesCommand
            {
                EventId = eventId,
                AttendeeIds = request.AttendeeIds,
                ApprovedBy = userGuid
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success(result.Data, $"Successfully approved {result.Data.ApprovedCount} attendees");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Event not found");

            if (result.Errors.Any(e => e.Contains("permission")))
                return Forbid("You don't have permission to approve attendees for this event");

            return BadRequest("Failed to bulk approve attendees", result.Errors);
        }

        [HttpPost("export")]
        public async Task<IActionResult> ExportAttendees(Guid eventId, [FromBody] ExportAttendeesRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new ExportEventAttendeesCommand
            {
                EventId = eventId,
                UserId = userGuid,
                Format = request.Format,
                IncludeFields = request.IncludeFields
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
            {
                var contentType = request.Format.ToLower() switch
                {
                    "csv" => "text/csv",
                    "excel" => "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    _ => "application/octet-stream"
                };

                return File(result.Data.FileContent, contentType, result.Data.FileName);
            }

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Event not found");

            if (result.Errors.Any(e => e.Contains("permission")))
                return Forbid("You don't have permission to export attendees for this event");

            return BadRequest("Failed to export attendees", result.Errors);
        }
    }

    // Request DTOs
    public class RejectAttendanceRequest
    {
        public string? Reason { get; set; }
    }

    public class BulkApproveAttendeesRequest
    {
        public List<Guid> AttendeeIds { get; set; } = new();
    }

    public class ExportAttendeesRequest
    {
        public string Format { get; set; } = "csv"; // csv, excel
        public List<string> IncludeFields { get; set; } = new();
    }
}