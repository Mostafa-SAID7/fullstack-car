using Domain.Entities.Identity;
using Domain.Entities.Common;
using Domain.Entities.Community.Posts;
using Domain.Entities.Community.Groups;
using Domain.Entities.Community.Reviews;
using Domain.Entities.Community;
using Domain.Entities.Community.Guides;
using Domain.Entities.Marketplace;
using Domain.Entities.Marketplace.Services;
using Domain.Entities.Marketplace.Providers;
using Domain.Entities.Marketplace.Bookings;
using Domain.Entities.Marketplace.Reviews;
using Domain.Entities.Marketplace.Payments;
using Domain.Entities.Marketplace.Products;
using Domain.Entities.Marketplace.Customers;
using Domain.Entities.Marketing;
using Domain.Entities.Community.Events;
using Domain.Entities.Admin.System;
using Domain.Entities.Admin.Analytics;
using Domain.Entities.Admin.Management;
using Domain.Entities.Admin.Management.Users;
using Domain.Entities.Messaging;
using Domain.Entities.Profile;
using Domain.Entities.Shared.Notifications;
using Domain.Entities.Shared.System;
using Domain.Entities.Media;
using Microsoft.EntityFrameworkCore;

namespace Application.Common.Interfaces;

public interface IApplicationDbContext
{
    // Identity Tables
    DbSet<ApplicationUser> Users { get; }
    DbSet<UserClaim> UserClaims { get; set; }
    DbSet<UserSession> UserSessions { get; set; }
    DbSet<RefreshToken> RefreshTokens { get; set; }
    DbSet<SecurityLog> SecurityLogs { get; set; }
    
    // Community Tables
    DbSet<Domain.Entities.Community.QA.Question> Questions { get; set; }
    DbSet<Domain.Entities.Community.QA.Answer> Answers { get; set; }
    DbSet<Post> Posts { get; set; }
    DbSet<Group> Groups { get; set; }
    DbSet<GroupMember> GroupMembers { get; set; }
    DbSet<Event> Events { get; set; }
    DbSet<EventAttendance> EventAttendances { get; set; }
    DbSet<Review> CommunityReviews { get; set; }
    DbSet<Domain.Entities.Community.Maps.Location> Locations { get; set; }
    DbSet<Domain.Entities.Community.News.Article> Articles { get; set; }
    DbSet<Domain.Entities.Community.Pages.Page> Pages { get; set; }
    DbSet<ReviewCategory> ReviewCategories { get; set; }
    DbSet<Domain.Entities.Community.News.NewsCategory> NewsCategories { get; set; }
    DbSet<Domain.Entities.Community.News.NewsComment> NewsComments { get; set; }
    DbSet<Domain.Entities.Community.News.ArticleLike> ArticleLikes { get; set; }
    DbSet<Domain.Entities.Community.Maps.CheckIn> CheckIns { get; set; }
    DbSet<Domain.Entities.Community.Maps.PlaceReview> PlaceReviews { get; set; }
    DbSet<Domain.Entities.Community.Maps.LocationHour> LocationHours { get; set; }
    DbSet<Domain.Entities.Community.Maps.LocationCategory> LocationCategories { get; set; }
    // Note: AnswerComment, QuestionBookmark, QuestionView entities don't exist yet
    DbSet<Domain.Entities.Community.Posts.CommentLike> CommentLikes { get; set; }
    DbSet<Domain.Entities.Community.Pages.PageComment> PageComments { get; set; }
    DbSet<Domain.Entities.Community.Pages.PageCommentLike> PageCommentLikes { get; set; }
    DbSet<Domain.Entities.Community.Pages.PageView> PageViews { get; set; }
    DbSet<Domain.Entities.Community.Pages.PageRevision> PageRevisions { get; set; }
    DbSet<Domain.Entities.Community.Pages.PageContent> PageContents { get; set; }
    DbSet<Domain.Entities.Admin.Dashboard.DashboardWidget> DashboardWidgets { get; set; }
    DbSet<Domain.Entities.Admin.Dashboard.DashboardPermission> DashboardPermissions { get; set; }
    DbSet<Domain.Entities.Admin.Dashboard.DashboardLayout> DashboardLayouts { get; set; }
    DbSet<Domain.Entities.Messaging.ConversationMember> ConversationMembers { get; set; }

    
    // Common Entities (Consolidated)
    DbSet<Domain.Entities.Common.Category> Categories { get; set; }
    DbSet<Domain.Entities.Common.Tag> Tags { get; set; }
    DbSet<Domain.Entities.Common.Comment> Comments { get; set; }
    DbSet<Domain.Entities.Common.Vote> Votes { get; set; }
    DbSet<Domain.Entities.Common.Reaction> Reactions { get; set; }
    DbSet<Domain.Entities.Common.Feedback> Feedbacks { get; set; }
    DbSet<Domain.Entities.Common.View> Views { get; set; }
    DbSet<Domain.Entities.Common.Bookmark> Bookmarks { get; set; }
    DbSet<Domain.Entities.Common.Rating> Ratings { get; set; }
    DbSet<Domain.Entities.Common.UserActivity> CommunityUserActivities { get; set; }
    
