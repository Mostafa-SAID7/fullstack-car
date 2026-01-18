using Application.Common.Models;
using Application.Features.Community.Events.DTOs;
using MediatR;

namespace Application.Features.Community.Events.Commands;

public class CreateEventCommentCommand : IRequest<Result<EventCommentDto>>
{
    public Guid EventId { get; set; }
    public Guid UserId { get; set; }
    public CreateEventCommentRequest Request { get; set; } = default!;
}

public class CreateEventCommentCommandHandler : IRequestHandler<CreateEventCommentCommand, Result<EventCommentDto>>
{
    public async Task<Result<EventCommentDto>> Handle(CreateEventCommentCommand request, CancellationToken cancellationToken)
    {
        // TODO: Implement comment creation logic
        await Task.CompletedTask;
        
        var comment = new EventCommentDto
        {
            Id = Guid.NewGuid(),
            EventId = request.EventId,
            ParentCommentId = request.Request.ParentCommentId,
            Content = request.Request.Content,
            CreatedAt = DateTime.UtcNow,
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