using Domain.Entities.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations.Identity
{
    public class ApplicationRoleConfiguration : IEntityTypeConfiguration<ApplicationRole>
    {
        public void Configure(EntityTypeBuilder<ApplicationRole> builder)
        {
            builder.ToTable("Roles");

            builder.Property(r => r.Description)
                .HasMaxLength(500);

            builder.Property(r => r.CreatedBy)
                .HasMaxLength(100);

            builder.Property(r => r.UpdatedBy)
                .HasMaxLength(100);

            // Indexes
            builder.HasIndex(r => r.IsActive);
            builder.HasIndex(r => r.IsSystemRole);
            builder.HasIndex(r => r.Priority);

            // Relationships
            builder.HasMany(r => r.UserRoles)
                .WithOne(ur => ur.Role)
                .HasForeignKey(ur => ur.RoleId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(r => r.RoleClaims)
                .WithOne(rc => rc.Role)
                .HasForeignKey(rc => rc.RoleId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
