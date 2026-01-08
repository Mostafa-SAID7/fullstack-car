using Domain.Entities.Media;
using Domain.Enums.Media;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data.Seeds;

public static class MediaSeedData
{
    public static void SeedMediaData(ModelBuilder modelBuilder)
    {
        // Seed PodcastSeries
        var podcastSeries = new[]
        {
            new PodcastSeries
            {
                Id = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                Name = "Tech Talk Weekly",
                Description = "Weekly discussions about the latest in technology and software development",
                CoverImage = "https://example.com/images/tech-talk-cover.jpg",
                IsActive = true,
                Category = "Technology",
                Language = "en",
                CreatorId = Guid.Parse("22222222-2222-2222-2222-222222222222"),
                CreatedAt = DateTime.UtcNow.AddDays(-30),
                IsDeleted = false
            },
            new PodcastSeries
            {
                Id = Guid.Parse("33333333-3333-3333-3333-333333333333"),
                Name = "Business Insights",
                Description = "Insights and strategies for modern business leaders",
                CoverImage = "https://example.com/images/business-insights-cover.jpg",
                IsActive = true,
                Category = "Business",
                Language = "en",
                CreatorId = Guid.Parse("44444444-4444-4444-4444-444444444444"),
                CreatedAt = DateTime.UtcNow.AddDays(-25),
                IsDeleted = false
            }
        };

        // Seed Videos
        var videos = new[]
        {
            new Video
            {
                Id = Guid.Parse("55555555-5555-5555-5555-555555555555"),
                Title = "Introduction to ASP.NET Core 9",
                Description = "Learn the basics of ASP.NET Core 9 and its new features",
                Thumbnail = "https://example.com/images/aspnet-core-thumb.jpg",
                VideoUrl = "https://example.com/videos/aspnet-core-intro.mp4",
                PreviewUrl = "https://example.com/videos/aspnet-core-preview.mp4",
                Duration = TimeSpan.FromMinutes(25),
                Quality = VideoQuality.FullHD_1080p,
                Status = MediaStatus.Published,
                FileSize = 524288000, // 500MB
                Tags = "ASP.NET,C#,Web Development,Tutorial",
                ViewCount = 1250,
                LikeCount = 89,
                DislikeCount = 3,
                IsPublic = true,
                AllowComments = true,
                PublishedAt = DateTime.UtcNow.AddDays(-10),
                CreatorId = Guid.Parse("22222222-2222-2222-2222-222222222222"),
                CreatedAt = DateTime.UtcNow.AddDays(-12),
                IsDeleted = false
            },
            new Video
            {
                Id = Guid.Parse("66666666-6666-6666-6666-666666666666"),
                Title = "React Best Practices 2024",
                Description = "Modern React development patterns and best practices",
                Thumbnail = "https://example.com/images/react-best-practices-thumb.jpg",
                VideoUrl = "https://example.com/videos/react-best-practices.mp4",
                Duration = TimeSpan.FromMinutes(35),
                Quality = VideoQuality.FullHD_1080p,
                Status = MediaStatus.Published,
                FileSize = 734003200, // 700MB
                Tags = "React,JavaScript,Frontend,Best Practices",
                ViewCount = 2100,
                LikeCount = 156,
                DislikeCount = 8,
                IsPublic = true,
                AllowComments = true,
                PublishedAt = DateTime.UtcNow.AddDays(-5),
                CreatorId = Guid.Parse("44444444-4444-4444-4444-444444444444"),
                CreatedAt = DateTime.UtcNow.AddDays(-7),
                IsDeleted = false
            },
            new Video
            {
                Id = Guid.Parse("77777777-7777-7777-7777-777777777777"),
                Title = "Database Design Fundamentals",
                Description = "Understanding database design principles and normalization",
                Thumbnail = "https://example.com/images/database-design-thumb.jpg",
                VideoUrl = "https://example.com/videos/database-design.mp4",
                Duration = TimeSpan.FromMinutes(42),
                Quality = VideoQuality.HD_720p,
                Status = MediaStatus.Draft,
                FileSize = 419430400, // 400MB
                Tags = "Database,SQL,Design,Normalization",
                ViewCount = 0,
                LikeCount = 0,
                DislikeCount = 0,
                IsPublic = false,
                AllowComments = true,
                CreatorId = Guid.Parse("22222222-2222-2222-2222-222222222222"),
                CreatedAt = DateTime.UtcNow.AddDays(-2),
                IsDeleted = false
            }
        };

        // Seed Podcasts
        var podcasts = new[]
        {
            new Podcast
            {
                Id = Guid.Parse("88888888-8888-8888-8888-888888888888"),
                Title = "The Future of AI in Software Development",
                Description = "Exploring how artificial intelligence is transforming the way we write code",
                CoverImage = "https://example.com/images/ai-software-cover.jpg",
                AudioUrl = "https://example.com/audio/ai-software-dev.mp3",
                Duration = TimeSpan.FromMinutes(45),
                Status = MediaStatus.Published,
                FileSize = 43200000, // 41MB
                Tags = "AI,Software Development,Machine Learning,Future",
                PlayCount = 850,
                LikeCount = 67,
                DownloadCount = 23,
                IsPublic = true,
                AllowComments = true,
                AllowDownload = true,
                PublishedAt = DateTime.UtcNow.AddDays(-8),
                Transcript = "Welcome to Tech Talk Weekly. Today we're discussing the future of AI in software development...",
                EpisodeNumber = 15,
                SeasonNumber = 2,
                SeriesId = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                CreatorId = Guid.Parse("22222222-2222-2222-2222-222222222222"),
                CreatedAt = DateTime.UtcNow.AddDays(-10),
                IsDeleted = false
            },
            new Podcast
            {
                Id = Guid.Parse("99999999-9999-9999-9999-999999999999"),
                Title = "Building Scalable Teams",
                Description = "Strategies for building and managing high-performing development teams",
                CoverImage = "https://example.com/images/scalable-teams-cover.jpg",
                AudioUrl = "https://example.com/audio/scalable-teams.mp3",
                Duration = TimeSpan.FromMinutes(38),
                Status = MediaStatus.Published,
                FileSize = 36700000, // 35MB
                Tags = "Team Management,Leadership,Scaling,Business",
                PlayCount = 1200,
                LikeCount = 94,
                DownloadCount = 45,
                IsPublic = true,
                AllowComments = true,
                AllowDownload = true,
                PublishedAt = DateTime.UtcNow.AddDays(-6),
                Transcript = "In today's episode of Business Insights, we explore strategies for building scalable teams...",
                EpisodeNumber = 8,
                SeasonNumber = 1,
                SeriesId = Guid.Parse("33333333-3333-3333-3333-333333333333"),
                CreatorId = Guid.Parse("44444444-4444-4444-4444-444444444444"),
                CreatedAt = DateTime.UtcNow.AddDays(-8),
                IsDeleted = false
            }
        };

        // Seed MediaAnalytics
        var mediaAnalytics = new[]
        {
            new MediaAnalytics
            {
                Id = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
                MediaId = Guid.Parse("55555555-5555-5555-5555-555555555555"),
                MediaType = MediaType.Video,
                ViewsToday = 45,
                ViewsWeek = 320,
                ViewsMonth = 1250,
                ViewsTotal = 1250,
                LikesCount = 89,
                DislikesCount = 3,
                CommentsCount = 12,
                SharesCount = 15,
                AverageWatchTime = 18.5m,
                CompletionRate = 74.2m,
                TopCountries = "[\"US\", \"UK\", \"CA\", \"AU\", \"DE\"]",
                TopDevices = "[\"Desktop\", \"Mobile\", \"Tablet\"]",
                TopReferrers = "[\"Google\", \"YouTube\", \"Direct\", \"Twitter\"]",
                LastUpdated = DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow.AddDays(-10),
                IsDeleted = false
            },
            new MediaAnalytics
            {
                Id = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"),
                MediaId = Guid.Parse("66666666-6666-6666-6666-666666666666"),
                MediaType = MediaType.Video,
                ViewsToday = 78,
                ViewsWeek = 540,
                ViewsMonth = 2100,
                ViewsTotal = 2100,
                LikesCount = 156,
                DislikesCount = 8,
                CommentsCount = 23,
                SharesCount = 31,
                AverageWatchTime = 28.3m,
                CompletionRate = 80.9m,
                TopCountries = "[\"US\", \"IN\", \"UK\", \"CA\", \"BR\"]",
                TopDevices = "[\"Mobile\", \"Desktop\", \"Tablet\"]",
                TopReferrers = "[\"Google\", \"Direct\", \"LinkedIn\", \"Reddit\"]",
                LastUpdated = DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow.AddDays(-5),
                IsDeleted = false
            },
            new MediaAnalytics
            {
                Id = Guid.Parse("cccccccc-cccc-cccc-cccc-cccccccccccc"),
                MediaId = Guid.Parse("88888888-8888-8888-8888-888888888888"),
                MediaType = MediaType.Podcast,
                ViewsToday = 25,
                ViewsWeek = 180,
                ViewsMonth = 850,
                ViewsTotal = 850,
                LikesCount = 67,
                DislikesCount = 2,
                CommentsCount = 8,
                SharesCount = 12,
                AverageWatchTime = 35.2m,
                CompletionRate = 78.2m,
                TopCountries = "[\"US\", \"UK\", \"CA\", \"AU\", \"NL\"]",
                TopDevices = "[\"Mobile\", \"Desktop\", \"Smart Speaker\"]",
                TopReferrers = "[\"Spotify\", \"Apple Podcasts\", \"Google Podcasts\", \"Direct\"]",
                LastUpdated = DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow.AddDays(-8),
                IsDeleted = false
            }
        };

        // Apply seed data
        modelBuilder.Entity<PodcastSeries>().HasData(podcastSeries);
        modelBuilder.Entity<Video>().HasData(videos);
        modelBuilder.Entity<Podcast>().HasData(podcasts);
        modelBuilder.Entity<MediaAnalytics>().HasData(mediaAnalytics);
    }
}