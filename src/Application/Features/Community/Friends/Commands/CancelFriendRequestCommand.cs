using Application.Common.Models;
using MediatR;

namespace Application.Features.Community.Friends.Commands;

public class CancelFriendRequestCommand : IRequest<Result<bool>>
{
    public Guid RequestId { get; set; }
    public Guid UserId { get; set; }
}

public class CancelFriendRequestCommandHandler : IRequestHandler<CancelFriendRequestCommand, Result<bool>>
{
    public async Task<Result<bool>> Handle(CancelFriendRequestCommand request, CancellationToken cancellationToken)
    {
        // TODO: Implement friend request cancellation logic
        await Task.CompletedTask;
        
        return Result<bool>.Success(true);
    }
}
