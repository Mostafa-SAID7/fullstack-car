namespace Domain.Enums.Marketplace
{
    public enum PaymentStatus
    {
        Pending = 1,
        Paid = 2,
        Failed = 3,
        Refunded = 4,
        PartiallyRefunded = 5,
        Disputed = 6
    }
}