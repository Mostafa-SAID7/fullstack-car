using Domain.Entities.Admin.System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations.Admin.System;

public class SystemBackupConfiguration : IEntityTypeConfiguration<SystemBackup>
{
    public void Configure(EntityTypeBuilder<SystemBackup> builder)
    {
        builder.ToTable("SystemBackups");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.BackupType)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(x => x.Status)
            .IsRequired()
            .HasConversion<string>();

        builder.Property(x => x.FilePath)
            .HasMaxLength(500);

        builder.Property(x => x.ErrorMessage)
            .HasMaxLength(1000);

        builder.Property(x => x.BackupMetadata)
            .HasColumnType("nvarchar(max)");

        builder.HasOne(x => x.InitiatedByUser)
            .WithMany()
            .HasForeignKey(x => x.InitiatedByUserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(x => x.InitiatedByUserId);
        builder.HasIndex(x => x.Status);
        builder.HasIndex(x => x.StartTime);
        builder.HasIndex(x => x.BackupType);
        builder.HasIndex(x => x.IsAutomatic);
    }
}