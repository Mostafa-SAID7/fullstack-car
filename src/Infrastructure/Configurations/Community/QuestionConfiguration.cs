using Domain.Entities.Community;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations.Community
{
    public class QuestionConfiguration : IEntityTypeConfiguration<Question>
    {
        public void Configure(EntityTypeBuilder<Question> builder)
        {
            builder.ToTable("Questions");

            builder.HasKey(x => x.Id);

            builder.Property(x => x.Title)
                .IsRequired()
                .HasMaxLength(500);

            builder.Property(x => x.Content)
                .IsRequired()
                .HasMaxLength(10000);

            builder.Property(x => x.Status)
                .IsRequired()
                .HasConversion<int>();

            builder.Property(x => x.Priority)
                .IsRequired()
                .HasConversion<int>();

            builder.Property(x => x.Tags)
                .HasMaxLength(2000);

            builder.HasOne(x => x.User)
                .WithMany()
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.Group)
                .WithMany()
                .HasForeignKey(x => x.GroupId)
                .OnDelete(DeleteBehavior.SetNull);

            builder.HasOne(x => x.Category)
                .WithMany(x => x.Questions)
                .HasForeignKey(x => x.CategoryId)
                .OnDelete(DeleteBehavior.SetNull);

            builder.HasOne(x => x.AcceptedAnswer)
                .WithOne()
                .HasForeignKey<Question>(x => x.AcceptedAnswerId)
                .OnDelete(DeleteBehavior.SetNull);

            builder.HasMany(x => x.Answers)
                .WithOne(x => x.Question)
                .HasForeignKey(x => x.QuestionId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(x => x.Votes)
                .WithOne(x => x.Question)
                .HasForeignKey(x => x.QuestionId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(x => x.Views)
                .WithOne(x => x.Question)
                .HasForeignKey(x => x.QuestionId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(x => x.Bookmarks)
                .WithOne(x => x.Question)
                .HasForeignKey(x => x.QuestionId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasIndex(x => x.UserId);
            builder.HasIndex(x => x.GroupId);
            builder.HasIndex(x => x.CategoryId);
            builder.HasIndex(x => x.Status);
            builder.HasIndex(x => x.CreatedAt);
        }
    }
}
