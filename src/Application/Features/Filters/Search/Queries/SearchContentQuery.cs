using Application.Common.Models;
using Application.Features.Filters.Search.DTOs.Responses;
using MediatR;

namespace Application.Features.Filters.Search.Queries;

public class SearchContentQuery : IRequest<Result<SearchContentResponse>>
{
    public string SearchTerm { get; set; } = string.Empty;
    public List<string> ContentTypes { get; set; } = new();
    public List<string> Categories { get; set; } = new();
    public List<string> Tags { get; set; } = new();
    public string SearchType { get; set; } = "full"; // full, title, content, tags
    public bool IncludeHighlights { get; set; } = true;
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}