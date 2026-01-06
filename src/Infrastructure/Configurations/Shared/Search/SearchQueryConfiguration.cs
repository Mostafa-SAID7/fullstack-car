using Domain.Entities.Shared.Search;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations.Shared.Search;

public class SearchQueryConfiguration : IEntityTypeConfiguration<SearchQuery>
{
    public void Configure(EntityTypeBuilder<SearchQuery> builder)
    {
        builder.ToTable("SearchQueries");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Query)
            .IsRequired()
            .HasMaxLength(500);

        builder.Property(x => x.UserId)
            .HasMaxLength(450);

        builder.Property(x => x.SessionId)
            .HasMaxLength(100);

        builder.Property(x => x.SearchType)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(x => x.Filters)
            .HasColumnType("nvarchar(max)");

        builder.Property(x => x.SortBy)
            .HasMaxLength(100);

        builder.Property(x => x.SortOrder)
            .HasMaxLength(20);

        builder.Property(x => x.IpAddress)
            .HasMaxLength(45);

        builder.Property(x => x.UserAgent)
            .HasMaxLength(500);

        builder.HasIndex(x => x.Query);
        builder.HasIndex(x => x.UserId);
        builder.HasIndex(x => x.SearchType);
        builder.HasIndex(x => x.SearchedAt);
    }
}
