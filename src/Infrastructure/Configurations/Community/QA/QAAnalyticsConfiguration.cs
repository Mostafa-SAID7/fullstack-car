using Domain.Entities.Community.QA;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations.Community.QA
{
    public class QAAnalyticsConfiguration : IEntityTypeConfiguration<QAAnalytics>
    {
        public void Configure(EntityTypeBuilder<QAAnalytics> builder)
        {
            builder.ToTable("QAAnalytics");

            builder.HasKey(a => a.Id);

            builder.Property(a => a.Date)
                .IsRequired()
                .HasColumnType("date");

            builder.Property(a => a.QuestionsAsked)
                .IsRequired()
                .HasDefaultValue(0);

            builder.Property(a => a.QuestionsAnswered)
                .IsRequired()
                .HasDefaultValue(0);

            builder.Property(a => a.AnswersAccepted)
                .IsRequired()
                .HasDefaultValue(0);

            builder.Property(a => a.TotalVotes)
                .IsRequired()
                .HasDefaultValue(0);

            builder.Property(a => a.UniqueUsers)
                .IsRequired()
                .HasDefaultValue(0);

            builder.Property(a => a.AverageResponseTime)
                .IsRequired()
                .HasDefaultValue(0);

            builder.Property(a => a.TopCategory)
                .HasMaxLength(100);

            // Unique constraint on Date
            builder.HasIndex(a => a.Date)
                .IsUnique()
                .HasDatabaseName("IX_QAAnalytics_Date");
        }
    }
}