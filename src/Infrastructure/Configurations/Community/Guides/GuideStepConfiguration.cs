using Domain.Entities.Community.Guides;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations.Community.Guides;

public class GuideStepConfiguration : IEntityTypeConfiguration<GuideStep>
{
    public void Configure(EntityTypeBuilder<GuideStep> builder)
    {
        builder.ToTable("GuideSteps");

        builder.HasKey(s => s.Id);

        builder.Property(s => s.StepNumber)
            .IsRequired();

        builder.Property(s => s.Title)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(s => s.Content)
            .IsRequired();

        builder.Property(s => s.ImageUrl)
            .HasMaxLength(500);

        builder.Property(s => s.VideoUrl)
            .HasMaxLength(500);

        builder.Property(s => s.Tips)
            .HasMaxLength(1000);

        builder.Property(s => s.WarningNotes)
            .HasMaxLength(1000);

        builder.Property(s => s.EstimatedTime)
            .IsRequired();

        // Relationships
        builder.HasOne(s => s.Guide)
            .WithMany(g => g.Steps)
            .HasForeignKey(s => s.GuideId)
            .OnDelete(DeleteBehavior.Cascade);

        // Indexes
        builder.HasIndex(s => new { s.GuideId, s.StepNumber })
            .IsUnique();
    }
}
