using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Application.Common.Interfaces
{
    public interface IApplicationDbContext
    {
        DbSet<User> Users { get; }
        DbSet<Post> Posts { get; }
        DbSet<Comment> Comments { get; }
        DbSet<Group> Groups { get; }
        DbSet<GroupMember> GroupMembers { get; }
        DbSet<Review> Reviews { get; }
        DbSet<UserFriend> UserFriends { get; }
        DbSet<PostLike> PostLikes { get; }
        DbSet<CommentLike> CommentLikes { get; }
        
        Task<int> SaveChangesAsync(CancellationToken cancellationToken);
    }
}