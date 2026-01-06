using Domain.Base;

namespace Domain.Entities.Community.Maps
{
    public class LocationCategory : BaseAuditableEntity
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? IconUrl { get; set; }
        public string Color { get; set; } = "#000000";
        public int LocationsCount { get; set; } = 0;
        public int SortOrder { get; set; } = 0;
        public bool IsActive { get; set; } = true;

        // Foreign Keys
        public Guid? ParentCategoryId { get; set; }

        // Navigation Properties
        public virtual LocationCategory? ParentCategory { get; set; }
        public virtual ICollection<LocationCategory> SubCategories { get; set; } = new List<LocationCategory>();
        public virtual ICollection<Location> Locations { get; set; } = new List<Location>();
    }
}
