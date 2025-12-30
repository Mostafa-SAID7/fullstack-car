using Domain.Entities.Community.Posts;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations.Community.Posts
{
    public class PostReportConfiguration : IEntityTypeConfiguration<PostReport>
    {
        public void Configure(EntityTypeBuilder<PostReport> builder)
        {
            builder.HasKey(pr => pr.Id);

            builder.Property(pr => pr.Reason)
                .IsRequired()
                .HasMaxLength(1000);

            builder.Property(pr => pr.Category)
                .IsRequired()
                .HasMaxLength(100);

            // Indexes
            builder.HasIndex(pr => pr.PostId);
            builder.HasIndex(pr => pr.UserId);
            builder.HasIndex(pr => pr.Category);
            builder.HasIndex(pr => pr.CreatedAt);

            // Relationships - Use NoAction to avoid cascade delete conflicts
            builder.HasOne(pr => pr.Post)
                .WithMany()
                .HasForeignKey(pr => pr.PostId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.HasOne(pr => pr.User)
                .WithMany()
                .HasForeignKey(pr => pr.UserId)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }
}