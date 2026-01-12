using Domain.Entities.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations.Identity
{
    public class ApplicationUserConfiguration : IEntityTypeConfiguration<ApplicationUser>
    {
        public void Configure(EntityTypeBuilder<ApplicationUser> builder)
        {
            // Table name - match what was created in migrations
            builder.ToTable("AspNetUsers");

            // Basic properties
            builder.Property(u => u.FirstName)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(u => u.LastName)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(u => u.ProfileImageUrl)
                .HasMaxLength(500);

            builder.Property(u => u.Bio)
                .HasMaxLength(1000);

            builder.Property(u => u.CoverImageUrl)
                .HasMaxLength(2048);

            builder.Property(u => u.Location)
                .HasMaxLength(100);

            builder.Property(u => u.Website)
                .HasMaxLength(500);

            builder.Property(u => u.IsPrivateProfile)
                .IsRequired()
                .HasDefaultValue(false);

            builder.Property(u => u.NotificationPreferences)
                .HasColumnType("nvarchar(max)");

            builder.Property(u => u.PrivacySettings)
                .HasColumnType("nvarchar(max)");

            builder.Property(u => u.IsActive)
                .IsRequired();

            builder.Property(u => u.Status)
                .IsRequired()
                .HasConversion<string>();

            builder.Property(u => u.SuspensionReason)
                .HasMaxLength(500);

            builder.Property(u => u.ExternalProvider)
                .HasMaxLength(50);

            builder.Property(u => u.ExternalProviderId)
                .HasMaxLength(100);

            // Localization preferences
            builder.Property(u => u.PreferredLanguage)
                .IsRequired()
                .HasMaxLength(10)
                .HasDefaultValue("en-US");

            builder.Property(u => u.IsRTLPreferred)
                .IsRequired()
                .HasDefaultValue(false);

            // Indexes
            builder.HasIndex(u => u.Email).IsUnique();
            builder.HasIndex(u => u.Status);
            builder.HasIndex(u => u.IsActive);
            builder.HasIndex(u => u.IsPrivateProfile);
            builder.HasIndex(u => u.LastActiveAt);
            builder.HasIndex(u => u.Location);
            builder.HasIndex(u => new { u.ExternalProvider, u.ExternalProviderId });
            builder.HasIndex(u => u.PreferredLanguage);
            builder.HasIndex(u => u.IsRTLPreferred);

            // Configure relationships - Use Restrict for Posts to avoid cascade conflicts
            builder.HasMany(u => u.Posts)
                .WithOne(p => p.User)
                .HasForeignKey(p => p.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(u => u.Groups)
                .WithOne(g => g.Owner)
                .HasForeignKey(g => g.OwnerId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(u => u.Reviews)
                .WithOne(r => r.User)
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(u => u.RefreshTokens)
                .WithOne(rt => rt.User)
                .HasForeignKey(rt => rt.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(u => u.GroupMemberships)
                .WithOne(gm => gm.User)
                .HasForeignKey(gm => gm.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(u => u.Claims)
                .WithOne(uc => uc.User)
                .HasForeignKey(uc => uc.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(u => u.Sessions)
                .WithOne(us => us.User)
                .HasForeignKey(us => us.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Friend relationships
            builder.HasMany(u => u.Friends)
                .WithOne(uf => uf.User)
                .HasForeignKey(uf => uf.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(u => u.FriendOf)
                .WithOne(uf => uf.Friend)
                .HasForeignKey(uf => uf.FriendId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
