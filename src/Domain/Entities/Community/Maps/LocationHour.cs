using Domain.Base;
using Domain.Enums.Community.Maps;

namespace Domain.Entities.Community.Maps
{
    public class LocationHour : BaseEntity
    {
        public DayOfWeek DayOfWeek { get; set; }
        public TimeSpan? OpenTime { get; set; }
        public TimeSpan? CloseTime { get; set; }
        public bool IsClosed { get; set; } = false;
        public bool Is24Hours { get; set; } = false;
        public string? Notes { get; set; }

        // Foreign Keys
        public Guid LocationId { get; set; }

        // Navigation Properties
        public virtual Location Location { get; set; } = null!;
    }
}
