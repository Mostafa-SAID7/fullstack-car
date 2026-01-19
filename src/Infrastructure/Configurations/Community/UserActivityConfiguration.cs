using Domain.Entities.Community;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations.Community
{
    public class UserActivityConfiguration : IEntityTypeConfiguration<UserActivity>
    {
        public void Configure(EntityTypeBuilder<UserActivity> builder)
        {
            builder.ToTable("UserActivities");

            builder.HasKey(ua => ua.Id);

            builder.Property(ua => ua.ActivityType)
                .IsRequired()
                .HasMaxLength(50);

            builder.Property(ua => ua.ContentId)
                .IsRequired();

            builder.Property(ua => ua.Category)
                .HasMaxLength(100);

            builder.Property(ua => ua.ReputationChange)
                .IsRequired()
                .HasDefaultValue(0);

            // Foreign key relationships
            builder.HasOne(ua => ua.User)
                .WithMany()
                .HasForeignKey(ua => ua.UserId)
                .OnDelete(DeleteBehavior.NoAction);

            // Indexes
            builder.HasIndex(ua => new { ua.UserId, ua.CreatedAt })
                .HasDatabaseName("IX_UserActivities_UserId_Date");

            builder.HasIndex(ua => new { ua.ActivityType, ua.CreatedAt })
                .HasDatabaseName("IX_UserActivities_Type_Date");
        }
    }
}
