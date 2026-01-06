using Domain.Entities.Admin.Management.Users;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations.Admin.Management;

public class UserSuspensionConfiguration : IEntityTypeConfiguration<UserSuspension>
{
    public void Configure(EntityTypeBuilder<UserSuspension> builder)
    {
        builder.ToTable("UserSuspensions");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Reason)
            .IsRequired()
            .HasConversion<string>();

        builder.Property(x => x.Notes)
            .HasMaxLength(1000);

        builder.HasOne(x => x.User)
            .WithMany()
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(x => x.SuspendedByUser)
            .WithMany()
            .HasForeignKey(x => x.SuspendedByUserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(x => x.UserId);
        builder.HasIndex(x => x.SuspendedByUserId);
        builder.HasIndex(x => x.SuspensionStart);
        builder.HasIndex(x => x.SuspensionEnd);
        builder.HasIndex(x => x.IsActive);
    }
}
