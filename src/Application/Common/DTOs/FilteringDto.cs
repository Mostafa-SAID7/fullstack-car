using System.Text.Json.Serialization;

namespace Application.Common.DTOs;

/// <summary>
/// Base filtering DTO for system queries that works with both Angular and React
/// </summary>
public class BaseFilterDto
{
    [JsonPropertyName("pageNumber")]
    public int PageNumber { get; set; } = 1;

    [JsonPropertyName("pageSize")]
    public int PageSize { get; set; } = 10;

    [JsonPropertyName("sortBy")]
    public string? SortBy { get; set; }

    [JsonPropertyName("sortDirection")]
    public string SortDirection { get; set; } = "desc"; // "asc" or "desc"

    [JsonPropertyName("searchTerm")]
    public string? SearchTerm { get; set; }

    public virtual void ValidateAndNormalize()
    {
        PageNumber = Math.Max(1, PageNumber);
        PageSize = Math.Clamp(PageSize, 1, 100); // Limit page size to prevent abuse
        SortDirection = SortDirection?.ToLowerInvariant() == "asc" ? "asc" : "desc";
        SearchTerm = string.IsNullOrWhiteSpace(SearchTerm) ? null : SearchTerm.Trim();
    }
}

/// <summary>
/// Date range filtering DTO for content with date-based filtering
/// </summary>
public class DateRangeFilterDto : BaseFilterDto
{
    [JsonPropertyName("dateFrom")]
    public DateTime? DateFrom { get; set; }

    [JsonPropertyName("dateTo")]
    public DateTime? DateTo { get; set; }

    public override void ValidateAndNormalize()
    {
        base.ValidateAndNormalize();
        
        // Ensure date range is valid
        if (DateFrom.HasValue && DateTo.HasValue && DateFrom > DateTo)
        {
            (DateFrom, DateTo) = (DateTo, DateFrom);
        }
    }
}

/// <summary>
/// User-based filtering DTO for content associated with users
/// </summary>
public class UserFilterDto : DateRangeFilterDto
{
    [JsonPropertyName("userId")]
    public Guid? UserId { get; set; }

    [JsonPropertyName("includeInactive")]
    public bool IncludeInactive { get; set; } = false;
}

/// <summary>
/// Category and tag filtering DTO for content with categorization
/// </summary>
public class CategoryTagFilterDto : DateRangeFilterDto
{
    [JsonPropertyName("categories")]
    public List<string> Categories { get; set; } = new();

    [JsonPropertyName("tags")]
    public List<string> Tags { get; set; } = new();

    public override void ValidateAndNormalize()
    {
        base.ValidateAndNormalize();
        
        Categories = Categories?.Where(c => !string.IsNullOrWhiteSpace(c)).Select(c => c.Trim()).ToList() ?? new List<string>();
        Tags = Tags?.Where(t => !string.IsNullOrWhiteSpace(t)).Select(t => t.Trim()).ToList() ?? new List<string>();
    }
}

/// <summary>
/// Content type filtering DTO for mixed content searches
/// </summary>
public class ContentTypeFilterDto : CategoryTagFilterDto
{
    [JsonPropertyName("contentTypes")]
    public List<string> ContentTypes { get; set; } = new();

    [JsonPropertyName("includeContent")]
    public bool IncludeContent { get; set; } = true;

    [JsonPropertyName("includeMetadata")]
    public bool IncludeMetadata { get; set; } = true;

    public override void ValidateAndNormalize()
    {
        base.ValidateAndNormalize();
        
        ContentTypes = ContentTypes?.Where(ct => !string.IsNullOrWhiteSpace(ct)).Select(ct => ct.Trim()).ToList() ?? new List<string>();
    }
}