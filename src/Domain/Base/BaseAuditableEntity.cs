using System;

namespace Domain.Base
{
    public abstract class BaseAuditableEntity : BaseEntity
    {
        public string? LastModifiedBy { get; set; }
        public DateTime? LastModifiedAt { get; set; }
        public int Version { get; set; } = 1;
    }
}