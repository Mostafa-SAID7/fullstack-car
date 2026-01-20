using Application.Common.Interfaces;
using Application.Common.Models;
using Domain.Enums.Common;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Common.Views.Commands;

public record UpdateViewCountCommand(Guid ContentId, ContentType ContentType, int Increment = 1) : IRequest<Result<int>>;

public class UpdateViewCountCommandHandler : IRequestHandler<UpdateViewCountCommand, Result<int>>
{
    private readonly IApplicationDbContext _context;

    public UpdateViewCountCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<int>> Handle(UpdateViewCountCommand request, CancellationToken cancellationToken)
    {
        try
        {
            int newViewCount = 0;

            switch (request.ContentType)
            {
                case ContentType.Question:
                    var question = await _context.Questions.FirstOrDefaultAsync(q => q.Id == request.ContentId, cancellationToken);
                    if (question != null)
                    {
                        question.ViewsCount = Math.Max(0, question.ViewsCount + request.Increment);
                        newViewCount = question.ViewsCount;
                    }
                    break;
                case ContentType.Post:
                    var post = await _context.Posts.FirstOrDefaultAsync(p => p.Id == request.ContentId, cancellationToken);
                    if (post != null)
                    {
                        post.ViewsCount = Math.Max(0, post.ViewsCount + request.Increment);
                        newViewCount = post.ViewsCount;
                    }
                    break;
                case ContentType.Guide:
                    var guide = await _context.Guides.FirstOrDefaultAsync(g => g.Id == request.ContentId, cancellationToken);
                    if (guide != null)
                    {
                        guide.ViewCount = Math.Max(0, guide.ViewCount + request.Increment);
                        newViewCount = guide.ViewCount;
                    }
                    break;
                case ContentType.Page:
                    // Update page view count if needed
                    break;
                case ContentType.Article:
                    // Update article view count if needed
                    break;
                default:
                    return Result<int>.Failure($"Unsupported content type: {request.ContentType}");
            }

            await _context.SaveChangesAsync(cancellationToken);
            return Result<int>.Success(newViewCount);
        }
        catch (Exception ex)
        {
            return Result<int>.Failure($"Failed to update view count: {ex.Message}");
        }
    }
}