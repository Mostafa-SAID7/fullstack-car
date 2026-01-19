using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Features.Marketing.Campaigns.Commands;
using Application.Features.Marketing.Campaigns.DTOs;
using Application.Features.Marketing.Campaigns.Queries;
using Domain.Entities.Marketing;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace Application.Features.Marketing.Campaigns.Handlers;

public class CreateCampaignContentCommandHandler : IRequestHandler<CreateCampaignContentCommand, Result<CampaignContentDto>>
{
    private readonly IApplicationDbContext _context;

    public CreateCampaignContentCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<CampaignContentDto>> Handle(CreateCampaignContentCommand request, CancellationToken cancellationToken)
    {
        try
        {
            // Verify campaign exists
            var campaignExists = await _context.Campaigns.AnyAsync(c => c.Id == request.Request.CampaignId, cancellationToken);
            if (!campaignExists)
            {
                return Result<CampaignContentDto>.Failure("Campaign not found");
            }

            var content = new CampaignContent
            {
                Id = Guid.NewGuid(),
                CampaignId = request.Request.CampaignId,
                Title = request.Request.Title,
                Content = request.Request.Content,
                Type = request.Request.Type,
                MediaUrl = request.Request.MediaUrl,
                ThumbnailUrl = request.Request.ThumbnailUrl,
                ScheduledDate = request.Request.ScheduledDate,
                Status = ContentStatus.Draft,
                Author = request.Request.Author,
                Tags = JsonSerializer.Serialize(request.Request.Tags),
                CreatedAt = DateTime.UtcNow
            };

            _context.CampaignContents.Add(content);

            // Add platform associations
            foreach (var platformId in request.Request.PlatformIds)
            {
                var contentPlatform = new ContentPlatform
                {
                    Id = Guid.NewGuid(),
                    ContentId = content.Id,
                    PlatformId = platformId,
                    Status = ContentStatus.Draft,
                    CreatedAt = DateTime.UtcNow
                };
                _context.ContentPlatforms.Add(contentPlatform);
            }

            await _context.SaveChangesAsync(cancellationToken);

            // Reload with includes for response
            var createdContent = await _context.CampaignContents
                .Include(c => c.Platforms)
                    .ThenInclude(cp => cp.Platform)
                .FirstAsync(c => c.Id == content.Id, cancellationToken);

            var contentDto = MapToCampaignContentDto(createdContent);
            return Result<CampaignContentDto>.Success(contentDto);
        }
        catch (Exception ex)
        {
            return Result<CampaignContentDto>.Failure($"Error creating campaign content: {ex.Message}");
        }
    }

    public static CampaignContentDto MapToCampaignContentDto(CampaignContent content)
    {
        return new CampaignContentDto
        {
            Id = content.Id,
            CampaignId = content.CampaignId,
            Title = content.Title,
            Content = content.Content,
            Type = content.Type,
            MediaUrl = content.MediaUrl,
            ThumbnailUrl = content.ThumbnailUrl,
            ScheduledDate = content.ScheduledDate,
            PublishedDate = content.PublishedDate,
            Status = content.Status,
            Author = content.Author,
            Tags = string.IsNullOrEmpty(content.Tags) 
                ? new List<string>() 
                : JsonSerializer.Deserialize<List<string>>(content.Tags) ?? new List<string>(),
            Views = content.Views,
            Likes = content.Likes,
            Shares = content.Shares,
            Comments = content.Comments,
            Clicks = content.Clicks,
            Platforms = content.Platforms?.Select(MapToContentPlatformDto).ToList() ?? new List<ContentPlatformDto>(),
            CreatedAt = content.CreatedAt
        };
    }

    private static ContentPlatformDto MapToContentPlatformDto(ContentPlatform platform)
    {
        return new ContentPlatformDto
        {
            Id = platform.Id,
            ContentId = platform.ContentId,
            PlatformId = platform.PlatformId,
            PlatformName = platform.Platform?.Name ?? "Unknown",
            PlatformPostId = platform.PlatformPostId,
            PlatformUrl = platform.PlatformUrl,
            PublishedAt = platform.PublishedAt,
            Status = platform.Status,
            Views = platform.Views,
            Likes = platform.Likes,
            Shares = platform.Shares,
            Comments = platform.Comments,
            Clicks = platform.Clicks
        };
    }
}

public class UpdateCampaignContentCommandHandler : IRequestHandler<UpdateCampaignContentCommand, Result<CampaignContentDto>>
{
    private readonly IApplicationDbContext _context;

