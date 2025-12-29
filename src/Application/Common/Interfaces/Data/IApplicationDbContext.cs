using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Application.Common.Interfaces.Data
{
    public interface IApplicationDbContext
    {
        DbSet<User> Users { get; }
        DbSet<Post> Posts { get; }
        DbSet<Comment> Comments { get; }
        DbSet<CommentLike> CommentLikes { get; }
        DbSet<Group> Groups { get; }
        DbSet<GroupMember> GroupMembers { get; }
        DbSet<PostLike> PostLikes { get; }
        DbSet<Review> Reviews { get; }
        DbSet<UserFriend> UserFriends { get; }

        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}