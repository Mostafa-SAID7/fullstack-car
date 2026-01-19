using Application.Common.Models;
using MediatR;

namespace Application.Features.Community.Friends.Commands;

public class BlockUserCommand : IRequest<Result<bool>>
{
    public Guid UserId { get; set; }
    public Guid BlockedUserId { get; set; }
}

public class BlockUserCommandHandler : IRequestHandler<BlockUserCommand, Result<bool>>
{
    public async Task<Result<bool>> Handle(BlockUserCommand request, CancellationToken cancellationToken)
    {
        // TODO: Implement user blocking logic
        await Task.CompletedTask;
        
        return Result<bool>.Success(true);
    }
}
