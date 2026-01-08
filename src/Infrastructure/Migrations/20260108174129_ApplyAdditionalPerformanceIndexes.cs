using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class ApplyAdditionalPerformanceIndexes : Migration
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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                schema: "Media",
                table: "MediaAnalytics",
                keyColumn: "Id",
                keyValue: new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
                columns: new[] { "CreatedAt", "LastUpdated" },
                values: new object[] { new DateTime(2025, 12, 29, 17, 39, 37, 1, DateTimeKind.Utc).AddTicks(1983), new DateTime(2026, 1, 8, 17, 39, 37, 1, DateTimeKind.Utc).AddTicks(515) });

            migrationBuilder.UpdateData(
                schema: "Media",
                table: "MediaAnalytics",
                keyColumn: "Id",
                keyValue: new Guid("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"),
                columns: new[] { "CreatedAt", "LastUpdated" },
                values: new object[] { new DateTime(2026, 1, 3, 17, 39, 37, 1, DateTimeKind.Utc).AddTicks(2106), new DateTime(2026, 1, 8, 17, 39, 37, 1, DateTimeKind.Utc).AddTicks(2105) });

            migrationBuilder.UpdateData(
                schema: "Media",
                table: "MediaAnalytics",
                keyColumn: "Id",
                keyValue: new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"),
                columns: new[] { "CreatedAt", "LastUpdated" },
                values: new object[] { new DateTime(2025, 12, 31, 17, 39, 37, 1, DateTimeKind.Utc).AddTicks(2142), new DateTime(2026, 1, 8, 17, 39, 37, 1, DateTimeKind.Utc).AddTicks(2127) });

            migrationBuilder.UpdateData(
                schema: "Media",
                table: "PodcastSeries",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                column: "CreatedAt",
                value: new DateTime(2025, 12, 9, 17, 39, 36, 992, DateTimeKind.Utc).AddTicks(2394));

            migrationBuilder.UpdateData(
                schema: "Media",
                table: "PodcastSeries",
                keyColumn: "Id",
                keyValue: new Guid("33333333-3333-3333-3333-333333333333"),
                column: "CreatedAt",
                value: new DateTime(2025, 12, 14, 17, 39, 36, 992, DateTimeKind.Utc).AddTicks(4317));

            migrationBuilder.UpdateData(
                schema: "Media",
                table: "Podcasts",
                keyColumn: "Id",
                keyValue: new Guid("88888888-8888-8888-8888-888888888888"),
                columns: new[] { "CreatedAt", "PublishedAt" },
                values: new object[] { new DateTime(2025, 12, 29, 17, 39, 36, 999, DateTimeKind.Utc).AddTicks(3444), new DateTime(2025, 12, 31, 17, 39, 36, 998, DateTimeKind.Utc).AddTicks(6892) });

            migrationBuilder.UpdateData(
                schema: "Media",
                table: "Podcasts",
                keyColumn: "Id",
                keyValue: new Guid("99999999-9999-9999-9999-999999999999"),
                columns: new[] { "CreatedAt", "PublishedAt" },
                values: new object[] { new DateTime(2025, 12, 31, 17, 39, 36, 999, DateTimeKind.Utc).AddTicks(3547), new DateTime(2026, 1, 2, 17, 39, 36, 999, DateTimeKind.Utc).AddTicks(3535) });

            migrationBuilder.UpdateData(
                schema: "Media",
                table: "Videos",
                keyColumn: "Id",
                keyValue: new Guid("55555555-5555-5555-5555-555555555555"),
                columns: new[] { "CreatedAt", "PublishedAt" },
                values: new object[] { new DateTime(2025, 12, 27, 17, 39, 36, 997, DateTimeKind.Utc).AddTicks(2134), new DateTime(2025, 12, 29, 17, 39, 36, 996, DateTimeKind.Utc).AddTicks(9916) });

            migrationBuilder.UpdateData(
                schema: "Media",
                table: "Videos",
                keyColumn: "Id",
                keyValue: new Guid("66666666-6666-6666-6666-666666666666"),
                columns: new[] { "CreatedAt", "PublishedAt" },
                values: new object[] { new DateTime(2026, 1, 1, 17, 39, 36, 997, DateTimeKind.Utc).AddTicks(2249), new DateTime(2026, 1, 3, 17, 39, 36, 997, DateTimeKind.Utc).AddTicks(2243) });

            migrationBuilder.UpdateData(
                schema: "Media",
                table: "Videos",
                keyColumn: "Id",
                keyValue: new Guid("77777777-7777-7777-7777-777777777777"),
                column: "CreatedAt",
                value: new DateTime(2026, 1, 6, 17, 39, 36, 997, DateTimeKind.Utc).AddTicks(2271));
        }
    }
}
