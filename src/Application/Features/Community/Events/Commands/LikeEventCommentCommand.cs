using Application.Common.Models;
using MediatR;

namespace Application.Features.Community.Events.Commands;

public class LikeEventCommentCommand : IRequest<Result<bool>>
{
    public Guid CommentId { get; set; }
    public Guid UserId { get; set; }
}

public class LikeEventCommentCommandHandler : IRequestHandler<LikeEventCommentCommand, Result<bool>>
{
    public async Task<Result<bool>> Handle(LikeEventCommentCommand request, CancellationToken cancellationToken)
    {
        // TODO: Implement comment like logic
        await Task.CompletedTask;
        
        return Result<bool>.Success(true);
    }
}
