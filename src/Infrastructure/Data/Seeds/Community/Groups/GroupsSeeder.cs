using Domain.Entities.Community.Groups;
using Domain.Enums.Community.Groups;
using Domain.Entities.Identity;
using Domain.Entities.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Data.Seeds.Community.Groups
{
    public class GroupsSeeder
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger<GroupsSeeder> _logger;

        public GroupsSeeder(
            ApplicationDbContext context,
            UserManager<ApplicationUser> userManager,
            ILogger<GroupsSeeder> logger)
        {
            _context = context;
            _userManager = userManager;
            _logger = logger;
        }

        public async Task SeedAsync()
        {
            if (await _context.Groups.AnyAsync()) return;

            var admin = await _userManager.FindByEmailAsync("admin@localhost");
            if (admin == null) return;

            var groups = new List<Group>
            {
                new Group
                {
                    Name = "Car Enthusiasts",
                    Description = "Global community for all car lovers. Join us to discuss anything automotive!",
                    OwnerId = admin.Id,
                    CreatedBy = admin.Id.ToString(),
                    CreatedAt = DateTime.UtcNow,
                    Privacy = GroupPrivacy.Public
                },
                new Group
                {
                    Name = "JDM Legends",
                    Description = "Dedicated to Japanese Domestic Market cars. Supra, Skyline, RX-7, NSX and more.",
                    OwnerId = admin.Id,
                    CreatedBy = admin.Id.ToString(),
                    CreatedAt = DateTime.UtcNow,
                    Privacy = GroupPrivacy.Public
                },
                new Group
                {
                    Name = "European Luxury",
                    Description = "BMW, Mercedes, Audi, Porsche. The finest engineering from Europe.",
                    OwnerId = admin.Id,
                    CreatedBy = admin.Id.ToString(),
                    CreatedAt = DateTime.UtcNow,
                    Privacy = GroupPrivacy.Public
                },
                new Group
                {
                    Name = "Off-Road Warriors",
                    Description = "4x4, Overlanding, and trail riding discussions.",
                    OwnerId = admin.Id,
                    CreatedBy = admin.Id.ToString(),
                    CreatedAt = DateTime.UtcNow,
                    Privacy = GroupPrivacy.Public
                }
            };

            await _context.Groups.AddRangeAsync(groups);
            await _context.SaveChangesAsync();

            // Add admin as member
            foreach (var group in groups)
            {
                _context.GroupMembers.Add(new GroupMember
                {
                    GroupId = group.Id,
                    UserId = admin.Id,
                    Role = GroupMemberRole.Admin,
                    JoinedAt = DateTime.UtcNow
                });
            }
            await _context.SaveChangesAsync();

            _logger.LogInformation("Seeded groups");
        }
    }
}
