using Domain.Entities.Community.News;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations.Community.News
{
    public class ArticleConfiguration : IEntityTypeConfiguration<Article>
    {
        public void Configure(EntityTypeBuilder<Article> builder)
        {
            builder.ToTable("Articles");

            builder.HasKey(x => x.Id);

            builder.Property(x => x.Title)
                .IsRequired()
                .HasMaxLength(500);

            builder.Property(x => x.Slug)
                .IsRequired()
                .HasMaxLength(500);

            builder.Property(x => x.Summary)
                .HasMaxLength(1000);

            builder.Property(x => x.Content)
                .IsRequired()
                .HasMaxLength(50000);

            builder.Property(x => x.FeaturedImageUrl)
                .HasMaxLength(500);

            builder.Property(x => x.Status)
                .IsRequired()
                .HasConversion<int>();

            builder.Property(x => x.Priority)
                .IsRequired()
                .HasConversion<int>();

            builder.Property(x => x.MetaTitle)
                .HasMaxLength(200);

            builder.Property(x => x.MetaDescription)
                .HasMaxLength(500);

            builder.Property(x => x.Tags)
                .HasMaxLength(2000);

            builder.Property(x => x.Source)
                .HasMaxLength(200);

            builder.Property(x => x.SourceUrl)
                .HasMaxLength(500);

            builder.HasOne(x => x.Author)
                .WithMany()
                .HasForeignKey(x => x.AuthorId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.Category)
                .WithMany(x => x.Articles)
                .HasForeignKey(x => x.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(x => x.Comments)
                .WithOne(x => x.Article)
                .HasForeignKey(x => x.ArticleId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(x => x.Likes)
                .WithOne(x => x.Article)
                .HasForeignKey(x => x.ArticleId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(x => x.Views)
                .WithOne(x => x.Article)
                .HasForeignKey(x => x.ArticleId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(x => x.Shares)
                .WithOne(x => x.Article)
                .HasForeignKey(x => x.ArticleId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(x => x.Images)
                .WithOne(x => x.Article)
                .HasForeignKey(x => x.ArticleId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasIndex(x => x.Slug)
                .IsUnique();
            builder.HasIndex(x => x.AuthorId);
            builder.HasIndex(x => x.CategoryId);
            builder.HasIndex(x => x.Status);
            builder.HasIndex(x => x.Priority);
            builder.HasIndex(x => x.PublishedAt);
            builder.HasIndex(x => x.IsFeatured);
            builder.HasIndex(x => x.CreatedAt);
        }
    }
}
