using Domain.Entities.Admin.Dashboard;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations.Admin.Dashboard;

public class DashboardPermissionConfiguration : IEntityTypeConfiguration<DashboardPermission>
{
    public void Configure(EntityTypeBuilder<DashboardPermission> builder)
    {
        builder.ToTable("DashboardPermissions", t => t.HasCheckConstraint("CK_DashboardPermission_UserOrRole", 
            "(UserId IS NOT NULL AND RoleId IS NULL) OR (UserId IS NULL AND RoleId IS NOT NULL)"));

        builder.HasKey(x => x.Id);

        builder.HasOne(x => x.DashboardLayout)
            .WithMany(x => x.Permissions)
            .HasForeignKey(x => x.DashboardLayoutId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.User)
            .WithMany()
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.Role)
            .WithMany()
            .HasForeignKey(x => x.RoleId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(x => x.DashboardLayoutId);
        builder.HasIndex(x => x.UserId);
        builder.HasIndex(x => x.RoleId);
    }
}