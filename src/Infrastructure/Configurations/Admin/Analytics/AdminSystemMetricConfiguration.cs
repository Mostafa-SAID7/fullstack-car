using Domain.Entities.Admin.Analytics;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations.Admin.Analytics;

public class AdminSystemMetricConfiguration : IEntityTypeConfiguration<AdminSystemMetric>
{
    public void Configure(EntityTypeBuilder<AdminSystemMetric> builder)
    {
        builder.ToTable("AdminSystemMetrics", "Admin");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.MetricName)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(e => e.Unit)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(e => e.Category)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(e => e.Tags)
            .HasMaxLength(1000);

        builder.HasIndex(e => e.MetricName);
        builder.HasIndex(e => e.Category);
        builder.HasIndex(e => e.Timestamp);
        builder.HasIndex(e => new { e.MetricName, e.Category });
    }
}
