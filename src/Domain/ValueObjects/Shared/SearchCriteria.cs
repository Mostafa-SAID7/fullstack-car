namespace Domain.ValueObjects.Shared;

public class SearchCriteria : ValueObject
{
    public string Query { get; private set; }
    public SearchType SearchType { get; private set; }
    public Dictionary<string, object> Filters { get; private set; }
    public string? SortBy { get; private set; }
    public SortOrder SortOrder { get; private set; }
    public int PageSize { get; private set; }
    public int PageNumber { get; private set; }

    private SearchCriteria() 
    { 
        Filters = new Dictionary<string, object>();
    } // For EF Core

    public SearchCriteria(string query, SearchType searchType, 
        Dictionary<string, object>? filters = null, string? sortBy = null, 
        SortOrder sortOrder = SortOrder.Descending, int pageSize = 20, int pageNumber = 1)
    {
        if (string.IsNullOrWhiteSpace(query))
            throw new ArgumentException("Search query cannot be empty", nameof(query));
        
        if (pageSize <= 0 || pageSize > 100)
            throw new ArgumentException("Page size must be between 1 and 100", nameof(pageSize));
        
        if (pageNumber <= 0)
            throw new ArgumentException("Page number must be greater than 0", nameof(pageNumber));

        Query = query.Trim();
        SearchType = searchType;
        Filters = filters ?? new Dictionary<string, object>();
        SortBy = sortBy;
        SortOrder = sortOrder;
        PageSize = pageSize;
        PageNumber = pageNumber;
    }

    public int Skip => (PageNumber - 1) * PageSize;

    protected override IEnumerable<object> GetEqualityComponents()
    {
        yield return Query;
        yield return SearchType;
        yield return SortBy ?? string.Empty;
        yield return SortOrder;
        yield return PageSize;
        yield return PageNumber;
        
        foreach (var filter in Filters.OrderBy(x => x.Key))
        {
            yield return filter.Key;
            yield return filter.Value;
        }
    }
}