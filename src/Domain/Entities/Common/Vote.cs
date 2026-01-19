using Domain.Base;
using Domain.Enums.Common;
using Domain.Entities.Identity;

namespace Domain.Entities.Common
{
    public class Vote : BaseAuditableEntity
    {
        public VoteType VoteType { get; set; }
        public Domain.Enums.Common.ContentType ContentType { get; set; }
        public Guid ContentId { get; set; }

        // Foreign Keys
        public Guid UserId { get; set; }

        // Navigation Properties
        public virtual ApplicationUser User { get; set; } = null!;
    }
}
