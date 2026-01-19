using Domain.Base;
using Domain.Enums.Common;

namespace Domain.Entities.Common
{
    public class Category : BaseAuditableEntity
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? IconUrl { get; set; }
        public string Color { get; set; } = "#000000"; // Hex color code
        public Domain.Enums.Common.ContentType ContentType { get; set; } // What this category is for
        public bool IsActive { get; set; } = true;
        
        public Guid? ParentCategoryId { get; set; }
        public virtual Category? ParentCategory { get; set; }
        public virtual ICollection<Category> SubCategories { get; set; } = new List<Category>();
    }
}
