namespace Domain.Entities.Marketplace.Services;

public class ServiceImage : BaseEntity
{
    public Guid ServiceId { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public string? AltText { get; set; }
    public string? Caption { get; set; }
    public bool IsPrimary { get; set; } = false;
    public int SortOrder { get; set; } = 0;
    public string? ImageType { get; set; } // Before, After, Process, Equipment
    public long FileSize { get; set; }
    public string? ContentType { get; set; }

    // Navigation properties
    public Service Service { get; set; } = null!;
}
