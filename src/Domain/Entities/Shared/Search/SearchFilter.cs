namespace Domain.Entities.Shared.Search;

public class SearchFilter : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public string FilterType { get; set; } = string.Empty; // Text, Number, Date, Boolean, Select
    public string? Options { get; set; } // JSON options for select filters
    public string? DefaultValue { get; set; }
    public bool IsRequired { get; set; } = false;
    public bool IsActive { get; set; } = true;
    public int SortOrder { get; set; } = 0;
    public string? Category { get; set; }
    public string? ValidationRule { get; set; }
}