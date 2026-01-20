using System.Reflection;
using Application.Common.Interfaces;
using Domain.Entities.Community;
using Domain.Entities.Community.Posts;
using Domain.Entities.Marketing;
using Domain.Entities.Community.Groups;
using Domain.Entities.Community.Events;
using Domain.Entities.Community.Guides;
using Domain.Entities.Community.QA;
using Domain.Entities.Identity;
using Domain.Entities.Admin.System;

using Domain.Entities.Admin.Analytics;
using Domain.Entities.Admin.Management;
using Domain.Entities.Admin.Management.Users;
using Domain.Entities.Marketplace.Services;
using Domain.Entities.Marketplace.Providers;
using Domain.Entities.Marketplace.Bookings;
using Domain.Entities.Marketplace.Products;
using Domain.Entities.Marketplace.Customers;
using Domain.Entities.Marketplace.Payments;
using Domain.Entities.Messaging;
using Domain.Entities.Profile;
using Domain.Entities.Shared.Notifications;
using Domain.Entities.Shared.System;
using Domain.Entities.Community.Reviews;
using Domain.Entities.Media;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, Guid>, IApplicationDbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    // Identity Tables
    public DbSet<UserClaim> UserClaims { get; set; }
    public DbSet<UserSession> UserSessions { get; set; }
    public DbSet<RefreshToken> RefreshTokens { get; set; }
    public DbSet<SecurityLog> SecurityLogs { get; set; }

    public DbSet<Domain.Entities.Community.QA.Question> Questions { get; set; }
    public DbSet<Domain.Entities.Community.QA.Answer> Answers { get; set; }
    public DbSet<Post> Posts { get; set; }
    public DbSet<Group> Groups { get; set; }
    public DbSet<GroupMember> GroupMembers { get; set; }
    public DbSet<Event> Events { get; set; }
    public DbSet<EventAttendance> EventAttendances { get; set; }
    public DbSet<Review> CommunityReviews { get; set; }
    public DbSet<Domain.Entities.Community.Maps.Location> Locations { get; set; }
    public DbSet<Domain.Entities.Community.News.Article> Articles { get; set; }
    public DbSet<Domain.Entities.Community.Pages.Page> Pages { get; set; }
    public DbSet<ReviewCategory> ReviewCategories { get; set; }
    public DbSet<Domain.Entities.Community.News.NewsCategory> NewsCategories { get; set; }
    public DbSet<Domain.Entities.Community.News.NewsComment> NewsComments { get; set; }
    public DbSet<Domain.Entities.Community.News.ArticleLike> ArticleLikes { get; set; }
    public DbSet<Domain.Entities.Community.Maps.CheckIn> CheckIns { get; set; }
    public DbSet<Domain.Entities.Community.Maps.PlaceReview> PlaceReviews { get; set; }
    public DbSet<Domain.Entities.Community.Maps.LocationHour> LocationHours { get; set; }
    public DbSet<Domain.Entities.Community.Maps.LocationCategory> LocationCategories { get; set; }
    // Note: AnswerComment entity doesn't exist yet
    public DbSet<Domain.Entities.Community.Posts.CommentLike> CommentLikes { get; set; }
    public DbSet<Domain.Entities.Community.Pages.PageComment> PageComments { get; set; }
    public DbSet<Domain.Entities.Community.Pages.PageCommentLike> PageCommentLikes { get; set; }
    public DbSet<Domain.Entities.Community.Pages.PageView> PageViews { get; set; }
    public DbSet<Domain.Entities.Community.Pages.PageRevision> PageRevisions { get; set; }
    public DbSet<Domain.Entities.Community.Pages.PageContent> PageContents { get; set; }
    public DbSet<Domain.Entities.Admin.Dashboard.DashboardWidget> DashboardWidgets { get; set; }
    public DbSet<Domain.Entities.Admin.Dashboard.DashboardPermission> DashboardPermissions { get; set; }
    public DbSet<Domain.Entities.Admin.Dashboard.DashboardLayout> DashboardLayouts { get; set; }
    public DbSet<Domain.Entities.Messaging.ConversationMember> ConversationMembers { get; set; }


    // Common Entities (Consolidated)
    public DbSet<Domain.Entities.Common.Category> Categories { get; set; }
    public DbSet<Domain.Entities.Common.Tag> Tags { get; set; }
    public DbSet<Domain.Entities.Common.Comment> Comments { get; set; }
    public DbSet<Domain.Entities.Common.Vote> Votes { get; set; }
    public DbSet<Domain.Entities.Common.Reaction> Reactions { get; set; }
    public DbSet<Domain.Entities.Common.Feedback> Feedbacks { get; set; }
    public DbSet<Domain.Entities.Common.View> Views { get; set; }
    public DbSet<Domain.Entities.Common.Bookmark> Bookmarks { get; set; }
    public DbSet<Domain.Entities.Common.Rating> Ratings { get; set; }
    public DbSet<Domain.Entities.Common.UserActivity> CommunityUserActivities { get; set; }

    // Analytics/Views/Likes
    public DbSet<PostView> PostViews { get; set; }
    public DbSet<PostLike> PostLikes { get; set; }
    public DbSet<PostReport> PostReports { get; set; }
    public DbSet<GuideRating> GuideRatings { get; set; }
    public DbSet<VideoLike> VideoLikes { get; set; }
    public DbSet<VideoView> VideoViews { get; set; }
    public DbSet<PodcastLike> PodcastLikes { get; set; }
    public DbSet<PodcastComment> PodcastComments { get; set; }
    public DbSet<VideoCommentLike> VideoCommentLikes { get; set; }
    public DbSet<PodcastCommentLike> PodcastCommentLikes { get; set; }

    // Media Sets
    public DbSet<Video> Videos { get; set; }
    public DbSet<Podcast> Podcasts { get; set; }
    public DbSet<VideoComment> VideoComments { get; set; }
    public DbSet<PodcastSeries> PodcastSeries { get; set; }
    public DbSet<MediaAnalytics> MediaAnalytics { get; set; }
    public DbSet<PodcastSubscription> PodcastSubscriptions { get; set; }
    public DbSet<PodcastPlay> PodcastPlays { get; set; }
    public DbSet<VideoPlaylist> VideoPlaylists { get; set; }
    public DbSet<VideoPlaylistItem> VideoPlaylistItems { get; set; }
    public DbSet<Recording> Recordings { get; set; }

    // Marketplace
    public DbSet<Service> Services { get; set; }
    public DbSet<CarService> CarServices { get; set; }
    public DbSet<Domain.Entities.Marketplace.Providers.ServiceProvider> ServiceProviders { get; set; }
    public DbSet<ServiceBooking> ServiceBookings { get; set; }
    public DbSet<Product> Products { get; set; }
    public DbSet<Customer> Customers { get; set; }
    public DbSet<ServiceAvailability> ServiceAvailabilities { get; set; }
    public DbSet<ServiceImage> ServiceImages { get; set; }
    public DbSet<Domain.Entities.Marketplace.Payments.ServicePayment> ServicePayments { get; set; }
    public DbSet<ServiceProviderSpecialty> ServiceProviderSpecialties { get; set; }

    // Missing sets
    public DbSet<Domain.Entities.Community.QA.QuestionTag> QuestionTags { get; set; }
    public DbSet<Domain.Entities.Community.QA.UserReputation> UserReputations { get; set; }
    public DbSet<Domain.Entities.Community.QA.Expert> Experts { get; set; }
    public DbSet<Domain.Entities.Community.QA.Analytics> Analytics { get; set; }
    public DbSet<Domain.Entities.Community.QA.UserFeedback> UserFeedback { get; set; }
    public DbSet<Domain.Entities.Community.Guides.Guide> Guides { get; set; }
    public DbSet<Domain.Entities.Community.Guides.GuideStep> GuideSteps { get; set; }

    public DbSet<Domain.Entities.Community.QA.QuestionCategory> QuestionCategories { get; set; }
    public DbSet<Domain.Entities.Community.QA.AnswerHistory> AnswerHistories { get; set; }
    
    // Admin System Tables
    public DbSet<Domain.Entities.Admin.Management.Users.UserActivity> UserActivities { get; set; }
    public DbSet<PerformanceLog> PerformanceLogs { get; set; }
    public DbSet<AdminAction> AdminActions { get; set; }
    public DbSet<SystemMetric> SystemMetrics { get; set; }
    public DbSet<UserPreference> UserPreferences { get; set; }
    public DbSet<Domain.Entities.Profile.UserFriend> UserFriends { get; set; }
    public DbSet<RoleAssignment> RoleAssignments { get; set; }

    // Marketplace Interaction Sets
    public DbSet<ServiceReview> ServiceReviews { get; set; }
    public DbSet<Domain.Entities.Marketplace.Payments.PaymentTransaction> PaymentTransactions { get; set; }
    
    // Marketing Platform Sets
    public DbSet<Campaign> Campaigns { get; set; }
    public DbSet<CampaignContent> CampaignContents { get; set; }
    public DbSet<SocialPlatform> SocialPlatforms { get; set; }
    public DbSet<CampaignPlatform> CampaignPlatforms { get; set; }
    public DbSet<ContentPlatform> ContentPlatforms { get; set; }
    public DbSet<CampaignAnalytics> CampaignAnalytics { get; set; }
    public DbSet<PlatformAnalytics> PlatformAnalytics { get; set; }

    // Shared Sets
    public DbSet<Notification> Notifications { get; set; }
    public DbSet<Domain.Entities.Messaging.Conversation> Conversations { get; set; }
    public DbSet<Domain.Entities.Messaging.ChatMessage> ChatMessages { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
    }
}
