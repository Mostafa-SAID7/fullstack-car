using Application.Common.DTOs;
using MediatR;

namespace Application.Features.Community.Social.Queries;

public class GetFriendshipStatusQuery : IRequest<ApiResponseDto<object>>
{
    public Guid UserId { get; set; }
    public Guid FriendId { get; set; }
}

public class GetFriendshipStatusQueryHandler : IRequestHandler<GetFriendshipStatusQuery, ApiResponseDto<object>>
{
    public async Task<ApiResponseDto<object>> Handle(GetFriendshipStatusQuery request, CancellationToken cancellationToken)
    {
        // Mock implementation
        await Task.Delay(1, cancellationToken);
        
        var status = new
        {
            UserId = request.UserId,
            FriendId = request.FriendId,
            Status = "Friends", // "None", "Pending", "Friends", "Blocked"
            Since = DateTime.UtcNow.AddDays(-30),
            IsMutual = true
        };
        
        return ApiResponseDto<object>.Success(status);
    }
}
