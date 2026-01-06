using Domain.Entities.Shared.Settings;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations.Shared.Settings;

public class SettingConfiguration : IEntityTypeConfiguration<Setting>
{
    public void Configure(EntityTypeBuilder<Setting> builder)
    {
        builder.ToTable("Settings", "Shared");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Key)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(e => e.Value)
            .IsRequired()
            .HasMaxLength(4000);

        builder.Property(e => e.DataType)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(e => e.Category)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(e => e.Description)
            .HasMaxLength(500);

        builder.Property(e => e.DefaultValue)
            .HasMaxLength(4000);

        builder.HasIndex(e => e.Key)
            .IsUnique();

        builder.HasIndex(e => e.Category);
        builder.HasIndex(e => e.IsUserConfigurable);
    }
}
