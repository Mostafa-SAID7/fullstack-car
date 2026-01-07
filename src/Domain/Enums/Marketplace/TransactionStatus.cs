namespace Domain.Enums.Marketplace;

public enum TransactionStatus
{
    Pending = 0,
    Processing = 1,
    Completed = 2,
    Failed = 3,
    Cancelled = 4,
    Refunded = 5,
    PartiallyRefunded = 6,
    Disputed = 7,
    Authorized = 8,
    Captured = 9
}