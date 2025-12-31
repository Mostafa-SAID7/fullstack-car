using Domain.Entities.Admin.Management;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations.Admin.Management;

public class AdminActionConfiguration : IEntityTypeConfiguration<AdminAction>
{
    public void Configure(EntityTypeBuilder<AdminAction> builder)
    {
        builder.ToTable("AdminActions");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.ActionType)
            .IsRequired()
            .HasConversion<string>();

        builder.Property(x => x.Description)
            .IsRequired()
            .HasMaxLength(500);

        builder.Property(x => x.TargetEntityType)
            .HasMaxLength(100);

        builder.Property(x => x.Reason)
            .HasMaxLength(1000);

        builder.Property(x => x.AdditionalData)
            .HasColumnType("nvarchar(max)");

        builder.HasOne(x => x.AdminUser)
            .WithMany()
            .HasForeignKey(x => x.AdminUserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(x => x.TargetUser)
            .WithMany()
            .HasForeignKey(x => x.TargetUserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(x => x.AdminUserId);
        builder.HasIndex(x => x.TargetUserId);
        builder.HasIndex(x => x.ActionDate);
        builder.HasIndex(x => x.ActionType);
    }
}