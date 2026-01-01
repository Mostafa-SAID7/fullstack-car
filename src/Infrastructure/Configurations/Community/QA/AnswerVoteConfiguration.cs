using Domain.Entities.Community.QA;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations.Community.QA
{
    public class AnswerVoteConfiguration : IEntityTypeConfiguration<AnswerVote>
    {
        public void Configure(EntityTypeBuilder<AnswerVote> builder)
        {
            builder.ToTable("AnswerVotes");

            builder.HasKey(x => x.Id);

            builder.Property(x => x.VoteType)
                .IsRequired()
                .HasConversion<int>();

            builder.HasOne(x => x.Answer)
                .WithMany(x => x.Votes)
                .HasForeignKey(x => x.AnswerId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(x => x.User)
                .WithMany()
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasIndex(x => new { x.AnswerId, x.UserId })
                .IsUnique();
        }
    }
}