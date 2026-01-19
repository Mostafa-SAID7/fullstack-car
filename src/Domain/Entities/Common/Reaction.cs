using Domain.Base;
using Domain.Enums.Common;
using Domain.Entities.Identity;

namespace Domain.Entities.Common
{
    public class Reaction : BaseEntity
    {
        public Guid UserId { get; set; }
        public ReactionType ReactionType { get; set; }
        
        // Generic Content Reference
        public Domain.Enums.Common.ContentType ContentType { get; set; }
        public Guid ContentId { get; set; }

        // Navigation Properties
        public virtual ApplicationUser User { get; set; } = null!;
    }
}
