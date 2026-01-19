using Application.Common.Models;
using Application.Features.Community.Events.DTOs;
using MediatR;

namespace Application.Features.Community.Events.Commands;

public class UpdateEventCommentCommand : IRequest<Result<EventCommentDto>>
{
    public Guid CommentId { get; set; }
    public Guid UserId { get; set; }
    public UpdateEventCommentRequest Request { get; set; } = default!;
}

public class UpdateEventCommentCommandHandler : IRequestHandler<UpdateEventCommentCommand, Result<EventCommentDto>>
{
    public async Task<Result<EventCommentDto>> Handle(UpdateEventCommentCommand request, CancellationToken cancellationToken)
    {
        // TODO: Implement comment update logic
        await Task.CompletedTask;
        
        var comment = new EventCommentDto
        {
            Id = request.CommentId,
            Content = request.Request.Content,
            UpdatedAt = DateTime.UtcNow,
            IsEdited = true,
            CreatedBy = new EventUserDto
            {
                Id = request.UserId,
                Username = "user",
                DisplayName = "User Name"
            }
        };
        
        return Result<EventCommentDto>.Success(comment);
    }
}
