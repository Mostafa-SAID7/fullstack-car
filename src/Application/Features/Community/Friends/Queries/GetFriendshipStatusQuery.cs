using Application.Common.Models;
using Application.Features.Community.Friends.DTOs;
using MediatR;

namespace Application.Features.Community.Friends.Queries;

public class GetFriendshipStatusQuery : IRequest<Result<FriendshipStatusDto>>
{
    public Guid UserId { get; set; }
    public Guid OtherUserId { get; set; }
}

public class GetFriendshipStatusQueryHandler : IRequestHandler<GetFriendshipStatusQuery, Result<FriendshipStatusDto>>
{
    public async Task<Result<FriendshipStatusDto>> Handle(GetFriendshipStatusQuery request, CancellationToken cancellationToken)
    {
        // TODO: Implement friendship status logic
        await Task.CompletedTask;
        
        var status = new FriendshipStatusDto
        {
            Status = "None",
            CanSendRequest = true,
            IsBlocked = false
        };
        
        return Result<FriendshipStatusDto>.Success(status);
    }
}
