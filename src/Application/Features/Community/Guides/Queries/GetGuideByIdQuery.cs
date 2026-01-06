using Application.Common.Interfaces;
using Application.Features.Community.Guides.DTOs.Responses;
using Domain.Entities.Community.Guides;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Community.Guides.Queries;

public record GetGuideByIdQuery(Guid Id, Guid? UserId = null) : IRequest<GuideDto?>;

public class GetGuideByIdQueryHandler : IRequestHandler<GetGuideByIdQuery, GuideDto?>
{
    private readonly IApplicationDbContext _context;

    public GetGuideByIdQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<GuideDto?> Handle(GetGuideByIdQuery request, CancellationToken cancellationToken)
    {
        var guide = await _context.Guides
            .Include(g => g.Author)
            .Include(g => g.Steps)
            .Include(g => g.Ratings)
            .Include(g => g.Bookmarks)
            .FirstOrDefaultAsync(g => g.Id == request.Id && g.IsPublished, cancellationToken);

        if (guide == null)
            return null;

        // Record view if user is provided
        if (request.UserId.HasValue)
        {
            var existingView = await _context.GuideViews
                .FirstOrDefaultAsync(v => v.GuideId == request.Id && v.UserId == request.UserId.Value, cancellationToken);

            if (existingView == null)
            {
                var view = new GuideView
                {
                    GuideId = request.Id,
                    UserId = request.UserId.Value,
                    ViewedAt = DateTime.UtcNow,
                    TimeSpent = 0,
                    CompletedReading = false
                };

                _context.GuideViews.Add(view);
                guide.ViewCount++;
                await _context.SaveChangesAsync(cancellationToken);
            }
        }

        return MapToDto(guide, request.UserId);
    }

    private static GuideDto MapToDto(Guide guide, Guid? currentUserId)
    {
        var userRating = currentUserId.HasValue ? 
            guide.Ratings.FirstOrDefault(r => r.UserId == currentUserId.Value)?.Rating : null;

        var isBookmarked = currentUserId.HasValue && 
            guide.Bookmarks.Any(b => b.UserId == currentUserId.Value);

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
                EstimatedTime = s.EstimatedTime
            }).ToList(),
            IsBookmarked = isBookmarked,
            UserRating = userRating,
            AverageRating = guide.Ratings.Any() ? guide.Ratings.Average(r => r.Rating) : 0,
            RatingCount = guide.Ratings.Count
        };
    }
}
