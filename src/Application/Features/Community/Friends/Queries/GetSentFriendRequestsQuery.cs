using Application.Common.Models;
using Application.Features.Community.Friends.DTOs;
using MediatR;

namespace Application.Features.Community.Friends.Queries;

public class GetSentFriendRequestsQuery : IRequest<Result<PaginatedList<FriendRequestDto>>>
{
    public Guid UserId { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}

public class GetSentFriendRequestsQueryHandler : IRequestHandler<GetSentFriendRequestsQuery, Result<PaginatedList<FriendRequestDto>>>
{
    public async Task<Result<PaginatedList<FriendRequestDto>>> Handle(GetSentFriendRequestsQuery request, CancellationToken cancellationToken)
    {
        // TODO: Implement sent friend requests retrieval logic
        await Task.CompletedTask;
        
        var requests = new List<FriendRequestDto>();
        var paginatedList = new PaginatedList<FriendRequestDto>(requests, 0, request.PageNumber, request.PageSize);
        
        return Result<PaginatedList<FriendRequestDto>>.Success(paginatedList);
    }
}
