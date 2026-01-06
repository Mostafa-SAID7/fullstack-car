using Domain.Entities.Community.Reviews;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations.Community.Reviews
{
    public class CommunityReviewConfiguration : IEntityTypeConfiguration<CommunityReview>
    {
        public void Configure(EntityTypeBuilder<CommunityReview> builder)
        {
            builder.ToTable("CommunityReviews");

            builder.HasKey(x => x.Id);

            builder.Property(x => x.Title)
                .IsRequired()
                .HasMaxLength(200);

            builder.Property(x => x.Content)
                .IsRequired()
                .HasMaxLength(5000);

            builder.Property(x => x.Rating)
                .IsRequired();

            builder.Property(x => x.Type)
                .IsRequired()
                .HasConversion<int>();

            builder.Property(x => x.Status)
                .IsRequired()
                .HasConversion<int>();

            builder.Property(x => x.ImageUrl)
                .HasMaxLength(500);

            builder.Property(x => x.FlagReason)
                .HasMaxLength(500);

            builder.Property(x => x.PurchaseProof)
                .HasMaxLength(500);

            builder.Property(x => x.CarModel)
                .HasMaxLength(100);

            builder.Property(x => x.CarBrand)
                .HasMaxLength(100);

            builder.Property(x => x.Pros)
                .HasMaxLength(2000);

            builder.Property(x => x.Cons)
                .HasMaxLength(2000);

            builder.HasOne(x => x.User)
                .WithMany()
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.Category)
                .WithMany(x => x.Reviews)
                .HasForeignKey(x => x.CategoryId)
                .OnDelete(DeleteBehavior.SetNull);

            builder.HasMany(x => x.HelpfulnessVotes)
                .WithOne(x => x.Review)
                .HasForeignKey(x => x.ReviewId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(x => x.Comments)
                .WithOne(x => x.Review)
                .HasForeignKey(x => x.ReviewId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(x => x.Images)
                .WithOne(x => x.Review)
                .HasForeignKey(x => x.ReviewId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasIndex(x => x.UserId);
            builder.HasIndex(x => x.CategoryId);
            builder.HasIndex(x => x.Type);
            builder.HasIndex(x => x.Status);
            builder.HasIndex(x => x.Rating);
            builder.HasIndex(x => x.CarBrand);
            builder.HasIndex(x => x.CarModel);
            builder.HasIndex(x => x.CreatedAt);
        }
    }
}
