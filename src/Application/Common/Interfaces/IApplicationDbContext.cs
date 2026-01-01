using Domain.Entities.Identity;
using Domain.Entities.Community.Posts;
using Domain.Entities.Community.Groups;
using Domain.Entities.Community.Reviews;
using Domain.Entities.Community.Social;
using Domain.Entities.Marketplace;
using Domain.Entities.Shared.Chat;
using Domain.Entities.Shared.Notifications;
using Domain.Entities.Admin.Analytics;
using Microsoft.EntityFrameworkCore;

namespace Application.Common.Interfaces.Data
{
    public interface IApplicationDbContext
    {
        // Identity Tables
        DbSet<ApplicationUser> Users { get; }
        DbSet<UserClaim> UserClaims { get; }
        DbSet<UserSession> UserSessions { get; }
        DbSet<RefreshToken> RefreshTokens { get; }
        DbSet<SecurityLog> SecurityLogs { get; }

        // Community Tables
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

        // Community Guides Tables
        DbSet<Domain.Entities.Community.Guides.Guide> Guides { get; }
        DbSet<Domain.Entities.Community.Guides.GuideStep> GuideSteps { get; }
        DbSet<Domain.Entities.Community.Guides.GuideRating> GuideRatings { get; }
        DbSet<Domain.Entities.Community.Guides.GuideBookmark> GuideBookmarks { get; }
        DbSet<Domain.Entities.Community.Guides.GuideView> GuideViews { get; }

        // Shared Tables
        DbSet<Notification> Notifications { get; }
        DbSet<Conversation> Conversations { get; }
        DbSet<ConversationMember> ConversationMembers { get; }
        DbSet<ChatMessage> ChatMessages { get; }

        // Marketplace Tables
        DbSet<ServiceProvider> ServiceProviders { get; }
        DbSet<Service> Services { get; }
        DbSet<CarService> CarServices { get; }
        DbSet<ServiceBooking> ServiceBookings { get; }
        DbSet<ServiceReview> ServiceReviews { get; }
        DbSet<PaymentTransaction> PaymentTransactions { get; }
        DbSet<ServicePayment> ServicePayments { get; }
        DbSet<ServiceImage> ServiceImages { get; }
        DbSet<ServiceAvailability> ServiceAvailabilities { get; }
        DbSet<ServiceProviderSpecialty> ServiceProviderSpecialties { get; }
        DbSet<BookingStatusHistory> BookingStatusHistories { get; }

        // Analytics Tables
        DbSet<UserActivity> UserActivities { get; }
        DbSet<UserPreference> UserPreferences { get; }
        DbSet<SystemMetric> SystemMetrics { get; }
        DbSet<PerformanceLog> PerformanceLogs { get; }
        DbSet<ErrorLog> ErrorLogs { get; }
        DbSet<ApiUsageLog> ApiUsageLogs { get; }

        // Notification Tables
        DbSet<EmailLog> EmailLogs { get; }
        DbSet<PushNotificationLog> PushNotificationLogs { get; }
        DbSet<NotificationPreference> NotificationPreferences { get; }

        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}