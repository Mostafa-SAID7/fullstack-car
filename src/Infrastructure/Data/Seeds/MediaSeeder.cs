using Domain.Entities.Identity;
using Domain.Entities.Media;
using Domain.Enums.Media;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Data.Seeds;

public class MediaSeeder
{
    private readonly ILogger<MediaSeeder> _logger;
    private readonly ApplicationDbContext _context;

    public MediaSeeder(ILogger<MediaSeeder> logger, ApplicationDbContext context)
    {
        _logger = logger;
        _context = context;
    }

    public async Task SeedMediaAsync()
    {
        _logger.LogInformation("Seeding Media data...");

        await SeedPodcastSeriesAsync();
        await SeedVideosAsync();
        await SeedPodcastsAsync();
        await SeedVideoPlaylistsAsync();
        await SeedMediaInteractionsAsync();

        await _context.SaveChangesAsync();
        _logger.LogInformation("Media data seeded successfully.");
    }

    private async Task SeedPodcastSeriesAsync()
    {
        if (await _context.PodcastSeries.AnyAsync())
        {
            _logger.LogInformation("Podcast series already exist, skipping seeding.");
            return;
        }

        var series = new List<PodcastSeries>
        {
            new()
            {
                Id = Guid.NewGuid(),
                Name = "Car Care Chronicles",
                Description = "Weekly discussions about car maintenance, tips, and automotive industry insights.",
                CoverImage = "/images/series/car-care-chronicles.jpg",
                CreatorId = Guid.NewGuid(),
                CreatedAt = DateTime.UtcNow.AddDays(-30),
                UpdatedAt = DateTime.UtcNow.AddDays(-30)
            },
            new()
            {
                Id = Guid.NewGuid(),
                Name = "Electric Future",
                Description = "Exploring the future of electric vehicles and sustainable transportation.",
                CoverImage = "/images/series/electric-future.jpg",
                CreatorId = Guid.NewGuid(),
                CreatedAt = DateTime.UtcNow.AddDays(-25),
                UpdatedAt = DateTime.UtcNow.AddDays(-25)
            },
            new()
            {
                Id = Guid.NewGuid(),
                Name = "Road Trip Stories",
                Description = "Amazing road trip experiences and travel tips from car enthusiasts.",
                CoverImage = "/images/series/road-trip-stories.jpg",
                CreatorId = Guid.NewGuid(),
                CreatedAt = DateTime.UtcNow.AddDays(-20),
                UpdatedAt = DateTime.UtcNow.AddDays(-20)
            }
        };

        _context.PodcastSeries.AddRange(series);
        await _context.SaveChangesAsync();
        _logger.LogInformation("Added {Count} podcast series.", series.Count);
    }

    private async Task SeedVideosAsync()
    {
        if (await _context.Videos.AnyAsync())
        {
            _logger.LogInformation("Videos already exist, skipping seeding.");
            return;
        }

        var users = await _context.Users.Take(5).ToListAsync();
        if (!users.Any())
        {
            _logger.LogWarning("No users found for video seeding.");
            return;
        }

        var videos = new List<Video>();
        var random = new Random();

        var videoTitles = new[]
        {
            "How to Change Your Car Oil - Complete Guide",
            "Top 10 Electric Cars of 2024",
            "DIY Car Maintenance Tips Every Owner Should Know",
            "Road Trip Preparation Checklist",
            "Understanding Car Insurance: What You Need to Know",
            "Best Fuel-Efficient Cars for City Driving",
            "Car Detailing: Professional vs DIY",
            "Winter Driving Safety Tips",
            "How to Buy a Used Car: Red Flags to Avoid",
            "Car Technology Trends in 2024"
        };

        for (int i = 0; i < videoTitles.Length; i++)
        {
            var user = users[random.Next(users.Count)];
            var createdDate = DateTime.UtcNow.AddDays(-random.Next(1, 60));
            
            videos.Add(new Video
            {
                Id = Guid.NewGuid(),
                Title = videoTitles[i],
                Description = $"Comprehensive guide about {videoTitles[i].ToLower()}. Learn everything you need to know with practical tips and expert advice.",
                VideoUrl = $"/videos/sample-video-{i + 1}.mp4",
                Thumbnail = $"/thumbnails/video-thumb-{i + 1}.jpg",
                Duration = TimeSpan.FromMinutes(random.Next(5, 45)),
                Quality = (VideoQuality)random.Next(0, 4),
                FileSize = random.Next(50_000_000, 500_000_000),
                ViewCount = random.Next(100, 10000),
                LikeCount = random.Next(10, 500),
                DislikeCount = random.Next(0, 50),
                Tags = GetRandomTags(random),
                Status = MediaStatus.Published,
                IsPublic = true,
                AllowComments = true,
                CreatorId = user.Id,
                CreatedAt = createdDate,
                UpdatedAt = createdDate
            });
        }

        _context.Videos.AddRange(videos);
        await _context.SaveChangesAsync();
        _logger.LogInformation("Added {Count} videos.", videos.Count);
    }

