using Application.Common.Interfaces;
using Application.Features.Community.Guides.DTOs.Requests;
using Application.Features.Community.Guides.DTOs.Responses;
using Domain.Entities.Community.Guides;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Community.Guides.Commands;

public record UpdateGuideCommand(UpdateGuideRequest Request, Guid UserId) : IRequest<GuideDto>;

public class UpdateGuideCommandHandler : IRequestHandler<UpdateGuideCommand, GuideDto>
{
    private readonly IApplicationDbContext _context;

    public UpdateGuideCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<GuideDto> Handle(UpdateGuideCommand request, CancellationToken cancellationToken)
    {
        var guide = await _context.Guides
            .Include(g => g.Author)
            .Include(g => g.Steps)
            .FirstOrDefaultAsync(g => g.Id == request.Request.Id && g.AuthorId == request.UserId, cancellationToken);

        if (guide == null)
            throw new UnauthorizedAccessException("Guide not found or you don't have permission to edit it.");

        // Update guide properties
        guide.Title = request.Request.Title;
        guide.Content = request.Request.Content;
        guide.Summary = request.Request.Summary;
        guide.Category = request.Request.Category;
        guide.Difficulty = request.Request.Difficulty;
        guide.EstimatedReadTime = request.Request.EstimatedReadTime;
        guide.Tags = request.Request.Tags;
        guide.ThumbnailUrl = request.Request.ThumbnailUrl;

        // Update steps
        var existingStepIds = guide.Steps.Select(s => s.Id).ToList();
        var requestStepIds = request.Request.Steps.Where(s => s.Id.HasValue).Select(s => s.Id!.Value).ToList();

        // Remove deleted steps
        var stepsToRemove = guide.Steps.Where(s => !requestStepIds.Contains(s.Id)).ToList();
        foreach (var step in stepsToRemove)
        {
            _context.GuideSteps.Remove(step);
        }

        // Update existing steps and add new ones
        foreach (var stepRequest in request.Request.Steps)
        {
            if (stepRequest.Id.HasValue)
            {
                // Update existing step
                var existingStep = guide.Steps.FirstOrDefault(s => s.Id == stepRequest.Id.Value);
                if (existingStep != null)
                {
                    existingStep.StepNumber = stepRequest.StepNumber;
                    existingStep.Title = stepRequest.Title;
                    existingStep.Content = stepRequest.Content;
                    existingStep.ImageUrl = stepRequest.ImageUrl;
                    existingStep.VideoUrl = stepRequest.VideoUrl;
                    existingStep.IsRequired = stepRequest.IsRequired;
                    existingStep.Tips = stepRequest.Tips;
                    existingStep.WarningNotes = stepRequest.WarningNotes;
                    existingStep.EstimatedTime = stepRequest.EstimatedTime;
                }
            }
            else
            {
                // Add new step
                var newStep = new GuideStep
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

                _context.GuideSteps.Add(newStep);
            }
        }

        await _context.SaveChangesAsync(cancellationToken);

        // Reload the guide with updated data
        guide = await _context.Guides
            .Include(g => g.Author)
            .Include(g => g.Steps)
            .FirstAsync(g => g.Id == guide.Id, cancellationToken);

        return MapToDto(guide, request.UserId);
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