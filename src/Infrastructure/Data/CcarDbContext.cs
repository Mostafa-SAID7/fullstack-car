using System;
using System.Collections.Generic;
// using Infrastructure.TempModels; // Commented out - this namespace doesn't exist
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data;

// This is a legacy scaffolded DbContext - not used in the application
// The ApplicationDbContext is the main context used by the application
public partial class CcarDbContextLegacy : DbContext
{
    public CcarDbContextLegacy()
    {
    }

    public CcarDbContextLegacy(DbContextOptions<CcarDbContextLegacy> options)
        : base(options)
    {
    }

    // Commented out to avoid compilation errors - these models don't exist
    // public virtual DbSet<MediaAnalytic> MediaAnalytics { get; set; }
    // public virtual DbSet<Podcast> Podcasts { get; set; }
    // public virtual DbSet<Video> Videos { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=.;Database=CCarDb;Trusted_Connection=true;MultipleActiveResultSets=true;TrustServerCertificate=True");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Legacy model configuration - commented out to avoid compilation errors
        /*
        modelBuilder.Entity<MediaAnalytic>(entity =>
        {
            entity.ToTable("MediaAnalytics", "Media");

            entity.HasIndex(e => e.LastUpdated, "IX_MediaAnalytics_LastUpdated");

            entity.HasIndex(e => new { e.MediaId, e.MediaType }, "IX_MediaAnalytics_MediaId_MediaType").IsUnique();

            entity.HasIndex(e => e.MediaType, "IX_MediaAnalytics_MediaType");

            entity.HasIndex(e => e.ViewsTotal, "IX_MediaAnalytics_ViewsTotal");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.AverageWatchTime).HasColumnType("decimal(5, 2)");
            entity.Property(e => e.CompletionRate).HasColumnType("decimal(5, 2)");
            entity.Property(e => e.LastUpdated).HasDefaultValueSql("(getutcdate())");
            entity.Property(e => e.TopCountries).HasMaxLength(2000);
            entity.Property(e => e.TopDevices).HasMaxLength(2000);
            entity.Property(e => e.TopReferrers).HasMaxLength(2000);
        });

        modelBuilder.Entity<Podcast>(entity =>
        {
            entity.ToTable("Podcasts", "Media");

            entity.HasIndex(e => e.CreatorId, "IX_Podcasts_CreatorId");

            entity.HasIndex(e => e.EpisodeNumber, "IX_Podcasts_EpisodeNumber");

            entity.HasIndex(e => new { e.IsPublic, e.Status, e.PublishedAt }, "IX_Podcasts_IsPublic_Status_PublishedAt");

            entity.HasIndex(e => e.LikeCount, "IX_Podcasts_LikeCount");

            entity.HasIndex(e => new { e.PlayCount, e.PublishedAt }, "IX_Podcasts_PlayCount_PublishedAt");

            entity.HasIndex(e => e.PublishedAt, "IX_Podcasts_PublishedAt");

            entity.HasIndex(e => e.SeriesId, "IX_Podcasts_SeriesId");

            entity.HasIndex(e => new { e.SeriesId, e.EpisodeNumber }, "IX_Podcasts_SeriesId_EpisodeNumber");

            entity.HasIndex(e => e.Status, "IX_Podcasts_Status");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.AudioUrl).HasMaxLength(500);
            entity.Property(e => e.CoverImage).HasMaxLength(500);
            entity.Property(e => e.Description).HasMaxLength(2000);
            entity.Property(e => e.Tags).HasMaxLength(1000);
            entity.Property(e => e.Title).HasMaxLength(200);
        });

        modelBuilder.Entity<Video>(entity =>
        {
            entity.ToTable("Videos", "Media");

            entity.HasIndex(e => e.CreatedAt, "IX_Videos_CreatedAt");

            entity.HasIndex(e => e.CreatorId, "IX_Videos_CreatorId");

            entity.HasIndex(e => new { e.IsPublic, e.Status, e.PublishedAt }, "IX_Videos_IsPublic_Status_PublishedAt");

            entity.HasIndex(e => e.LikeCount, "IX_Videos_LikeCount");

            entity.HasIndex(e => e.PublishedAt, "IX_Videos_PublishedAt");

            entity.HasIndex(e => e.Status, "IX_Videos_Status");

            entity.HasIndex(e => new { e.ViewCount, e.PublishedAt }, "IX_Videos_ViewCount_PublishedAt");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.Description).HasMaxLength(2000);
            entity.Property(e => e.PreviewUrl).HasMaxLength(500);
            entity.Property(e => e.Tags).HasMaxLength(1000);
            entity.Property(e => e.Thumbnail).HasMaxLength(500);
            entity.Property(e => e.Title).HasMaxLength(200);
            entity.Property(e => e.VideoUrl).HasMaxLength(500);
        });
        */

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
