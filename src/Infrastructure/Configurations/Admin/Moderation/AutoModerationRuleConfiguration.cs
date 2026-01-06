using Domain.Entities.Admin.Moderation;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations.Admin.Moderation;

public class AutoModerationRuleConfiguration : IEntityTypeConfiguration<AutoModerationRule>
{
    public void Configure(EntityTypeBuilder<AutoModerationRule> builder)
    {
        builder.ToTable("AutoModerationRules");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Name)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(x => x.Description)
            .HasMaxLength(500);

        builder.Property(x => x.RuleType)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(x => x.Conditions)
            .IsRequired()
            .HasColumnType("nvarchar(max)");

        builder.Property(x => x.Actions)
            .IsRequired()
            .HasColumnType("nvarchar(max)");

        builder.HasOne(x => x.CreatedByUser)
            .WithMany()
            .HasForeignKey(x => x.CreatedByUserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(x => x.IsActive);
        builder.HasIndex(x => x.RuleType);
        builder.HasIndex(x => x.Priority);
        builder.HasIndex(x => x.CreatedByUserId);
    }
}
