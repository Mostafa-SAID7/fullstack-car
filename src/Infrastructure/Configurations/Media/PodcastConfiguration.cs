using Domain.Entities.Media;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations.Media;

public class PodcastConfiguration : IEntityTypeConfiguration<Podcast>
{
    public void Configure(EntityTypeBuilder<Podcast> builder)
    {
        builder.ToTable("Podcasts", "Media");
        
        builder.HasKey(p => p.Id);
        
        builder.Property(p => p.Title)
            .IsRequired()
            .HasMaxLength(200);
            
        builder.Property(p => p.Description)
            .HasMaxLength(2000);
            
        builder.Property(p => p.AudioUrl)
            .IsRequired()
            .HasMaxLength(500);
            
        builder.Property(p => p.CoverImage)
            .HasMaxLength(500);
            
        builder.Property(p => p.Tags)
            .HasMaxLength(1000);
            
        builder.Property(p => p.Transcript)
            .HasMaxLength(10000);
            
        builder.Property(p => p.Duration)
            .IsRequired();
            
        builder.Property(p => p.Status)
            .HasConversion<int>();
            
        builder.HasIndex(p => p.CreatorId);
        builder.HasIndex(p => p.SeriesId);
        builder.HasIndex(p => p.Status);
        builder.HasIndex(p => p.PublishedAt);
        builder.HasIndex(p => p.EpisodeNumber);
        
        // Relationships
        builder.HasOne(p => p.Series)
            .WithMany(s => s.Episodes)
            .HasForeignKey(p => p.SeriesId)
            .OnDelete(DeleteBehavior.SetNull);
            
        builder.HasMany(p => p.Comments)
            .WithOne(c => c.Podcast)
            .HasForeignKey(c => c.PodcastId)
            .OnDelete(DeleteBehavior.Cascade);
            
        builder.HasMany(p => p.Likes)
            .WithOne(l => l.Podcast)
            .HasForeignKey(l => l.PodcastId)
            .OnDelete(DeleteBehavior.Cascade);
            
        builder.HasMany(p => p.Plays)
            .WithOne(p => p.Podcast)
            .HasForeignKey(p => p.PodcastId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

public class PodcastSeriesConfiguration : IEntityTypeConfiguration<PodcastSeries>
{
    public void Configure(EntityTypeBuilder<PodcastSeries> builder)
    {
        builder.ToTable("PodcastSeries", "Media");
        
        builder.HasKey(s => s.Id);
        
        builder.Property(s => s.Name)
            .IsRequired()
            .HasMaxLength(200);
            
        builder.Property(s => s.Description)
            .HasMaxLength(2000);
            
        builder.Property(s => s.CoverImage)
            .HasMaxLength(500);
            
        builder.Property(s => s.Category)
            .HasMaxLength(100);
            
        builder.Property(s => s.Language)
            .HasMaxLength(10);
            
        builder.HasIndex(s => s.CreatorId);
        builder.HasIndex(s => s.Category);
        builder.HasIndex(s => s.IsActive);
    }
}
