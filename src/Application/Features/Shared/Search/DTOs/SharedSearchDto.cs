namespace Application.Features.Shared.Search.DTOs;

public class GlobalSearchResultsDto
{
    public string SearchTerm { get; set; } = string.Empty;
    public int TotalResults { get; set; }
    public TimeSpan SearchTime { get; set; }
    public List<GlobalSearchItemDto> Results { get; set; } = new();
    public Dictionary<string, List<SearchFacetDto>> Facets { get; set; } = new();
}

public class GlobalSearchItemDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public double RelevanceScore { get; set; }
    public DateTime CreatedAt { get; set; }
    public string Author { get; set; } = string.Empty;
    public List<string> Tags { get; set; } = new();
    public Dictionary<string, object> Metadata { get; set; } = new();
}

public class SearchFacetDto
{
    public string Name { get; set; } = string.Empty;
    public int Count { get; set; }
}

public class SearchSuggestionDto
{
    public string Text { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public int Count { get; set; }
}

public class TrendingSearchDto
{
    public string Term { get; set; } = string.Empty;
    public int Count { get; set; }
    public string Trend { get; set; } = string.Empty; // up, down, stable
}

public class AdvancedSearchRequest
{
    public string SearchTerm { get; set; } = string.Empty;
    public List<string> ContentTypes { get; set; } = new();
    public List<string> Tags { get; set; } = new();
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
    public string SortBy { get; set; } = "Relevance";
    public bool SortDescending { get; set; } = true;
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 20;
    public Dictionary<string, object> Filters { get; set; } = new();
}
