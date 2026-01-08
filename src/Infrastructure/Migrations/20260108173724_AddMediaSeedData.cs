using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddMediaSeedData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                schema: "Media",
                table: "MediaAnalytics",
                columns: new[] { "Id", "AverageWatchTime", "CommentsCount", "CompletionRate", "CreatedAt", "CreatedBy", "DeletedAt", "DeletedBy", "DislikesCount", "IsDeleted", "LastUpdated", "LikesCount", "MediaId", "MediaType", "SharesCount", "TopCountries", "TopDevices", "TopReferrers", "UpdatedAt", "UpdatedBy", "ViewsMonth", "ViewsToday", "ViewsTotal", "ViewsWeek" },
                values: new object[,]
                {
                    { new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"), 18.5m, 12, 74.2m, new DateTime(2025, 12, 29, 17, 37, 16, 918, DateTimeKind.Utc).AddTicks(5393), null, null, null, 3, false, new DateTime(2026, 1, 8, 17, 37, 16, 918, DateTimeKind.Utc).AddTicks(4571), 89, new Guid("55555555-5555-5555-5555-555555555555"), 1, 15, "[\"US\", \"UK\", \"CA\", \"AU\", \"DE\"]", "[\"Desktop\", \"Mobile\", \"Tablet\"]", "[\"Google\", \"YouTube\", \"Direct\", \"Twitter\"]", null, null, 1250, 45, 1250, 320 },
                    { new Guid("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"), 28.3m, 23, 80.9m, new DateTime(2026, 1, 3, 17, 37, 16, 918, DateTimeKind.Utc).AddTicks(5467), null, null, null, 8, false, new DateTime(2026, 1, 8, 17, 37, 16, 918, DateTimeKind.Utc).AddTicks(5466), 156, new Guid("66666666-6666-6666-6666-666666666666"), 1, 31, "[\"US\", \"IN\", \"UK\", \"CA\", \"BR\"]", "[\"Mobile\", \"Desktop\", \"Tablet\"]", "[\"Google\", \"Direct\", \"LinkedIn\", \"Reddit\"]", null, null, 2100, 78, 2100, 540 },
                    { new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"), 35.2m, 8, 78.2m, new DateTime(2025, 12, 31, 17, 37, 16, 918, DateTimeKind.Utc).AddTicks(5516), null, null, null, 2, false, new DateTime(2026, 1, 8, 17, 37, 16, 918, DateTimeKind.Utc).AddTicks(5506), 67, new Guid("88888888-8888-8888-8888-888888888888"), 2, 12, "[\"US\", \"UK\", \"CA\", \"AU\", \"NL\"]", "[\"Mobile\", \"Desktop\", \"Smart Speaker\"]", "[\"Spotify\", \"Apple Podcasts\", \"Google Podcasts\", \"Direct\"]", null, null, 850, 25, 850, 180 }
                });

            migrationBuilder.InsertData(
                schema: "Media",
                table: "PodcastSeries",
                columns: new[] { "Id", "Category", "CoverImage", "CreatedAt", "CreatedBy", "CreatorId", "DeletedAt", "DeletedBy", "Description", "IsActive", "IsDeleted", "Language", "Name", "UpdatedAt", "UpdatedBy" },
                values: new object[,]
                {
                    { new Guid("11111111-1111-1111-1111-111111111111"), "Technology", "https://example.com/images/tech-talk-cover.jpg", new DateTime(2025, 12, 9, 17, 37, 16, 912, DateTimeKind.Utc).AddTicks(8403), null, new Guid("22222222-2222-2222-2222-222222222222"), null, null, "Weekly discussions about the latest in technology and software development", true, false, "en", "Tech Talk Weekly", null, null },
                    { new Guid("33333333-3333-3333-3333-333333333333"), "Business", "https://example.com/images/business-insights-cover.jpg", new DateTime(2025, 12, 14, 17, 37, 16, 913, DateTimeKind.Utc).AddTicks(1034), null, new Guid("44444444-4444-4444-4444-444444444444"), null, null, "Insights and strategies for modern business leaders", true, false, "en", "Business Insights", null, null }
                });

            migrationBuilder.InsertData(
                schema: "Media",
                table: "Videos",
                columns: new[] { "Id", "AllowComments", "CreatedAt", "CreatedBy", "CreatorId", "DeletedAt", "DeletedBy", "Description", "DislikeCount", "Duration", "FileSize", "IsDeleted", "IsPublic", "LikeCount", "PreviewUrl", "PublishedAt", "Quality", "Status", "Tags", "Thumbnail", "Title", "UpdatedAt", "UpdatedBy", "VideoUrl", "ViewCount" },
                values: new object[,]
                {
                    { new Guid("55555555-5555-5555-5555-555555555555"), true, new DateTime(2025, 12, 27, 17, 37, 16, 915, DateTimeKind.Utc).AddTicks(1254), null, new Guid("22222222-2222-2222-2222-222222222222"), null, null, "Learn the basics of ASP.NET Core 9 and its new features", 3, new TimeSpan(0, 0, 25, 0, 0), 524288000L, false, true, 89, "https://example.com/videos/aspnet-core-preview.mp4", new DateTime(2025, 12, 29, 17, 37, 16, 914, DateTimeKind.Utc).AddTicks(7830), 1080, 2, "ASP.NET,C#,Web Development,Tutorial", "https://example.com/images/aspnet-core-thumb.jpg", "Introduction to ASP.NET Core 9", null, null, "https://example.com/videos/aspnet-core-intro.mp4", 1250 },
                    { new Guid("66666666-6666-6666-6666-666666666666"), true, new DateTime(2026, 1, 1, 17, 37, 16, 915, DateTimeKind.Utc).AddTicks(1343), null, new Guid("44444444-4444-4444-4444-444444444444"), null, null, "Modern React development patterns and best practices", 8, new TimeSpan(0, 0, 35, 0, 0), 734003200L, false, true, 156, null, new DateTime(2026, 1, 3, 17, 37, 16, 915, DateTimeKind.Utc).AddTicks(1337), 1080, 2, "React,JavaScript,Frontend,Best Practices", "https://example.com/images/react-best-practices-thumb.jpg", "React Best Practices 2024", null, null, "https://example.com/videos/react-best-practices.mp4", 2100 },
                    { new Guid("77777777-7777-7777-7777-777777777777"), true, new DateTime(2026, 1, 6, 17, 37, 16, 915, DateTimeKind.Utc).AddTicks(1367), null, new Guid("22222222-2222-2222-2222-222222222222"), null, null, "Understanding database design principles and normalization", 0, new TimeSpan(0, 0, 42, 0, 0), 419430400L, false, false, 0, null, null, 720, 0, "Database,SQL,Design,Normalization", "https://example.com/images/database-design-thumb.jpg", "Database Design Fundamentals", null, null, "https://example.com/videos/database-design.mp4", 0 }
                });

            migrationBuilder.InsertData(
                schema: "Media",
                table: "Podcasts",
                columns: new[] { "Id", "AllowComments", "AllowDownload", "AudioUrl", "CoverImage", "CreatedAt", "CreatedBy", "CreatorId", "DeletedAt", "DeletedBy", "Description", "DownloadCount", "Duration", "EpisodeNumber", "FileSize", "IsDeleted", "IsPublic", "LikeCount", "PlayCount", "PublishedAt", "SeasonNumber", "SeriesId", "Status", "Tags", "Title", "Transcript", "UpdatedAt", "UpdatedBy" },
                values: new object[,]
                {
                    { new Guid("88888888-8888-8888-8888-888888888888"), true, true, "https://example.com/audio/ai-software-dev.mp3", "https://example.com/images/ai-software-cover.jpg", new DateTime(2025, 12, 29, 17, 37, 16, 917, DateTimeKind.Utc).AddTicks(2227), null, new Guid("22222222-2222-2222-2222-222222222222"), null, null, "Exploring how artificial intelligence is transforming the way we write code", 23, new TimeSpan(0, 0, 45, 0, 0), 15, 43200000L, false, true, 67, 850, new DateTime(2025, 12, 31, 17, 37, 16, 916, DateTimeKind.Utc).AddTicks(4497), 2, new Guid("11111111-1111-1111-1111-111111111111"), 2, "AI,Software Development,Machine Learning,Future", "The Future of AI in Software Development", "Welcome to Tech Talk Weekly. Today we're discussing the future of AI in software development...", null, null },
                    { new Guid("99999999-9999-9999-9999-999999999999"), true, true, "https://example.com/audio/scalable-teams.mp3", "https://example.com/images/scalable-teams-cover.jpg", new DateTime(2025, 12, 31, 17, 37, 16, 917, DateTimeKind.Utc).AddTicks(2303), null, new Guid("44444444-4444-4444-4444-444444444444"), null, null, "Strategies for building and managing high-performing development teams", 45, new TimeSpan(0, 0, 38, 0, 0), 8, 36700000L, false, true, 94, 1200, new DateTime(2026, 1, 2, 17, 37, 16, 917, DateTimeKind.Utc).AddTicks(2293), 1, new Guid("33333333-3333-3333-3333-333333333333"), 2, "Team Management,Leadership,Scaling,Business", "Building Scalable Teams", "In today's episode of Business Insights, we explore strategies for building scalable teams...", null, null }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                schema: "Media",
                table: "MediaAnalytics",
                keyColumn: "Id",
                keyValue: new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"));

            migrationBuilder.DeleteData(
                schema: "Media",
                table: "MediaAnalytics",
                keyColumn: "Id",
                keyValue: new Guid("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"));

            migrationBuilder.DeleteData(
                schema: "Media",
                table: "MediaAnalytics",
                keyColumn: "Id",
                keyValue: new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"));

            migrationBuilder.DeleteData(
                schema: "Media",
                table: "Podcasts",
                keyColumn: "Id",
                keyValue: new Guid("88888888-8888-8888-8888-888888888888"));

            migrationBuilder.DeleteData(
                schema: "Media",
                table: "Podcasts",
                keyColumn: "Id",
                keyValue: new Guid("99999999-9999-9999-9999-999999999999"));

            migrationBuilder.DeleteData(
                schema: "Media",
                table: "Videos",
                keyColumn: "Id",
                keyValue: new Guid("55555555-5555-5555-5555-555555555555"));

            migrationBuilder.DeleteData(
                schema: "Media",
                table: "Videos",
                keyColumn: "Id",
                keyValue: new Guid("66666666-6666-6666-6666-666666666666"));

            migrationBuilder.DeleteData(
                schema: "Media",
                table: "Videos",
                keyColumn: "Id",
                keyValue: new Guid("77777777-7777-7777-7777-777777777777"));

            migrationBuilder.DeleteData(
                schema: "Media",
                table: "PodcastSeries",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"));

            migrationBuilder.DeleteData(
                schema: "Media",
                table: "PodcastSeries",
                keyColumn: "Id",
                keyValue: new Guid("33333333-3333-3333-3333-333333333333"));
        }
    }
}
