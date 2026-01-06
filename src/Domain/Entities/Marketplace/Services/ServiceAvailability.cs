namespace Domain.Entities.Marketplace.Services;

public class ServiceAvailability : BaseEntity
{
    public Guid ServiceId { get; set; }
    public DayOfWeek DayOfWeek { get; set; }
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
    public bool IsAvailable { get; set; } = true;
    public DateTime? SpecificDate { get; set; } // For specific date overrides
    public bool IsHoliday { get; set; } = false;
    public string? Notes { get; set; }
    public int MaxBookingsPerSlot { get; set; } = 1;
    public int SlotDuration { get; set; } = 60; // in minutes

    // Navigation properties
    public Service Service { get; set; } = null!;
}
