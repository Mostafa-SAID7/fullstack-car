using Application.Common.Models;

namespace Application.Features.Filters.Advanced.DTOs.Responses;

public class FilteredContentResponse
{
    public PaginatedList<FilteredItem> Items { get; set; } = new();
    public FilterSummary Summary { get; set; } = new();
    public List<FilterFacet> Facets { get; set; } = new();
}

public class FilteredItem
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public List<string> Tags { get; set; } = new();
    public int Views { get; set; }
    public int Votes { get; set; }
    public int Comments { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public string AuthorName { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string Excerpt { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
}

public class FilterSummary
{
    public int TotalResults { get; set; }
    public int FilteredResults { get; set; }
    public string AppliedFilters { get; set; } = string.Empty;
    public TimeSpan QueryTime { get; set; }
}

public class FilterFacet
{
    public string Name { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public List<FacetValue> Values { get; set; } = new();
}

public class FacetValue
{
    public string Value { get; set; } = string.Empty;
    public string DisplayValue { get; set; } = string.Empty;
    public int Count { get; set; }
    public bool IsSelected { get; set; }
}