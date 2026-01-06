using Domain.Entities.Shared.Search;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations.Shared.Search;

public class SearchIndexConfiguration : IEntityTypeConfiguration<SearchIndex>
{
    public void Configure(EntityTypeBuilder<SearchIndex> builder)
    {
        builder.ToTable("SearchIndexes");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.EntityType)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(x => x.Title)
            .IsRequired()
            .HasMaxLength(500);

        builder.Property(x => x.Content)
            .IsRequired()
            .HasColumnType("nvarchar(max)");

        builder.Property(x => x.Tags)
            .HasMaxLength(1000);

        builder.Property(x => x.Category)
            .HasMaxLength(100);

        builder.Property(x => x.Metadata)
            .HasColumnType("nvarchar(max)");

        builder.Property(x => x.Language)
            .HasMaxLength(10);

        builder.Property(x => x.Priority)
            .HasConversion<string>();

        builder.HasIndex(x => x.EntityType);
        builder.HasIndex(x => x.EntityId);
        builder.HasIndex(x => new { x.EntityType, x.EntityId })
            .IsUnique();
        builder.HasIndex(x => x.IsActive);
        builder.HasIndex(x => x.LastIndexed);
    }
}
