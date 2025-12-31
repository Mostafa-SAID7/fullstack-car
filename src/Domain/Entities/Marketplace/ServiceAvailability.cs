using Domain.Base;

namespace Domain.Entities.Marketplace
{
    public class ServiceAvailability : BaseAuditableEntity
    {
        public DayOfWeek DayOfWeek { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public bool IsAvailable { get; set; } = true;
        public string? Notes { get; set; }

        // Foreign Keys
        public Guid ServiceId { get; set; }

        // Navigation Properties
        public virtual CarService Service { get; set; } = null!;
    }
}