using Domain.Entities.Community.Pages;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations.Community.Pages
{
    public class PageConfiguration : IEntityTypeConfiguration<Page>
    {
        public void Configure(EntityTypeBuilder<Page> builder)
        {
            builder.ToTable("Pages");

            builder.HasKey(x => x.Id);

            builder.Property(x => x.Title)
                .IsRequired()
                .HasMaxLength(500);

            builder.Property(x => x.Slug)
                .IsRequired()
                .HasMaxLength(500);

            builder.Property(x => x.Content)
                .IsRequired()
                .HasMaxLength(100000);

            builder.Property(x => x.Excerpt)
                .HasMaxLength(1000);

            builder.Property(x => x.Status)
                .IsRequired()
                .HasConversion<int>();

            builder.Property(x => x.Type)
                .IsRequired()
                .HasConversion<int>();

            builder.Property(x => x.Template)
                .HasMaxLength(100);

            builder.Property(x => x.FeaturedImageUrl)
                .HasMaxLength(500);

            builder.Property(x => x.MetaTitle)
                .HasMaxLength(200);

            builder.Property(x => x.MetaDescription)
                .HasMaxLength(500);

            builder.Property(x => x.MetaKeywords)
                .HasMaxLength(500);

            builder.Property(x => x.CustomCss)
                .HasMaxLength(10000);

            builder.Property(x => x.CustomJs)
                .HasMaxLength(10000);

            builder.HasOne(x => x.Author)
                .WithMany()
                .HasForeignKey(x => x.AuthorId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.ParentPage)
                .WithMany(x => x.ChildPages)
                .HasForeignKey(x => x.ParentPageId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(x => x.Contents)
                .WithOne(x => x.Page)
                .HasForeignKey(x => x.PageId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(x => x.Revisions)
                .WithOne(x => x.Page)
                .HasForeignKey(x => x.PageId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(x => x.Views)
                .WithOne(x => x.Page)
                .HasForeignKey(x => x.PageId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(x => x.Comments)
                .WithOne(x => x.Page)
                .HasForeignKey(x => x.PageId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasIndex(x => x.Slug)
                .IsUnique();
            builder.HasIndex(x => x.AuthorId);
            builder.HasIndex(x => x.Status);
            builder.HasIndex(x => x.Type);
            builder.HasIndex(x => x.IsHomepage);
            builder.HasIndex(x => x.ShowInMenu);
            builder.HasIndex(x => x.CreatedAt);
        }
    }
}