    private async Task SeedPodcastsAsync()
    {
        if (await _context.Podcasts.AnyAsync())
        {
            _logger.LogInformation("Podcasts already exist, skipping seeding.");
            return;
        }

        var users = await _context.Users.Take(5).ToListAsync();
        var series = await _context.PodcastSeries.ToListAsync();
        
        if (!users.Any() || !series.Any())
        {
            _logger.LogWarning("No users or series found for podcast seeding.");
            return;
        }

        var podcasts = new List<Podcast>();
        var random = new Random();

        var podcastTitles = new[]
        {
            "The Future of Electric Vehicles",
            "Car Maintenance Myths Debunked",
            "Best Road Trip Routes in America",
            "Understanding Car Financing Options",
            "Hybrid vs Electric: Which is Better?",
            "Car Safety Features That Save Lives",
            "The Rise of Autonomous Vehicles",
            "Classic Cars: Investment or Passion?",
            "Motorcycle Safety and Maintenance",
            "Car Sharing vs Car Ownership"
        };

        for (int i = 0; i < podcastTitles.Length; i++)
        {
            var user = users[random.Next(users.Count)];
            var podcastSeries = series[random.Next(series.Count)];
            var createdDate = DateTime.UtcNow.AddDays(-random.Next(1, 45));
            
            podcasts.Add(new Podcast
            {
                Id = Guid.NewGuid(),
                Title = podcastTitles[i],
                Description = $"In-depth discussion about {podcastTitles[i].ToLower()}. Join us as we explore this topic with industry experts.",
                AudioUrl = $"/podcasts/episode-{i + 1}.mp3",
                CoverImage = $"/thumbnails/podcast-thumb-{i + 1}.jpg",
                Duration = TimeSpan.FromMinutes(random.Next(20, 90)),
                FileSize = random.Next(20_000_000, 200_000_000),
                PlayCount = random.Next(50, 5000),
                LikeCount = random.Next(5, 200),
                EpisodeNumber = i + 1,
                SeasonNumber = 1,
                Tags = GetRandomTags(random),
                Status = MediaStatus.Published,
                IsPublic = true,
                AllowComments = true,
                AllowDownload = random.Next(0, 2) == 1,
                SeriesId = podcastSeries.Id,
                CreatorId = user.Id,
                CreatedAt = createdDate,
                UpdatedAt = createdDate
            });
        }

        _context.Podcasts.AddRange(podcasts);
        await _context.SaveChangesAsync();
        _logger.LogInformation("Added {Count} podcasts.", podcasts.Count);
    }

