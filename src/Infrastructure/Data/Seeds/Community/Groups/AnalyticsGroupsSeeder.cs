using Domain.Entities.Community.Groups;

namespace Infrastructure.Data.Seeds.Community.Groups
{
    public class AnalyticsGroupsSeeder
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger<AnalyticsGroupsSeeder> _logger;
        private readonly Random _random = new();

        public AnalyticsGroupsSeeder(
            ApplicationDbContext context,
            UserManager<ApplicationUser> userManager,
            ILogger<AnalyticsGroupsSeeder> logger)
        {
            _context = context;
            _userManager = userManager;
            _logger = logger;
        }

        public async Task SeedAsync()
        {
            try
            {
                var users = await _context.Users.Take(10).ToListAsync();
                if (!users.Any())
                {
                    _logger.LogWarning("No users found for analytics groups seeding");
                    return;
                }

                await SeedAnalyticsGroupsAsync(users);
                await SeedGroupMembersAsync(users);
                
                await _context.SaveChangesAsync();
                _logger.LogInformation("Analytics groups seed data created successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error seeding analytics groups data");
                throw;
            }
        }

        private async Task SeedAnalyticsGroupsAsync(List<ApplicationUser> users)
        {
            var groups = new List<Group>
            {
                new()
                {
                    Name = "Car Enthusiasts Analytics",
                    Description = "A community for car lovers and automotive discussions",
                    CreatedBy = users[0].Id,
                    CreatedAt = DateTime.UtcNow.AddMonths(-6),
                    IsPublic = true,
                    IsActive = true
                },
                new()
                {
                    Name = "Electric Vehicles Analytics",
                    Description = "Discussion about electric cars and sustainable transportation",
                    CreatedBy = users[1].Id,
                    CreatedAt = DateTime.UtcNow.AddMonths(-4),
                    IsPublic = true,
                    IsActive = true
                },
                new()
                {
                    Name = "Classic Cars Analytics",
                    Description = "Vintage and classic automobile appreciation",
                    CreatedBy = users[2].Id,
                    CreatedAt = DateTime.UtcNow.AddMonths(-3),
                    IsPublic = true,
                    IsActive = true
                },
                new()
                {
                    Name = "Racing & Performance Analytics",
                    Description = "High-performance vehicles and racing discussions",
                    CreatedBy = users[3].Id,
                    CreatedAt = DateTime.UtcNow.AddMonths(-2),
                    IsPublic = true,
                    IsActive = true
                },
                new()
                {
                    Name = "Car Maintenance Analytics",
                    Description = "Tips and tricks for car maintenance and repairs",
                    CreatedBy = users[4].Id,
                    CreatedAt = DateTime.UtcNow.AddMonths(-1),
                    IsPublic = true,
                    IsActive = true
                },
                new()
                {
                    Name = "Luxury Cars Analytics",
                    Description = "Discussion about luxury and premium vehicles",
                    CreatedBy = users[5 % users.Count].Id,
                    CreatedAt = DateTime.UtcNow.AddMonths(-5),
                    IsPublic = true,
                    IsActive = true
                },
                new()
                {
                    Name = "Off-Road Adventures Analytics",
                    Description = "Off-road vehicles and adventure driving",
                    CreatedBy = users[6 % users.Count].Id,
                    CreatedAt = DateTime.UtcNow.AddMonths(-4),
                    IsPublic = true,
                    IsActive = true
                },
                new()
                {
                    Name = "Car Photography Analytics",
                    Description = "Automotive photography and visual content",
                    CreatedBy = users[7 % users.Count].Id,
                    CreatedAt = DateTime.UtcNow.AddMonths(-2),
                    IsPublic = true,
                    IsActive = true
                }
            };

            await _context.Groups.AddRangeAsync(groups);
        }

        private async Task SeedGroupMembersAsync(List<ApplicationUser> users)
        {
            var groups = await _context.Groups.Where(g => g.Name.Contains("Analytics")).ToListAsync();
            
            foreach (var group in groups)
            {
                var memberCount = _random.Next(8, 20);
                var selectedUsers = users.OrderBy(x => _random.Next()).Take(memberCount);
                
                foreach (var user in selectedUsers)
                {
                    var groupMember = new GroupMember
                    {
                        GroupId = group.Id,
                        UserId = user.Id,
                        JoinedAt = GetRandomDateInRange(group.CreatedAt, DateTime.UtcNow),
                        IsActive = true
                    };
                    await _context.GroupMembers.AddAsync(groupMember);
                }
            }
        }

        private DateTime GetRandomDateInRange(DateTime startDate, DateTime endDate)
        {
            var range = endDate - startDate;
            var randomDays = _random.Next(0, (int)range.TotalDays);
            return startDate.AddDays(randomDays);
        }
    }
}