using Domain.Entities.Identity;

namespace Domain.Entities.Admin.System;

public class SystemConfiguration : BaseEntity
{
    public string Key { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
    public ConfigurationType Category { get; set; }
    public string Description { get; set; } = string.Empty;
    public string DataType { get; set; } = "String"; // String, Integer, Boolean, JSON, etc.
    public bool IsEncrypted { get; set; } = false;
    public bool IsReadOnly { get; set; } = false;
    public Guid? ModifiedByUserId { get; set; }
    public DateTime? LastModified { get; set; }

    // Navigation properties
    public ApplicationUser? ModifiedByUser { get; set; }
}