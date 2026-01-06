using Domain.Entities.Admin.Moderation;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations.Admin.Moderation;

public class ContentModerationActionConfiguration : IEntityTypeConfiguration<ContentModerationAction>
{
    public void Configure(EntityTypeBuilder<ContentModerationAction> builder)
    {
        builder.ToTable("ContentModerationActions");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.ContentType)
            .IsRequired()
            .HasConversion<string>();

        builder.Property(x => x.ActionType)
            .IsRequired()
            .HasConversion<string>();

        builder.Property(x => x.Reason)
            .IsRequired()
            .HasMaxLength(500);

        builder.Property(x => x.Notes)
            .HasMaxLength(1000);

        builder.HasOne(x => x.Moderator)
            .WithMany()
            .HasForeignKey(x => x.ModeratorId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(x => x.ContentAuthor)
            .WithMany()
            .HasForeignKey(x => x.ContentAuthorId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(x => x.ReversedByUser)
            .WithMany()
            .HasForeignKey(x => x.ReversedByUserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(x => x.ModeratorId);
        builder.HasIndex(x => x.ContentAuthorId);
        builder.HasIndex(x => x.ContentId);
        builder.HasIndex(x => x.ActionDate);
        builder.HasIndex(x => x.ContentType);
        builder.HasIndex(x => x.ActionType);
    }
}
