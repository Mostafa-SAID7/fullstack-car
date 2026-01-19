using Domain.Entities.Community;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations.Community
{
    public class QuestionVoteConfiguration : IEntityTypeConfiguration<QuestionVote>
    {
        public void Configure(EntityTypeBuilder<QuestionVote> builder)
        {
            builder.ToTable("QuestionVotes");

            builder.HasKey(x => x.Id);

            builder.Property(x => x.VoteType)
                .IsRequired()
                .HasConversion<int>();

            builder.HasOne(x => x.Question)
                .WithMany(x => x.Votes)
                .HasForeignKey(x => x.QuestionId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(x => x.User)
                .WithMany()
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasIndex(x => new { x.QuestionId, x.UserId })
                .IsUnique();
        }
    }
}
