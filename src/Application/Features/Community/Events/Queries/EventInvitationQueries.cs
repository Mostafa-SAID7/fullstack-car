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

public class GetUserEventInvitationsQueryHandler : IRequestHandler<GetUserEventInvitationsQuery, ApiResponseDto<object>>
{
    public async Task<ApiResponseDto<object>> Handle(GetUserEventInvitationsQuery request, CancellationToken cancellationToken)
    {
        await Task.Delay(1, cancellationToken);
        
        var invitations = new
        {
            Items = new object[0],
            TotalCount = 0,
            PageNumber = request.PageNumber,
            PageSize = request.PageSize
        };
        
        return ApiResponseDto<object>.Success(invitations);
    }
}

public class GetEventInvitationStatsQueryHandler : IRequestHandler<GetEventInvitationStatsQuery, ApiResponseDto<object>>
{
    public async Task<ApiResponseDto<object>> Handle(GetEventInvitationStatsQuery request, CancellationToken cancellationToken)
    {
        await Task.Delay(1, cancellationToken);
        
        var stats = new
        {
            TotalSent = 0,
            Accepted = 0,
            Declined = 0,
            Pending = 0,
            Expired = 0
        };
        
        return ApiResponseDto<object>.Success(stats);
    }
}