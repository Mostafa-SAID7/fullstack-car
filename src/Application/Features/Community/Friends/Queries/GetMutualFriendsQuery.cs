using Application.Common.Models;
using Application.Features.Community.Friends.DTOs;
using MediatR;

namespace Application.Features.Community.Friends.Queries;

public class GetMutualFriendsQuery : IRequest<Result<List<FriendDto>>>
{
    public Guid UserId { get; set; }
    public Guid OtherUserId { get; set; }
    public int PageSize { get; set; } = 10;
}

public class GetMutualFriendsQueryHandler : IRequestHandler<GetMutualFriendsQuery, Result<List<FriendDto>>>
{
    public async Task<Result<List<FriendDto>>> Handle(GetMutualFriendsQuery request, CancellationToken cancellationToken)
    {
        // TODO: Implement mutual friends logic
        await Task.CompletedTask;
        
        var mutualFriends = new List<FriendDto>();
        
        return Result<List<FriendDto>>.Success(mutualFriends);
    }
}