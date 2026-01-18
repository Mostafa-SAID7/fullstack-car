using Domain.Entities.Community.Events;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations.Community.Events
{
    public class EventConfiguration : IEntityTypeConfiguration<Event>
    {
        public void Configure(EntityTypeBuilder<Event> builder)
        {
            builder.ToTable("Events");

            builder.HasKey(e => e.Id);

            builder.Property(e => e.Title)
                .IsRequired()
                .HasMaxLength(200);

            builder.Property(e => e.Description)
                .IsRequired()
                .HasMaxLength(2000);

            builder.Property(e => e.Category)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(e => e.EventType)
                .IsRequired()
                .HasMaxLength(50);

            builder.Property(e => e.Location)
                .HasMaxLength(500);

            builder.Property(e => e.OnlineLink)
                .HasMaxLength(1000);

            builder.Property(e => e.Status)
                .IsRequired()
                .HasMaxLength(50);

            builder.Property(e => e.Currency)
                .HasMaxLength(10);

            builder.Property(e => e.ImageUrl)
                .HasMaxLength(1000);

            builder.Property(e => e.Price)
                .HasColumnType("decimal(18,2)");

            // Configure relationships
            builder.HasOne(e => e.Organizer)
                .WithMany()
                .HasForeignKey(e => e.OrganizerId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(e => e.Attendances)
                .WithOne(a => a.Event)
                .HasForeignKey(a => a.EventId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(e => e.Comments)
                .WithOne(c => c.Event)
                .HasForeignKey(c => c.EventId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(e => e.Invitations)
                .WithOne(i => i.Event)
                .HasForeignKey(i => i.EventId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(e => e.Updates)
                .WithOne(u => u.Event)
                .HasForeignKey(u => u.EventId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure indexes
            builder.HasIndex(e => e.StartDate);
            builder.HasIndex(e => e.Category);
            builder.HasIndex(e => e.EventType);
            builder.HasIndex(e => e.IsPublic);
            builder.HasIndex(e => e.IsActive);
            builder.HasIndex(e => e.IsFeatured);
            builder.HasIndex(e => e.OrganizerId);
            builder.HasIndex(e => new { e.StartDate, e.IsActive, e.IsPublic });
        }
    }
}