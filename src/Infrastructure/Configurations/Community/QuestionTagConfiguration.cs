using Domain.Entities.Community;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations.Community
{
    public class QuestionTagConfiguration : IEntityTypeConfiguration<QuestionTag>
    {
        public void Configure(EntityTypeBuilder<QuestionTag> builder)
        {
            builder.ToTable("QuestionTags");

            builder.HasKey(qt => qt.Id);

            // Foreign key relationships
            builder.HasOne(qt => qt.Question)
                .WithMany(q => q.QuestionTags)
                .HasForeignKey(qt => qt.QuestionId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(qt => qt.Tag)
                .WithMany(t => t.QuestionTags)
                .HasForeignKey(qt => qt.TagId)
                .OnDelete(DeleteBehavior.NoAction);

            // Unique constraint - one tag per question
            builder.HasIndex(qt => new { qt.QuestionId, qt.TagId })
                .IsUnique()
                .HasDatabaseName("IX_QuestionTags_QuestionId_TagId");
        }
    }
}