    private async Task SeedVideoPlaylistsAsync()
    {
        if (await _context.VideoPlaylists.AnyAsync())
        {
            _logger.LogInformation("Video playlists already exist, skipping seeding.");
            return;
        }

        var users = await _context.Users.Take(3).ToListAsync();
        var videos = await _context.Videos.ToListAsync();
        
        if (!users.Any() || !videos.Any())
        {
            _logger.LogWarning("No users or videos found for playlist seeding.");
            return;
        }

        var playlists = new List<VideoPlaylist>();
        var playlistItems = new List<VideoPlaylistItem>();
        var random = new Random();

        var playlistNames = new[]
        {
            "Car Maintenance Essentials",
            "Electric Vehicle Guide",
            "Road Trip Preparation"
        };

        for (int i = 0; i < playlistNames.Length; i++)
        {
            var user = users[i];
            var playlistId = Guid.NewGuid();
            
            playlists.Add(new VideoPlaylist
            {
                Id = playlistId,
                Name = playlistNames[i],
                Description = $"Curated collection of videos about {playlistNames[i].ToLower()}.",
                IsPublic = true,
                CreatorId = user.Id,
                CreatedAt = DateTime.UtcNow.AddDays(-random.Next(1, 30)),
                UpdatedAt = DateTime.UtcNow.AddDays(-random.Next(1, 30))
            });

            // Add 3-5 videos to each playlist
            var playlistVideos = videos.OrderBy(x => random.Next()).Take(random.Next(3, 6)).ToList();
            for (int j = 0; j < playlistVideos.Count; j++)
            {
                playlistItems.Add(new VideoPlaylistItem
                {
                    Id = Guid.NewGuid(),
                    PlaylistId = playlistId,
                    VideoId = playlistVideos[j].Id,
                    Order = j + 1,
                    CreatedAt = DateTime.UtcNow.AddDays(-random.Next(1, 25))
                });
            }
        }

        _context.VideoPlaylists.AddRange(playlists);
        _context.VideoPlaylistItems.AddRange(playlistItems);
        await _context.SaveChangesAsync();
        _logger.LogInformation("Added {PlaylistCount} playlists with {ItemCount} items.", playlists.Count, playlistItems.Count);
    }

    private async Task SeedMediaInteractionsAsync()
    {
        var users = await _context.Users.ToListAsync();
        var videos = await _context.Videos.ToListAsync();
        var podcasts = await _context.Podcasts.ToListAsync();
        
        if (!users.Any() || (!videos.Any() && !podcasts.Any()))
        {
            _logger.LogWarning("No users or media found for interaction seeding.");
            return;
        }

        var random = new Random();

        // Seed video interactions
        await SeedVideoInteractions(users, videos, random);
        
        // Seed podcast interactions
        await SeedPodcastInteractions(users, podcasts, random);

        await _context.SaveChangesAsync();
        _logger.LogInformation("Media interactions seeded successfully.");
    }

    private async Task SeedVideoInteractions(List<ApplicationUser> users, List<Video> videos, Random random)
    {
        var videoLikes = new List<VideoLike>();
        var videoViews = new List<VideoView>();
        var videoComments = new List<VideoComment>();

        foreach (var video in videos)
        {
            // Add likes (random subset of users)
            var likers = users.OrderBy(x => random.Next()).Take(random.Next(1, Math.Min(users.Count, 10))).ToList();
            foreach (var liker in likers)
            {
                videoLikes.Add(new VideoLike
                {
                    Id = Guid.NewGuid(),
                    VideoId = video.Id,
                    UserId = liker.Id,
                    IsLike = random.Next(0, 10) > 1, // 90% likes, 10% dislikes
                    CreatedAt = DateTime.UtcNow.AddDays(-random.Next(1, 30))
                });
            }

            // Add views
            var viewers = users.OrderBy(x => random.Next()).Take(random.Next(5, users.Count)).ToList();
            foreach (var viewer in viewers)
            {
                videoViews.Add(new VideoView
                {
                    Id = Guid.NewGuid(),
                    VideoId = video.Id,
                    UserId = viewer.Id,
                    WatchDuration = TimeSpan.FromMinutes(random.Next(1, (int)video.Duration.TotalMinutes + 1)),
                    IsCompleted = random.Next(0, 3) == 0, // 33% completion rate
                    CreatedAt = DateTime.UtcNow.AddDays(-random.Next(1, 30))
                });
            }

            // Add comments
            var commenters = users.OrderBy(x => random.Next()).Take(random.Next(1, 5)).ToList();
            foreach (var commenter in commenters)
            {
                videoComments.Add(new VideoComment
                {
                    Id = Guid.NewGuid(),
                    VideoId = video.Id,
                    UserId = commenter.Id,
                    Content = GetRandomComment(random),
                    CreatedAt = DateTime.UtcNow.AddDays(-random.Next(1, 25))
                });
            }
        }

        _context.VideoLikes.AddRange(videoLikes);
        _context.VideoViews.AddRange(videoViews);
        _context.VideoComments.AddRange(videoComments);
    }

