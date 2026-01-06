using Domain.Entities.Media;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations.Media;

public class VideoConfiguration : IEntityTypeConfiguration<Video>
{
    public void Configure(EntityTypeBuilder<Video> builder)
    {
        builder.ToTable("Videos", "Media");
        
        builder.HasKey(v => v.Id);
        
        builder.Property(v => v.Title)
            .IsRequired()
            .HasMaxLength(200);
            
        builder.Property(v => v.Description)
            .HasMaxLength(2000);
            
        builder.Property(v => v.VideoUrl)
            .IsRequired()
            .HasMaxLength(500);
            
        builder.Property(v => v.PreviewUrl)
            .HasMaxLength(500);
            
        builder.Property(v => v.Thumbnail)
            .HasMaxLength(500);
            
        builder.Property(v => v.Tags)
            .HasMaxLength(1000);
            
        builder.Property(v => v.Duration)
            .IsRequired();
            
        builder.Property(v => v.Quality)
            .HasConversion<int>();
            
        builder.Property(v => v.Status)
            .HasConversion<int>();
            
        builder.HasIndex(v => v.CreatorId);
        builder.HasIndex(v => v.Status);
        builder.HasIndex(v => v.PublishedAt);
        builder.HasIndex(v => v.CreatedAt);
        
        // Relationships
        builder.HasMany(v => v.Comments)
            .WithOne(c => c.Video)
            .HasForeignKey(c => c.VideoId)
            .OnDelete(DeleteBehavior.Cascade);
            
        builder.HasMany(v => v.Likes)
            .WithOne(l => l.Video)
            .HasForeignKey(l => l.VideoId)
            .OnDelete(DeleteBehavior.Cascade);
            
        builder.HasMany(v => v.Views)
            .WithOne(v => v.Video)
            .HasForeignKey(v => v.VideoId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
