using Domain.Entities.Community.Pages;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations.Community.Pages
{
    public class PageCommentLikeConfiguration : IEntityTypeConfiguration<PageCommentLike>
    {
        public void Configure(EntityTypeBuilder<PageCommentLike> builder)
        {
            builder.ToTable("PageCommentLikes");

            builder.HasKey(x => x.Id);

            builder.Property(x => x.LikedAt)
                .IsRequired();

            // Configure relationships with NO ACTION to avoid cascade cycles
            builder.HasOne(x => x.Comment)
                .WithMany(x => x.Likes)
                .HasForeignKey(x => x.CommentId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(x => x.User)
                .WithMany()
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.NoAction); // Changed to NoAction to avoid cascade cycles

            // Indexes
            builder.HasIndex(x => x.CommentId);
            builder.HasIndex(x => x.UserId);
            builder.HasIndex(x => new { x.CommentId, x.UserId })
                .IsUnique();
        }
    }
}