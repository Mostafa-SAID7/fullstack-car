using Application.Common.Models;
using Application.Features.Marketing.Campaigns.DTOs;
using MediatR;

namespace Application.Features.Marketing.Campaigns.Queries;

public class GetCampaignsQuery : IRequest<Result<PaginatedResult<CampaignDto>>>
{
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? SearchTerm { get; set; }
    public string? Status { get; set; }
    public string? Type { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public string? SortBy { get; set; } = "CreatedAt";
    public string? SortDirection { get; set; } = "desc";
}

public class GetCampaignByIdQuery : IRequest<Result<CampaignDto>>
{
    public Guid Id { get; set; }

    public GetCampaignByIdQuery(Guid id)
    {
        Id = id;
    }
}

public class GetCampaignContentsQuery : IRequest<Result<PaginatedResult<CampaignContentDto>>>
{
    public Guid CampaignId { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? Status { get; set; }
    public string? Type { get; set; }

    public GetCampaignContentsQuery(Guid campaignId)
    {
        CampaignId = campaignId;
    }
}