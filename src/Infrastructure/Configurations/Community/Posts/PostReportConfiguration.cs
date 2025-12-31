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

            builder.Property(pr => pr.IsResolved)
                .IsRequired()
                .HasDefaultValue(false);

            builder.Property(pr => pr.Resolution)
                .HasMaxLength(1000);

            // Indexes
            builder.HasIndex(pr => pr.PostId);
            builder.HasIndex(pr => pr.ReportedBy);
            builder.HasIndex(pr => pr.Category);
            builder.HasIndex(pr => pr.IsResolved);
            builder.HasIndex(pr => pr.CreatedAt);

            // Relationships - Use NoAction to avoid cascade delete conflicts
            builder.HasOne(pr => pr.Post)
                .WithMany(p => p.Reports)
                .HasForeignKey(pr => pr.PostId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.HasOne(pr => pr.Reporter)
                .WithMany()
                .HasForeignKey(pr => pr.ReportedBy)
                .OnDelete(DeleteBehavior.NoAction);

            builder.HasOne(pr => pr.Resolver)
                .WithMany()
                .HasForeignKey(pr => pr.ResolvedBy)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }
}