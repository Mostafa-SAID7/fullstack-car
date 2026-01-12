using Domain.Entities.Shared.Localization;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations.Shared
{
    public class TranslationCompletenessConfiguration : IEntityTypeConfiguration<TranslationCompleteness>
    {
        public void Configure(EntityTypeBuilder<TranslationCompleteness> builder)
        {
            builder.ToTable("TranslationCompleteness");

            builder.HasKey(x => x.Id);

            builder.Property(x => x.Culture)
                .IsRequired()
                .HasMaxLength(10);

            builder.Property(x => x.Feature)
                .IsRequired()
                .HasMaxLength(50);

            builder.Property(x => x.TotalKeys)
                .IsRequired();

            builder.Property(x => x.TranslatedKeys)
                .IsRequired();

            builder.Property(x => x.CompletionPercentage)
                .HasPrecision(5, 2)
                .IsRequired();

            builder.Property(x => x.LastUpdated)
                .IsRequired();

            // Unique constraint for Culture + Feature combination
            builder.HasIndex(x => new { x.Culture, x.Feature })
                .IsUnique()
                .HasDatabaseName("IX_TranslationCompleteness_Culture_Feature_Unique");

            // Performance indexes
            builder.HasIndex(x => x.Culture)
                .HasDatabaseName("IX_TranslationCompleteness_Culture");

            builder.HasIndex(x => x.Feature)
                .HasDatabaseName("IX_TranslationCompleteness_Feature");

            builder.HasIndex(x => x.CompletionPercentage)
                .HasDatabaseName("IX_TranslationCompleteness_CompletionPercentage");

            builder.HasIndex(x => x.LastUpdated)
                .HasDatabaseName("IX_TranslationCompleteness_LastUpdated");
        }
    }
}