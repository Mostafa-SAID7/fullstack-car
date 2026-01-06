using Domain.Entities.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Security.Claims;

namespace Infrastructure.Data.Seeds.Management.Users
{
    public class UserPermissionsSeeder
    {
        private readonly ILogger<UserPermissionsSeeder> _logger;
        private readonly ApplicationDbContext _context;
        private readonly RoleManager<ApplicationRole> _roleManager;

        public UserPermissionsSeeder(
            ILogger<UserPermissionsSeeder> logger,
            ApplicationDbContext context,
            RoleManager<ApplicationRole> roleManager)
        {
            _logger = logger;
            _context = context;
            _roleManager = roleManager;
        }

        public async Task SeedPermissionsAsync()
        {
            _logger.LogInformation("Seeding comprehensive permission system...");

            await SeedSystemPermissionsAsync();
            await SeedUserManagementPermissionsAsync();
            await SeedContentPermissionsAsync();
            await SeedCommunityPermissionsAsync();
            await SeedMarketplacePermissionsAsync();
            await SeedAnalyticsPermissionsAsync();

            _logger.LogInformation("Permissions seeding completed.");
        }

        private async Task SeedSystemPermissionsAsync()
        {
            var systemPermissions = new[]
            {
                "system.admin.full_access",
                "system.admin.read_only",
                "system.settings.manage",
                "system.settings.read",
                "system.backup.create",
                "system.backup.restore",
                "system.logs.view",
                "system.logs.export",
                "system.maintenance.perform",
                "system.security.manage"
            };

            await AssignPermissionsToRole("SuperAdmin", systemPermissions);
            await AssignPermissionsToRole("Admin", new[] { 
                "system.admin.read_only", "system.settings.read", "system.logs.view" 
            });
        }

        private async Task SeedUserManagementPermissionsAsync()
        {
            var userPermissions = new[]
            {
                "users.create",
                "users.read",
                "users.update",
                "users.delete",
                "users.suspend",
                "users.activate",
                "users.roles.assign",
                "users.roles.remove",
                "users.permissions.manage",
                "users.profile.edit_any",
                "users.activities.view",
                "users.statistics.view",
                "users.export.data"
            };

            await AssignPermissionsToRole("SuperAdmin", userPermissions);
            await AssignPermissionsToRole("Admin", userPermissions);
            await AssignPermissionsToRole("UserManager", new[] {
                "users.read", "users.update", "users.suspend", "users.activate",
                "users.roles.assign", "users.activities.view", "users.statistics.view"
            });
            await AssignPermissionsToRole("HR_Manager", new[] {
                "users.create", "users.read", "users.update", "users.roles.assign",
                "users.activities.view", "users.statistics.view", "users.export.data"
            });
        }

        private async Task SeedContentPermissionsAsync()
        {
            var contentPermissions = new[]
            {
                "content.posts.create",
                "content.posts.read",
                "content.posts.update",
                "content.posts.delete",
                "content.posts.moderate",
                "content.posts.feature",
                "content.comments.create",
                "content.comments.read",
                "content.comments.update",
                "content.comments.delete",
                "content.comments.moderate",
                "content.media.upload",
                "content.media.manage",
                "content.media.delete",
                "content.guides.create",
                "content.guides.edit",
                "content.guides.publish",
                "content.news.create",
                "content.news.edit",
                "content.news.publish"
            };

            await AssignPermissionsToRole("SuperAdmin", contentPermissions);
            await AssignPermissionsToRole("Admin", contentPermissions);
            await AssignPermissionsToRole("ContentManager", contentPermissions);
            await AssignPermissionsToRole("Content_Creator", new[] {
                "content.posts.create", "content.posts.read", "content.posts.update",
                "content.comments.create", "content.comments.read", "content.media.upload",
                "content.guides.create", "content.guides.edit", "content.news.create"
            });
            await AssignPermissionsToRole("Technical_Writer", new[] {
                "content.guides.create", "content.guides.edit", "content.guides.publish",
                "content.news.create", "content.news.edit", "content.media.upload"
            });
        }

