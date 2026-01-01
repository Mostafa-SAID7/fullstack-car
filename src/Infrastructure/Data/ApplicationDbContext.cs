using Domain.Entities.Identity;
using Domain.Entities.Community.Posts;
using Domain.Entities.Community.Groups;
using Domain.Entities.Community.Reviews;
using Domain.Entities.Shared.Chat;
using Domain.Entities.Community.Social;
using Domain.Entities.Marketplace;
using Domain.Entities.Admin.Analytics;
using Domain.Entities.Admin.Dashboard;
using Domain.Entities.Admin.Management;
using Domain.Entities.Admin.Moderation;
using Domain.Entities.Admin.System;
using Domain.Entities.Shared.Notifications;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Reflection;

namespace Infrastructure.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, Guid, IdentityUserClaim<Guid>, UserRole, IdentityUserLogin<Guid>, RoleClaim, IdentityUserToken<Guid>>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        // Identity Tables (with better names)
        public DbSet<UserClaim> UserClaims { get; set; }
        public DbSet<UserSession> UserSessions { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }
        public DbSet<SecurityLog> SecurityLogs { get; set; }

        // Community Tables
        public DbSet<Post> Posts { get; set; }
        public DbSet<PostView> PostViews { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Group> Groups { get; set; }
        public DbSet<GroupMember> GroupMembers { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<UserFriend> UserFriends { get; set; }
        public DbSet<PostLike> PostLikes { get; set; }
        public DbSet<CommentLike> CommentLikes { get; set; }
        public DbSet<PostReport> PostReports { get; set; }

        // Community Q&A Tables
        public DbSet<Domain.Entities.Community.QA.Question> Questions { get; set; }
        public DbSet<Domain.Entities.Community.QA.Answer> Answers { get; set; }
        public DbSet<Domain.Entities.Community.QA.QuestionVote> QuestionVotes { get; set; }
        public DbSet<Domain.Entities.Community.QA.AnswerVote> AnswerVotes { get; set; }
        public DbSet<Domain.Entities.Community.QA.QuestionCategory> QuestionCategories { get; set; }
        public DbSet<Domain.Entities.Community.QA.QuestionTag> QuestionTags { get; set; }
        public DbSet<Domain.Entities.Community.QA.QuestionView> QuestionViews { get; set; }
        public DbSet<Domain.Entities.Community.QA.QuestionBookmark> QuestionBookmarks { get; set; }
        public DbSet<Domain.Entities.Community.QA.AnswerComment> AnswerComments { get; set; }

        // Community Maps Tables
        public DbSet<Domain.Entities.Community.Maps.Location> Locations { get; set; }
        public DbSet<Domain.Entities.Community.Maps.PlaceReview> PlaceReviews { get; set; }
        public DbSet<Domain.Entities.Community.Maps.CheckIn> CheckIns { get; set; }
        public DbSet<Domain.Entities.Community.Maps.LocationCategory> LocationCategories { get; set; }
        public DbSet<Domain.Entities.Community.Maps.LocationImage> LocationImages { get; set; }
        public DbSet<Domain.Entities.Community.Maps.LocationHour> LocationHours { get; set; }
        public DbSet<Domain.Entities.Community.Maps.ReviewHelpful> ReviewHelpfulVotes { get; set; }
        public DbSet<Domain.Entities.Community.Maps.ReviewImage> MapReviewImages { get; set; }
        public DbSet<Domain.Entities.Community.Maps.CheckInLike> CheckInLikes { get; set; }
        public DbSet<Domain.Entities.Community.Maps.CheckInComment> CheckInComments { get; set; }

        // Community News Tables
        public DbSet<Domain.Entities.Community.News.Article> Articles { get; set; }
        public DbSet<Domain.Entities.Community.News.NewsCategory> NewsCategories { get; set; }
        public DbSet<Domain.Entities.Community.News.NewsComment> NewsComments { get; set; }
        public DbSet<Domain.Entities.Community.News.ArticleLike> ArticleLikes { get; set; }
        public DbSet<Domain.Entities.Community.News.ArticleView> ArticleViews { get; set; }
        public DbSet<Domain.Entities.Community.News.ArticleShare> ArticleShares { get; set; }
        public DbSet<Domain.Entities.Community.News.ArticleImage> ArticleImages { get; set; }
        public DbSet<Domain.Entities.Community.News.ArticleTag> ArticleTags { get; set; }
        public DbSet<Domain.Entities.Community.News.CommentLike> NewsCommentLikes { get; set; }

        // Community Pages Tables
        public DbSet<Domain.Entities.Community.Pages.Page> Pages { get; set; }
        public DbSet<Domain.Entities.Community.Pages.PageContent> PageContents { get; set; }
        public DbSet<Domain.Entities.Community.Pages.PageRevision> PageRevisions { get; set; }
        public DbSet<Domain.Entities.Community.Pages.PageView> PageViews { get; set; }
        public DbSet<Domain.Entities.Community.Pages.PageComment> PageComments { get; set; }
        public DbSet<Domain.Entities.Community.Pages.PageCommentLike> PageCommentLikes { get; set; }

        // Community Reviews Tables (Enhanced)
        public DbSet<Domain.Entities.Community.Reviews.CommunityReview> CommunityReviews { get; set; }
        public DbSet<Domain.Entities.Community.Reviews.ReviewCategory> ReviewCategories { get; set; }
        public DbSet<Domain.Entities.Community.Reviews.ReviewHelpfulness> ReviewHelpfulness { get; set; }
        public DbSet<Domain.Entities.Community.Reviews.ReviewComment> ReviewComments { get; set; }
        public DbSet<Domain.Entities.Community.Reviews.ReviewImage> CommunityReviewImages { get; set; }
        public DbSet<Domain.Entities.Community.Reviews.ReviewCommentLike> ReviewCommentLikes { get; set; }

        // Community Guides Tables
        public DbSet<Domain.Entities.Community.Guides.Guide> Guides { get; set; }
        public DbSet<Domain.Entities.Community.Guides.GuideStep> GuideSteps { get; set; }
        public DbSet<Domain.Entities.Community.Guides.GuideRating> GuideRatings { get; set; }
        public DbSet<Domain.Entities.Community.Guides.GuideBookmark> GuideBookmarks { get; set; }
        public DbSet<Domain.Entities.Community.Guides.GuideView> GuideViews { get; set; }

        // Shared Tables
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<Conversation> Conversations { get; set; }
        public DbSet<ConversationMember> ConversationMembers { get; set; }
        public DbSet<ChatMessage> ChatMessages { get; set; }
        public DbSet<Domain.Entities.Shared.Attachments.Attachment> Attachments { get; set; }
        public DbSet<Domain.Entities.Shared.Settings.Setting> Settings { get; set; }

        // Shared Caching Tables
        public DbSet<Domain.Entities.Shared.Caching.CacheEntry> CacheEntries { get; set; }
        public DbSet<Domain.Entities.Shared.Caching.CacheStatistic> CacheStatistics { get; set; }

        // Shared Documents Tables
        public DbSet<Domain.Entities.Shared.Documents.Document> Documents { get; set; }
        public DbSet<Domain.Entities.Shared.Documents.DocumentVersion> DocumentVersions { get; set; }

        // Shared Localization Tables
        public DbSet<Domain.Entities.Shared.Localization.LocalizationResource> LocalizationResources { get; set; }
        public DbSet<Domain.Entities.Shared.Localization.Culture> Cultures { get; set; }

        // Shared Logging Tables
        public DbSet<Domain.Entities.Shared.Logging.LogEntry> LogEntries { get; set; }

        // Shared Security Tables
        public DbSet<Domain.Entities.Shared.Security.SecurityEvent> SecurityEvents { get; set; }
        public DbSet<Domain.Entities.Shared.Security.RateLimit> RateLimits { get; set; }

        // Shared Storage Tables
        public DbSet<Domain.Entities.Shared.Storage.StorageItem> StorageItems { get; set; }

        // Shared System Tables
        public DbSet<Domain.Entities.Shared.System.HealthCheck> HealthChecks { get; set; }
        public DbSet<Domain.Entities.Shared.System.SystemMetric> SharedSystemMetrics { get; set; }

        // Shared Search Tables
        public DbSet<Domain.Entities.Shared.Search.SearchQuery> SearchQueries { get; set; }
        public DbSet<Domain.Entities.Shared.Search.SearchIndex> SearchIndexes { get; set; }
        public DbSet<Domain.Entities.Shared.Search.SearchSuggestion> SearchSuggestions { get; set; }
        public DbSet<Domain.Entities.Shared.Search.SearchFilter> SearchFilters { get; set; }

        // Shared Error Tables
        public DbSet<Domain.Entities.Shared.Errors.ErrorLog> SharedErrorLogs { get; set; }
        public DbSet<Domain.Entities.Shared.Errors.ErrorPattern> ErrorPatterns { get; set; }
        public DbSet<Domain.Entities.Shared.Errors.ErrorReport> ErrorReports { get; set; }

        // Marketplace Tables
        public DbSet<Domain.Entities.Marketplace.Providers.ServiceProvider> ServiceProviders { get; set; }
        public DbSet<Domain.Entities.Marketplace.Services.Service> Services { get; set; }
        public DbSet<Domain.Entities.Marketplace.Services.CarService> CarServices { get; set; }
        public DbSet<Domain.Entities.Marketplace.Bookings.ServiceBooking> ServiceBookings { get; set; }
        public DbSet<Domain.Entities.Marketplace.Reviews.ServiceReview> ServiceReviews { get; set; }
        public DbSet<Domain.Entities.Marketplace.Payments.PaymentTransaction> PaymentTransactions { get; set; }
        
        // Marketplace Services
        public DbSet<Domain.Entities.Marketplace.Services.ServiceImage> ServiceImages { get; set; }
        public DbSet<Domain.Entities.Marketplace.Services.ServiceAvailability> ServiceAvailabilities { get; set; }
        public DbSet<Domain.Entities.Marketplace.Services.ServicePricing> ServicePricings { get; set; }
        
        // Marketplace Providers
        public DbSet<Domain.Entities.Marketplace.Providers.ServiceProviderSpecialty> ServiceProviderSpecialties { get; set; }
        public DbSet<Domain.Entities.Marketplace.Providers.ProviderCertification> ProviderCertifications { get; set; }
        public DbSet<Domain.Entities.Marketplace.Providers.ProviderTeamMember> ProviderTeamMembers { get; set; }
        
        // Marketplace Bookings
        public DbSet<Domain.Entities.Marketplace.Bookings.BookingStatusHistory> BookingStatusHistories { get; set; }
        public DbSet<Domain.Entities.Marketplace.Bookings.BookingAttachment> BookingAttachments { get; set; }
        
        // Marketplace Payments
        public DbSet<Domain.Entities.Marketplace.Payments.PaymentRefund> PaymentRefunds { get; set; }
        public DbSet<Domain.Entities.Marketplace.Payments.ServicePayment> ServicePayments { get; set; }
        
        // Marketplace Reviews
        public DbSet<Domain.Entities.Marketplace.Reviews.ReviewAttachment> ReviewAttachments { get; set; }
        public DbSet<Domain.Entities.Marketplace.Reviews.ReviewHelpfulness> ReviewHelpfulnessVotes { get; set; }

        // Analytics Tables (Admin)
        public DbSet<UserActivity> UserActivities { get; set; }
        public DbSet<UserPreference> UserPreferences { get; set; }
        public DbSet<AdminSystemMetric> AdminSystemMetrics { get; set; }
        public DbSet<PerformanceLog> PerformanceLogs { get; set; }
        public DbSet<ApplicationErrorLog> ApplicationErrorLogs { get; set; }
        public DbSet<ApiUsageLog> ApiUsageLogs { get; set; }

        // Admin Dashboard Tables
        public DbSet<DashboardWidget> DashboardWidgets { get; set; }
        public DbSet<DashboardLayout> DashboardLayouts { get; set; }
        public DbSet<DashboardPermission> DashboardPermissions { get; set; }

        // Admin Management Tables
        public DbSet<AdminAction> AdminActions { get; set; }
        public DbSet<UserSuspension> UserSuspensions { get; set; }
        public DbSet<RoleAssignment> RoleAssignments { get; set; }

        // Admin Moderation Tables
        public DbSet<ContentModerationAction> ContentModerationActions { get; set; }
        public DbSet<ModerationQueue> ModerationQueues { get; set; }
        public DbSet<AutoModerationRule> AutoModerationRules { get; set; }

        // Admin System Tables
        public DbSet<AuditLog> AuditLogs { get; set; }
        public DbSet<SystemConfiguration> SystemConfigurations { get; set; }
        public DbSet<SystemBackup> SystemBackups { get; set; }

        // Notification Tables
        public DbSet<EmailLog> EmailLogs { get; set; }
        public DbSet<PushNotificationLog> PushNotificationLogs { get; set; }
        public DbSet<NotificationPreference> NotificationPreferences { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Configure Identity table names
            builder.Entity<ApplicationUser>().ToTable("Users");
            builder.Entity<ApplicationRole>().ToTable("Roles");
            builder.Entity<UserRole>().ToTable("UserRoles");
            builder.Entity<IdentityUserClaim<Guid>>().ToTable("UserClaims");
            builder.Entity<IdentityUserLogin<Guid>>().ToTable("UserLogins");
            builder.Entity<IdentityUserToken<Guid>>().ToTable("UserTokens");
            builder.Entity<RoleClaim>().ToTable("RoleClaims");
            builder.Entity<SecurityLog>().ToTable("SecurityLogs");

            // Apply all configurations
            builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
        }
    }
}