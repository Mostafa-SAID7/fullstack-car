using Application.Common.Models;
using MediatR;

namespace Application.Features.Community.Events.Commands;

public class DeleteEventCommentCommand : IRequest<Result<bool>>
{
    public Guid CommentId { get; set; }
    public Guid UserId { get; set; }
}

public class DeleteEventCommentCommandHandler : IRequestHandler<DeleteEventCommentCommand, Result<bool>>
{
    public async Task<Result<bool>> Handle(DeleteEventCommentCommand request, CancellationToken cancellationToken)
    {
        // TODO: Implement comment deletion logic
        await Task.CompletedTask;
        
        return Result<bool>.Success(true);
    }
}