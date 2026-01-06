using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Features.Admin.Management.Users.Statistics.Models;
using Application.Features.Admin.Management.Users.Statistics.Queries;
using Domain.Entities.Identity;
using Domain.Enums.Identity;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Admin.Management.Users.Statistics.Handlers
{
    public class GetUserStatisticsHandler : IRequestHandler<GetUserStatisticsQuery, Result<UserStatistics>>
    {
        private readonly IApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public GetUserStatisticsHandler(
            IApplicationDbContext context,
            UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        public async Task<Result<UserStatistics>> Handle(GetUserStatisticsQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var fromDate = request.FromDate ?? DateTime.UtcNow.AddMonths(-1);
                var toDate = request.ToDate ?? DateTime.UtcNow;
                var currentMonth = DateTime.UtcNow.AddDays(-30);

                // Get all users with their roles
                var users = await _context.Users
                    .Include(u => u.UserRoles)
                    .ThenInclude(ur => ur.Role)
                    .ToListAsync(cancellationToken);

                var totalUsers = users.Count;
                var activeUsers = users.Count(u => u.IsActive && u.LastLoginAt.HasValue && u.LastLoginAt > DateTime.UtcNow.AddDays(-30));
                var inactiveUsers = users.Count(u => !u.IsActive || !u.LastLoginAt.HasValue || u.LastLoginAt <= DateTime.UtcNow.AddDays(-30));
                var suspendedUsers = users.Count(u => u.Status == UserStatus.Suspended);
                var bannedUsers = users.Count(u => u.Status == UserStatus.Banned);
                var newUsersThisMonth = users.Count(u => u.CreatedAt >= currentMonth);
                var verifiedUsers = users.Count(u => u.EmailConfirmed);
                var unverifiedUsers = users.Count(u => !u.EmailConfirmed);

                // Calculate growth rate
                var previousMonthUsers = users.Count(u => u.CreatedAt < currentMonth);
                var userGrowthRate = previousMonthUsers > 0 ? ((double)newUsersThisMonth / previousMonthUsers) * 100 : 0;

                // Users by role
                var usersByRole = new Dictionary<string, int>();
                var allRoles = new[] { "Admin", "Moderator", "User", "Premium", "ServiceProvider" };
                
                foreach (var roleName in allRoles)
                {
                    var usersInRole = users.Count(u => u.UserRoles.Any(ur => ur.Role.Name == roleName));
                    usersByRole[roleName] = usersInRole;
                }

                // Users by status
                var usersByStatus = new Dictionary<string, int>
                {
                    { "Active", activeUsers },
                    { "Inactive", inactiveUsers },
                    { "Suspended", suspendedUsers },
                    { "Banned", bannedUsers }
                };

                var statistics = new UserStatistics
                {
                    TotalUsers = totalUsers,
                    ActiveUsers = activeUsers,
                    SuspendedUsers = suspendedUsers,
                    BannedUsers = bannedUsers,
                    NewUsersThisMonth = newUsersThisMonth,
                    UserGrowthRate = Math.Round(userGrowthRate, 2),
                    VerifiedUsers = verifiedUsers,
                    UnverifiedUsers = unverifiedUsers,
                    UsersByRole = usersByRole,
                    UsersByStatus = usersByStatus
                };

                return Result<UserStatistics>.Success(statistics);
            }
            catch (Exception ex)
            {
                return Result<UserStatistics>.Failure($"Error retrieving user statistics: {ex.Message}");
            }
        }
    }
}