    private async Task SeedPodcastInteractions(List<ApplicationUser> users, List<Podcast> podcasts, Random random)
    {
        var podcastLikes = new List<PodcastLike>();
        var podcastPlays = new List<PodcastPlay>();
        var podcastComments = new List<PodcastComment>();

        foreach (var podcast in podcasts)
        {
            // Add likes
            var likers = users.OrderBy(x => random.Next()).Take(random.Next(1, Math.Min(users.Count, 8))).ToList();
            foreach (var liker in likers)
            {
                podcastLikes.Add(new PodcastLike
                {
                    Id = Guid.NewGuid(),
                    PodcastId = podcast.Id,
                    UserId = liker.Id,
                    CreatedAt = DateTime.UtcNow.AddDays(-random.Next(1, 30))
                });
            }

            // Add plays
            var listeners = users.OrderBy(x => random.Next()).Take(random.Next(3, users.Count)).ToList();
            foreach (var listener in listeners)
            {
                podcastPlays.Add(new PodcastPlay
                {
                    Id = Guid.NewGuid(),
                    PodcastId = podcast.Id,
                    UserId = listener.Id,
                    PlayDuration = TimeSpan.FromMinutes(random.Next(5, (int)podcast.Duration.TotalMinutes + 1)),
                    IsCompleted = random.Next(0, 4) == 0, // 25% completion rate
                    CreatedAt = DateTime.UtcNow.AddDays(-random.Next(1, 30))
                });
            }

            // Add comments
            var commenters = users.OrderBy(x => random.Next()).Take(random.Next(1, 4)).ToList();
            foreach (var commenter in commenters)
            {
                podcastComments.Add(new PodcastComment
                {
                    Id = Guid.NewGuid(),
                    PodcastId = podcast.Id,
                    UserId = commenter.Id,
                    Content = GetRandomComment(random),
                    CreatedAt = DateTime.UtcNow.AddDays(-random.Next(1, 25))
                });
            }
        }

        _context.PodcastLikes.AddRange(podcastLikes);
        _context.PodcastPlays.AddRange(podcastPlays);
        _context.PodcastComments.AddRange(podcastComments);
    }

    private static string GetRandomTags(Random random)
    {
        var allTags = new[] { "automotive", "maintenance", "electric", "hybrid", "safety", "tips", "guide", "review", "tutorial", "news" };
        var selectedTags = allTags.OrderBy(x => random.Next()).Take(random.Next(2, 5));
        return string.Join(",", selectedTags);
    }

    private static string GetRandomComment(Random random)
    {
        var comments = new[]
        {
            "Great content! Very helpful.",
            "Thanks for sharing this information.",
            "This really helped me understand the topic better.",
            "Excellent explanation, keep up the good work!",
            "I learned something new today, thank you!",
            "Very informative and well presented.",
            "Could you make a follow-up video on this topic?",
            "This is exactly what I was looking for!",
            "Amazing quality content as always.",
            "Please do more videos like this one."
        };
        
        return comments[random.Next(comments.Length)];
    }
}
