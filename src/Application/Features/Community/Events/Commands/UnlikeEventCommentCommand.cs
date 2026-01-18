using Application.Common.Models;
using MediatR;

namespace Application.Features.Community.Events.Commands;

public class UnlikeEventCommentCommand : IRequest<Result<bool>>
{
    public Guid CommentId { get; set; }
    public Guid UserId { get; set; }
}

public class UnlikeEventCommentCommandHandler : IRequestHandler<UnlikeEventCommentCommand, Result<bool>>
{
    public async Task<Result<bool>> Handle(UnlikeEventCommentCommand request, CancellationToken cancellationToken)
    {
        // TODO: Implement comment unlike logic
        await Task.CompletedTask;
        
        return Result<bool>.Success(true);
    }
}