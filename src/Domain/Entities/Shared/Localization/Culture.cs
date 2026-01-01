namespace Domain.Entities.Shared.Localization;

public class Culture : BaseEntity
{
    public string Code { get; set; } = string.Empty; // e.g., "en-US", "ar-AE"
    public string Name { get; set; } = string.Empty; // e.g., "English (United States)"
    public string NativeName { get; set; } = string.Empty; // e.g., "English (United States)"
    public bool IsRightToLeft { get; set; } = false;
    public bool IsEnabled { get; set; } = true;
    public bool IsDefault { get; set; } = false;
    public string? FlagIcon { get; set; }
    public int SortOrder { get; set; } = 0;

    // Navigation properties
    public ICollection<LocalizationResource> Resources { get; set; } = new List<LocalizationResource>();
}