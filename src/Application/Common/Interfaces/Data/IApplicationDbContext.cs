using Domain.Entities.Identity;
using Domain.Entities.Community.Posts;
using Domain.Entities.Community.Groups;
using Domain.Entities.Community.Reviews;
using Domain.Entities.Community.Social;
using Domain.Entities.Marketplace;
using Microsoft.EntityFrameworkCore;

namespace Application.Common.Interfaces.Data
{
    public interface IApplicationDbContext
    {
        DbSet<ApplicationUser> Users { get; }
        DbSet<Post> Posts { get; }
        DbSet<PostView> PostViews { get; }
        DbSet<Comment> Comments { get; }
        DbSet<CommentLike> CommentLikes { get; }
        DbSet<Group> Groups { get; }
        DbSet<GroupMember> GroupMembers { get; }
        DbSet<PostLike> PostLikes { get; }
        DbSet<PostReport> PostReports { get; }
        DbSet<Review> Reviews { get; }
        DbSet<UserFriend> UserFriends { get; }
        DbSet<UserFriend> FriendRequests { get; }

        // Marketplace
        DbSet<ServiceProvider> ServiceProviders { get; }
        DbSet<CarService> CarServices { get; }
        DbSet<ServiceBooking> ServiceBookings { get; }
        DbSet<ServicePayment> ServicePayments { get; }
        DbSet<ServiceReview> ServiceReviews { get; }
        DbSet<ServiceImage> ServiceImages { get; }
        DbSet<ServiceAvailability> ServiceAvailabilities { get; }
        DbSet<ServiceProviderSpecialty> ServiceProviderSpecialties { get; }
        DbSet<BookingStatusHistory> BookingStatusHistories { get; }

        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}