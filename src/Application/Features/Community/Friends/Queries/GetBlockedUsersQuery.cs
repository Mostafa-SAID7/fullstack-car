using Application.Common.Models;
using Application.Features.Community.Friends.DTOs;
using MediatR;

namespace Application.Features.Community.Friends.Queries;

public class GetBlockedUsersQuery : IRequest<Result<PaginatedList<BlockedUserDto>>>
{
    public Guid UserId { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}

public class GetBlockedUsersQueryHandler : IRequestHandler<GetBlockedUsersQuery, Result<PaginatedList<BlockedUserDto>>>
{
    public async Task<Result<PaginatedList<BlockedUserDto>>> Handle(GetBlockedUsersQuery request, CancellationToken cancellationToken)
    {
        // TODO: Implement blocked users retrieval logic
        await Task.CompletedTask;
        
        var blockedUsers = new List<BlockedUserDto>();
        var paginatedList = new PaginatedList<BlockedUserDto>(blockedUsers, 0, request.PageNumber, request.PageSize);
        
        return Result<PaginatedList<BlockedUserDto>>.Success(paginatedList);
    }
}
