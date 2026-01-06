using Domain.Entities.Community.Posts;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations.Community.Posts
{
    public class PostViewConfiguration : IEntityTypeConfiguration<PostView>
    {
        public void Configure(EntityTypeBuilder<PostView> builder)
        {
            builder.ToTable("PostViews");

            builder.HasKey(pv => pv.Id);

            builder.Property(pv => pv.Id)
                .ValueGeneratedOnAdd();

            builder.Property(pv => pv.IpAddress)
                .HasMaxLength(45); // IPv6 max length

            builder.Property(pv => pv.UserAgent)
                .HasMaxLength(500);

            builder.Property(pv => pv.ReferrerUrl)
                .HasMaxLength(2000);

            builder.Property(pv => pv.ViewedAt)
                .IsRequired();

            // Relationships
            builder.HasOne(pv => pv.Post)
                .WithMany(p => p.Views)
                .HasForeignKey(pv => pv.PostId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(pv => pv.User)
                .WithMany()
                .HasForeignKey(pv => pv.UserId)
                .OnDelete(DeleteBehavior.SetNull);

            // Indexes
            builder.HasIndex(pv => pv.PostId);
            builder.HasIndex(pv => pv.UserId);
            builder.HasIndex(pv => pv.ViewedAt);
            builder.HasIndex(pv => new { pv.PostId, pv.UserId, pv.ViewedAt });
        }
    }
}
