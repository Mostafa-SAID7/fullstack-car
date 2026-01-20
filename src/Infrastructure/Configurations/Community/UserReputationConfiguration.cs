using Domain.Entities.Community.QA;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations.Community
{
    public class UserReputationConfiguration : IEntityTypeConfiguration<UserReputation>
    {
        public void Configure(EntityTypeBuilder<UserReputation> builder)
        {
            builder.ToTable("UserReputations");

            builder.HasKey(ur => ur.Id);

            builder.Property(ur => ur.ReputationScore)
                .IsRequired()
                .HasDefaultValue(0);

            builder.Property(ur => ur.QuestionsAsked)
                .IsRequired()
                .HasDefaultValue(0);

            builder.Property(ur => ur.AnswersGiven)
                .IsRequired()
                .HasDefaultValue(0);

            builder.Property(ur => ur.AcceptedAnswers)
                .IsRequired()
                .HasDefaultValue(0);

            builder.Property(ur => ur.UpvotesReceived)
                .IsRequired()
                .HasDefaultValue(0);

            builder.Property(ur => ur.DownvotesReceived)
                .IsRequired()
                .HasDefaultValue(0);

            builder.Property(ur => ur.BadgesEarned)
                .HasMaxLength(2000);

            builder.Property(ur => ur.ExpertiseAreas)
                .HasMaxLength(2000);

            builder.Property(ur => ur.LastUpdated)
                .IsRequired()
                .HasDefaultValueSql("GETUTCDATE()");

            // Foreign key relationships
            builder.HasOne(ur => ur.User)
                .WithMany()
                .HasForeignKey(ur => ur.UserId)
                .OnDelete(DeleteBehavior.NoAction);

            // Indexes
            builder.HasIndex(ur => ur.UserId)
                .IsUnique()
                .HasDatabaseName("IX_UserReputations_UserId");

            builder.HasIndex(ur => ur.ReputationScore)
                .HasDatabaseName("IX_UserReputations_ReputationScore");

            builder.HasIndex(ur => ur.ExpertiseAreas)
                .HasDatabaseName("IX_UserReputations_ExpertiseAreas");
        }
    }
}
