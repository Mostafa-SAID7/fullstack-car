using Domain.Entities.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations.Identity
{
    public class RoleClaimConfiguration : IEntityTypeConfiguration<RoleClaim>
    {
        public void Configure(EntityTypeBuilder<RoleClaim> builder)
        {
            builder.ToTable("RoleClaims");

            builder.Property(rc => rc.Description)
                .HasMaxLength(500);

            builder.Property(rc => rc.CreatedBy)
                .HasMaxLength(100);

            // Indexes
            builder.HasIndex(rc => rc.ClaimType);
            builder.HasIndex(rc => rc.IsActive);

            // Relationships
            builder.HasOne(rc => rc.Role)
                .WithMany(r => r.RoleClaims)
                .HasForeignKey(rc => rc.RoleId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
