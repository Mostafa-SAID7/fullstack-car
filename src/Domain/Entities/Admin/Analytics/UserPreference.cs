using Domain.Entities.Identity;

namespace Domain.Entities.Admin.Analytics;

public class UserPreference : BaseEntity
{
    public Guid UserId { get; set; }
    public string PreferenceKey { get; set; } = string.Empty;
    public string PreferenceValue { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;

    // Navigation properties
    public ApplicationUser User { get; set; } = null!;
}
