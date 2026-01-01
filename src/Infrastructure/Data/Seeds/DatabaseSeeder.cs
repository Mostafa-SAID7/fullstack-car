using Domain.Entities.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Data.Seeds
{
    public class DatabaseSeeder
    {
        private readonly ILogger<DatabaseSeeder> _logger;
        private readonly ApplicationDbContext _context;
        private readonly IdentitySeeder _identitySeeder;
        private readonly CommunitySocialSeeder _socialSeeder;
        private readonly CommunityContentSeeder _contentSeeder;
        private readonly CommunityKnowledgeSeeder _knowledgeSeeder;
        private readonly CommunityMapsSeeder _mapsSeeder;
        private readonly MarketplaceSeeder _marketplaceSeeder;
        private readonly AdminSeeder _adminSeeder;
        private readonly NotificationSeeder _notificationSeeder;

        public DatabaseSeeder(
            ILogger<DatabaseSeeder> logger,
            ApplicationDbContext context,
            IdentitySeeder identitySeeder,
            CommunitySocialSeeder socialSeeder,
            CommunityContentSeeder contentSeeder,
            CommunityKnowledgeSeeder knowledgeSeeder,
            CommunityMapsSeeder mapsSeeder,
            MarketplaceSeeder marketplaceSeeder,
            AdminSeeder adminSeeder,
            NotificationSeeder notificationSeeder)
        {
            _logger = logger;
            _context = context;
            _identitySeeder = identitySeeder;
            _socialSeeder = socialSeeder;
            _contentSeeder = contentSeeder;
            _knowledgeSeeder = knowledgeSeeder;
            _mapsSeeder = mapsSeeder;
            _marketplaceSeeder = marketplaceSeeder;
            _adminSeeder = adminSeeder;
            _notificationSeeder = notificationSeeder;
        }

        public async Task InitializeAsync()
        {
            try
            {
                _logger.LogInformation("Starting database initialization...");

                if (_context.Database.IsSqlServer())
                {
                    var canConnect = await _context.Database.CanConnectAsync();
                    if (!canConnect)
                    {
                        _logger.LogInformation("Database does not exist. Creating database...");
                        await _context.Database.EnsureCreatedAsync();
                        _logger.LogInformation("Database created successfully.");
                    }
                    else
                    {
                        var pendingMigrations = await _context.Database.GetPendingMigrationsAsync();
                        if (pendingMigrations.Any())
                        {
                            _logger.LogInformation("Applying {Count} pending migrations...", pendingMigrations.Count());
                            await _context.Database.MigrateAsync();
                            _logger.LogInformation("Database migrations applied successfully.");
                        }
                        else
                        {
                            _logger.LogInformation("Database is up to date. No migrations needed.");
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while initializing the database: {Message}", ex.Message);
                _logger.LogWarning("Continuing with database seeding despite initialization error...");
            }
        }

        public async Task SeedAsync()
        {
            try
            {
                _logger.LogInformation("Starting database seeding...");

                await ClearExistingDataAsync();

                // Seed in dependency order
                await _identitySeeder.SeedRolesAsync();
                await _identitySeeder.SeedUsersAsync();
                
                await _socialSeeder.SeedGroupsAsync();
                await _contentSeeder.SeedPostsAsync();
                await _contentSeeder.SeedCommentsAsync();
                await _contentSeeder.SeedLikesAsync();
                await _socialSeeder.SeedFriendsAsync();
                await _contentSeeder.SeedReviewsAsync();
                await _knowledgeSeeder.SeedQAAsync();
                await _mapsSeeder.SeedMapsAsync();
                await _knowledgeSeeder.SeedNewsAsync();
                await _knowledgeSeeder.SeedGuidesAsync();
                await _socialSeeder.SeedChatAsync();
                await _knowledgeSeeder.SeedPagesAsync();
                
                await _marketplaceSeeder.SeedAllAsync();
                
                await _adminSeeder.SeedAdminDashboardAsync();
                
                await _notificationSeeder.SeedNotificationsAsync();

                await _context.SaveChangesAsync();
                _logger.LogInformation("Database seeding completed successfully.");

                await LogStatisticsAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while seeding the database: {Message}", ex.Message);
                throw;
            }
        }

        private async Task ClearExistingDataAsync()
        {
            _logger.LogInformation("Clearing existing seed data...");

            // Clear in reverse dependency order
            _context.DashboardWidgets.RemoveRange(_context.DashboardWidgets);
            _context.DashboardPermissions.RemoveRange(_context.DashboardPermissions);
            _context.DashboardLayouts.RemoveRange(_context.DashboardLayouts);

            _context.ServiceReviews.RemoveRange(_context.ServiceReviews);
            _context.ServiceBookings.RemoveRange(_context.ServiceBookings);
            _context.Services.RemoveRange(_context.Services);
            _context.ServiceProviders.RemoveRange(_context.ServiceProviders);

            _context.PageCommentLikes.RemoveRange(_context.PageCommentLikes);
            _context.PageComments.RemoveRange(_context.PageComments);
            _context.PageViews.RemoveRange(_context.PageViews);
            _context.PageRevisions.RemoveRange(_context.PageRevisions);
            _context.PageContents.RemoveRange(_context.PageContents);
            _context.Pages.RemoveRange(_context.Pages);

            _context.ChatMessages.RemoveRange(_context.ChatMessages);
            _context.ConversationMembers.RemoveRange(_context.ConversationMembers);
            _context.Conversations.RemoveRange(_context.Conversations);
            
            _context.GuideSteps.RemoveRange(_context.GuideSteps);
            _context.Guides.RemoveRange(_context.Guides);
            
            _context.ArticleLikes.RemoveRange(_context.ArticleLikes);
            _context.NewsComments.RemoveRange(_context.NewsComments);
            _context.Articles.RemoveRange(_context.Articles);
            _context.NewsCategories.RemoveRange(_context.NewsCategories);
            
            _context.CheckIns.RemoveRange(_context.CheckIns);
            _context.PlaceReviews.RemoveRange(_context.PlaceReviews);
            _context.LocationHours.RemoveRange(_context.LocationHours);
            _context.Locations.RemoveRange(_context.Locations);
            _context.LocationCategories.RemoveRange(_context.LocationCategories);
            
            _context.AnswerComments.RemoveRange(_context.AnswerComments);
            _context.Answers.RemoveRange(_context.Answers);
            _context.QuestionVotes.RemoveRange(_context.QuestionVotes);
            _context.Questions.RemoveRange(_context.Questions);
            _context.QuestionCategories.RemoveRange(_context.QuestionCategories);

            _context.Notifications.RemoveRange(_context.Notifications);
            _context.CommentLikes.RemoveRange(_context.CommentLikes);
            _context.PostLikes.RemoveRange(_context.PostLikes);
            _context.Comments.RemoveRange(_context.Comments);
            _context.Posts.RemoveRange(_context.Posts);
            _context.GroupMembers.RemoveRange(_context.GroupMembers);
            _context.Groups.RemoveRange(_context.Groups);
            _context.UserFriends.RemoveRange(_context.UserFriends);
            _context.CommunityReviews.RemoveRange(_context.CommunityReviews);
            _context.ReviewCategories.RemoveRange(_context.ReviewCategories);

            await _context.SaveChangesAsync();

            var seededUsers = await _context.Users
                .Where(u => u.Email.Contains("@fully2car.com") || u.Email.Contains("@communitycar.com"))
                .ToListAsync();

            if (seededUsers.Any())
            {
                var seededUserIds = seededUsers.Select(u => u.Id).ToList();
                
                var userRoles = await _context.UserRoles.Where(ur => seededUserIds.Contains(ur.UserId)).ToListAsync();
                _context.UserRoles.RemoveRange(userRoles);

                var userClaims = await _context.UserClaims.Where(uc => seededUserIds.Contains(uc.UserId)).ToListAsync();
                _context.UserClaims.RemoveRange(userClaims);

                var userLogins = await _context.UserLogins.Where(ul => seededUserIds.Contains(ul.UserId)).ToListAsync();
                _context.UserLogins.RemoveRange(userLogins);

                var userTokens = await _context.UserTokens.Where(ut => seededUserIds.Contains(ut.UserId)).ToListAsync();
                _context.UserTokens.RemoveRange(userTokens);

                await _context.SaveChangesAsync();
                _context.Users.RemoveRange(seededUsers);
                await _context.SaveChangesAsync();
            }

            _logger.LogInformation("Existing seed data cleared successfully.");
        }

        private async Task LogStatisticsAsync()
        {
            var userCount = await _context.Users.CountAsync();
            var groupCount = await _context.Groups.CountAsync();
            var postCount = await _context.Posts.CountAsync();
            var commentCount = await _context.Comments.CountAsync();
            var notificationCount = await _context.Notifications.CountAsync();
            var friendCount = await _context.UserFriends.CountAsync();
            var reviewCount = await _context.CommunityReviews.CountAsync();
            var questionCount = await _context.Questions.CountAsync();
            var answerCount = await _context.Answers.CountAsync();
            var locationCount = await _context.Locations.CountAsync();
            var articleCount = await _context.Articles.CountAsync();
            var guideCount = await _context.Guides.CountAsync();
            var chatMessageCount = await _context.ChatMessages.CountAsync();
            var pageCount = await _context.Pages.CountAsync();
            
            var providerCount = await _context.ServiceProviders.CountAsync();
            var serviceCount = await _context.Services.CountAsync();
            var bookingCount = await _context.ServiceBookings.CountAsync();
            var serviceReviewCount = await _context.ServiceReviews.CountAsync();
            var widgetCount = await _context.DashboardWidgets.CountAsync();
            var layoutCount = await _context.DashboardLayouts.CountAsync();

            _logger.LogInformation("📊 Database Seeding Statistics:");
            _logger.LogInformation("================================");
            _logger.LogInformation("  Users: {UserCount:N0}", userCount);
            _logger.LogInformation("  Groups: {GroupCount:N0}", groupCount);
            _logger.LogInformation("  Posts: {PostCount:N0}", postCount);
            _logger.LogInformation("  Comments: {CommentCount:N0}", commentCount);
            _logger.LogInformation("  Notifications: {NotificationCount:N0}", notificationCount);
            _logger.LogInformation("  Friends: {FriendCount:N0}", friendCount);
            _logger.LogInformation("  Reviews: {ReviewCount:N0}", reviewCount);
            _logger.LogInformation("  Questions: {QuestionCount:N0}", questionCount);
            _logger.LogInformation("  Answers: {AnswerCount:N0}", answerCount);
            _logger.LogInformation("  Locations: {LocationCount:N0}", locationCount);
            _logger.LogInformation("  News Articles: {ArticleCount:N0}", articleCount);
            _logger.LogInformation("  Guides: {GuideCount:N0}", guideCount);
            _logger.LogInformation("  Chat Messages: {ChatMessageCount:N0}", chatMessageCount);
            _logger.LogInformation("  Community Pages: {PageCount:N0}", pageCount);
            _logger.LogInformation("  Service Providers: {ProviderCount:N0}", providerCount);
            _logger.LogInformation("  Services: {ServiceCount:N0}", serviceCount);
            _logger.LogInformation("  Bookings: {BookingCount:N0}", bookingCount);
            _logger.LogInformation("  Service Reviews: {ServiceReviewCount:N0}", serviceReviewCount);
            _logger.LogInformation("  Dashboard Widgets: {WidgetCount:N0}", widgetCount);
            _logger.LogInformation("  Dashboard Layouts: {LayoutCount:N0}", layoutCount);
            _logger.LogInformation("================================");
        }
    }
}
