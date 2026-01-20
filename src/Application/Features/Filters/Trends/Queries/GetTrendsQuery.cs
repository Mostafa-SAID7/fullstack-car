using Application.Common.Models;
using Application.Features.Filters.Trends.DTOs.Responses;
using MediatR;

namespace Application.Features.Filters.Trends.Queries;

public class GetTrendsQuery : IRequest<Result<TrendsResponse>>
{
    public string ContentType { get; set; } = string.Empty;
    public string TimeFrame { get; set; } = "week"; // hour, day, week, month, year
    public int Limit { get; set; } = 10;
    public string Category { get; set; } = string.Empty;
    public string SortBy { get; set; } = "popularity"; // popularity, engagement, views, votes
}