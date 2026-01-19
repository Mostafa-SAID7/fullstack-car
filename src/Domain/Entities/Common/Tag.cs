using Domain.Base;
using Domain.Enums.Common;

namespace Domain.Entities.Common
{
    public class Tag : BaseAuditableEntity
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int UsageCount { get; set; } = 0;
        public Guid? CategoryId { get; set; }
        public Domain.Enums.Common.ContentType ContentType { get; set; }

        // Navigation Properties
        public virtual Category? Category { get; set; }
    }
}
