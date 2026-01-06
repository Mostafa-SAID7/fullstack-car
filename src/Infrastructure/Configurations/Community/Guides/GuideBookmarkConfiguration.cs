using Domain.Entities.Community.Guides;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations.Community.Guides;

public class GuideBookmarkConfiguration : IEntityTypeConfiguration<GuideBookmark>
{
    public void Configure(EntityTypeBuilder<GuideBookmark> builder)
    {
        builder.ToTable("GuideBookmarks");

        builder.HasKey(b => b.Id);

        builder.Property(b => b.Notes)
            .HasMaxLength(500);

        builder.Property(b => b.UserId)
            .IsRequired()
            .HasMaxLength(450);

        // Relationships
        builder.HasOne(b => b.Guide)
            .WithMany(g => g.Bookmarks)
            .HasForeignKey(b => b.GuideId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(b => b.User)
            .WithMany()
            .HasForeignKey(b => b.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        // Indexes
        builder.HasIndex(b => new { b.GuideId, b.UserId })
            .IsUnique();
        
        builder.HasIndex(b => b.UserId);
    }
}
