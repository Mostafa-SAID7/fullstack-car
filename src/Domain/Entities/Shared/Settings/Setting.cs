namespace Domain.Entities.Shared.Settings;

public class Setting : BaseEntity
{
    public string Key { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Category { get; set; } = "General";
    public bool IsPublic { get; set; } = false;
    public bool IsEncrypted { get; set; } = false;
    public string? ValidationType { get; set; }
    public string? ValidationRule { get; set; }
}