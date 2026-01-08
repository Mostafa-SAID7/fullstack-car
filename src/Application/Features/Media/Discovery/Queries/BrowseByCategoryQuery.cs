using Application.Common.Models;
using Application.Features.Media.Discovery.DTOs;
using Domain.Enums.Media;
using MediatR;

namespace Application.Features.Media.Discovery.Queries;

public class BrowseByCategoryQuery : IRequest<Result<PaginatedList<MediaSearchResultDto>>>
{
    public string Category { get; set; } = string.Empty;
    public MediaType? MediaType { get; set; }
    public string SortBy { get; set; } = "Popular"; // Popular, Recent, Trending, Alphabetical
    public bool SortDescending { get; set; } = true;
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 20;
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
}