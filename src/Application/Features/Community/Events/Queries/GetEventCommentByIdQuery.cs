using Application.Common.Models;
using Application.Features.Community.Events.DTOs;
using MediatR;

namespace Application.Features.Community.Events.Queries;

public class GetEventCommentByIdQuery : IRequest<Result<EventCommentDto>>
{
    public Guid EventId { get; set; }
    public Guid CommentId { get; set; }
    public bool IncludeReplies { get; set; } = true;
}

public class GetEventCommentByIdQueryHandler : IRequestHandler<GetEventCommentByIdQuery, Result<EventCommentDto>>
{
    public async Task<Result<EventCommentDto>> Handle(GetEventCommentByIdQuery request, CancellationToken cancellationToken)
    {
        // TODO: Implement comment retrieval logic
        await Task.CompletedTask;
        
        var comment = new EventCommentDto
        {
            Id = request.CommentId,
            EventId = request.EventId,
            Content = "Sample comment",
            CreatedAt = DateTime.UtcNow,
            CreatedBy = new EventUserDto
            {
                Id = Guid.NewGuid(),
                Username = "user",
                DisplayName = "User Name"
            }
        };
        
        return Result<EventCommentDto>.Success(comment);
    }
}
