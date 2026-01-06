namespace Domain.Entities.Shared.Search;

public class SearchSuggestion : BaseEntity
{
    public string Term { get; set; } = string.Empty;
    public string? Category { get; set; }
    public int UsageCount { get; set; } = 1;
    public double Score { get; set; } = 1.0;
    public bool IsApproved { get; set; } = true;
    public string? Language { get; set; }
    public DateTime LastUsed { get; set; } = DateTime.UtcNow;
}
