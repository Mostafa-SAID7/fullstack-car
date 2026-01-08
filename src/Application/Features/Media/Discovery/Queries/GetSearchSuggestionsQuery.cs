using Application.Common.Models;
using Application.Features.Media.Discovery.DTOs;
using MediatR;

namespace Application.Features.Media.Discovery.Queries;

public class GetSearchSuggestionsQuery : IRequest<Result<List<SearchSuggestionDto>>>
{
    public string Query { get; set; } = string.Empty;
    public int Limit { get; set; } = 10;
    public bool IncludeTags { get; set; } = true;
    public bool IncludeCreators { get; set; } = true;
    public bool IncludeCategories { get; set; } = true;
}