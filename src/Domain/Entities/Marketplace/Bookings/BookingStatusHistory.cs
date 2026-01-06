using Domain.Entities.Identity;

using Domain.Enums.Marketplace;

namespace Domain.Entities.Marketplace.Bookings;

public class BookingStatusHistory : BaseEntity
{
    public Guid BookingId { get; set; }
    public BookingStatus FromStatus { get; set; }
    public BookingStatus ToStatus { get; set; }
    public DateTime ChangedAt { get; set; } = DateTime.UtcNow;
    public Guid? ChangedByUserId { get; set; }
    public string? Reason { get; set; }
    public string? Notes { get; set; }
    public bool IsSystemGenerated { get; set; } = false;

    // Navigation properties
    public ServiceBooking Booking { get; set; } = null!;
    public ApplicationUser? ChangedByUser { get; set; }
}
