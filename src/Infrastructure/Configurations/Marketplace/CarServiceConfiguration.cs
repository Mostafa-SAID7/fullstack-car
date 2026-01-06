using Domain.Entities.Marketplace.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations.Marketplace
{
    public class CarServiceConfiguration : IEntityTypeConfiguration<CarService>
    {
        public void Configure(EntityTypeBuilder<CarService> builder)
        {
            // CarService-specific properties only
            builder.Property(cs => cs.VehicleTypes)
                .HasMaxLength(1000);

            builder.Property(cs => cs.SupportedBrands)
                .HasMaxLength(1000);

            builder.Property(cs => cs.SpecialEquipmentDetails)
                .HasMaxLength(500);

            builder.Property(cs => cs.ServiceLocation)
                .HasMaxLength(50);

            builder.Property(cs => cs.WarrantyPeriod)
                .HasMaxLength(100);

            builder.Property(cs => cs.EmergencyPriceMultiplier)
                .HasPrecision(5, 2);

            builder.Property(cs => cs.ImageUrl)
                .HasMaxLength(500);

            // CarService-specific indexes
            builder.HasIndex(cs => cs.IsMobileService);
            builder.HasIndex(cs => cs.IsEmergencyService);
            builder.HasIndex(cs => cs.RequiresAppointment);
        }
    }
}
