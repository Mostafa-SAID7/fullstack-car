namespace Domain.DomainEvents.Marketplace.Bookings;

public class ServiceBookedEvent : BaseDomainEvent
{
    public Guid BookingId { get; }
    public Guid ServiceId { get; }
    public Guid CustomerId { get; }
    public Guid ProviderId { get; }
    public DateTime BookingDate { get; }
    public decimal Amount { get; }

    public ServiceBookedEvent(Guid bookingId, Guid serviceId, Guid customerId, Guid providerId, 
        DateTime bookingDate, decimal amount)
    {
        BookingId = bookingId;
        ServiceId = serviceId;
        CustomerId = customerId;
        ProviderId = providerId;
        BookingDate = bookingDate;
        Amount = amount;
    }
}