    public UpdateCampaignContentCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<CampaignContentDto>> Handle(UpdateCampaignContentCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var content = await _context.CampaignContents
                .Include(c => c.Platforms)
                .FirstOrDefaultAsync(c => c.Id == request.Id, cancellationToken);

            if (content == null)
            {
                return Result<CampaignContentDto>.Failure("Campaign content not found");
            }

            // Update content properties
            content.Title = request.Request.Title;
            content.Content = request.Request.Content;
            content.Type = request.Request.Type;
            content.Status = request.Request.Status;
            content.MediaUrl = request.Request.MediaUrl;
            content.ThumbnailUrl = request.Request.ThumbnailUrl;
            content.ScheduledDate = request.Request.ScheduledDate;
            content.Author = request.Request.Author;
            content.Tags = JsonSerializer.Serialize(request.Request.Tags);
            content.UpdatedAt = DateTime.UtcNow;

            // Update platform associations
            var existingPlatformIds = content.Platforms.Select(p => p.PlatformId).ToList();
            var newPlatformIds = request.Request.PlatformIds;

            // Remove platforms that are no longer associated
            var platformsToRemove = content.Platforms.Where(p => !newPlatformIds.Contains(p.PlatformId)).ToList();
            foreach (var platform in platformsToRemove)
            {
                _context.ContentPlatforms.Remove(platform);
            }

            // Add new platform associations
            var platformsToAdd = newPlatformIds.Where(id => !existingPlatformIds.Contains(id));
            foreach (var platformId in platformsToAdd)
            {
                var contentPlatform = new ContentPlatform
                {
                    Id = Guid.NewGuid(),
                    ContentId = content.Id,
                    PlatformId = platformId,
                    Status = content.Status,
                    CreatedAt = DateTime.UtcNow
                };
                _context.ContentPlatforms.Add(contentPlatform);
            }

            await _context.SaveChangesAsync(cancellationToken);

            // Reload with includes for response
            var updatedContent = await _context.CampaignContents
                .Include(c => c.Platforms)
                    .ThenInclude(cp => cp.Platform)
                .FirstAsync(c => c.Id == content.Id, cancellationToken);

            var contentDto = CreateCampaignContentCommandHandler.MapToCampaignContentDto(updatedContent);
            return Result<CampaignContentDto>.Success(contentDto);
        }
        catch (Exception ex)
        {
            return Result<CampaignContentDto>.Failure($"Error updating campaign content: {ex.Message}");
        }
    }
}

public class DeleteCampaignContentCommandHandler : IRequestHandler<DeleteCampaignContentCommand, Result<bool>>
{
    private readonly IApplicationDbContext _context;

    public DeleteCampaignContentCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<bool>> Handle(DeleteCampaignContentCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var content = await _context.CampaignContents
                .Include(c => c.Platforms)
                .FirstOrDefaultAsync(c => c.Id == request.Id, cancellationToken);

            if (content == null)
            {
                return Result<bool>.Failure("Campaign content not found");
            }

            // Remove related entities
            _context.ContentPlatforms.RemoveRange(content.Platforms);
            _context.CampaignContents.Remove(content);

            await _context.SaveChangesAsync(cancellationToken);

            return Result<bool>.Success(true);
        }
        catch (Exception ex)
        {
            return Result<bool>.Failure($"Error deleting campaign content: {ex.Message}");
        }
    }
}

public class GetCampaignContentsQueryHandler : IRequestHandler<GetCampaignContentsQuery, Result<PaginatedList<CampaignContentDto>>>
{
    private readonly IApplicationDbContext _context;

    public GetCampaignContentsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<PaginatedList<CampaignContentDto>>> Handle(GetCampaignContentsQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var query = _context.CampaignContents
                .Include(c => c.Platforms)
                    .ThenInclude(cp => cp.Platform)
                .Where(c => c.CampaignId == request.CampaignId)
                .AsQueryable();

            // Apply filters
            if (!string.IsNullOrEmpty(request.Status) && Enum.TryParse<ContentStatus>(request.Status, out var status))
            {
                query = query.Where(c => c.Status == status);
            }

            if (!string.IsNullOrEmpty(request.Type) && Enum.TryParse<ContentType>(request.Type, out var type))
            {
                query = query.Where(c => c.Type == type);
            }

            // Apply sorting
            query = query.OrderByDescending(c => c.CreatedAt);

            var totalCount = await query.CountAsync(cancellationToken);
            var contents = await query
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync(cancellationToken);

            var contentDtos = contents.Select(CreateCampaignContentCommandHandler.MapToCampaignContentDto).ToList();

            var paginatedResult = new PaginatedList<CampaignContentDto>(
                contentDtos,
                totalCount,
                request.PageNumber,
                request.PageSize);

            return Result<PaginatedList<CampaignContentDto>>.Success(paginatedResult);
        }
        catch (Exception ex)
        {
            return Result<PaginatedList<CampaignContentDto>>.Failure($"Error retrieving campaign contents: {ex.Message}");
        }
    }
}