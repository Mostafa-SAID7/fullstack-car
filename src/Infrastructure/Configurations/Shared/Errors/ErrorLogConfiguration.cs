using Domain.Entities.Shared.Errors;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations.Shared.Errors;

public class ErrorLogConfiguration : IEntityTypeConfiguration<ErrorLog>
{
    public void Configure(EntityTypeBuilder<ErrorLog> builder)
    {
        builder.ToTable("SharedErrorLogs");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.ErrorId)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(x => x.Message)
            .IsRequired()
            .HasMaxLength(2000);

        builder.Property(x => x.Exception)
            .HasColumnType("nvarchar(max)");

        builder.Property(x => x.StackTrace)
            .HasColumnType("nvarchar(max)");

        builder.Property(x => x.InnerException)
            .HasColumnType("nvarchar(max)");

        builder.Property(x => x.Source)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(x => x.Method)
            .HasMaxLength(200);

        builder.Property(x => x.RequestPath)
            .HasMaxLength(500);

        builder.Property(x => x.RequestMethod)
            .HasMaxLength(10);

        builder.Property(x => x.QueryString)
            .HasMaxLength(2000);

        builder.Property(x => x.RequestBody)
            .HasColumnType("nvarchar(max)");

        builder.Property(x => x.UserAgent)
            .HasMaxLength(500);

        builder.Property(x => x.IpAddress)
            .HasMaxLength(45);

        builder.Property(x => x.UserName)
            .HasMaxLength(256);

        builder.Property(x => x.SessionId)
            .HasMaxLength(100);

        builder.Property(x => x.CorrelationId)
            .HasMaxLength(100);

        builder.Property(x => x.Severity)
            .HasConversion<string>();

        builder.Property(x => x.Category)
            .HasMaxLength(100);

        builder.Property(x => x.Environment)
            .HasMaxLength(50);

        builder.Property(x => x.Version)
            .HasMaxLength(50);

        builder.Property(x => x.Resolution)
            .HasMaxLength(2000);

        builder.HasIndex(x => x.ErrorId)
            .IsUnique();
        builder.HasIndex(x => x.Severity);
        builder.HasIndex(x => x.Category);
        builder.HasIndex(x => x.UserId);
        builder.HasIndex(x => x.OccurredAt);
        builder.HasIndex(x => x.IsResolved);
    }
}