using Application.Common.Interfaces.Data;
using Application.Common.Models;
using Application.Features.Marketing.Campaigns.Commands;
using Application.Features.Marketing.Campaigns.DTOs;
using Domain.Entities.Marketing;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace Application.Features.Marketing.Campaigns.Handlers;

public class CreateCampaignCommandHandler : IRequestHandler<CreateCampaignCommand, Result<CampaignDto>>
{
    private readonly IApplicationDbContext _context;

    public CreateCampaignCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<CampaignDto>> Handle(CreateCampaignCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var campaign = new Campaign
            {
                Id = Guid.NewGuid(),
                Name = request.Request.Name,
                Description = request.Request.Description,
                Type = request.Request.Type,
                Status = CampaignStatus.Draft,
                StartDate = request.Request.StartDate,
                EndDate = request.Request.EndDate,
                Budget = request.Request.Budget,
                SpentAmount = 0,
                TargetAudience = request.Request.TargetAudience,
                Tags = JsonSerializer.Serialize(request.Request.Tags),
                CreatedAt = DateTime.UtcNow
            };

            _context.Campaigns.Add(campaign);

            // Add platform associations
            foreach (var platformId in request.Request.PlatformIds)
            {
                var campaignPlatform = new CampaignPlatform
                {
                    Id = Guid.NewGuid(),
                    CampaignId = campaign.Id,
                    PlatformId = platformId,
                    IsActive = true,
                    Budget = 0,
                    SpentAmount = 0,
                    CreatedAt = DateTime.UtcNow
                };
                _context.CampaignPlatforms.Add(campaignPlatform);
            }

            await _context.SaveChangesAsync(cancellationToken);

            // Reload with includes for response
            var createdCampaign = await _context.Campaigns
                .Include(c => c.Contents)
                .Include(c => c.Platforms)
                    .ThenInclude(cp => cp.Platform)
                .FirstAsync(c => c.Id == campaign.Id, cancellationToken);

            var campaignDto = MapToCampaignDto(createdCampaign);
            return Result<CampaignDto>.Success(campaignDto);
        }
        catch (Exception ex)
        {
            return Result<CampaignDto>.Failure($"Error creating campaign: {ex.Message}");
        }
    }

    private static CampaignDto MapToCampaignDto(Campaign campaign)
    {
        return new CampaignDto
        {
            Id = campaign.Id,
            Name = campaign.Name,
            Description = campaign.Description,
            Type = campaign.Type,
            Status = campaign.Status,
            StartDate = campaign.StartDate,
            EndDate = campaign.EndDate,
            Budget = campaign.Budget,
            SpentAmount = campaign.SpentAmount,
            TargetAudience = campaign.TargetAudience,
            Tags = string.IsNullOrEmpty(campaign.Tags) 
                ? new List<string>() 
                : JsonSerializer.Deserialize<List<string>>(campaign.Tags) ?? new List<string>(),
            Impressions = campaign.Impressions,
            Reach = campaign.Reach,
            Engagement = campaign.Engagement,
            Clicks = campaign.Clicks,
            EngagementRate = campaign.EngagementRate,
            ClickThroughRate = campaign.ClickThroughRate,
            Contents = campaign.Contents?.Select(MapToCampaignContentDto).ToList() ?? new List<CampaignContentDto>(),
            Platforms = campaign.Platforms?.Select(MapToCampaignPlatformDto).ToList() ?? new List<CampaignPlatformDto>(),
            CreatedAt = campaign.CreatedAt,
            UpdatedAt = campaign.UpdatedAt
        };
    }

    private static CampaignContentDto MapToCampaignContentDto(CampaignContent content)
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

    private static CampaignPlatformDto MapToCampaignPlatformDto(CampaignPlatform platform)
    {
        return new CampaignPlatformDto
        {
            Id = platform.Id,
            CampaignId = platform.CampaignId,
            PlatformId = platform.PlatformId,
            PlatformName = platform.Platform?.Name ?? "Unknown",
            IsActive = platform.IsActive,
            Budget = platform.Budget,
            SpentAmount = platform.SpentAmount,
            Impressions = platform.Impressions,
            Reach = platform.Reach,
            Engagement = platform.Engagement,
            Clicks = platform.Clicks
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

public class UpdateCampaignCommandHandler : IRequestHandler<UpdateCampaignCommand, Result<CampaignDto>>
{
    private readonly IApplicationDbContext _context;

    public UpdateCampaignCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<CampaignDto>> Handle(UpdateCampaignCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var campaign = await _context.Campaigns
                .Include(c => c.Platforms)
                .FirstOrDefaultAsync(c => c.Id == request.Id, cancellationToken);

            if (campaign == null)
            {
                return Result<CampaignDto>.Failure("Campaign not found");
            }

            // Update campaign properties
            campaign.Name = request.Request.Name;
            campaign.Description = request.Request.Description;
            campaign.Type = request.Request.Type;
            campaign.Status = request.Request.Status;
            campaign.StartDate = request.Request.StartDate;
            campaign.EndDate = request.Request.EndDate;
            campaign.Budget = request.Request.Budget;
            campaign.TargetAudience = request.Request.TargetAudience;
            campaign.Tags = JsonSerializer.Serialize(request.Request.Tags);
            campaign.UpdatedAt = DateTime.UtcNow;

            // Update platform associations
            var existingPlatformIds = campaign.Platforms.Select(p => p.PlatformId).ToList();
            var newPlatformIds = request.Request.PlatformIds;

            // Remove platforms that are no longer associated
            var platformsToRemove = campaign.Platforms.Where(p => !newPlatformIds.Contains(p.PlatformId)).ToList();
            foreach (var platform in platformsToRemove)
            {
                _context.CampaignPlatforms.Remove(platform);
            }

            // Add new platform associations
            var platformsToAdd = newPlatformIds.Where(id => !existingPlatformIds.Contains(id));
            foreach (var platformId in platformsToAdd)
            {
                var campaignPlatform = new CampaignPlatform
                {
                    Id = Guid.NewGuid(),
                    CampaignId = campaign.Id,
                    PlatformId = platformId,
                    IsActive = true,
                    Budget = 0,
                    SpentAmount = 0,
                    CreatedAt = DateTime.UtcNow
                };
                _context.CampaignPlatforms.Add(campaignPlatform);
            }

            await _context.SaveChangesAsync(cancellationToken);

            // Reload with includes for response
            var updatedCampaign = await _context.Campaigns
                .Include(c => c.Contents)
                .Include(c => c.Platforms)
                    .ThenInclude(cp => cp.Platform)
                .FirstAsync(c => c.Id == campaign.Id, cancellationToken);

            var campaignDto = MapToCampaignDto(updatedCampaign);
            return Result<CampaignDto>.Success(campaignDto);
        }
        catch (Exception ex)
        {
            return Result<CampaignDto>.Failure($"Error updating campaign: {ex.Message}");
        }
    }

    private static CampaignDto MapToCampaignDto(Campaign campaign)
    {
        return new CampaignDto
        {
            Id = campaign.Id,
            Name = campaign.Name,
            Description = campaign.Description,
            Type = campaign.Type,
            Status = campaign.Status,
            StartDate = campaign.StartDate,
            EndDate = campaign.EndDate,
            Budget = campaign.Budget,
            SpentAmount = campaign.SpentAmount,
            TargetAudience = campaign.TargetAudience,
            Tags = string.IsNullOrEmpty(campaign.Tags) 
                ? new List<string>() 
                : JsonSerializer.Deserialize<List<string>>(campaign.Tags) ?? new List<string>(),
            Impressions = campaign.Impressions,
            Reach = campaign.Reach,
            Engagement = campaign.Engagement,
            Clicks = campaign.Clicks,
            EngagementRate = campaign.EngagementRate,
            ClickThroughRate = campaign.ClickThroughRate,
            Contents = campaign.Contents?.Select(MapToCampaignContentDto).ToList() ?? new List<CampaignContentDto>(),
            Platforms = campaign.Platforms?.Select(MapToCampaignPlatformDto).ToList() ?? new List<CampaignPlatformDto>(),
            CreatedAt = campaign.CreatedAt,
            UpdatedAt = campaign.UpdatedAt
        };
    }

    private static CampaignContentDto MapToCampaignContentDto(CampaignContent content)
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

    private static CampaignPlatformDto MapToCampaignPlatformDto(CampaignPlatform platform)
    {
        return new CampaignPlatformDto
        {
            Id = platform.Id,
            CampaignId = platform.CampaignId,
            PlatformId = platform.PlatformId,
            PlatformName = platform.Platform?.Name ?? "Unknown",
            IsActive = platform.IsActive,
            Budget = platform.Budget,
            SpentAmount = platform.SpentAmount,
            Impressions = platform.Impressions,
            Reach = platform.Reach,
            Engagement = platform.Engagement,
            Clicks = platform.Clicks
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

public class DeleteCampaignCommandHandler : IRequestHandler<DeleteCampaignCommand, Result<bool>>
{
    private readonly IApplicationDbContext _context;

    public DeleteCampaignCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<bool>> Handle(DeleteCampaignCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var campaign = await _context.Campaigns
                .Include(c => c.Contents)
                .Include(c => c.Platforms)
                .FirstOrDefaultAsync(c => c.Id == request.Id, cancellationToken);

            if (campaign == null)
            {
                return Result<bool>.Failure("Campaign not found");
            }

            // Remove related entities
            _context.CampaignPlatforms.RemoveRange(campaign.Platforms);
            _context.CampaignContents.RemoveRange(campaign.Contents);
            _context.Campaigns.Remove(campaign);

            await _context.SaveChangesAsync(cancellationToken);

            return Result<bool>.Success(true);
        }
        catch (Exception ex)
        {
            return Result<bool>.Failure($"Error deleting campaign: {ex.Message}");
        }
    }
}