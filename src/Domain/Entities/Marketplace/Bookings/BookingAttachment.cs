using Domain.Entities.Identity;

namespace Domain.Entities.Marketplace.Bookings;

public class BookingAttachment : BaseEntity
{
    public Guid BookingId { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string OriginalFileName { get; set; } = string.Empty;
    public string FilePath { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
    public long FileSize { get; set; }
    public string AttachmentType { get; set; } = string.Empty; // Photo, Document, Invoice, Receipt
    public string? Description { get; set; }
    public Guid UploadedByUserId { get; set; }
    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
    public bool IsPublic { get; set; } = false;

    // Navigation properties
    public ServiceBooking Booking { get; set; } = null!;
    public ApplicationUser UploadedByUser { get; set; } = null!;
}
