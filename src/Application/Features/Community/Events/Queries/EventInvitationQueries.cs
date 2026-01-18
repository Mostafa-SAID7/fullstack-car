using Application.Common.DTOs;
using MediatR;

namespace Application.Features.Community.Events.Queries;

public class GetEventInvitationStatsQuery : IRequest<ApiResponseDto<object>>
{
    public Guid EventId { get; set; }
    public Guid UserId { get; set; }
}

public class GetUserEventInvitationsQuery : IRequest<ApiResponseDto<object>>
{
    public string Email { get; set; } = string.Empty;
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 20;
    public string? Status { get; set; }
    public string? SortBy { get; set; }
    public bool SortDescending { get; set; } = true;
}