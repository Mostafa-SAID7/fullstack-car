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

        // Shared Tables
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<Conversation> Conversations { get; set; }
        public DbSet<ConversationMember> ConversationMembers { get; set; }
        public DbSet<ChatMessage> ChatMessages { get; set; }

        // Marketplace Tables
        public DbSet<Domain.Entities.Marketplace.ServiceProvider> ServiceProviders { get; set; }
        public DbSet<Service> Services { get; set; }
        public DbSet<CarService> CarServices { get; set; }
        public DbSet<ServiceBooking> ServiceBookings { get; set; }
        public DbSet<ServiceReview> ServiceReviews { get; set; }
        public DbSet<PaymentTransaction> PaymentTransactions { get; set; }

        // Analytics Tables
        public DbSet<UserActivity> UserActivities { get; set; }
        public DbSet<UserPreference> UserPreferences { get; set; }
        public DbSet<SystemMetric> SystemMetrics { get; set; }
        public DbSet<PerformanceLog> PerformanceLogs { get; set; }
        public DbSet<ErrorLog> ErrorLogs { get; set; }
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
        public DbSet<ServicePayment> ServicePayments { get; set; }
        public DbSet<ServiceImage> ServiceImages { get; set; }
        public DbSet<ServiceAvailability> ServiceAvailabilities { get; set; }
        public DbSet<ServiceProviderSpecialty> ServiceProviderSpecialties { get; set; }
        public DbSet<BookingStatusHistory> BookingStatusHistories { get; set; }

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