        private async Task SeedCommunityPermissionsAsync()
        {
            var communityPermissions = new[]
            {
                "community.groups.create",
                "community.groups.manage",
                "community.groups.delete",
                "community.groups.moderate",
                "community.events.create",
                "community.events.manage",
                "community.events.delete",
                "community.messages.send",
                "community.messages.moderate",
                "community.reviews.create",
                "community.reviews.moderate",
                "community.reviews.delete",
                "community.reports.view",
                "community.reports.resolve",
                "community.moderation.perform",
                "community.announcements.send"
            };

            await AssignPermissionsToRole("SuperAdmin", communityPermissions);
            await AssignPermissionsToRole("Admin", communityPermissions);
            await AssignPermissionsToRole("ContentManager", new[] {
                "community.groups.moderate", "community.messages.moderate",
                "community.reviews.moderate", "community.reports.view",
                "community.reports.resolve", "community.moderation.perform"
            });
            await AssignPermissionsToRole("Community_Leader", new[] {
                "community.groups.create", "community.groups.manage",
                "community.events.create", "community.events.manage",
                "community.messages.send", "community.announcements.send"
            });
            await AssignPermissionsToRole("Event_Organizer", new[] {
                "community.events.create", "community.events.manage",
                "community.messages.send", "community.announcements.send"
            });
        }

        private async Task SeedMarketplacePermissionsAsync()
        {
            var marketplacePermissions = new[]
            {
                "marketplace.services.create",
                "marketplace.services.manage",
                "marketplace.services.delete",
                "marketplace.bookings.view",
                "marketplace.bookings.manage",
                "marketplace.payments.view",
                "marketplace.payments.process",
                "marketplace.providers.verify",
                "marketplace.providers.manage",
                "marketplace.reviews.moderate",
                "marketplace.analytics.view",
                "marketplace.reports.generate"
            };

            await AssignPermissionsToRole("SuperAdmin", marketplacePermissions);
            await AssignPermissionsToRole("Admin", marketplacePermissions);
            await AssignPermissionsToRole("Sales_Manager", new[] {
                "marketplace.services.manage", "marketplace.bookings.view",
                "marketplace.bookings.manage", "marketplace.providers.manage",
                "marketplace.analytics.view", "marketplace.reports.generate"
            });
            await AssignPermissionsToRole("Operations_Manager", new[] {
                "marketplace.services.manage", "marketplace.bookings.manage",
                "marketplace.providers.verify", "marketplace.providers.manage",
                "marketplace.reviews.moderate"
            });
        }

        private async Task SeedAnalyticsPermissionsAsync()
        {
            var analyticsPermissions = new[]
            {
                "analytics.dashboard.view",
                "analytics.dashboard.customize",
                "analytics.reports.view",
                "analytics.reports.create",
                "analytics.reports.export",
                "analytics.users.view",
                "analytics.content.view",
                "analytics.marketplace.view",
                "analytics.financial.view",
                "analytics.system.view",
                "analytics.advanced.access"
            };

            await AssignPermissionsToRole("SuperAdmin", analyticsPermissions);
            await AssignPermissionsToRole("Admin", analyticsPermissions);
            await AssignPermissionsToRole("Analyst", analyticsPermissions);
            await AssignPermissionsToRole("Finance_Manager", new[] {
                "analytics.dashboard.view", "analytics.reports.view",
                "analytics.reports.create", "analytics.reports.export",
                "analytics.financial.view", "analytics.marketplace.view"
            });
            await AssignPermissionsToRole("Marketing_Manager", new[] {
                "analytics.dashboard.view", "analytics.reports.view",
                "analytics.reports.create", "analytics.users.view",
                "analytics.content.view", "analytics.marketplace.view"
            });
        }

        private async Task AssignPermissionsToRole(string roleName, string[] permissions)
        {
            var role = await _roleManager.FindByNameAsync(roleName);
            if (role == null)
            {
                _logger.LogWarning("Role {RoleName} not found, skipping permission assignment", roleName);
                return;
            }

            var existingClaims = await _roleManager.GetClaimsAsync(role);
            var existingPermissions = existingClaims.Where(c => c.Type == "permission").Select(c => c.Value).ToHashSet();

            foreach (var permission in permissions)
            {
                if (!existingPermissions.Contains(permission))
                {
                    await _roleManager.AddClaimAsync(role, new Claim("permission", permission));
                    _logger.LogDebug("Added permission {Permission} to role {RoleName}", permission, roleName);
                }
            }

            _logger.LogInformation("Assigned {Count} permissions to role {RoleName}", permissions.Length, roleName);
        }
    }
}
