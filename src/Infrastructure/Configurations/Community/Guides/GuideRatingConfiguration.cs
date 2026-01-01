using Domain.Entities.Community.Guides;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations.Community.Guides;

public class GuideRatingConfiguration : IEntityTypeConfiguration<GuideRating>
{
    public void Configure(EntityTypeBuilder<GuideRating> builder)
    {
        builder.ToTable("GuideRatings");

        builder.HasKey(r => r.Id);

        builder.Property(r => r.Rating)
            .IsRequired()
            .HasAnnotation("Range", new[] { 1, 5 });

        builder.Property(r => r.Comment)
            .HasMaxLength(1000);

        builder.Property(r => r.UserId)
            .IsRequired()
            .HasMaxLength(450);

        // Relationships
        builder.HasOne(r => r.Guide)
            .WithMany(g => g.Ratings)
            .HasForeignKey(r => r.GuideId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(r => r.User)
            .WithMany()
            .HasForeignKey(r => r.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        // Indexes
        builder.HasIndex(r => new { r.GuideId, r.UserId })
            .IsUnique();
        
        builder.HasIndex(r => r.Rating);
    }
}