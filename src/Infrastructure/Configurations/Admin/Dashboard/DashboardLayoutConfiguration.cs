using Domain.Entities.Admin.Dashboard;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations.Admin.Dashboard;

public class DashboardLayoutConfiguration : IEntityTypeConfiguration<DashboardLayout>
{
    public void Configure(EntityTypeBuilder<DashboardLayout> builder)
    {
        builder.ToTable("DashboardLayouts");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Name)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(x => x.Description)
            .HasMaxLength(500);

        builder.Property(x => x.Configuration)
            .IsRequired()
            .HasColumnType("nvarchar(max)");

        builder.HasOne(x => x.CreatedByUser)
            .WithMany()
            .HasForeignKey(x => x.CreatedByUserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(x => x.Widgets)
            .WithOne(x => x.DashboardLayout)
            .HasForeignKey(x => x.DashboardLayoutId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(x => x.Permissions)
            .WithOne(x => x.DashboardLayout)
            .HasForeignKey(x => x.DashboardLayoutId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(x => x.CreatedByUserId);
        builder.HasIndex(x => x.IsDefault);
        builder.HasIndex(x => x.IsPublic);
    }
}
