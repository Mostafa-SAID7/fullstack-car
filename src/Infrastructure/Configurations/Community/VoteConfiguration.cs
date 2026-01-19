using Domain.Entities.Community;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations.Community
{
    public class VoteConfiguration : IEntityTypeConfiguration<Vote>
    {
        public void Configure(EntityTypeBuilder<Vote> builder)
        {
            builder.ToTable("Votes");

            builder.HasKey(v => v.Id);

            builder.Property(v => v.VoteType)
                .IsRequired()
                .HasConversion<int>();

            builder.Property(v => v.ContentType)
                .IsRequired()
                .HasMaxLength(20);

            builder.Property(v => v.ContentId)
                .IsRequired();

            // Foreign key relationships
            builder.HasOne(v => v.User)
                .WithMany()
                .HasForeignKey(v => v.UserId)
                .OnDelete(DeleteBehavior.NoAction);

            // Unique constraint - one vote per user per content
            builder.HasIndex(v => new { v.UserId, v.ContentId, v.ContentType })
                .IsUnique()
                .HasDatabaseName("IX_Votes_UserId_ContentId_Type");

            // Indexes
            builder.HasIndex(v => new { v.ContentId, v.ContentType })
                .HasDatabaseName("IX_Votes_ContentId_Type");

            builder.HasIndex(v => new { v.UserId, v.CreatedAt })
                .HasDatabaseName("IX_Votes_UserId_CreatedAt");
        }
    }
}
