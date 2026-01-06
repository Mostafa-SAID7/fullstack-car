using Domain.Entities.Admin.Dashboard;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations.Admin.Dashboard;

public class DashboardWidgetConfiguration : IEntityTypeConfiguration<DashboardWidget>
{
    public void Configure(EntityTypeBuilder<DashboardWidget> builder)
    {
        builder.ToTable("DashboardWidgets");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Name)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(x => x.Type)
            .IsRequired()
            .HasConversion<string>();

        builder.Property(x => x.Configuration)
            .IsRequired()
            .HasColumnType("nvarchar(max)");

        builder.Property(x => x.DataSource)
            .HasMaxLength(200);

        builder.HasOne(x => x.CreatedByUser)
            .WithMany()
            .HasForeignKey(x => x.CreatedByUserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(x => x.DashboardLayout)
            .WithMany(x => x.Widgets)
            .HasForeignKey(x => x.DashboardLayoutId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(x => x.CreatedByUserId);
        builder.HasIndex(x => x.DashboardLayoutId);
        builder.HasIndex(x => new { x.DashboardLayoutId, x.Position });
    }
}
