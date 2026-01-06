using Domain.Entities.Shared.Errors;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations.Shared.Errors;

public class ErrorLogConfiguration : IEntityTypeConfiguration<ErrorLog>
{
    public void Configure(EntityTypeBuilder<ErrorLog> builder)
    {
        builder.ToTable("ErrorLogs", "Shared");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.ErrorId)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(e => e.Message)
            .IsRequired()
            .HasMaxLength(2000);

        builder.Property(e => e.Exception)
            .HasMaxLength(4000);

        builder.Property(e => e.StackTrace)
            .HasMaxLength(8000);

        builder.Property(e => e.InnerException)
            .HasMaxLength(2000);

        builder.Property(e => e.Source)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(e => e.Method)
            .HasMaxLength(200);

        builder.Property(e => e.RequestPath)
            .HasMaxLength(500);

        builder.Property(e => e.RequestMethod)
            .HasMaxLength(10);

        builder.Property(e => e.QueryString)
            .HasMaxLength(2000);

        builder.Property(e => e.RequestBody)
            .HasMaxLength(4000);

        builder.Property(e => e.UserAgent)
            .HasMaxLength(500);

        builder.Property(e => e.IpAddress)
            .HasMaxLength(45);

        builder.Property(e => e.UserName)
            .HasMaxLength(256);

        builder.Property(e => e.SessionId)
            .HasMaxLength(100);

        builder.Property(e => e.CorrelationId)
            .HasMaxLength(100);

        builder.Property(e => e.Category)
            .HasMaxLength(100);

        builder.Property(e => e.Environment)
            .HasMaxLength(50);

        builder.Property(e => e.Version)
            .HasMaxLength(50);

        builder.Property(e => e.Resolution)
            .HasMaxLength(1000);

        builder.HasIndex(e => e.ErrorId)
            .IsUnique();

        builder.HasIndex(e => e.OccurredAt);
        builder.HasIndex(e => e.Severity);
        builder.HasIndex(e => e.Category);
        builder.HasIndex(e => e.UserId);
        builder.HasIndex(e => e.IsResolved);
    }
}
