using Domain.Entities.Community.Groups;
using Domain.Entities.Community.Social;
using Domain.Entities.Shared.Chat;
using Domain.Entities.Identity;
using Domain.Enums.Community.Groups;
using Domain.Enums.Community.Social;
using Domain.Enums.Shared.Chat;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Data.Seeds
{
    public class CommunitySocialSeeder
    {
        private readonly ILogger<CommunitySocialSeeder> _logger;
        private readonly ApplicationDbContext _context;

        public CommunitySocialSeeder(ILogger<CommunitySocialSeeder> logger, ApplicationDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        public async Task SeedGroupsAsync()
        {
            _logger.LogInformation("Seeding groups...");

            var users = await _context.Users.ToListAsync();
            if (!users.Any()) return;

            var groups = new[]
            {
                new { Name = "BMW Enthusiasts UAE", Description = "For BMW owners and enthusiasts in the UAE", Type = GroupType.CarBrand },
                new { Name = "Mercedes-Benz Club Dubai", Description = "Mercedes-Benz owners and fans in Dubai", Type = GroupType.CarBrand },
                new { Name = "Toyota Reliability Group", Description = "Discussing Toyota's legendary reliability and maintenance", Type = GroupType.CarBrand },
                new { Name = "Supercar Spotting Dubai", Description = "Share your supercar sightings around Dubai", Type = GroupType.General },
                new { Name = "Track Day Warriors", Description = "For serious track day enthusiasts and racers", Type = GroupType.Racing },
                new { Name = "Classic Car Restoration", Description = "Vintage and classic car restoration projects", Type = GroupType.Modification },
                new { Name = "Electric Vehicle Future", Description = "Discussion about EVs and sustainable transportation", Type = GroupType.General },
                new { Name = "DIY Car Maintenance", Description = "Do-it-yourself car maintenance and repairs", Type = GroupType.Maintenance },
                new { Name = "Abu Dhabi Car Community", Description = "Local car community in Abu Dhabi", Type = GroupType.LocalCommunity },
                new { Name = "Luxury Car Owners", Description = "For owners of luxury and premium vehicles", Type = GroupType.General },
                new { Name = "Car Photography Club", Description = "Share your best automotive photography", Type = GroupType.General },
                new { Name = "JDM Legends", Description = "Japanese Domestic Market car enthusiasts", Type = GroupType.Modification }
            };

            foreach (var groupData in groups)
            {
                var owner = users[Random.Shared.Next(users.Count)];
                var group = new Group
                {
                    Name = groupData.Name,
                    Description = groupData.Description,
                    Type = groupData.Type,
                    Privacy = GroupPrivacy.Public,
                    OwnerId = owner.Id,
                    MembersCount = Random.Shared.Next(15, 250),
                    PostsCount = 0,
                    CreatedAt = DateTime.UtcNow.AddDays(-Random.Shared.Next(1, 120)),
                    CreatedBy = owner.Id.ToString()
                };

                _context.Groups.Add(group);
                await _context.SaveChangesAsync(); // Ensure Group.Id is generated before adding members
                _logger.LogInformation("Created group: {GroupName}", group.Name);

                // Add some members to each group
                var memberCount = Random.Shared.Next(5, Math.Min(15, users.Count));
                var selectedMembers = users.OrderBy(x => Random.Shared.Next()).Take(memberCount);

                foreach (var member in selectedMembers)
                {
                    var groupMember = new GroupMember
                    {
                        UserId = member.Id,
                        GroupId = group.Id,
                        Role = member.Id == owner.Id ? GroupMemberRole.Owner : GroupMemberRole.Member,
                        JoinedAt = group.CreatedAt.AddDays(Random.Shared.Next(0, 30)),
                        CreatedAt = DateTime.UtcNow,
                        CreatedBy = "System"
                    };

                    _context.GroupMembers.Add(groupMember);
                }

                await _context.SaveChangesAsync(); // Persist members
            }
        }

        public async Task SeedFriendsAsync()
        {
            _logger.LogInformation("Seeding friends...");

            var users = await _context.Users.ToListAsync();
            if (users.Count < 2) return;

            foreach (var user in users.Take(10))
            {
                var friendCount = Random.Shared.Next(1, 5);
                var potentialFriends = users.Where(u => u.Id != user.Id).OrderBy(x => Random.Shared.Next()).Take(friendCount);

                foreach (var friend in potentialFriends)
                {
                    // Check if already friends
                    var exists = await _context.UserFriends.AnyAsync(f => 
                        (f.UserId == user.Id && f.FriendId == friend.Id) || 
                        (f.UserId == friend.Id && f.FriendId == user.Id));

                    if (!exists)
                    {
                        var friendship = new UserFriend
                        {
                            UserId = user.Id,
                            FriendId = friend.Id,
                            Status = FriendshipStatus.Accepted,
                            AcceptedAt = DateTime.UtcNow.AddDays(-Random.Shared.Next(1, 30)),
                            CreatedAt = DateTime.UtcNow.AddDays(-Random.Shared.Next(31, 60)),
                            CreatedBy = "System"
                        };
                        _context.UserFriends.Add(friendship);
                    }
                }
            }
            await _context.SaveChangesAsync();
        }

        public async Task SeedChatAsync()
        {
            _logger.LogInformation("Seeding Chat...");

            var users = await _context.Users.ToListAsync();
            if (users.Count < 2) return;

            var conv = new Conversation
            {
                Title = "General Chat",
                IsGroup = true,
                CreatedAt = DateTime.UtcNow.AddDays(-10),
                CreatedBy = "System"
            };
            _context.Conversations.Add(conv);
            await _context.SaveChangesAsync();

            foreach (var user in users.Take(5))
            {
                _context.ConversationMembers.Add(new ConversationMember
                {
                    ConversationId = conv.Id,
                    UserId = user.Id,
                    JoinedAt = conv.CreatedAt,
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = "System"
                });

                _context.ChatMessages.Add(new ChatMessage
                {
                    ConversationId = conv.Id,
                    SenderId = user.Id,
                    Content = $"Hello everyone! I'm user {user.UserName}",
                    CreatedAt = conv.CreatedAt.AddMinutes(Random.Shared.Next(1, 60)),
                    CreatedBy = user.Id.ToString()
                });
            }
            await _context.SaveChangesAsync();
        }
    }
}
