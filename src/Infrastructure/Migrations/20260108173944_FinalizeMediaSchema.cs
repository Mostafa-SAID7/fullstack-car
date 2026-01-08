using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class FinalizeMediaSchema : Migration
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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                schema: "Media",
                table: "MediaAnalytics",
                keyColumn: "Id",
                keyValue: new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
                columns: new[] { "CreatedAt", "LastUpdated" },
                values: new object[] { new DateTime(2025, 12, 29, 17, 37, 16, 918, DateTimeKind.Utc).AddTicks(5393), new DateTime(2026, 1, 8, 17, 37, 16, 918, DateTimeKind.Utc).AddTicks(4571) });

            migrationBuilder.UpdateData(
                schema: "Media",
                table: "MediaAnalytics",
                keyColumn: "Id",
                keyValue: new Guid("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"),
                columns: new[] { "CreatedAt", "LastUpdated" },
                values: new object[] { new DateTime(2026, 1, 3, 17, 37, 16, 918, DateTimeKind.Utc).AddTicks(5467), new DateTime(2026, 1, 8, 17, 37, 16, 918, DateTimeKind.Utc).AddTicks(5466) });

            migrationBuilder.UpdateData(
                schema: "Media",
                table: "MediaAnalytics",
                keyColumn: "Id",
                keyValue: new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"),
                columns: new[] { "CreatedAt", "LastUpdated" },
                values: new object[] { new DateTime(2025, 12, 31, 17, 37, 16, 918, DateTimeKind.Utc).AddTicks(5516), new DateTime(2026, 1, 8, 17, 37, 16, 918, DateTimeKind.Utc).AddTicks(5506) });

            migrationBuilder.UpdateData(
                schema: "Media",
                table: "PodcastSeries",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                column: "CreatedAt",
                value: new DateTime(2025, 12, 9, 17, 37, 16, 912, DateTimeKind.Utc).AddTicks(8403));

            migrationBuilder.UpdateData(
                schema: "Media",
                table: "PodcastSeries",
                keyColumn: "Id",
                keyValue: new Guid("33333333-3333-3333-3333-333333333333"),
                column: "CreatedAt",
                value: new DateTime(2025, 12, 14, 17, 37, 16, 913, DateTimeKind.Utc).AddTicks(1034));

            migrationBuilder.UpdateData(
                schema: "Media",
                table: "Podcasts",
                keyColumn: "Id",
                keyValue: new Guid("88888888-8888-8888-8888-888888888888"),
                columns: new[] { "CreatedAt", "PublishedAt" },
                values: new object[] { new DateTime(2025, 12, 29, 17, 37, 16, 917, DateTimeKind.Utc).AddTicks(2227), new DateTime(2025, 12, 31, 17, 37, 16, 916, DateTimeKind.Utc).AddTicks(4497) });

            migrationBuilder.UpdateData(
                schema: "Media",
                table: "Podcasts",
                keyColumn: "Id",
                keyValue: new Guid("99999999-9999-9999-9999-999999999999"),
                columns: new[] { "CreatedAt", "PublishedAt" },
                values: new object[] { new DateTime(2025, 12, 31, 17, 37, 16, 917, DateTimeKind.Utc).AddTicks(2303), new DateTime(2026, 1, 2, 17, 37, 16, 917, DateTimeKind.Utc).AddTicks(2293) });

            migrationBuilder.UpdateData(
                schema: "Media",
                table: "Videos",
                keyColumn: "Id",
                keyValue: new Guid("55555555-5555-5555-5555-555555555555"),
                columns: new[] { "CreatedAt", "PublishedAt" },
                values: new object[] { new DateTime(2025, 12, 27, 17, 37, 16, 915, DateTimeKind.Utc).AddTicks(1254), new DateTime(2025, 12, 29, 17, 37, 16, 914, DateTimeKind.Utc).AddTicks(7830) });

            migrationBuilder.UpdateData(
                schema: "Media",
                table: "Videos",
                keyColumn: "Id",
                keyValue: new Guid("66666666-6666-6666-6666-666666666666"),
                columns: new[] { "CreatedAt", "PublishedAt" },
                values: new object[] { new DateTime(2026, 1, 1, 17, 37, 16, 915, DateTimeKind.Utc).AddTicks(1343), new DateTime(2026, 1, 3, 17, 37, 16, 915, DateTimeKind.Utc).AddTicks(1337) });

            migrationBuilder.UpdateData(
                schema: "Media",
                table: "Videos",
                keyColumn: "Id",
                keyValue: new Guid("77777777-7777-7777-7777-777777777777"),
                column: "CreatedAt",
                value: new DateTime(2026, 1, 6, 17, 37, 16, 915, DateTimeKind.Utc).AddTicks(1367));
        }
    }
}
