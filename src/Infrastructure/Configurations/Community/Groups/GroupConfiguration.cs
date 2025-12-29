using Domain.Entities.Community.Groups;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations.Community.Groups
{
    public class GroupConfiguration : IEntityTypeConfiguration<Group>
    {
        public void Configure(EntityTypeBuilder<Group> builder)
        {
            builder.HasKey(g => g.Id);

            builder.Property(g => g.Name)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(g => g.Description)
                .IsRequired()
                .HasMaxLength(1000);

            builder.Property(g => g.ImageUrl)
                .HasMaxLength(500);

            builder.Property(g => g.Type)
                .IsRequired()
                .HasConversion<string>();

            builder.Property(g => g.Privacy)
                .IsRequired()
                .HasConversion<string>();

            builder.HasOne(g => g.Owner)
                .WithMany(u => u.Groups)
                .HasForeignKey(g => g.OwnerId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
