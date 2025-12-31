using Domain.Entities.Marketplace;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations.Marketplace
{
    public class CarServiceConfiguration : IEntityTypeConfiguration<CarService>
    {
        public void Configure(EntityTypeBuilder<CarService> builder)
        {
            builder.ToTable("CarServices");

            builder.HasKey(cs => cs.Id);

            builder.Property(cs => cs.Title)
                .IsRequired()
                .HasMaxLength(200);

            builder.Property(cs => cs.Description)
                .HasMaxLength(2000);

            builder.Property(cs => cs.BasePrice)
                .HasPrecision(10, 2);

            builder.Property(cs => cs.MaxPrice)
                .HasPrecision(10, 2);

            builder.Property(cs => cs.Currency)
                .HasMaxLength(3)
                .HasDefaultValue("USD");

            builder.Property(cs => cs.ImageUrl)
                .HasMaxLength(500);

            builder.Property(cs => cs.Requirements)
                .HasMaxLength(1000);

            builder.Property(cs => cs.IncludedItems)
                .HasMaxLength(1000);

            builder.Property(cs => cs.ExcludedItems)
                .HasMaxLength(1000);

            builder.Property(cs => cs.AverageRating)
                .HasPrecision(3, 2);

            // Relationships
            builder.HasOne(cs => cs.ServiceProvider)
                .WithMany(sp => sp.Services)
                .HasForeignKey(cs => cs.ServiceProviderId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(cs => cs.Bookings)
                .WithOne(b => b.Service)
                .HasForeignKey(b => b.ServiceId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(cs => cs.Reviews)
                .WithOne(r => r.Service)
                .HasForeignKey(r => r.ServiceId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(cs => cs.Images)
                .WithOne(i => i.Service)
                .HasForeignKey(i => i.ServiceId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(cs => cs.Availability)
                .WithOne(a => a.Service)
                .HasForeignKey(a => a.ServiceId)
                .OnDelete(DeleteBehavior.Cascade);

            // Indexes
            builder.HasIndex(cs => cs.ServiceProviderId);
            builder.HasIndex(cs => cs.Type);
            builder.HasIndex(cs => cs.Status);
            builder.HasIndex(cs => cs.BasePrice);
            builder.HasIndex(cs => cs.AverageRating);
            builder.HasIndex(cs => cs.IsEmergencyService);
            builder.HasIndex(cs => cs.IsAvailable24x7);
        }
    }
}