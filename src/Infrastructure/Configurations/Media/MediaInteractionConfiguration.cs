using Domain.Entities.Media;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations.Media;

public class VideoCommentConfiguration : IEntityTypeConfiguration<VideoComment>
{
    public void Configure(EntityTypeBuilder<VideoComment> builder)
    {
        builder.ToTable("VideoComments", "Media");
        
        builder.HasKey(c => c.Id);
        
        builder.Property(c => c.Content)
            .IsRequired()
            .HasMaxLength(1000);
            
        builder.HasIndex(c => c.VideoId);
        builder.HasIndex(c => c.UserId);
        builder.HasIndex(c => c.ParentCommentId);
        
        builder.HasOne(c => c.ParentComment)
            .WithMany(c => c.Replies)
            .HasForeignKey(c => c.ParentCommentId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

public class PodcastCommentConfiguration : IEntityTypeConfiguration<PodcastComment>
{
    public void Configure(EntityTypeBuilder<PodcastComment> builder)
    {
        builder.ToTable("PodcastComments", "Media");
        
        builder.HasKey(c => c.Id);
        
        builder.Property(c => c.Content)
            .IsRequired()
            .HasMaxLength(1000);
            
        builder.HasIndex(c => c.PodcastId);
        builder.HasIndex(c => c.UserId);
        builder.HasIndex(c => c.ParentCommentId);
        
        builder.HasOne(c => c.ParentComment)
            .WithMany(c => c.Replies)
            .HasForeignKey(c => c.ParentCommentId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

public class VideoLikeConfiguration : IEntityTypeConfiguration<VideoLike>
{
    public void Configure(EntityTypeBuilder<VideoLike> builder)
    {
        builder.ToTable("VideoLikes", "Media");
        
        builder.HasKey(l => l.Id);
        
        builder.HasIndex(l => new { l.VideoId, l.UserId })
            .IsUnique();
    }
}

public class PodcastLikeConfiguration : IEntityTypeConfiguration<PodcastLike>
{
    public void Configure(EntityTypeBuilder<PodcastLike> builder)
    {
        builder.ToTable("PodcastLikes", "Media");
        
        builder.HasKey(l => l.Id);
        
        builder.HasIndex(l => new { l.PodcastId, l.UserId })
            .IsUnique();
    }
}

public class VideoViewConfiguration : IEntityTypeConfiguration<VideoView>
{
    public void Configure(EntityTypeBuilder<VideoView> builder)
    {
        builder.ToTable("VideoViews", "Media");
        
        builder.HasKey(v => v.Id);
        
        builder.Property(v => v.IpAddress)
            .HasMaxLength(45);
            
        builder.Property(v => v.UserAgent)
            .HasMaxLength(500);
            
        builder.Property(v => v.Country)
            .HasMaxLength(2);
            
        builder.HasIndex(v => v.VideoId);
        builder.HasIndex(v => v.UserId);
        builder.HasIndex(v => v.CreatedAt);
    }
}

public class PodcastPlayConfiguration : IEntityTypeConfiguration<PodcastPlay>
{
    public void Configure(EntityTypeBuilder<PodcastPlay> builder)
    {
        builder.ToTable("PodcastPlays", "Media");
        
        builder.HasKey(p => p.Id);
        
        builder.Property(p => p.IpAddress)
            .HasMaxLength(45);
            
        builder.Property(p => p.UserAgent)
            .HasMaxLength(500);
            
        builder.Property(p => p.Country)
            .HasMaxLength(2);
            
        builder.HasIndex(p => p.PodcastId);
        builder.HasIndex(p => p.UserId);
        builder.HasIndex(p => p.CreatedAt);
    }
}