    // Analytics/Views/Likes
    DbSet<PostView> PostViews { get; set; }
    DbSet<PostLike> PostLikes { get; set; }
    DbSet<PostReport> PostReports { get; set; }
    DbSet<GuideView> GuideViews { get; set; }
    DbSet<GuideRating> GuideRatings { get; set; }
    DbSet<GuideBookmark> GuideBookmarks { get; set; }
    
    // Media Sets
    DbSet<Video> Videos { get; set; }
    DbSet<VideoLike> VideoLikes { get; set; }
    DbSet<VideoView> VideoViews { get; set; }
    DbSet<VideoComment> VideoComments { get; set; }
    DbSet<VideoCommentLike> VideoCommentLikes { get; set; }
    DbSet<VideoPlaylist> VideoPlaylists { get; set; }
    DbSet<VideoPlaylistItem> VideoPlaylistItems { get; set; }
    
    DbSet<Podcast> Podcasts { get; set; }
    DbSet<PodcastLike> PodcastLikes { get; set; }
    DbSet<PodcastComment> PodcastComments { get; set; }
    DbSet<PodcastCommentLike> PodcastCommentLikes { get; set; }
    DbSet<PodcastSeries> PodcastSeries { get; set; }
    DbSet<PodcastSubscription> PodcastSubscriptions { get; set; }
    DbSet<PodcastPlay> PodcastPlays { get; set; }
    
    DbSet<MediaAnalytics> MediaAnalytics { get; set; }

    // Marketplace
    DbSet<Service> Services { get; set; }
    DbSet<CarService> CarServices { get; set; }
    DbSet<ServiceProvider> ServiceProviders { get; set; }
    DbSet<ServiceBooking> ServiceBookings { get; set; }
    DbSet<Product> Products { get; set; }
    DbSet<Customer> Customers { get; set; }
    DbSet<ServiceAvailability> ServiceAvailabilities { get; set; }
    DbSet<ServiceImage> ServiceImages { get; set; }
    DbSet<ServicePayment> ServicePayments { get; set; }
    DbSet<ServiceProviderSpecialty> ServiceProviderSpecialties { get; set; }
    DbSet<ServiceReview> ServiceReviews { get; set; }
    DbSet<PaymentTransaction> PaymentTransactions { get; set; }

    // Other missing sets expected by codebase
    DbSet<Domain.Entities.Community.QA.QuestionTag> QuestionTags { get; set; }
    DbSet<Domain.Entities.Community.QA.UserReputation> UserReputations { get; set; }
    DbSet<Domain.Entities.Community.QA.Expert> Experts { get; set; }
    DbSet<Domain.Entities.Community.Guides.Guide> Guides { get; set; }
    DbSet<Domain.Entities.Community.Guides.GuideStep> GuideSteps { get; set; }
    DbSet<Domain.Entities.Community.QA.QuestionCategory> QuestionCategories { get; set; }
    DbSet<Domain.Entities.Community.QA.AnswerHistory> AnswerHistories { get; set; }
    
    // Admin/System Tables
    DbSet<Domain.Entities.Admin.Management.Users.UserActivity> UserActivities { get; set; }
    DbSet<PerformanceLog> PerformanceLogs { get; set; }
    DbSet<AdminAction> AdminActions { get; set; }
    DbSet<SystemMetric> SystemMetrics { get; set; }
    DbSet<UserPreference> UserPreferences { get; set; }
    DbSet<Domain.Entities.Profile.UserFriend> UserFriends { get; set; }
    DbSet<RoleAssignment> RoleAssignments { get; set; }
    
    // Marketing Sets
    DbSet<Campaign> Campaigns { get; set; }
    DbSet<CampaignContent> CampaignContents { get; set; }
    DbSet<SocialPlatform> SocialPlatforms { get; set; }
    DbSet<CampaignPlatform> CampaignPlatforms { get; set; }
    DbSet<ContentPlatform> ContentPlatforms { get; set; }
    DbSet<CampaignAnalytics> CampaignAnalytics { get; set; }
    DbSet<PlatformAnalytics> PlatformAnalytics { get; set; }

    // Shared Sets
    DbSet<Notification> Notifications { get; set; }
    DbSet<Conversation> Conversations { get; set; }
    DbSet<ChatMessage> ChatMessages { get; set; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
