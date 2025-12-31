using Domain.Entities.Marketplace;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations.Marketplace
{
    public class ServiceReviewConfiguration : IEntityTypeConfiguration<ServiceReview>
    {
        public void Configure(EntityTypeBuilder<ServiceReview> builder)
        {
            builder.ToTable("ServiceReviews");

            builder.HasKey(sr => sr.Id);

            builder.Property(sr => sr.Rating)
                .IsRequired()
                .HasComment("Rating from 1 to 5");

            builder.Property(sr => sr.Comment)
                .HasMaxLength(1000)
                .HasComment("Customer review comment");

            builder.Property(sr => sr.IsVerified)
                .HasDefaultValue(false)
                .HasComment("Whether the review is verified");

            builder.Property(sr => sr.IsPublic)
                .HasDefaultValue(true)
                .HasComment("Whether the review is publicly visible");

            builder.Property(sr => sr.ProviderResponse)
                .HasMaxLength(1000)
                .HasComment("Service provider response to the review");

            builder.Property(sr => sr.ProviderResponseDate)
                .HasComment("Date when provider responded");

            builder.Property(sr => sr.IsRecommended)
                .HasDefaultValue(true)
                .HasComment("Whether customer recommends the service");

            // Foreign Key Relationships with NO ACTION to prevent cascade conflicts
            builder.HasOne(sr => sr.Customer)
                .WithMany()
                .HasForeignKey(sr => sr.CustomerId)
                .OnDelete(DeleteBehavior.NoAction)
                .HasConstraintName("FK_ServiceReviews_Customers");

            builder.HasOne(sr => sr.Service)
                .WithMany(s => s.Reviews)
                .HasForeignKey(sr => sr.ServiceId)
                .OnDelete(DeleteBehavior.NoAction)
                .HasConstraintName("FK_ServiceReviews_Services");

            builder.HasOne(sr => sr.ServiceProvider)
                .WithMany(sp => sp.Reviews)
                .HasForeignKey(sr => sr.ServiceProviderId)
                .OnDelete(DeleteBehavior.NoAction)
                .HasConstraintName("FK_ServiceReviews_ServiceProviders");

            builder.HasOne(sr => sr.Booking)
                .WithOne(b => b.Review)
                .HasForeignKey<ServiceReview>(sr => sr.BookingId)
                .OnDelete(DeleteBehavior.NoAction)
                .HasConstraintName("FK_ServiceReviews_Bookings");

            // Indexes
            builder.HasIndex(sr => sr.CustomerId)
                .HasDatabaseName("IX_ServiceReviews_CustomerId");

            builder.HasIndex(sr => sr.ServiceId)
                .HasDatabaseName("IX_ServiceReviews_ServiceId");

            builder.HasIndex(sr => sr.ServiceProviderId)
                .HasDatabaseName("IX_ServiceReviews_ServiceProviderId");

            builder.HasIndex(sr => sr.BookingId)
                .IsUnique()
                .HasDatabaseName("IX_ServiceReviews_BookingId");

            builder.HasIndex(sr => sr.Rating)
                .HasDatabaseName("IX_ServiceReviews_Rating");

            builder.HasIndex(sr => sr.IsVerified)
                .HasDatabaseName("IX_ServiceReviews_IsVerified");

            builder.HasIndex(sr => sr.IsPublic)
                .HasDatabaseName("IX_ServiceReviews_IsPublic");

            // Check constraints
            builder.HasCheckConstraint("CK_ServiceReviews_Rating", "[Rating] >= 1 AND [Rating] <= 5");
        }
    }
}