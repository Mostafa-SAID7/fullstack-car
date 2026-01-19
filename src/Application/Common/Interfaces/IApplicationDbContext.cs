using Domain.Entities.Identity;
using Domain.Entities.Community.Posts;
using Domain.Entities.Community.Groups;
using Domain.Entities.Community.Reviews;
using Domain.Entities.Community.Social;
using Domain.Entities.Community.QA;
using Domain.Entities.Marketplace;
using Domain.Entities.Marketplace.Services;
using Domain.Entities.Marketplace.Providers;
using Domain.Entities.Marketplace.Bookings;
using Domain.Entities.Marketplace.Reviews;
using Domain.Entities.Marketplace.Payments;
using Domain.Entities.Marketing;
using Domain.Entities.Shared.Chat;
using Domain.Entities.Shared.Notifications;
using Domain.Entities.Shared.System;
using Domain.Entities.Shared.Errors;
using Domain.Entities.Admin.Analytics;
using Domain.Entities.Admin.Management;
using Domain.Entities.Admin.Management.Users;
using Domain.Entities.Marketplace.Products;
using Domain.Entities.Marketplace.Customers;
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

        // Community QA Tables
        DbSet<Question> Questions { get; }
        DbSet<Answer> Answers { get; }
        DbSet<AnswerHistory> AnswerHistories { get; }
        DbSet<QuestionCategory> QuestionCategories { get; }
        DbSet<QuestionTag> QuestionTags { get; }
        DbSet<QuestionVote> QuestionVotes { get; }
        DbSet<AnswerVote> AnswerVotes { get; }
        DbSet<Vote> Votes { get; }
        DbSet<QuestionView> QuestionViews { get; }
        DbSet<QuestionBookmark> QuestionBookmarks { get; }
        DbSet<UserReputation> UserReputations { get; }
        DbSet<UserActivity> UserActivities { get; }
        DbSet<Expert> Experts { get; }
        DbSet<Category> Categories { get; }
        DbSet<Tag> Tags { get; }
        DbSet<Analytics> Analytics { get; }

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
        DbSet<Domain.Entities.Admin.Management.Users.UserActivity> UserActivities { get; }
        DbSet<UserPreference> UserPreferences { get; }
        DbSet<SystemMetric> SystemMetrics { get; }
        DbSet<PerformanceLog> PerformanceLogs { get; }
        DbSet<ErrorLog> ErrorLogs { get; }
        DbSet<ApiUsageLog> ApiUsageLogs { get; }

        // Admin Management Tables
        DbSet<AdminAction> AdminActions { get; }
        DbSet<UserSuspension> UserSuspensions { get; }
        DbSet<RoleAssignment> RoleAssignments { get; }
        DbSet<Customer> Customers { get; }
        DbSet<Product> Products { get; }

        // Notification Tables
        DbSet<EmailLog> EmailLogs { get; }
        DbSet<PushNotificationLog> PushNotificationLogs { get; }
        DbSet<NotificationPreference> NotificationPreferences { get; }

        // Media Tables
        DbSet<Domain.Entities.Media.Video> Videos { get; }
        DbSet<Domain.Entities.Media.Podcast> Podcasts { get; }
        DbSet<Domain.Entities.Media.PodcastSeries> PodcastSeries { get; }
        DbSet<Domain.Entities.Media.MediaAnalytics> MediaAnalytics { get; }
        DbSet<Domain.Entities.Media.VideoComment> VideoComments { get; }
        DbSet<Domain.Entities.Media.PodcastComment> PodcastComments { get; }
        DbSet<Domain.Entities.Media.VideoLike> VideoLikes { get; }
        DbSet<Domain.Entities.Media.PodcastLike> PodcastLikes { get; }
        DbSet<Domain.Entities.Media.PodcastSubscription> PodcastSubscriptions { get; }
        DbSet<Domain.Entities.Media.VideoCommentLike> VideoCommentLikes { get; }
        DbSet<Domain.Entities.Media.PodcastCommentLike> PodcastCommentLikes { get; }
        DbSet<Domain.Entities.Media.VideoView> VideoViews { get; }
        DbSet<Domain.Entities.Media.PodcastPlay> PodcastPlays { get; }
        DbSet<Domain.Entities.Media.VideoPlaylist> VideoPlaylists { get; }
        DbSet<Domain.Entities.Media.VideoPlaylistItem> VideoPlaylistItems { get; }

        // Marketing Tables
        DbSet<Campaign> Campaigns { get; }
        DbSet<CampaignContent> CampaignContents { get; }
        DbSet<SocialPlatform> SocialPlatforms { get; }
        DbSet<CampaignPlatform> CampaignPlatforms { get; }
        DbSet<ContentPlatform> ContentPlatforms { get; }
        DbSet<CampaignAnalytics> CampaignAnalytics { get; }
        DbSet<PlatformAnalytics> PlatformAnalytics { get; }
        DbSet<MarketingOverview> MarketingOverviews { get; }

        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}
