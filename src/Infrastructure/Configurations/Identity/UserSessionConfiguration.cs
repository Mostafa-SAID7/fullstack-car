using Domain.Entities.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations.Identity
{
    public class UserSessionConfiguration : IEntityTypeConfiguration<UserSession>
    {
        public void Configure(EntityTypeBuilder<UserSession> builder)
        {
            builder.ToTable("UserSessions");

            builder.Property(us => us.SessionId)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(us => us.DeviceInfo)
                .HasMaxLength(500);

            builder.Property(us => us.IpAddress)
                .HasMaxLength(45); // IPv6 max length

            builder.Property(us => us.UserAgent)
                .HasMaxLength(1000);

            builder.Property(us => us.Location)
                .HasMaxLength(200);

            builder.Property(us => us.RevokedReason)
                .HasMaxLength(500);

            // Indexes
            builder.HasIndex(us => us.SessionId).IsUnique();
            builder.HasIndex(us => us.IsActive);
            builder.HasIndex(us => us.LastActivity);
            builder.HasIndex(us => us.ExpiresAt);
            builder.HasIndex(us => us.IpAddress);

            // Relationships
            builder.HasOne(us => us.User)
                .WithMany(u => u.Sessions)
                .HasForeignKey(us => us.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
