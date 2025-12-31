using Domain.Entities.Admin.System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations.Admin.System;

public class SystemConfigurationConfiguration : IEntityTypeConfiguration<SystemConfiguration>
{
    public void Configure(EntityTypeBuilder<SystemConfiguration> builder)
    {
        builder.ToTable("SystemConfigurations");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Key)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(x => x.Value)
            .IsRequired()
            .HasColumnType("nvarchar(max)");

        builder.Property(x => x.Category)
            .IsRequired()
            .HasConversion<string>();

        builder.Property(x => x.Description)
            .HasMaxLength(500);

        builder.Property(x => x.DataType)
            .IsRequired()
            .HasMaxLength(50);

        builder.HasOne(x => x.ModifiedByUser)
            .WithMany()
            .HasForeignKey(x => x.ModifiedByUserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(x => x.Key)
            .IsUnique();

        builder.HasIndex(x => x.Category);
        builder.HasIndex(x => x.IsReadOnly);
        builder.HasIndex(x => x.LastModified);
    }
}