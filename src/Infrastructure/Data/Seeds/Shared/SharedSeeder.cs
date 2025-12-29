using Domain.Entities.Shared.Chat;
using Domain.Enums.Shared.Chat;
using Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Data.Seeds.Shared
{
    public class SharedSeeder
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger<SharedSeeder> _logger;

        public SharedSeeder(
            ApplicationDbContext context,
            UserManager<ApplicationUser> userManager,
            ILogger<SharedSeeder> logger)
        {
            _context = context;
            _userManager = userManager;
            _logger = logger;
        }

        public async Task SeedAsync()
        {
            try
            {
                await SeedChatAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error seeding shared data");
                throw;
            }
        }

        private async Task SeedChatAsync()
        {
            if (await _context.Conversations.AnyAsync()) return;

            var admin = await _userManager.FindByEmailAsync("admin@localhost");
            var user = await _userManager.FindByEmailAsync("user@localhost");

            if (admin == null || user == null) return;

            var conversation = new Conversation
            {
                Title = null, // Direct chat typically has no title or auto-generated
                IsGroup = false,
                CreatedBy = admin.Id.ToString(),
                CreatedAt = DateTime.UtcNow
            };

            _context.Conversations.Add(conversation);
            await _context.SaveChangesAsync();

            var members = new List<ConversationMember>
            {
                new ConversationMember
                {
                    ConversationId = conversation.Id,
                    UserId = admin.Id,
                    JoinedAt = DateTime.UtcNow
                },
                new ConversationMember
                {
                    ConversationId = conversation.Id,
                    UserId = user.Id,
                    JoinedAt = DateTime.UtcNow
                }
            };

            _context.ConversationMembers.AddRange(members);
            await _context.SaveChangesAsync();

            var messages = new List<ChatMessage>
            {
                new ChatMessage
                {
                    ConversationId = conversation.Id,
                    SenderId = admin.Id,
                    Content = "Hello! Welcome to the Direct Messaging feature.",
                    Type = MessageType.Text,
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = admin.Id.ToString()
                },
                new ChatMessage
                {
                    ConversationId = conversation.Id,
                    SenderId = user.Id,
                    Content = "Hi Admin! Thank you, this looks great.",
                    Type = MessageType.Text,
                    CreatedAt = DateTime.UtcNow.AddSeconds(5),
                    CreatedBy = user.Id.ToString()
                }
            };

            _context.ChatMessages.AddRange(messages);
            await _context.SaveChangesAsync();

            // Update conversation last message details
            var lastMsg = messages.Last();
            conversation.LastMessageId = lastMsg.Id;
            conversation.LastMessageAt = lastMsg.CreatedAt;

            _context.Conversations.Update(conversation);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Seeded chat conversation");
        }
    }
}
