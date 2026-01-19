using Domain.Entities.Identity;
using Domain.Entities.Common;
using Domain.Entities.Community.Posts;
using Domain.Entities.Community.Groups;
using Domain.Entities.Community.Events;
using Domain.Entities.Community.Reviews;
using Domain.Entities.Shared.Chat;
using Domain.Entities.Community.Social;
using Domain.Entities.Marketplace;
using Domain.Entities.Admin.Analytics;
using Domain.Entities.Admin.Dashboard;
using Domain.Entities.Admin.Management;
using Domain.Entities.Admin.Management.Users;
using Domain.Entities.Marketplace.Products;
using Domain.Entities.Marketplace.Customers;
using Domain.Entities.Admin.Moderation;
using Domain.Entities.Admin.System;
using Domain.Entities.Shared.Notifications;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Reflection;
using Infrastructure.Data.Seeds;

using Application.Common.Interfaces;

namespace Infrastructure.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, Guid, IdentityUserClaim<Guid>, UserRole, IdentityUserLogin<Guid>, RoleClaim, IdentityUserToken<Guid>>, IApplicationDbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        // Identity Tables (with better names)
        public new DbSet<UserClaim> UserClaims { get; set; }
        public DbSet<UserSession> UserSessions { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }
        public DbSet<SecurityLog> SecurityLogs { get; set; }

        // Community Tables
        public DbSet<Post> Posts { get; set; }
        public DbSet<Domain.Entities.Common.View> Views { get; set; }
        public DbSet<Domain.Entities.Common.Comment> Comments { get; set; }
        public DbSet<Domain.Entities.Common.Like> Likes { get; set; }
        public DbSet<Domain.Entities.Common.Reaction> Reactions { get; set; }
        public DbSet<Domain.Entities.Common.Bookmark> Bookmarks { get; set; }
        public DbSet<Domain.Entities.Common.Feedback> Feedbacks { get; set; }
        public DbSet<Domain.Entities.Common.Rating> Ratings { get; set; }
        public DbSet<Domain.Entities.Common.Image> Images { get; set; }
        public DbSet<Domain.Entities.Common.File> Files { get; set; }
        public DbSet<Group> Groups { get; set; }
        public DbSet<GroupMember> GroupMembers { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<UserFriend> UserFriends { get; set; }
        public DbSet<UserConnection> UserConnections { get; set; }
        public DbSet<PostReport> PostReports { get; set; }

        // Community Events Tables
        public DbSet<Event> Events { get; set; }
        public DbSet<EventAttendance> EventAttendances { get; set; }
        public DbSet<EventInvitation> EventInvitations { get; set; }
        public DbSet<EventUpdate> EventUpdates { get; set; }

        // Community Q&A Tables
        public DbSet<Domain.Entities.Community.Question> Questions { get; set; }
        public DbSet<Domain.Entities.Community.Answer> Answers { get; set; }
        public DbSet<Domain.Entities.Common.ContentHistory> ContentHistories { get; set; }
        public DbSet<Vote> Votes { get; set; }
        public DbSet<Domain.Entities.Community.UserReputation> UserReputations { get; set; }
        public DbSet<Domain.Entities.Community.Expert> Experts { get; set; }
        public DbSet<Domain.Entities.Community.Analytics> Analytics { get; set; }
        public DbSet<Domain.Entities.Common.UserActivity> CommunityUserActivities { get; set; }
        public DbSet<Domain.Entities.Common.Category> Categories { get; set; }
        public DbSet<Domain.Entities.Common.Tag> Tags { get; set; }
        public DbSet<Domain.Entities.Community.QuestionTag> QuestionTags { get; set; }

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
        public DbSet<Domain.Entities.Community.News.ArticleShare> ArticleShares { get; set; }
        public DbSet<Domain.Entities.Community.News.ArticleImage> ArticleImages { get; set; }
        public DbSet<Domain.Entities.Community.News.ArticleTag> ArticleTags { get; set; }

        // Community Pages Tables
        public DbSet<Domain.Entities.Community.Pages.Page> Pages { get; set; }
        public DbSet<Domain.Entities.Community.Pages.PageContent> PageContents { get; set; }
        public DbSet<Domain.Entities.Community.Pages.PageRevision> PageRevisions { get; set; }

        // Community Reviews Tables (Enhanced)
        public DbSet<Domain.Entities.Community.Reviews.CommunityReview> CommunityReviews { get; set; }
        public DbSet<Domain.Entities.Community.Reviews.ReviewCategory> ReviewCategories { get; set; }
        public DbSet<Domain.Entities.Community.Reviews.ReviewHelpfulness> ReviewHelpfulness { get; set; }
        public DbSet<Domain.Entities.Community.Reviews.ReviewImage> CommunityReviewImages { get; set; }

        // Community Guides Tables
        public DbSet<Domain.Entities.Community.Guides.Guide> Guides { get; set; }
        public DbSet<Domain.Entities.Community.Guides.GuideStep> GuideSteps { get; set; }

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
        public DbSet<Domain.Entities.Shared.Localization.TranslationAudit> TranslationAudits { get; set; }
        public DbSet<Domain.Entities.Shared.Localization.TranslationCompleteness> TranslationCompleteness { get; set; }

        // Shared Logging Tables
        public DbSet<Domain.Entities.Shared.Logging.LogEntry> LogEntries { get; set; }

        // Shared Security Tables
        public DbSet<Domain.Entities.Shared.Security.SecurityEvent> SecurityEvents { get; set; }
        public DbSet<Domain.Entities.Shared.Security.RateLimit> RateLimits { get; set; }

        // Shared Storage Tables
        public DbSet<Domain.Entities.Shared.Storage.StorageItem> StorageItems { get; set; }

        // Shared System Tables
        public DbSet<Domain.Entities.Shared.System.HealthCheck> HealthChecks { get; set; }
        public DbSet<Domain.Entities.Shared.System.SystemMetric> SystemMetrics { get; set; }

        // Shared Search Tables
        public DbSet<Domain.Entities.Shared.Search.SearchQuery> SearchQueries { get; set; }
        public DbSet<Domain.Entities.Shared.Search.SearchIndex> SearchIndexes { get; set; }
        public DbSet<Domain.Entities.Shared.Search.SearchSuggestion> SearchSuggestions { get; set; }
        public DbSet<Domain.Entities.Shared.Search.SearchFilter> SearchFilters { get; set; }

        // Shared Error Tables
        public DbSet<Domain.Entities.Shared.Errors.ErrorLog> ErrorLogs { get; set; }
        public DbSet<Domain.Entities.Shared.Errors.ErrorPattern> ErrorPatterns { get; set; }
        public DbSet<Domain.Entities.Shared.Errors.ErrorReport> ErrorReports { get; set; }

        // Media Tables
        public DbSet<Domain.Entities.Media.Video> Videos { get; set; }
        public DbSet<Domain.Entities.Media.Podcast> Podcasts { get; set; }
        public DbSet<Domain.Entities.Media.PodcastSeries> PodcastSeries { get; set; }
        public DbSet<Domain.Entities.Media.MediaAnalytics> MediaAnalytics { get; set; }
        public DbSet<Domain.Entities.Media.PodcastSubscription> PodcastSubscriptions { get; set; }
        public DbSet<Domain.Entities.Media.PodcastPlay> PodcastPlays { get; set; }
        public DbSet<Domain.Entities.Media.VideoPlaylist> VideoPlaylists { get; set; }
        public DbSet<Domain.Entities.Media.VideoPlaylistItem> VideoPlaylistItems { get; set; }

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
        public DbSet<Domain.Entities.Admin.Management.Users.UserActivity> UserActivities { get; set; }
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
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Product> Products { get; set; }

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

        // Marketing Tables
        public DbSet<Domain.Entities.Marketing.Campaign> Campaigns { get; set; }
        public DbSet<Domain.Entities.Marketing.CampaignContent> CampaignContents { get; set; }
        public DbSet<Domain.Entities.Marketing.SocialPlatform> SocialPlatforms { get; set; }
        public DbSet<Domain.Entities.Marketing.CampaignPlatform> CampaignPlatforms { get; set; }
        public DbSet<Domain.Entities.Marketing.ContentPlatform> ContentPlatforms { get; set; }
        public DbSet<Domain.Entities.Marketing.CampaignAnalytics> CampaignAnalytics { get; set; }
        public DbSet<Domain.Entities.Marketing.PlatformAnalytics> PlatformAnalytics { get; set; }
        public DbSet<Domain.Entities.Marketing.MarketingOverview> MarketingOverviews { get; set; }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            await OnBeforeSaveChanges();
            var result = await base.SaveChangesAsync(cancellationToken);
            return result;
        }

        private async Task OnBeforeSaveChanges()
        {
            ChangeTracker.DetectChanges();
            var auditEntries = new List<AuditEntry>();

            foreach (var entry in ChangeTracker.Entries())
            {
                if (entry.Entity is AuditLog || entry.State == EntityState.Detached || entry.State == EntityState.Unchanged)
                    continue;

                var auditEntry = new AuditEntry(entry);
                auditEntry.TableName = entry.Entity.GetType().Name;
                auditEntry.UserId = null; // Should be handled by ICurrentUserService if accessible
                auditEntries.Add(auditEntry);

                foreach (var property in entry.Properties)
                {
                    string propertyName = property.Metadata.Name;
                    if (property.Metadata.IsPrimaryKey())
                    {
                        auditEntry.KeyValues[propertyName] = property.CurrentValue;
                        continue;
                    }

                    switch (entry.State)
                    {
                        case EntityState.Added:
                            auditEntry.AuditType = Domain.Enums.Admin.System.AuditActionType.Create;
                            auditEntry.NewValues[propertyName] = property.CurrentValue;
                            break;

                        case EntityState.Deleted:
                            auditEntry.AuditType = Domain.Enums.Admin.System.AuditActionType.Delete;
                            auditEntry.OldValues[propertyName] = property.OriginalValue;
                            break;

                        case EntityState.Modified:
                            if (property.IsModified)
                            {
                                auditEntry.ChangedColumns.Add(propertyName);
                                auditEntry.AuditType = Domain.Enums.Admin.System.AuditActionType.Update;
                                auditEntry.OldValues[propertyName] = property.OriginalValue;
                                auditEntry.NewValues[propertyName] = property.CurrentValue;
                            }
                            break;
                    }
                }
            }

            foreach (var auditEntry in auditEntries)
            {
                AuditLogs.Add(auditEntry.ToAuditLog());
            }
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                // This will be overridden by DI configuration
            }
            
            // Suppress the pending model changes warning for now
            optionsBuilder.ConfigureWarnings(warnings => 
                warnings.Ignore(Microsoft.EntityFrameworkCore.Diagnostics.RelationalEventId.PendingModelChangesWarning));
        }

        private class AuditEntry
        {
            public AuditEntry(Microsoft.EntityFrameworkCore.ChangeTracking.EntityEntry entry)
            {
                Entry = entry;
            }
            public Microsoft.EntityFrameworkCore.ChangeTracking.EntityEntry Entry { get; }
            public Guid? UserId { get; set; }
            public string TableName { get; set; }
            public Dictionary<string, object> KeyValues { get; } = new();
            public Dictionary<string, object> OldValues { get; } = new();
            public Dictionary<string, object> NewValues { get; } = new();
            public Domain.Enums.Admin.System.AuditActionType AuditType { get; set; }
            public List<string> ChangedColumns { get; } = new();
            public AuditLog ToAuditLog()
            {
                var audit = new AuditLog();
                audit.UserId = UserId;
                audit.Action = AuditType;
                audit.EntityType = TableName;
                audit.EntityName = TableName;
                audit.Timestamp = DateTime.UtcNow;
                
                if (KeyValues.Count == 1 && KeyValues.First().Value is Guid guidId)
                {
                    audit.EntityId = guidId;
                }
                
                audit.OldValues = OldValues.Count == 0 ? null : System.Text.Json.JsonSerializer.Serialize(OldValues);
                audit.NewValues = NewValues.Count == 0 ? null : System.Text.Json.JsonSerializer.Serialize(NewValues);
                audit.Changes = ChangedColumns.Count == 0 ? string.Empty : System.Text.Json.JsonSerializer.Serialize(ChangedColumns);
                
                return audit;
            }
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Ignore domain events - they are not entities
            builder.Ignore<Domain.DomainEvents.BaseDomainEvent>();

            // Configure Identity table names to match what was created in migrations
            builder.Entity<ApplicationUser>().ToTable("AspNetUsers");
            builder.Entity<ApplicationRole>().ToTable("AspNetRoles");
            builder.Entity<UserRole>().ToTable("AspNetUserRoles");
            builder.Entity<IdentityUserClaim<Guid>>().ToTable("AspNetUserClaims");
            builder.Entity<IdentityUserLogin<Guid>>().ToTable("AspNetUserLogins");
            builder.Entity<IdentityUserToken<Guid>>().ToTable("AspNetUserTokens");
            builder.Entity<RoleClaim>().ToTable("AspNetRoleClaims");
            builder.Entity<SecurityLog>().ToTable("SecurityLogs");

            // Configure Feedback Metadata property as JSON
            builder.Entity<Feedback>()
                .Property(e => e.Metadata)
                .HasColumnType("nvarchar(max)");

            // Apply all configurations first
            builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

            // Seed development data
            MediaSeedData.SeedMediaData(builder);

            // Configure cascade delete behavior to avoid cycles
            // Set all foreign key relationships to NoAction to prevent cascade cycles
            foreach (var entityType in builder.Model.GetEntityTypes())
            {
                foreach (var foreignKey in entityType.GetForeignKeys())
                {
                    foreignKey.DeleteBehavior = DeleteBehavior.NoAction;
                }
            }
        }
    }
}
