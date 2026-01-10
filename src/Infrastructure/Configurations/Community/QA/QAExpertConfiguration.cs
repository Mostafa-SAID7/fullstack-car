using Domain.Entities.Community.QA;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations.Community.QA
{
    public class QAExpertConfiguration : IEntityTypeConfiguration<QAExpert>
    {
        public void Configure(EntityTypeBuilder<QAExpert> builder)
        {
            builder.ToTable("QAExperts");

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
                .WithMany(c => c.Experts)
                .HasForeignKey(e => e.CategoryId)
                .OnDelete(DeleteBehavior.NoAction);

            // Unique constraint
            builder.HasIndex(e => new { e.UserId, e.CategoryId })
                .IsUnique()
                .HasDatabaseName("IX_QAExperts_UserId_CategoryId");

            // Indexes
            builder.HasIndex(e => new { e.CategoryId, e.ExpertiseLevel })
                .HasDatabaseName("IX_QAExperts_Category_Level");

            builder.HasIndex(e => e.UserId)
                .HasDatabaseName("IX_QAExperts_UserId");
        }
    }
}