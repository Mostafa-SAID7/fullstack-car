using Domain.Entities.Community.QA;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations.Community.QA
{
    public class AnswerHistoryConfiguration : IEntityTypeConfiguration<AnswerHistory>
    {
        public void Configure(EntityTypeBuilder<AnswerHistory> builder)
        {
            builder.ToTable("AnswerHistories");

            builder.HasKey(x => x.Id);

            builder.Property(x => x.Content)
                .IsRequired()
                .HasMaxLength(10000);

            builder.Property(x => x.Version)
                .IsRequired();

            builder.Property(x => x.EditReason)
                .HasMaxLength(500)
                .HasDefaultValue("");

            builder.Property(x => x.EditedAt)
                .IsRequired();

            // Relationships
            builder.HasOne(x => x.Answer)
                .WithMany(x => x.VersionHistory)
                .HasForeignKey(x => x.AnswerId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(x => x.EditedByUser)
                .WithMany()
                .HasForeignKey(x => x.EditedByUserId)
                .OnDelete(DeleteBehavior.Restrict);

            // Indexes
            builder.HasIndex(x => x.AnswerId);
            builder.HasIndex(x => new { x.AnswerId, x.Version })
                .IsUnique();
        }
    }
}