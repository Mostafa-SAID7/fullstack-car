using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddMediaPerformanceIndexes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                schema: "Media",
                table: "MediaAnalytics",
                keyColumn: "Id",
                keyValue: new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
                columns: new[] { "CreatedAt", "LastUpdated" },
                values: new object[] { new DateTime(2025, 12, 29, 17, 47, 29, 773, DateTimeKind.Utc).AddTicks(4963), new DateTime(2026, 1, 8, 17, 47, 29, 773, DateTimeKind.Utc).AddTicks(4577) });

            migrationBuilder.UpdateData(
                schema: "Media",
                table: "MediaAnalytics",
                keyColumn: "Id",
                keyValue: new Guid("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"),
                columns: new[] { "CreatedAt", "LastUpdated" },
                values: new object[] { new DateTime(2026, 1, 3, 17, 47, 29, 773, DateTimeKind.Utc).AddTicks(5011), new DateTime(2026, 1, 8, 17, 47, 29, 773, DateTimeKind.Utc).AddTicks(5011) });

            migrationBuilder.UpdateData(
                schema: "Media",
                table: "MediaAnalytics",
                keyColumn: "Id",
                keyValue: new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"),
                columns: new[] { "CreatedAt", "LastUpdated" },
                values: new object[] { new DateTime(2025, 12, 31, 17, 47, 29, 773, DateTimeKind.Utc).AddTicks(5033), new DateTime(2026, 1, 8, 17, 47, 29, 773, DateTimeKind.Utc).AddTicks(5025) });

            migrationBuilder.UpdateData(
                schema: "Media",
                table: "PodcastSeries",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                column: "CreatedAt",
                value: new DateTime(2025, 12, 9, 17, 47, 29, 770, DateTimeKind.Utc).AddTicks(2488));

            migrationBuilder.UpdateData(
                schema: "Media",
                table: "PodcastSeries",
                keyColumn: "Id",
                keyValue: new Guid("33333333-3333-3333-3333-333333333333"),
                column: "CreatedAt",
                value: new DateTime(2025, 12, 14, 17, 47, 29, 770, DateTimeKind.Utc).AddTicks(3570));

            migrationBuilder.UpdateData(
                schema: "Media",
                table: "Podcasts",
                keyColumn: "Id",
                keyValue: new Guid("88888888-8888-8888-8888-888888888888"),
                columns: new[] { "CreatedAt", "PublishedAt" },
                values: new object[] { new DateTime(2025, 12, 29, 17, 47, 29, 772, DateTimeKind.Utc).AddTicks(7374), new DateTime(2025, 12, 31, 17, 47, 29, 772, DateTimeKind.Utc).AddTicks(4918) });

            migrationBuilder.UpdateData(
                schema: "Media",
                table: "Podcasts",
                keyColumn: "Id",
                keyValue: new Guid("99999999-9999-9999-9999-999999999999"),
                columns: new[] { "CreatedAt", "PublishedAt" },
                values: new object[] { new DateTime(2025, 12, 31, 17, 47, 29, 772, DateTimeKind.Utc).AddTicks(7414), new DateTime(2026, 1, 2, 17, 47, 29, 772, DateTimeKind.Utc).AddTicks(7407) });

            migrationBuilder.UpdateData(
                schema: "Media",
                table: "Videos",
                keyColumn: "Id",
                keyValue: new Guid("55555555-5555-5555-5555-555555555555"),
                columns: new[] { "CreatedAt", "PublishedAt" },
                values: new object[] { new DateTime(2025, 12, 27, 17, 47, 29, 771, DateTimeKind.Utc).AddTicks(7621), new DateTime(2025, 12, 29, 17, 47, 29, 771, DateTimeKind.Utc).AddTicks(6648) });

            migrationBuilder.UpdateData(
                schema: "Media",
                table: "Videos",
                keyColumn: "Id",
                keyValue: new Guid("66666666-6666-6666-6666-666666666666"),
                columns: new[] { "CreatedAt", "PublishedAt" },
                values: new object[] { new DateTime(2026, 1, 1, 17, 47, 29, 771, DateTimeKind.Utc).AddTicks(7671), new DateTime(2026, 1, 3, 17, 47, 29, 771, DateTimeKind.Utc).AddTicks(7666) });

            migrationBuilder.UpdateData(
                schema: "Media",
                table: "Videos",
                keyColumn: "Id",
                keyValue: new Guid("77777777-7777-7777-7777-777777777777"),
                column: "CreatedAt",
                value: new DateTime(2026, 1, 6, 17, 47, 29, 771, DateTimeKind.Utc).AddTicks(7730));

            migrationBuilder.CreateIndex(
                name: "IX_Videos_IsPublic_Status_PublishedAt",
                schema: "Media",
                table: "Videos",
                columns: new[] { "IsPublic", "Status", "PublishedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_Videos_LikeCount",
                schema: "Media",
                table: "Videos",
                column: "LikeCount");

            migrationBuilder.CreateIndex(
                name: "IX_Videos_ViewCount_PublishedAt",
                schema: "Media",
                table: "Videos",
                columns: new[] { "ViewCount", "PublishedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_Podcasts_IsPublic_Status_PublishedAt",
                schema: "Media",
                table: "Podcasts",
                columns: new[] { "IsPublic", "Status", "PublishedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_Podcasts_LikeCount",
                schema: "Media",
                table: "Podcasts",
                column: "LikeCount");

            migrationBuilder.CreateIndex(
                name: "IX_Podcasts_PlayCount_PublishedAt",
                schema: "Media",
                table: "Podcasts",
                columns: new[] { "PlayCount", "PublishedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_Podcasts_SeriesId_EpisodeNumber",
                schema: "Media",
                table: "Podcasts",
                columns: new[] { "SeriesId", "EpisodeNumber" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Videos_IsPublic_Status_PublishedAt",
                schema: "Media",
                table: "Videos");

            migrationBuilder.DropIndex(
                name: "IX_Videos_LikeCount",
                schema: "Media",
                table: "Videos");

            migrationBuilder.DropIndex(
                name: "IX_Videos_ViewCount_PublishedAt",
                schema: "Media",
                table: "Videos");

            migrationBuilder.DropIndex(
                name: "IX_Podcasts_IsPublic_Status_PublishedAt",
                schema: "Media",
                table: "Podcasts");

            migrationBuilder.DropIndex(
                name: "IX_Podcasts_LikeCount",
                schema: "Media",
                table: "Podcasts");

            migrationBuilder.DropIndex(
                name: "IX_Podcasts_PlayCount_PublishedAt",
                schema: "Media",
                table: "Podcasts");

            migrationBuilder.DropIndex(
                name: "IX_Podcasts_SeriesId_EpisodeNumber",
                schema: "Media",
                table: "Podcasts");

            migrationBuilder.UpdateData(
                schema: "Media",
                table: "MediaAnalytics",
                keyColumn: "Id",
                keyValue: new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
                columns: new[] { "CreatedAt", "LastUpdated" },
                values: new object[] { new DateTime(2025, 12, 29, 17, 41, 23, 656, DateTimeKind.Utc).AddTicks(221), new DateTime(2026, 1, 8, 17, 41, 23, 655, DateTimeKind.Utc).AddTicks(9189) });

            migrationBuilder.UpdateData(
                schema: "Media",
                table: "MediaAnalytics",
                keyColumn: "Id",
                keyValue: new Guid("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"),
                columns: new[] { "CreatedAt", "LastUpdated" },
                values: new object[] { new DateTime(2026, 1, 3, 17, 41, 23, 656, DateTimeKind.Utc).AddTicks(520), new DateTime(2026, 1, 8, 17, 41, 23, 656, DateTimeKind.Utc).AddTicks(519) });

            migrationBuilder.UpdateData(
                schema: "Media",
                table: "MediaAnalytics",
                keyColumn: "Id",
                keyValue: new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"),
                columns: new[] { "CreatedAt", "LastUpdated" },
                values: new object[] { new DateTime(2025, 12, 31, 17, 41, 23, 656, DateTimeKind.Utc).AddTicks(571), new DateTime(2026, 1, 8, 17, 41, 23, 656, DateTimeKind.Utc).AddTicks(554) });

            migrationBuilder.UpdateData(
                schema: "Media",
                table: "PodcastSeries",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                column: "CreatedAt",
                value: new DateTime(2025, 12, 9, 17, 41, 23, 652, DateTimeKind.Utc).AddTicks(140));

            migrationBuilder.UpdateData(
                schema: "Media",
                table: "PodcastSeries",
                keyColumn: "Id",
                keyValue: new Guid("33333333-3333-3333-3333-333333333333"),
                column: "CreatedAt",
                value: new DateTime(2025, 12, 14, 17, 41, 23, 652, DateTimeKind.Utc).AddTicks(1975));

            migrationBuilder.UpdateData(
                schema: "Media",
                table: "Podcasts",
                keyColumn: "Id",
                keyValue: new Guid("88888888-8888-8888-8888-888888888888"),
                columns: new[] { "CreatedAt", "PublishedAt" },
                values: new object[] { new DateTime(2025, 12, 29, 17, 41, 23, 654, DateTimeKind.Utc).AddTicks(8933), new DateTime(2025, 12, 31, 17, 41, 23, 654, DateTimeKind.Utc).AddTicks(5826) });

            migrationBuilder.UpdateData(
                schema: "Media",
                table: "Podcasts",
                keyColumn: "Id",
                keyValue: new Guid("99999999-9999-9999-9999-999999999999"),
                columns: new[] { "CreatedAt", "PublishedAt" },
                values: new object[] { new DateTime(2025, 12, 31, 17, 41, 23, 654, DateTimeKind.Utc).AddTicks(9012), new DateTime(2026, 1, 2, 17, 41, 23, 654, DateTimeKind.Utc).AddTicks(9002) });

            migrationBuilder.UpdateData(
                schema: "Media",
                table: "Videos",
                keyColumn: "Id",
                keyValue: new Guid("55555555-5555-5555-5555-555555555555"),
                columns: new[] { "CreatedAt", "PublishedAt" },
                values: new object[] { new DateTime(2025, 12, 27, 17, 41, 23, 653, DateTimeKind.Utc).AddTicks(4352), new DateTime(2025, 12, 29, 17, 41, 23, 653, DateTimeKind.Utc).AddTicks(2370) });

            migrationBuilder.UpdateData(
                schema: "Media",
                table: "Videos",
                keyColumn: "Id",
                keyValue: new Guid("66666666-6666-6666-6666-666666666666"),
                columns: new[] { "CreatedAt", "PublishedAt" },
                values: new object[] { new DateTime(2026, 1, 1, 17, 41, 23, 653, DateTimeKind.Utc).AddTicks(4415), new DateTime(2026, 1, 3, 17, 41, 23, 653, DateTimeKind.Utc).AddTicks(4409) });

            migrationBuilder.UpdateData(
                schema: "Media",
                table: "Videos",
                keyColumn: "Id",
                keyValue: new Guid("77777777-7777-7777-7777-777777777777"),
                column: "CreatedAt",
                value: new DateTime(2026, 1, 6, 17, 41, 23, 653, DateTimeKind.Utc).AddTicks(4428));
        }
    }
}
