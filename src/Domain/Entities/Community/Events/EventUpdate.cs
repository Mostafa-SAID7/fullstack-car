using Domain.Base;
using Domain.Entities.Identity;

namespace Domain.Entities.Community.Events
{
    public class EventUpdate : BaseAuditableEntity
    {
        public Guid EventId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string UpdateType { get; set; } = "General"; // General, Important, Cancellation, Postponement
        public bool IsImportant { get; set; } = false;
        public bool NotifyAttendees { get; set; } = true;
        public DateTime? NotifiedAt { get; set; }

        // Navigation Properties
        public virtual Event Event { get; set; } = null!;
        public virtual ApplicationUser CreatedByUser { get; set; } = null!;
    }
}