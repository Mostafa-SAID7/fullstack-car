namespace Domain.DomainEvents.Marketplace.Payments;

public class PaymentProcessedEvent : BaseDomainEvent
{
    public Guid PaymentId { get; }
    public Guid BookingId { get; }
    public decimal Amount { get; }
    public string Currency { get; }
    public bool IsSuccessful { get; }
    public string? PaymentMethod { get; }

    public PaymentProcessedEvent(Guid paymentId, Guid bookingId, decimal amount, string currency, 
        bool isSuccessful, string? paymentMethod)
    {
        PaymentId = paymentId;
        BookingId = bookingId;
        Amount = amount;
        Currency = currency;
        IsSuccessful = isSuccessful;
        PaymentMethod = paymentMethod;
    }
}
