using Application.Common.Interfaces.Data;
using Application.Common.Models;
using Application.Features.Marketing.Campaigns.DTOs;
using Application.Features.Marketing.Campaigns.Queries;
using Domain.Entities.Marketing;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace Application.Features.Marketing.Campaigns.Handlers;

public class GetCampaignsQueryHandler : IRequestHandler<GetCampaignsQuery, Result<PaginatedResult<CampaignDto>>>
{
    private readonly IApplicationDbContext _context;

    public GetCampaignsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<PaginatedResult<CampaignDto>>> Handle(GetCampaignsQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var query = _context.Campaigns
                .Include(c => c.Contents)
                .Include(c => c.Platforms)
                    .ThenInclude(cp => cp.Platform)
                .AsQueryable();

            // Apply filters
            if (!string.IsNullOrEmpty(request.SearchTerm))
            {
                query = query.Where(c => c.Name.Contains(request.SearchTerm) || 
                                        (c.Description != null && c.Description.Contains(request.SearchTerm)));
            }

            if (!string.IsNullOrEmpty(request.Status) && Enum.TryParse<CampaignStatus>(request.Status, out var status))
            {
                query = query.Where(c => c.Status == status);
            }

            if (!string.IsNullOrEmpty(request.Type) && Enum.TryParse<CampaignType>(request.Type, out var type))
            {
                query = query.Where(c => c.Type == type);
            }

            if (request.StartDate.HasValue)
            {
                query = query.Where(c => c.StartDate >= request.StartDate.Value);
            }

            if (request.EndDate.HasValue)
            {
                query = query.Where(c => c.EndDate <= request.EndDate.Value || c.EndDate == null);
            }

            // Apply sorting
            query = request.SortBy?.ToLower() switch
            {
                "name" => request.SortDirection?.ToLower() == "desc" 
                    ? query.OrderByDescending(c => c.Name)
                    : query.OrderBy(c => c.Name),
                "startdate" => request.SortDirection?.ToLower() == "desc"
                    ? query.OrderByDescending(c => c.StartDate)
                    : query.OrderBy(c => c.StartDate),
                "budget" => request.SortDirection?.ToLower() == "desc"
                    ? query.OrderByDescending(c => c.Budget)
                    : query.OrderBy(c => c.Budget),
                _ => request.SortDirection?.ToLower() == "desc"
                    ? query.OrderByDescending(c => c.CreatedAt)
                    : query.OrderBy(c => c.CreatedAt)
            };

            var totalCount = await query.CountAsync(cancellationToken);
            var campaigns = await query
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync(cancellationToken);

            var campaignDtos = campaigns.Select(MapToCampaignDto).ToList();

            var paginatedResult = new PaginatedResult<CampaignDto>
            {
                Items = campaignDtos,
                PageNumber = request.PageNumber,
                PageSize = request.PageSize,
                TotalCount = totalCount,
                TotalPages = (int)Math.Ceiling(totalCount / (double)request.PageSize),
                HasPreviousPage = request.PageNumber > 1,
                HasNextPage = request.PageNumber < (int)Math.Ceiling(totalCount / (double)request.PageSize)
            };

            return Result<PaginatedResult<CampaignDto>>.Success(paginatedResult);
        }
        catch (Exception ex)
        {
            return Result<PaginatedResult<CampaignDto>>.Failure($"Error retrieving campaigns: {ex.Message}");
        }
    }

    public static CampaignDto MapToCampaignDto(Campaign campaign)
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
            Contents = campaign.Contents.Select(MapToCampaignContentDto).ToList(),
            Platforms = campaign.Platforms.Select(MapToCampaignPlatformDto).ToList(),
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
            Platforms = content.Platforms.Select(MapToContentPlatformDto).ToList(),
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
            PlatformName = platform.Platform.Name,
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
            PlatformName = platform.Platform.Name,
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

public class GetCampaignByIdQueryHandler : IRequestHandler<GetCampaignByIdQuery, Result<CampaignDto>>
{
    private readonly IApplicationDbContext _context;

    public GetCampaignByIdQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<CampaignDto>> Handle(GetCampaignByIdQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var campaign = await _context.Campaigns
                .Include(c => c.Contents)
                    .ThenInclude(cc => cc.Platforms)
                        .ThenInclude(cp => cp.Platform)
                .Include(c => c.Platforms)
                    .ThenInclude(cp => cp.Platform)
                .FirstOrDefaultAsync(c => c.Id == request.Id, cancellationToken);

            if (campaign == null)
            {
                return Result<CampaignDto>.Failure("Campaign not found");
            }

            var campaignDto = MapToCampaignDto(campaign);
            return Result<CampaignDto>.Success(campaignDto);
        }
        catch (Exception ex)
        {
            return Result<CampaignDto>.Failure($"Error retrieving campaign: {ex.Message}");
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