using Domain.Entities.Profile;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations.Community.Social
{
    public class UserFriendConfiguration : IEntityTypeConfiguration<UserFriend>
    {
        public void Configure(EntityTypeBuilder<UserFriend> builder)
        {
            builder.HasKey(uf => uf.Id);

            builder.Property(uf => uf.Status)
                .IsRequired()
                .HasConversion<string>();

            builder.Property(uf => uf.AcceptedAt)
                .IsRequired(false);

            // Configure the relationship from User (initiator) to UserFriend
            builder.HasOne(uf => uf.User)
                .WithMany(u => u.Friends)
                .HasForeignKey(uf => uf.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // Configure the relationship from Friend (recipient) to UserFriend
            builder.HasOne(uf => uf.Friend)
                .WithMany(u => u.FriendOf)
                .HasForeignKey(uf => uf.FriendId)
                .OnDelete(DeleteBehavior.Restrict);

            // Ensure a user cannot be friends with the same person twice
            builder.HasIndex(uf => new { uf.UserId, uf.FriendId })
                .IsUnique();

            // Add a check constraint to prevent self-friendship
            builder.ToTable(t => t.HasCheckConstraint("CK_UserFriend_NoSelfFriendship", "[UserId] != [FriendId]"));
        }
    }
}
