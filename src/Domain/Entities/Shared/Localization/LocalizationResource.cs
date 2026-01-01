namespace Domain.Entities.Shared.Localization;

public class LocalizationResource : BaseEntity
{
    public string Key { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
    public string Culture { get; set; } = string.Empty;
    public string? Category { get; set; }
    public string? Description { get; set; }
    public bool IsApproved { get; set; } = false;
    public Guid? ApprovedByUserId { get; set; }
    public DateTime? ApprovedAt { get; set; }
}