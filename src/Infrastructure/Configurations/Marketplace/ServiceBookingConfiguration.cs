using Domain.Entities.Marketplace;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations.Marketplace
{
    public class ServiceBookingConfiguration : IEntityTypeConfiguration<ServiceBooking>
    {
        public void Configure(EntityTypeBuilder<ServiceBooking> builder)
        {
            builder.ToTable("ServiceBookings");

            builder.HasKey(sb => sb.Id);

            builder.Property(sb => sb.BookingNumber)
                .IsRequired()
                .HasMaxLength(50);

            builder.Property(sb => sb.TotalAmount)
                .HasPrecision(10, 2);

            builder.Property(sb => sb.Currency)
                .HasMaxLength(3)
                .HasDefaultValue("USD");

            builder.Property(sb => sb.CustomerNotes)
                .HasMaxLength(1000);

            builder.Property(sb => sb.ProviderNotes)
                .HasMaxLength(1000);

            builder.Property(sb => sb.CancellationReason)
                .HasMaxLength(500);

            builder.Property(sb => sb.CustomerAddress)
                .HasMaxLength(500);

            builder.Property(sb => sb.EmergencyDetails)
                .HasMaxLength(1000);

            // Relationships
            builder.HasOne(sb => sb.Customer)
                .WithMany()
                .HasForeignKey(sb => sb.CustomerId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(sb => sb.Service)
                .WithMany(s => s.Bookings)
                .HasForeignKey(sb => sb.ServiceId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(sb => sb.ServiceProvider)
                .WithMany(sp => sp.Bookings)
                .HasForeignKey(sb => sb.ServiceProviderId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(sb => sb.Payment)
                .WithOne(p => p.Booking)
                .HasForeignKey<ServicePayment>(p => p.BookingId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(sb => sb.Review)
                .WithOne(r => r.Booking)
                .HasForeignKey<ServiceReview>(r => r.BookingId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.HasMany(sb => sb.StatusHistory)
                .WithOne(h => h.Booking)
                .HasForeignKey(h => h.BookingId)
                .OnDelete(DeleteBehavior.Cascade);

            // Indexes
            builder.HasIndex(sb => sb.BookingNumber).IsUnique();
            builder.HasIndex(sb => sb.CustomerId);
            builder.HasIndex(sb => sb.ServiceId);
            builder.HasIndex(sb => sb.ServiceProviderId);
            builder.HasIndex(sb => sb.Status);
            builder.HasIndex(sb => sb.ScheduledDate);
            builder.HasIndex(sb => sb.IsEmergency);
            builder.HasIndex(sb => new { sb.CustomerLatitude, sb.CustomerLongitude });
        }
    }
}