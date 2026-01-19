using Domain.Entities.Community.QA;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations.Community.QA
{
    public class ExpertConfiguration : IEntityTypeConfiguration<Expert>
    {
        public void Configure(EntityTypeBuilder<Expert> builder)
        {
            builder.ToTable("Experts");

            builder.HasKey(e => e.Id);

            builder.Property(e => e.ExpertiseLevel)
                .IsRequired()
                .HasMaxLength(20)
                .HasDefaultValue("Beginner");

            builder.Property(e => e.AnswerCount)
                .IsRequired()
                .HasDefaultValue(0);

            builder.Property(e => e.AcceptedAnswerCount)
                .IsRequired()
                .HasDefaultValue(0);

            builder.Property(e => e.AverageRating)
                .HasPrecision(3, 2)
                .HasDefaultValue(0);

            builder.Property(e => e.ResponseRate)
                .HasPrecision(5, 2)
                .HasDefaultValue(0);

            builder.Property(e => e.NotificationEnabled)
                .IsRequired()
                .HasDefaultValue(true);

            // Foreign key relationships
            builder.HasOne(e => e.User)
                .WithMany()
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.HasOne(e => e.Category)
                .WithMany()
                .HasForeignKey(e => e.CategoryId)
                .OnDelete(DeleteBehavior.NoAction);

            // Unique constraint
            builder.HasIndex(e => new { e.UserId, e.CategoryId })
                .IsUnique()
                .HasDatabaseName("IX_Experts_UserId_CategoryId");

            // Indexes
            builder.HasIndex(e => new { e.CategoryId, e.ExpertiseLevel })
                .HasDatabaseName("IX_Experts_Category_Level");

            builder.HasIndex(e => e.UserId)
                .HasDatabaseName("IX_Experts_UserId");
        }
    }
}