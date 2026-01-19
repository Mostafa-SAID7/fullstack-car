namespace Application.Features.Community.DTOs.Responses;

public class CategoryDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? IconUrl { get; set; }
    public string? Color { get; set; }
    public int QuestionCount { get; set; }
    public int ExpertCount { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class TagDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int UsageCount { get; set; }
    public string? Category { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class PopularTagDto
{
    public string Name { get; set; } = string.Empty;
    public int UsageCount { get; set; }
    public int TrendingScore { get; set; }
}
