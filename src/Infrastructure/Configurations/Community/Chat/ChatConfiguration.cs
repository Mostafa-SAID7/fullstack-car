using Domain.Entities.Community.Chat;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations.Community.Chat
{
    public class ConversationConfiguration : IEntityTypeConfiguration<Conversation>
    {
        public void Configure(EntityTypeBuilder<Conversation> builder)
        {
            builder.HasKey(c => c.Id);
            builder.Property(c => c.Title).HasMaxLength(200);
        }
    }

    public class ConversationMemberConfiguration : IEntityTypeConfiguration<ConversationMember>
    {
        public void Configure(EntityTypeBuilder<ConversationMember> builder)
        {
            builder.HasKey(cm => new { cm.ConversationId, cm.UserId });

            builder.HasOne(cm => cm.Conversation)
                .WithMany(c => c.Members)
                .HasForeignKey(cm => cm.ConversationId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(cm => cm.User)
                .WithMany()
                .HasForeignKey(cm => cm.UserId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }

    public class ChatMessageConfiguration : IEntityTypeConfiguration<ChatMessage>
    {
        public void Configure(EntityTypeBuilder<ChatMessage> builder)
        {
            builder.HasKey(m => m.Id);
            builder.Property(m => m.Content).IsRequired().HasMaxLength(4000);

            builder.HasOne(m => m.Conversation)
                .WithMany(c => c.Messages)
                .HasForeignKey(m => m.ConversationId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(m => m.Sender)
                .WithMany()
                .HasForeignKey(m => m.SenderId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
