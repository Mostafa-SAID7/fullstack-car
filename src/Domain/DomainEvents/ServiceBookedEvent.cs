namespace Domain.DomainEvents
{
    public class ServiceBookedEvent : BaseDomainEvent
    {
        public Guid BookingId { get; }
        public Guid ServiceId { get; }
        public Guid CustomerId { get; }
        public Guid ServiceProviderId { get; }
        public DateTime BookingDate { get; }
        public decimal Amount { get; }

        public ServiceBookedEvent(Guid bookingId, Guid serviceId, Guid customerId, Guid serviceProviderId, DateTime bookingDate, decimal amount)
        {
            BookingId = bookingId;
            ServiceId = serviceId;
            CustomerId = customerId;
            ServiceProviderId = serviceProviderId;
            BookingDate = bookingDate;
            Amount = amount;
        }
    }
}