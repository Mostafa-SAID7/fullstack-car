using Domain.Entities.Admin.Moderation;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations.Admin.Moderation;

public class ModerationQueueConfiguration : IEntityTypeConfiguration<ModerationQueue>
{
    public void Configure(EntityTypeBuilder<ModerationQueue> builder)
    {
        builder.ToTable("ModerationQueues");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.ContentType)
            .IsRequired()
            .HasConversion<string>();

        builder.Property(x => x.Status)
            .IsRequired()
            .HasConversion<string>();

        builder.Property(x => x.Priority)
            .IsRequired()
            .HasMaxLength(20);

        builder.Property(x => x.ReportReason)
            .HasMaxLength(500);

        builder.Property(x => x.ContentSnapshot)
            .HasColumnType("nvarchar(max)");

        builder.HasOne(x => x.ContentAuthor)
            .WithMany()
            .HasForeignKey(x => x.ContentAuthorId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(x => x.ReportedByUser)
            .WithMany()
            .HasForeignKey(x => x.ReportedByUserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(x => x.AssignedModerator)
            .WithMany()
            .HasForeignKey(x => x.AssignedModeratorId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(x => x.ContentId);
        builder.HasIndex(x => x.Status);
        builder.HasIndex(x => x.Priority);
        builder.HasIndex(x => x.QueuedDate);
        builder.HasIndex(x => x.AssignedModeratorId);
        builder.HasIndex(x => x.ContentType);
    }
}
