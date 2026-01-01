namespace Domain.Entities.Shared.Search;

public class SearchQuery : BaseEntity
{
    public string Query { get; set; } = string.Empty;
    public string? UserId { get; set; }
    public string? SessionId { get; set; }
    public string SearchType { get; set; } = string.Empty; // Global, Posts, Users, Services, etc.
    public string? Filters { get; set; } // JSON filters
    public string? SortBy { get; set; }
    public string? SortOrder { get; set; } // Asc, Desc
    public int ResultsCount { get; set; }
    public TimeSpan ExecutionTime { get; set; }
    public string? IpAddress { get; set; }
    public string? UserAgent { get; set; }
    public DateTime SearchedAt { get; set; } = DateTime.UtcNow;
}