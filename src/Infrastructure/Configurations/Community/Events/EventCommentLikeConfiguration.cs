using Domain.Entities.Community.Events;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations.Community.Events
{
    public class EventCommentLikeConfiguration : IEntityTypeConfiguration<EventCommentLike>
    {
        public void Configure(EntityTypeBuilder<EventCommentLike> builder)
        {
            builder.ToTable("EventCommentLikes");

            builder.HasKey(l => l.Id);

            // Configure relationships
            builder.HasOne(l => l.Comment)
                .WithMany(c => c.Likes)
                .HasForeignKey(l => l.CommentId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(l => l.User)
                .WithMany()
                .HasForeignKey(l => l.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure indexes
            builder.HasIndex(l => l.CommentId);
            builder.HasIndex(l => l.UserId);
            builder.HasIndex(l => new { l.CommentId, l.UserId })
                .IsUnique()
                .HasDatabaseName("IX_EventCommentLikes_CommentId_UserId_Unique");

            // Configure constraints
            builder.Property(l => l.LikedAt)
                .IsRequired();
        }
    }
}