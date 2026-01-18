namespace Application.Features.Shared.Categories.DTOs;

public class SharedCategoryDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string ModuleType { get; set; } = string.Empty;
    public Guid? ParentId { get; set; }
    public int ItemCount { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public Dictionary<string, object> Metadata { get; set; } = new();
}

public class CategoryHierarchyDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int Level { get; set; }
    public List<CategoryHierarchyDto> Children { get; set; } = new();
}

public class PopularCategoryDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string ModuleType { get; set; } = string.Empty;
    public int ItemCount { get; set; }
    public double TrendingScore { get; set; }
    public double GrowthRate { get; set; }
}
