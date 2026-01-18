namespace Application.Features.Marketplace.Bookings.DTOs;

public class CancelBookingRequest
{
    public string? CancellationReason { get; set; }
    public bool RefundRequested { get; set; } = false;
}

public class ConfirmBookingRequest
{
    public string? ProviderNotes { get; set; }
    public DateTime? ScheduledDateTime { get; set; }
}

public class CompleteBookingRequest
{
    public string? CompletionNotes { get; set; }
    public List<string>? CompletionPhotos { get; set; }
    public Dictionary<string, object> ServiceDetails { get; set; } = new();
}