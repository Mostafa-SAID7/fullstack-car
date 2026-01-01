namespace Domain.Entities.Shared.Search;

public class SearchIndex : BaseEntity
{
    public string EntityType { get; set; } = string.Empty; // Post, User, Service, etc.
    public Guid EntityId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string? Tags { get; set; }
    public string? Category { get; set; }
    public string? Metadata { get; set; } // JSON metadata
    public double SearchScore { get; set; } = 1.0;
    public bool IsActive { get; set; } = true;
    public DateTime LastIndexed { get; set; } = DateTime.UtcNow;
    public string? Language { get; set; }
    public Priority Priority { get; set; } = Priority.Normal;
}