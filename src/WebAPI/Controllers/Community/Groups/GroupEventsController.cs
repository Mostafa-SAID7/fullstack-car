using Application.Features.Community.Groups.Commands;
using Application.Features.Community.Groups.DTOs;
using Application.Features.Community.Groups.Queries;
using Application.Features.Identity.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Asp.Versioning;

namespace WebAPI.Controllers.Community.Groups
{
    [Authorize]
    [ApiVersion("2.0")]
    [Route("api/v{version:apiVersion}/groups/{groupId}/events")]
    public class GroupEventsController : BaseController
    {
        private readonly ICurrentUserService _currentUserService;

        public GroupEventsController(ICurrentUserService currentUserService)
        {
            _currentUserService = currentUserService;
        }

        [HttpGet]
        [AllowAnonymous]
        [OutputCache(Duration = 300, Tags = new[] { "Groups", "Events" })]
        public async Task<IActionResult> GetGroupEvents(
            Guid groupId,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] bool? upcomingOnly = true,
            [FromQuery] DateTime? fromDate = null,
            [FromQuery] DateTime? toDate = null,
            [FromQuery] string? eventType = null)
        {
            var query = new GetGroupEventsQuery
            {
                GroupId = groupId,
                PageNumber = page,
                PageSize = pageSize,
                UpcomingOnly = upcomingOnly,
                FromDate = fromDate,
                ToDate = toDate,
                EventType = eventType
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Group events retrieved successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Group not found");

            return BadRequest("Failed to retrieve group events", result.Errors);
        }

        [HttpGet("{eventId}")]
        [AllowAnonymous]
        [OutputCache(Duration = 300, Tags = new[] { "Groups", "Events" })]
        public async Task<IActionResult> GetGroupEvent(Guid groupId, Guid eventId)
        {
            var userId = _currentUserService.IsAuthenticated && Guid.TryParse(_currentUserService.UserId, out var userGuid) 
                ? userGuid : (Guid?)null;

            var query = new GetGroupEventQuery
            {
                GroupId = groupId,
                EventId = eventId,
                UserId = userId
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Group event retrieved successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Event not found");

            return BadRequest("Failed to retrieve group event", result.Errors);
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Moderator")]
        public async Task<IActionResult> CreateGroupEvent(Guid groupId, [FromBody] CreateGroupEventRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new CreateGroupEventCommand
            {
                GroupId = groupId,
                CreatedBy = userGuid,
                Request = request
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
            {
                dynamic eventData = result.Data;
                var location = Url.Action(nameof(GetGroupEvent), new { groupId, eventId = eventData.Id });
                return Created(result.Data, location!, "Group event created successfully");
            }

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Group not found");

            if (result.Errors.Any(e => e.Contains("permission")))
                return Forbidden("You don't have permission to create events in this group");

            return BadRequest("Failed to create group event", result.Errors);
        }

        [HttpPut("{eventId}")]
        [Authorize(Roles = "Admin,Moderator")]
        public async Task<IActionResult> UpdateGroupEvent(Guid groupId, Guid eventId, [FromBody] UpdateGroupEventRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new UpdateGroupEventCommand
            {
                GroupId = groupId,
                EventId = eventId,
                UpdatedBy = userGuid,
                Request = request
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success(result.Data, "Group event updated successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Event not found");

            if (result.Errors.Any(e => e.Contains("permission")))
                return Forbidden("You don't have permission to update this event");

            return BadRequest("Failed to update group event", result.Errors);
        }

        [HttpDelete("{eventId}")]
        [Authorize(Roles = "Admin,Moderator")]
        public async Task<IActionResult> DeleteGroupEvent(Guid groupId, Guid eventId)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new DeleteGroupEventCommand
            {
                GroupId = groupId,
                EventId = eventId,
                DeletedBy = userGuid
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success("Group event deleted successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Event not found");

            if (result.Errors.Any(e => e.Contains("permission")))
                return Forbidden("You don't have permission to delete this event");

            return BadRequest("Failed to delete group event", result.Errors);
        }

        [HttpPost("{eventId}/attend")]
        public async Task<IActionResult> AttendEvent(Guid groupId, Guid eventId, [FromBody] AttendEventRequest? request = null)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new AttendEventCommand
            {
                GroupId = groupId,
                EventId = eventId,
                UserId = userGuid,
                AttendanceType = request?.AttendanceType ?? "Going"
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success(result.Data, "Event attendance updated successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Event not found");

            if (result.Errors.Any(e => e.Contains("not member")))
                return BadRequest("You must be a group member to attend events", result.Errors);

            return BadRequest("Failed to update event attendance", result.Errors);
        }

        [HttpDelete("{eventId}/attend")]
        public async Task<IActionResult> CancelAttendance(Guid groupId, Guid eventId)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new CancelEventAttendanceCommand
            {
                GroupId = groupId,
                EventId = eventId,
                UserId = userGuid
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success("Event attendance cancelled successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Event attendance not found");

            return BadRequest("Failed to cancel event attendance", result.Errors);
        }

        [HttpGet("{eventId}/attendees")]
        [AllowAnonymous]
        [OutputCache(Duration = 300, Tags = new[] { "Groups", "EventAttendees" })]
        public async Task<IActionResult> GetEventAttendees(
            Guid groupId,
            Guid eventId,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20,
            [FromQuery] string? attendanceType = null)
        {
            var query = new GetEventAttendeesQuery
            {
                GroupId = groupId,
                EventId = eventId,
                PageNumber = page,
                PageSize = pageSize,
                AttendanceType = attendanceType
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Event attendees retrieved successfully");

            return BadRequest("Failed to retrieve event attendees", result.Errors);
        }

        [HttpGet("calendar")]
        [AllowAnonymous]
        [OutputCache(Duration = 300, Tags = new[] { "Groups", "EventCalendar" })]
        public async Task<IActionResult> GetEventCalendar(
            Guid groupId,
            [FromQuery] int year = 0,
            [FromQuery] int month = 0)
        {
            if (year == 0) year = DateTime.UtcNow.Year;
            if (month == 0) month = DateTime.UtcNow.Month;

            var query = new GetGroupEventCalendarQuery
            {
                GroupId = groupId,
                Year = year,
                Month = month
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Event calendar retrieved successfully");

            return BadRequest("Failed to retrieve event calendar", result.Errors);
        }
    }
}