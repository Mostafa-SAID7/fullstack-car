namespace Application.Features.Shared.Email.Models
{
    public class EmailDeliveryStatus
    {
        public string MessageId { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string? Recipient { get; set; }
        public DateTime? DeliveredAt { get; set; }
        public DateTime? OpenedAt { get; set; }
        public DateTime? ClickedAt { get; set; }
        public DateTime? BouncedAt { get; set; }
        public string? BounceReason { get; set; }
        public List<EmailEvent> Events { get; set; } = new();
    }
}
