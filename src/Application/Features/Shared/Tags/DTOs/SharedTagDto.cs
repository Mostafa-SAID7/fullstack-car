namespace Application.Features.Shared.Tags.DTOs;

public class SharedTagDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string ModuleType { get; set; } = string.Empty;
    public int UsageCount { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public Dictionary<string, object> Metadata { get; set; } = new();
}

public class PopularTagDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string ModuleType { get; set; } = string.Empty;
    public int UsageCount { get; set; }
    public double TrendingScore { get; set; }
    public double GrowthRate { get; set; }
}

public class TagSuggestionDto
{
    public string TagName { get; set; } = string.Empty;
    public double Confidence { get; set; }
    public string Reason { get; set; } = string.Empty;
}

public class TagSuggestionRequest
{
    public string Content { get; set; } = string.Empty;
    public string? ModuleType { get; set; }
    public int MaxSuggestions { get; set; } = 10;
}