using Domain.Entities.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations.Identity
{
    public class UserClaimConfiguration : IEntityTypeConfiguration<UserClaim>
    {
        public void Configure(EntityTypeBuilder<UserClaim> builder)
        {
            builder.ToTable("UserCustomClaims");

            builder.Property(uc => uc.ClaimType)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(uc => uc.ClaimValue)
                .IsRequired()
                .HasMaxLength(500);

            builder.Property(uc => uc.Description)
                .HasMaxLength(500);

            // Indexes
            builder.HasIndex(uc => uc.ClaimType);
            builder.HasIndex(uc => uc.IsActive);
            builder.HasIndex(uc => uc.ExpiresAt);
            builder.HasIndex(uc => new { uc.UserId, uc.ClaimType });

            // Relationships
            builder.HasOne(uc => uc.User)
                .WithMany(u => u.Claims)
                .HasForeignKey(uc => uc.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
