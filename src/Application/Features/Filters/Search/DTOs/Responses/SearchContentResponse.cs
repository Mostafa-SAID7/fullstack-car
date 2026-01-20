using Application.Common.Models;

namespace Application.Features.Filters.Search.DTOs.Responses;

public class SearchContentResponse
{
    public PaginatedList<SearchResultItem> Results { get; set; } = new();
    public SearchMetadata Metadata { get; set; } = new();
    public List<SearchSuggestion> Suggestions { get; set; } = new();
}

public class SearchResultItem
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public List<string> Tags { get; set; } = new();
    public string Excerpt { get; set; } = string.Empty;
    public List<SearchHighlight> Highlights { get; set; } = new();
    public double RelevanceScore { get; set; }
    public DateTime CreatedAt { get; set; }
    public string AuthorName { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
}

public class SearchHighlight
{
    public string Field { get; set; } = string.Empty;
    public List<string> Fragments { get; set; } = new();
}

public class SearchMetadata
{
    public string Query { get; set; } = string.Empty;
    public int TotalResults { get; set; }
    public TimeSpan QueryTime { get; set; }
    public List<string> AppliedFilters { get; set; } = new();
}

public class SearchSuggestion
{
    public string Text { get; set; } = string.Empty;
    public int ResultCount { get; set; }
    public string Type { get; set; } = string.Empty; // spelling, completion, related
}