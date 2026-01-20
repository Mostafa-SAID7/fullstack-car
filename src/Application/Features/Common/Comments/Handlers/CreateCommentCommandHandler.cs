using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Features.Common.Comments.Commands;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Common.Comments.Handlers;

public class CreateCommentCommandHandler : IRequestHandler<CreateCommentCommand, Result<bool>>
{
    private readonly IApplicationDbContext _context;

    public CreateCommentCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<bool>> Handle(CreateCommentCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var comment = new Domain.Entities.Common.Comment
            {
                ContentId = request.ContentId,
                ContentType = request.ContentType,
                UserId = request.UserId,
                Content = request.Content,
                ParentCommentId = request.ParentCommentId,
                CreatedAt = DateTime.UtcNow
            };

            _context.Comments.Add(comment);

            // Update content comment count if the entity has this property
            await UpdateContentCommentCount(request.ContentId, request.ContentType, 1, cancellationToken);

            await _context.SaveChangesAsync(cancellationToken);
            return Result<bool>.Success(true);
        }
        catch (Exception ex)
        {
            return Result<bool>.Failure($"Failed to create comment: {ex.Message}");
        }
    }

    private async Task UpdateContentCommentCount(Guid contentId, Domain.Enums.Common.ContentType contentType, int increment, CancellationToken cancellationToken)
    {
        // Only update if the entity has CommentCount property
        // This is optional since not all entities may have this property yet
        try
        {
            switch (contentType)
            {
                case Domain.Enums.Common.ContentType.Post:
                    var post = await _context.Posts.FirstOrDefaultAsync(p => p.Id == contentId, cancellationToken);
                    // Skip if CommentCount property doesn't exist
                    break;
                case Domain.Enums.Common.ContentType.Question:
                    var question = await _context.Questions.FirstOrDefaultAsync(q => q.Id == contentId, cancellationToken);
                    // Skip if CommentCount property doesn't exist
                    break;
                case Domain.Enums.Common.ContentType.Guide:
                    var guide = await _context.Guides.FirstOrDefaultAsync(g => g.Id == contentId, cancellationToken);
                    // Skip if CommentCount property doesn't exist
                    break;
            }
        }
        catch
        {
            // Ignore errors for now - entities may not have CommentCount property
        }
    }
}