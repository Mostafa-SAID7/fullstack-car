using Application.Common.Interfaces;
using Application.Features.Community.Guides.DTOs.Responses;
using Application.Features.Common.Views.Commands;
using Domain.Entities.Community.Guides;
using Domain.Enums.Common;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Community.Guides.Queries;

public record GetGuideByIdQuery(Guid Id, Guid? UserId = null) : IRequest<GuideDto?>;

public class GetGuideByIdQueryHandler : IRequestHandler<GetGuideByIdQuery, GuideDto?>
{
    private readonly IApplicationDbContext _context;
    private readonly IMediator _mediator;

    public GetGuideByIdQueryHandler(IApplicationDbContext context, IMediator mediator)
    {
        _context = context;
        _mediator = mediator;
    }

    public async Task<GuideDto?> Handle(GetGuideByIdQuery request, CancellationToken cancellationToken)
    {
        var guide = await _context.Guides
            .Include(g => g.Author)
            .Include(g => g.Steps)
            .Include(g => g.Ratings)
            .FirstOrDefaultAsync(g => g.Id == request.Id && g.IsPublished, cancellationToken);

        if (guide == null)
            return null;

        // Record view if user is provided
        if (request.UserId.HasValue)
        {
            var trackViewCommand = new TrackViewCommand(
                request.Id, 
                ContentType.Guide, 
                request.UserId.Value
            );
            await _mediator.Send(trackViewCommand, cancellationToken);
        }

        return await MapToDto(guide, request.UserId, _context, cancellationToken);
    }

    private static async Task<GuideDto> MapToDto(Guide guide, Guid? currentUserId, IApplicationDbContext context, CancellationToken cancellationToken)
    {
        var userRating = currentUserId.HasValue ? 
            guide.Ratings.FirstOrDefault(r => r.UserId == currentUserId.Value)?.Rating : null;

        var isBookmarked = false;
        if (currentUserId.HasValue)
        {
            isBookmarked = await context.Bookmarks
                .AnyAsync(b => b.ContentId == guide.Id && 
                              b.ContentType == Domain.Enums.Common.ContentType.Guide && 
                              b.UserId == currentUserId.Value, cancellationToken);
        }

        return new GuideDto
        {
            Id = guide.Id,
            Title = guide.Title,
            Content = guide.Content,
            Summary = guide.Summary,
            Category = guide.Category,
            CategoryName = guide.Category.ToString(),
            Difficulty = guide.Difficulty,
            DifficultyName = guide.Difficulty.ToString(),
            EstimatedReadTime = guide.EstimatedReadTime,
            IsFeatured = guide.IsFeatured,
            IsPublished = guide.IsPublished,
            ViewCount = guide.ViewCount,
            LikeCount = guide.LikeCount,
            BookmarkCount = guide.BookmarkCount,
            Tags = string.IsNullOrEmpty(guide.Tags) ? new List<string>() : 
                   System.Text.Json.JsonSerializer.Deserialize<List<string>>(guide.Tags) ?? new List<string>(),
            ThumbnailUrl = guide.ThumbnailUrl,
            CreatedAt = guide.CreatedAt,
            UpdatedAt = guide.UpdatedAt,
            AuthorId = guide.AuthorId,
            AuthorName = guide.Author?.UserName ?? "Unknown",
            AuthorAvatar = guide.Author?.ProfileImageUrl,
            Steps = guide.Steps.OrderBy(s => s.StepNumber).Select(s => new GuideStepDto
            {
                Id = s.Id,
                StepNumber = s.StepNumber,
                Title = s.Title,
                Content = s.Content,
                ImageUrl = s.ImageUrl,
                VideoUrl = s.VideoUrl,
                IsRequired = s.IsRequired,
                Tips = s.Tips,
                WarningNotes = s.WarningNotes,
                EstimatedTime = s.EstimatedTime ?? 0
            }).ToList(),
            IsBookmarked = isBookmarked,
            UserRating = userRating,
            AverageRating = guide.Ratings.Any() ? guide.Ratings.Average(r => r.Rating) : 0,
            RatingCount = guide.Ratings.Count
        };
    }
}
