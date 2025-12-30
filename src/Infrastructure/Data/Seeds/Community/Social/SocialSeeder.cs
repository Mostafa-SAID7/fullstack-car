using Domain.Entities.Community.Social;
using Domain.Enums.Community.Social;
using Domain.Entities.Identity;
using Infrastructure.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Data.Seeds.Community.Social
{
    public class SocialSeeder
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger<SocialSeeder> _logger;

        public SocialSeeder(
            ApplicationDbContext context,
            UserManager<ApplicationUser> userManager,
            ILogger<SocialSeeder> logger)
        {
            _context = context;
            _userManager = userManager;
            _logger = logger;
        }

        public async Task SeedAsync()
        {
            if (await _context.UserFriends.AnyAsync()) return;

            var admin = await _userManager.FindByEmailAsync("admin@localhost");
            var user = await _userManager.FindByEmailAsync("user@localhost");
            var sarah = await _userManager.FindByEmailAsync("sarah@fully2car.com");
            var mike = await _userManager.FindByEmailAsync("mike@fully2car.com");
            var elias = await _userManager.FindByEmailAsync("elias@fully2car.com");

            if (admin == null || user == null) return;

            // Establishing Friendships (Bidirectional)
            var friendships = new List<UserFriend>();

            void AddFriendship(ApplicationUser u1, ApplicationUser u2)
            {
                friendships.Add(new UserFriend { UserId = u1.Id, FriendId = u2.Id, Status = FriendshipStatus.Accepted, AcceptedAt = DateTime.UtcNow.AddDays(-30) });
                friendships.Add(new UserFriend { UserId = u2.Id, FriendId = u1.Id, Status = FriendshipStatus.Accepted, AcceptedAt = DateTime.UtcNow.AddDays(-30) });
            }

            AddFriendship(admin, user);
            if (sarah != null) AddFriendship(admin, sarah);
            if (mike != null) AddFriendship(user, mike);
            if (elias != null) AddFriendship(sarah, elias);

            await _context.UserFriends.AddRangeAsync(friendships);
            await _context.SaveChangesAsync();

            // Seed Friend Requests (Unidirectional Pending)
            var yasmine = await _userManager.FindByEmailAsync("yasmine@fully2car.com");
            var khalid = await _userManager.FindByEmailAsync("khalid@fully2car.com");

            if (yasmine != null)
            {
                _context.UserFriends.Add(new UserFriend
                {
                    UserId = yasmine.Id,
                    FriendId = admin.Id,
                    Status = FriendshipStatus.Pending
                });
            }

            if (khalid != null)
            {
                _context.UserFriends.Add(new UserFriend
                {
                    UserId = khalid.Id,
                    FriendId = user.Id,
                    Status = FriendshipStatus.Pending
                });
            }

            await _context.SaveChangesAsync();
            _logger.LogInformation("Seeded social connections and requests");
        }
    }
}
