using Domain.Entities.Admin.Analytics;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations.Admin.Analytics;

public class ApplicationErrorLogConfiguration : IEntityTypeConfiguration<ApplicationErrorLog>
{
    public void Configure(EntityTypeBuilder<ApplicationErrorLog> builder)
    {
        builder.ToTable("ApplicationErrorLogs", "Admin");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.ErrorType)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(e => e.Message)
            .IsRequired()
            .HasMaxLength(2000);

        builder.Property(e => e.StackTrace)
            .HasMaxLength(8000);

        builder.Property(e => e.Source)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(e => e.Severity)
            .IsRequired()
            .HasMaxLength(50);

        builder.HasIndex(e => e.Timestamp);
        builder.HasIndex(e => e.ErrorType);
        builder.HasIndex(e => e.Severity);
        builder.HasIndex(e => e.UserId);

        // Navigation properties
        builder.HasOne(e => e.User)
            .WithMany()
            .HasForeignKey(e => e.UserId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
