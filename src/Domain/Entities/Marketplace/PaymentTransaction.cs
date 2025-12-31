namespace Domain.Entities.Marketplace
{
    public class PaymentTransaction : BaseEntity
    {
        public string TransactionId { get; set; } = string.Empty;
        public Guid? BookingId { get; set; }
        public decimal Amount { get; set; }
        public string Currency { get; set; } = string.Empty;
        public string PaymentMethod { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime ProcessedAt { get; set; }

        // Navigation properties
        public ServiceBooking? Booking { get; set; }
    }
}