using Domain.Entities.Community.Guides;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations.Community.Guides;

public class GuideConfiguration : IEntityTypeConfiguration<Guide>
{
    public void Configure(EntityTypeBuilder<Guide> builder)
    {
        builder.ToTable("Guides");

        builder.HasKey(g => g.Id);

        builder.Property(g => g.Title)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(g => g.Content)
            .IsRequired();

        builder.Property(g => g.Summary)
            .IsRequired()
            .HasMaxLength(500);

        builder.Property(g => g.Category)
            .IsRequired()
            .HasConversion<int>();

        builder.Property(g => g.Difficulty)
            .IsRequired()
            .HasConversion<int>();

        builder.Property(g => g.EstimatedReadTime)
            .IsRequired();

        builder.Property(g => g.Tags)
            .HasMaxLength(1000);

        builder.Property(g => g.ThumbnailUrl)
            .HasMaxLength(500);

        builder.Property(g => g.AuthorId)
            .IsRequired()
            .HasMaxLength(450);

        // Relationships
        builder.HasOne(g => g.Author)
            .WithMany()
            .HasForeignKey(g => g.AuthorId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(g => g.Post)
            .WithMany()
            .HasForeignKey(g => g.PostId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasMany(g => g.Steps)
            .WithOne(s => s.Guide)
            .HasForeignKey(s => s.GuideId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(g => g.Ratings)
            .WithOne(r => r.Guide)
            .HasForeignKey(r => r.GuideId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(g => g.Bookmarks)
            .WithOne(b => b.Guide)
            .HasForeignKey(b => b.GuideId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(g => g.Views)
            .WithOne(v => v.Guide)
            .HasForeignKey(v => v.GuideId)
            .OnDelete(DeleteBehavior.Cascade);

        // Indexes
        builder.HasIndex(g => g.Category);
        builder.HasIndex(g => g.Difficulty);
        builder.HasIndex(g => g.IsFeatured);
        builder.HasIndex(g => g.IsPublished);
        builder.HasIndex(g => g.CreatedAt);
        builder.HasIndex(g => g.AuthorId);
    }
}
