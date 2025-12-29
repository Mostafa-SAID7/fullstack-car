using Domain.Entities.Community.Reviews;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations.Community.Reviews
{
    public class ReviewConfiguration : IEntityTypeConfiguration<Review>
    {
        public void Configure(EntityTypeBuilder<Review> builder)
        {
            builder.HasKey(r => r.Id);

            builder.Property(r => r.Title)
                .IsRequired()
                .HasMaxLength(200);

            builder.Property(r => r.Content)
                .IsRequired()
                .HasMaxLength(2000);

            builder.Property(r => r.Type)
                .IsRequired()
                .HasConversion<string>();

            builder.Property(r => r.CarBrand)
                .HasMaxLength(100);

            builder.Property(r => r.CarModel)
                .HasMaxLength(100);

            builder.Property(r => r.ImageUrl)
                .HasMaxLength(500);

            builder.HasOne(r => r.User)
                .WithMany(u => u.Reviews)
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
