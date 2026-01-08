using Application.Common.Models;
using Application.Features.Media.Discovery.DTOs;
using Domain.Enums.Media;
using MediatR;

namespace Application.Features.Media.Discovery.Queries;

public class SearchMediaQuery : IRequest<Result<PaginatedList<MediaSearchResultDto>>>
{
    public string? SearchTerm { get; set; }
    public MediaType? MediaType { get; set; } // Video, Podcast, or both
    public string? Category { get; set; }
    public string? Tags { get; set; }
    public VideoQuality? Quality { get; set; }
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
    public int? MinDuration { get; set; } // in seconds
    public int? MaxDuration { get; set; } // in seconds
    public int? MinViews { get; set; }
    public int? MinLikes { get; set; }
    public Guid? CreatorId { get; set; }
    public bool? IsPublic { get; set; } = true;
    public string SortBy { get; set; } = "Relevance"; // Relevance, Date, Views, Likes, Duration
    public bool SortDescending { get; set; } = true;
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}