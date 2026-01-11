using Application.Common.Models;
using Application.Features.Community.QA.DTOs.Responses;
using MediatR;

namespace Application.Features.Community.QA.Queries;

public class GetTagsQuery : IRequest<Result<List<TagDto>>>
{
    public string? SearchTerm { get; set; }
    public Guid? CategoryId { get; set; }
    public int? MinUsageCount { get; set; }
    public string SortBy { get; set; } = "Name";
    public bool SortDescending { get; set; } = false;
    public int MaxResults { get; set; } = 50;
}

public class GetPopularTagsQuery : IRequest<Result<List<PopularTagDto>>>
{
    public Guid? CategoryId { get; set; }
    public int MaxResults { get; set; } = 20;
    public int DaysBack { get; set; } = 30;
}

public class GetTagDetailQuery : IRequest<Result<TagDto>>
{
    public Guid TagId { get; set; }
}

public class SearchTagsQuery : IRequest<Result<List<TagDto>>>
{
    public string SearchTerm { get; set; } = string.Empty;
    public Guid? CategoryId { get; set; }
    public int MaxResults { get; set; } = 10;
}