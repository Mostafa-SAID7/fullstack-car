using Domain.Entities.Community.Guides;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations.Community.Guides;

public class GuideViewConfiguration : IEntityTypeConfiguration<GuideView>
{
    public void Configure(EntityTypeBuilder<GuideView> builder)
    {
        builder.ToTable("GuideViews");

        builder.HasKey(v => v.Id);

        builder.Property(v => v.ViewedAt)
            .IsRequired();

        builder.Property(v => v.TimeSpent)
            .IsRequired();

        builder.Property(v => v.UserId)
            .IsRequired()
            .HasMaxLength(450);

        // Relationships
        builder.HasOne(v => v.Guide)
            .WithMany(g => g.Views)
            .HasForeignKey(v => v.GuideId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(v => v.User)
            .WithMany()
            .HasForeignKey(v => v.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        // Indexes
        builder.HasIndex(v => new { v.GuideId, v.UserId });
        builder.HasIndex(v => v.ViewedAt);
        builder.HasIndex(v => v.UserId);
    }
}
