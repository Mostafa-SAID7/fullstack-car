using Domain.Entities.Marketplace;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ServiceProviderEntity = Domain.Entities.Marketplace.ServiceProvider;

namespace Infrastructure.Configurations.Marketplace
{
    public class ServiceProviderConfiguration : IEntityTypeConfiguration<ServiceProviderEntity>
    {
        public void Configure(EntityTypeBuilder<ServiceProviderEntity> builder)
        {
            builder.ToTable("ServiceProviders");

            builder.HasKey(sp => sp.Id);

            builder.Property(sp => sp.BusinessName)
                .IsRequired()
                .HasMaxLength(200);

            builder.Property(sp => sp.Description)
                .HasMaxLength(2000);

            builder.Property(sp => sp.ContactEmail)
                .IsRequired()
                .HasMaxLength(254);

            builder.Property(sp => sp.ContactPhone)
                .HasMaxLength(20);

            builder.Property(sp => sp.Address)
                .HasMaxLength(500);

            builder.Property(sp => sp.City)
                .HasMaxLength(100);

            builder.Property(sp => sp.State)
                .HasMaxLength(100);

            builder.Property(sp => sp.ZipCode)
                .HasMaxLength(20);

            builder.Property(sp => sp.Country)
                .HasMaxLength(100);

            builder.Property(sp => sp.LogoUrl)
                .HasMaxLength(500);

            builder.Property(sp => sp.WebsiteUrl)
                .HasMaxLength(500);

            builder.Property(sp => sp.AverageRating)
                .HasPrecision(3, 2);

            builder.Property(sp => sp.BusinessLicense)
                .HasMaxLength(100);

            builder.Property(sp => sp.InsuranceInfo)
                .HasMaxLength(500);

            // Relationships
            builder.HasOne(sp => sp.Owner)
                .WithMany()
                .HasForeignKey(sp => sp.OwnerId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(sp => sp.Services)
                .WithOne(s => s.ServiceProvider)
                .HasForeignKey(s => s.ServiceProviderId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(sp => sp.Bookings)
                .WithOne(b => b.ServiceProvider)
                .HasForeignKey(b => b.ServiceProviderId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(sp => sp.Reviews)
                .WithOne(r => r.ServiceProvider)
                .HasForeignKey(r => r.ServiceProviderId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(sp => sp.Specialties)
                .WithOne(s => s.ServiceProvider)
                .HasForeignKey(s => s.ServiceProviderId)
                .OnDelete(DeleteBehavior.Cascade);

            // Indexes
            builder.HasIndex(sp => sp.OwnerId);
            builder.HasIndex(sp => sp.BusinessName);
            builder.HasIndex(sp => sp.City);
            builder.HasIndex(sp => sp.IsActive);
            builder.HasIndex(sp => sp.IsVerified);
            builder.HasIndex(sp => sp.AverageRating);
            builder.HasIndex(sp => new { sp.Latitude, sp.Longitude });
        }
    }
}