using Application.Common.DTOs;
using MediatR;

namespace Application.Features.Community.Groups.Queries;

public class GetGroupEventQuery : IRequest<ApiResponseDto<object>>
{
    public Guid GroupId { get; set; }
    public Guid EventId { get; set; }
    public Guid? UserId { get; set; }
}

public class GetEventAttendeesQuery : IRequest<ApiResponseDto<object>>
{
    public Guid GroupId { get; set; }
    public Guid EventId { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 20;
    public string? AttendanceType { get; set; }
}

public class GetGroupEventCalendarQuery : IRequest<ApiResponseDto<object>>
{
    public Guid GroupId { get; set; }
    public int Year { get; set; }
    public int Month { get; set; }
}