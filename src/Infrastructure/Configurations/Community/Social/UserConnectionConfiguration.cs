using Domain.Entities.Community.Social;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations.Community.Social
{
    public class UserConnectionConfiguration : IEntityTypeConfiguration<UserConnection>
    {
        public void Configure(EntityTypeBuilder<UserConnection> builder)
        {
            builder.HasKey(uc => uc.Id);

            builder.Property(uc => uc.RequesterId)
                .IsRequired();

            builder.Property(uc => uc.ReceiverId)
                .IsRequired();

            builder.Property(uc => uc.ConnectionType)
                .IsRequired()
                .HasConversion<string>()
                .HasMaxLength(20);

            builder.Property(uc => uc.Status)
                .IsRequired()
                .HasConversion<string>()
                .HasMaxLength(20);

            builder.Property(uc => uc.CreatedAt)
                .IsRequired()
                .HasDefaultValueSql("GETUTCDATE()");

            builder.Property(uc => uc.AcceptedAt)
                .IsRequired(false);

            // Configure the relationship from Requester to UserConnection
            builder.HasOne(uc => uc.Requester)
                .WithMany(u => u.SentConnections)
                .HasForeignKey(uc => uc.RequesterId)
                .OnDelete(DeleteBehavior.Restrict);

            // Configure the relationship from Receiver to UserConnection
            builder.HasOne(uc => uc.Receiver)
                .WithMany(u => u.ReceivedConnections)
                .HasForeignKey(uc => uc.ReceiverId)
                .OnDelete(DeleteBehavior.Restrict);

            // Ensure a user cannot connect to the same person twice with the same connection type
            builder.HasIndex(uc => new { uc.RequesterId, uc.ReceiverId, uc.ConnectionType })
                .IsUnique()
                .HasDatabaseName("IX_UserConnections_RequesterId_ReceiverId_ConnectionType");

            // Performance indexes
            builder.HasIndex(uc => new { uc.ReceiverId, uc.Status })
                .HasDatabaseName("IX_UserConnections_ReceiverId_Status");

            builder.HasIndex(uc => new { uc.RequesterId, uc.Status })
                .HasDatabaseName("IX_UserConnections_RequesterId_Status");

            builder.HasIndex(uc => new { uc.ConnectionType, uc.Status })
                .HasDatabaseName("IX_UserConnections_ConnectionType_Status");

            builder.HasIndex(uc => uc.CreatedAt)
                .HasDatabaseName("IX_UserConnections_CreatedAt");

            // Add a check constraint to prevent self-connection
            builder.ToTable(t => t.HasCheckConstraint("CK_UserConnection_NoSelfConnection", "[RequesterId] != [ReceiverId]"));

            // Table name
            builder.ToTable("UserConnections");
        }
    }
}