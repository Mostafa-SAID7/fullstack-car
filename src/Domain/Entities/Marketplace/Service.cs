namespace Domain.Entities.Marketplace
{
    public class Service : BaseEntity
    {
        public Guid ServiceProviderId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int Duration { get; set; }
        public string Category { get; set; } = string.Empty;
        public bool IsActive { get; set; }

        // Navigation properties
        public ServiceProvider ServiceProvider { get; set; } = null!;
        public ICollection<ServiceBooking> Bookings { get; set; } = new List<ServiceBooking>();
    }
}