using Application.Common.Models;
using MediatR;

namespace Application.Features.Identity.Profile.Commands;

public class DeleteAvatarCommand : IRequest<Result<bool>>
{
    public Guid UserId { get; set; }
}

public class DeleteAvatarCommandHandler : IRequestHandler<DeleteAvatarCommand, Result<bool>>
{
    public async Task<Result<bool>> Handle(DeleteAvatarCommand request, CancellationToken cancellationToken)
    {
        // TODO: Implement avatar deletion logic
        await Task.CompletedTask;
        
        return Result<bool>.Success(true);
    }
}