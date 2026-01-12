using Domain.Entities.Shared.Localization;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations.Shared
{
    public class TranslationAuditConfiguration : IEntityTypeConfiguration<TranslationAudit>
    {
        public void Configure(EntityTypeBuilder<TranslationAudit> builder)
        {
            builder.ToTable("TranslationAudits");

            builder.HasKey(x => x.Id);

            builder.Property(x => x.Culture)
                .IsRequired()
                .HasMaxLength(10);

            builder.Property(x => x.Feature)
                .IsRequired()
                .HasMaxLength(50);

            builder.Property(x => x.TranslationKey)
                .IsRequired()
                .HasMaxLength(200);

            builder.Property(x => x.OldValue)
                .HasColumnType("nvarchar(max)");

            builder.Property(x => x.NewValue)
                .HasColumnType("nvarchar(max)");

            // Indexes for performance
            builder.HasIndex(x => new { x.Culture, x.Feature })
                .HasDatabaseName("IX_TranslationAudits_Culture_Feature");

            builder.HasIndex(x => x.TranslationKey)
                .HasDatabaseName("IX_TranslationAudits_TranslationKey");

            builder.HasIndex(x => x.CreatedAt)
                .HasDatabaseName("IX_TranslationAudits_CreatedAt");

            builder.HasIndex(x => x.UpdatedBy)
                .HasDatabaseName("IX_TranslationAudits_UpdatedBy");

            // Foreign key relationship
            builder.HasOne(x => x.UpdatedByUser)
                .WithMany()
                .HasForeignKey(x => x.UpdatedBy)
                .OnDelete(DeleteBehavior.SetNull);
        }
    }
}