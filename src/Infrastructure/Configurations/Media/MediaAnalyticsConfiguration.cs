using Domain.Entities.Media;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations.Media;

public class MediaAnalyticsConfiguration : IEntityTypeConfiguration<MediaAnalytics>
{
    public void Configure(EntityTypeBuilder<MediaAnalytics> builder)
    {
        builder.ToTable("MediaAnalytics", "Media");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.MediaId)
            .IsRequired();

        builder.Property(x => x.MediaType)
            .IsRequired()
            .HasConversion<int>();

        builder.Property(x => x.ViewsToday)
            .HasDefaultValue(0);

        builder.Property(x => x.ViewsWeek)
            .HasDefaultValue(0);

        builder.Property(x => x.ViewsMonth)
            .HasDefaultValue(0);

        builder.Property(x => x.ViewsTotal)
            .HasDefaultValue(0);

        builder.Property(x => x.LikesCount)
            .HasDefaultValue(0);

        builder.Property(x => x.DislikesCount)
            .HasDefaultValue(0);

        builder.Property(x => x.CommentsCount)
            .HasDefaultValue(0);

        builder.Property(x => x.SharesCount)
            .HasDefaultValue(0);

        builder.Property(x => x.AverageWatchTime)
            .HasColumnType("decimal(5,2)")
            .HasDefaultValue(0);

        builder.Property(x => x.CompletionRate)
            .HasColumnType("decimal(5,2)")
            .HasDefaultValue(0);

        builder.Property(x => x.TopCountries)
            .HasMaxLength(2000)
            .IsRequired(false);

        builder.Property(x => x.TopDevices)
            .HasMaxLength(2000)
            .IsRequired(false);

        builder.Property(x => x.TopReferrers)
            .HasMaxLength(2000)
            .IsRequired(false);

        builder.Property(x => x.LastUpdated)
            .IsRequired()
            .HasDefaultValueSql("GETUTCDATE()");

        // Indexes for performance
        builder.HasIndex(x => new { x.MediaId, x.MediaType })
            .IsUnique()
            .HasDatabaseName("IX_MediaAnalytics_MediaId_MediaType");

        builder.HasIndex(x => x.MediaType)
            .HasDatabaseName("IX_MediaAnalytics_MediaType");

        builder.HasIndex(x => x.ViewsTotal)
            .HasDatabaseName("IX_MediaAnalytics_ViewsTotal");

        builder.HasIndex(x => x.LastUpdated)
            .HasDatabaseName("IX_MediaAnalytics_LastUpdated");
    }
}