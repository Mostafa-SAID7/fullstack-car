using Domain.Entities.Community.QA;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations.Community.QA
{
    public class QATagConfiguration : IEntityTypeConfiguration<QATag>
    {
        public void Configure(EntityTypeBuilder<QATag> builder)
        {
            builder.ToTable("QATags");

            builder.HasKey(t => t.Id);

            builder.Property(t => t.Name)
                .IsRequired()
                .HasMaxLength(50);

            builder.Property(t => t.Description)
                .HasMaxLength(200);

            builder.Property(t => t.UsageCount)
                .IsRequired()
                .HasDefaultValue(0);

            // Foreign key relationships
            builder.HasOne(t => t.Category)
                .WithMany(c => c.Tags)
                .HasForeignKey(t => t.CategoryId)
                .OnDelete(DeleteBehavior.SetNull);

            // Unique constraint on Name
            builder.HasIndex(t => t.Name)
                .IsUnique()
                .HasDatabaseName("IX_QATags_Name");

            // Index on usage count for popular tags
            builder.HasIndex(t => t.UsageCount)
                .HasDatabaseName("IX_QATags_UsageCount");
        }
    }
}