using Application.Common.DTOs;
using Application.Features.Community.Groups.DTOs;
using MediatR;

namespace Application.Features.Community.Groups.Commands;

public class CreateGroupEventCommand : IRequest<ApiResponseDto<object>>
{
    public Guid GroupId { get; set; }
    public Guid CreatedBy { get; set; }
    public CreateGroupEventRequest Request { get; set; } = new();
}

public class UpdateGroupEventCommand : IRequest<ApiResponseDto<object>>
{
    public Guid GroupId { get; set; }
    public Guid EventId { get; set; }
    public Guid UpdatedBy { get; set; }
    public UpdateGroupEventRequest Request { get; set; } = new();
}

public class DeleteGroupEventCommand : IRequest<ApiResponseDto<object>>
{
    public Guid GroupId { get; set; }
    public Guid EventId { get; set; }
    public Guid DeletedBy { get; set; }
}

public class AttendEventCommand : IRequest<ApiResponseDto<object>>
{
    public Guid GroupId { get; set; }
    public Guid EventId { get; set; }
    public Guid UserId { get; set; }
    public string AttendanceType { get; set; } = "Going";
}

public class CancelEventAttendanceCommand : IRequest<ApiResponseDto<object>>
{
    public Guid GroupId { get; set; }
    public Guid EventId { get; set; }
    public Guid UserId { get; set; }
}
