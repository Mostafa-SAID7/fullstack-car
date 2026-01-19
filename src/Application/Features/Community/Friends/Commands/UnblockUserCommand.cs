using Application.Common.Models;
using MediatR;

namespace Application.Features.Community.Friends.Commands;

public class UnblockUserCommand : IRequest<Result<bool>>
{
    public Guid UserId { get; set; }
    public Guid BlockedUserId { get; set; }
}

public class UnblockUserCommandHandler : IRequestHandler<UnblockUserCommand, Result<bool>>
{
    public async Task<Result<bool>> Handle(UnblockUserCommand request, CancellationToken cancellationToken)
    {
        // TODO: Implement user unblocking logic
        await Task.CompletedTask;
        
        return Result<bool>.Success(true);
    }
}
