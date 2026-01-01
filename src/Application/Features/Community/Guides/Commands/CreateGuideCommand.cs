using Application.Common.Interfaces;
using Application.Features.Community.Guides.DTOs.Requests;
using Application.Features.Community.Guides.DTOs.Responses;
using Domain.Entities.Community.Guides;
using Domain.Entities.Community.Posts;
using Domain.Enums.Community.Posts;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Community.Guides.Commands;

public record CreateGuideCommand(CreateGuideRequest Request, Guid UserId) : IRequest<GuideDto>;

public class CreateGuideCommandHandler : IRequestHandler<CreateGuideCommand, GuideDto>
{
    private readonly IApplicationDbContext _context;

    public CreateGuideCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<GuideDto> Handle(CreateGuideCommand request, CancellationToken cancellationToken)
    {
        var guide = new Guide
        {
            Title = request.Request.Title,
            Content = request.Request.Content,
            Summary = request.Request.Summary,
            Category = request.Request.Category,
            Difficulty = request.Request.Difficulty,
            EstimatedReadTime = request.Request.EstimatedReadTime,
            Tags = request.Request.Tags,
            ThumbnailUrl = request.Request.ThumbnailUrl,
            AuthorId = request.UserId,
            IsPublished = false,
            IsFeatured = false
        };

        // Create associated post
        var post = new Post
        {
            Title = request.Request.Title,
            Content = request.Request.Summary,
            Type = PostType.Guide,
            UserId = request.UserId,
            Status = PostStatus.Published
        };

        _context.Posts.Add(post);
        await _context.SaveChangesAsync(cancellationToken);

        guide.PostId = post.Id;
        _context.Guides.Add(guide);
        await _context.SaveChangesAsync(cancellationToken);

        // Add steps
        foreach (var stepRequest in request.Request.Steps)
        {
            var step = new GuideStep
            {
                GuideId = guide.Id,
                StepNumber = stepRequest.StepNumber,
                Title = stepRequest.Title,
                Content = stepRequest.Content,
                ImageUrl = stepRequest.ImageUrl,
                VideoUrl = stepRequest.VideoUrl,
                IsRequired = stepRequest.IsRequired,
                Tips = stepRequest.Tips,
                WarningNotes = stepRequest.WarningNotes,
                EstimatedTime = stepRequest.EstimatedTime
            };

            _context.GuideSteps.Add(step);
        }

        await _context.SaveChangesAsync(cancellationToken);

        // Load the created guide with related data
        var createdGuide = await _context.Guides
            .Include(g => g.Author)
            .Include(g => g.Steps)
            .FirstAsync(g => g.Id == guide.Id, cancellationToken);

        return MapToDto(createdGuide, request.UserId);
    }

    private static GuideDto MapToDto(Guide guide, Guid currentUserId)
    {
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
            Tags = DeserializeTags(guide.Tags),
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
            IsBookmarked = false,
            UserRating = null,
            AverageRating = 0,
            RatingCount = 0
        };
    }

    private static List<string> DeserializeTags(string? tags)
    {
        if (string.IsNullOrEmpty(tags))
            return new List<string>();
        
        try
        {
            return System.Text.Json.JsonSerializer.Deserialize<List<string>>(tags) ?? new List<string>();
        }
        catch
        {
            return new List<string>();
        }
    }
}