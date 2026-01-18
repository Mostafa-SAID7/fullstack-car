using Application.Common.DTOs;

namespace Application.Features.Community.Groups.DTOs
{
    // Event DTOs
    public class GroupEventDto
    {
        public Guid Id { get; set; }
        public Guid GroupId { get; set; }
        public string GroupName { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string? Location { get; set; }
        public string EventType { get; set; } = string.Empty;
        public bool IsOnline { get; set; }
        public string? OnlineLink { get; set; }
        public int? MaxAttendees { get; set; }
        public bool RequireApproval { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public GroupMemberDto CreatedBy { get; set; } = new();
        public EventAttendanceStatsDto AttendanceStats { get; set; } = new();
        public EventAttendanceDto? UserAttendance { get; set; }
        public List<string> Tags { get; set; } = new();
        public string? ImageUrl { get; set; }
    }

    public class GroupEventSummaryDto
    {
        public Guid Id { get; set; }
        public Guid GroupId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string? Location { get; set; }
        public string EventType { get; set; } = string.Empty;
        public bool IsOnline { get; set; }
        public int AttendeeCount { get; set; }
        public int? MaxAttendees { get; set; }
        public string Status { get; set; } = string.Empty;
        public bool IsUserAttending { get; set; }
        public string? ImageUrl { get; set; }
    }

    public class EventAttendanceDto
    {
        public Guid Id { get; set; }
        public Guid EventId { get; set; }
        public Guid UserId { get; set; }
        public string AttendanceType { get; set; } = string.Empty; // Going, Maybe, NotGoing
        public DateTime ResponseDate { get; set; }
        public string? Notes { get; set; }
        public bool IsApproved { get; set; }
        public DateTime? ApprovedAt { get; set; }
    }

    public class EventAttendeeDto
    {
        public Guid Id { get; set; }
        public GroupMemberDto Member { get; set; } = new();
        public string AttendanceType { get; set; } = string.Empty;
        public DateTime ResponseDate { get; set; }
        public string? Notes { get; set; }
        public bool IsApproved { get; set; }
        public DateTime? ApprovedAt { get; set; }
    }

    public class EventAttendanceStatsDto
    {
        public int TotalResponses { get; set; }
        public int GoingCount { get; set; }
        public int MaybeCount { get; set; }
        public int NotGoingCount { get; set; }
        public int PendingApprovalCount { get; set; }
        public double ResponseRate { get; set; }
        public int? AvailableSpots { get; set; }
    }

    public class EventCalendarDto
    {
        public int Year { get; set; }
        public int Month { get; set; }
        public List<EventCalendarDayDto> Days { get; set; } = new();
        public EventCalendarStatsDto Stats { get; set; } = new();
    }

    public class EventCalendarDayDto
    {
        public int Day { get; set; }
        public List<GroupEventSummaryDto> Events { get; set; } = new();
        public int EventCount { get; set; }
        public bool HasEvents { get; set; }
    }

    public class EventCalendarStatsDto
    {
        public int TotalEvents { get; set; }
        public int UpcomingEvents { get; set; }
        public int OnlineEvents { get; set; }
        public int InPersonEvents { get; set; }
        public Dictionary<string, int> EventsByType { get; set; } = new();
    }

    // Request DTOs
    public class CreateGroupEventRequest
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string? Location { get; set; }
        public string EventType { get; set; } = "General";
        public bool IsOnline { get; set; } = false;
        public string? OnlineLink { get; set; }
        public int? MaxAttendees { get; set; }
        public bool RequireApproval { get; set; } = false;
        public List<string> Tags { get; set; } = new();
        public string? ImageUrl { get; set; }
    }

    public class UpdateGroupEventRequest
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string? Location { get; set; }
        public string EventType { get; set; } = "General";
        public bool IsOnline { get; set; } = false;
        public string? OnlineLink { get; set; }
        public int? MaxAttendees { get; set; }
        public bool RequireApproval { get; set; } = false;
        public List<string> Tags { get; set; } = new();
        public string? ImageUrl { get; set; }
    }

    public class AttendEventRequest
    {
        public string AttendanceType { get; set; } = "Going"; // Going, Maybe, NotGoing
        public string? Notes { get; set; }
    }

    // Pagination DTOs
    public class GroupEventsPagedResponse : PaginatedResponseDto<GroupEventSummaryDto>
    {
        public Dictionary<string, int> EventTypeCounts { get; set; } = new();
        public EventCalendarStatsDto Stats { get; set; } = new();
    }

    public class EventAttendeesPagedResponse : PaginatedResponseDto<EventAttendeeDto>
    {
        public EventAttendanceStatsDto Stats { get; set; } = new();
    }
}