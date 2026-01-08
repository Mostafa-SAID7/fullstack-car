using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class FinalMediaSchemaUpdate : Migration
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
                values: new object[] { new DateTime(2025, 12, 29, 17, 50, 14, 792, DateTimeKind.Utc).AddTicks(1858), new DateTime(2026, 1, 8, 17, 50, 14, 792, DateTimeKind.Utc).AddTicks(1378) });

            migrationBuilder.UpdateData(
                schema: "Media",
                table: "MediaAnalytics",
                keyColumn: "Id",
                keyValue: new Guid("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"),
                columns: new[] { "CreatedAt", "LastUpdated" },
                values: new object[] { new DateTime(2026, 1, 3, 17, 50, 14, 792, DateTimeKind.Utc).AddTicks(1923), new DateTime(2026, 1, 8, 17, 50, 14, 792, DateTimeKind.Utc).AddTicks(1922) });

            migrationBuilder.UpdateData(
                schema: "Media",
                table: "MediaAnalytics",
                keyColumn: "Id",
                keyValue: new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"),
                columns: new[] { "CreatedAt", "LastUpdated" },
                values: new object[] { new DateTime(2025, 12, 31, 17, 50, 14, 792, DateTimeKind.Utc).AddTicks(1948), new DateTime(2026, 1, 8, 17, 50, 14, 792, DateTimeKind.Utc).AddTicks(1937) });

            migrationBuilder.UpdateData(
                schema: "Media",
                table: "PodcastSeries",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                column: "CreatedAt",
                value: new DateTime(2025, 12, 9, 17, 50, 14, 786, DateTimeKind.Utc).AddTicks(5048));

            migrationBuilder.UpdateData(
                schema: "Media",
                table: "PodcastSeries",
                keyColumn: "Id",
                keyValue: new Guid("33333333-3333-3333-3333-333333333333"),
                column: "CreatedAt",
                value: new DateTime(2025, 12, 14, 17, 50, 14, 786, DateTimeKind.Utc).AddTicks(6437));

            migrationBuilder.UpdateData(
                schema: "Media",
                table: "Podcasts",
                keyColumn: "Id",
                keyValue: new Guid("88888888-8888-8888-8888-888888888888"),
                columns: new[] { "CreatedAt", "PublishedAt" },
                values: new object[] { new DateTime(2025, 12, 29, 17, 50, 14, 791, DateTimeKind.Utc).AddTicks(1454), new DateTime(2025, 12, 31, 17, 50, 14, 790, DateTimeKind.Utc).AddTicks(5764) });

            migrationBuilder.UpdateData(
                schema: "Media",
                table: "Podcasts",
                keyColumn: "Id",
                keyValue: new Guid("99999999-9999-9999-9999-999999999999"),
                columns: new[] { "CreatedAt", "PublishedAt" },
                values: new object[] { new DateTime(2025, 12, 31, 17, 50, 14, 791, DateTimeKind.Utc).AddTicks(1529), new DateTime(2026, 1, 2, 17, 50, 14, 791, DateTimeKind.Utc).AddTicks(1521) });

            migrationBuilder.UpdateData(
                schema: "Media",
                table: "Videos",
                keyColumn: "Id",
                keyValue: new Guid("55555555-5555-5555-5555-555555555555"),
                columns: new[] { "CreatedAt", "PublishedAt" },
                values: new object[] { new DateTime(2025, 12, 27, 17, 50, 14, 788, DateTimeKind.Utc).AddTicks(8209), new DateTime(2025, 12, 29, 17, 50, 14, 788, DateTimeKind.Utc).AddTicks(6613) });

            migrationBuilder.UpdateData(
                schema: "Media",
                table: "Videos",
                keyColumn: "Id",
                keyValue: new Guid("66666666-6666-6666-6666-666666666666"),
                columns: new[] { "CreatedAt", "PublishedAt" },
                values: new object[] { new DateTime(2026, 1, 1, 17, 50, 14, 788, DateTimeKind.Utc).AddTicks(8273), new DateTime(2026, 1, 3, 17, 50, 14, 788, DateTimeKind.Utc).AddTicks(8269) });

            migrationBuilder.UpdateData(
                schema: "Media",
                table: "Videos",
                keyColumn: "Id",
                keyValue: new Guid("77777777-7777-7777-7777-777777777777"),
                column: "CreatedAt",
                value: new DateTime(2026, 1, 6, 17, 50, 14, 788, DateTimeKind.Utc).AddTicks(8287));
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
        }
    }
}
