using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateMediaAnalyticsDecimalPrecision : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<decimal>(
                name: "AverageWatchTime",
                schema: "Media",
                table: "MediaAnalytics",
                type: "decimal(8,2)",
                nullable: false,
                defaultValue: 0m,
                oldClrType: typeof(decimal),
                oldType: "decimal(5,2)",
                oldDefaultValue: 0m);

            migrationBuilder.CreateTable(
                name: "PodcastSubscriptions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PodcastId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    UnsubscribedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DeletedBy = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PodcastSubscriptions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PodcastSubscriptions_Podcasts_PodcastId",
                        column: x => x.PodcastId,
                        principalSchema: "Media",
                        principalTable: "Podcasts",
                        principalColumn: "Id");
                });

            migrationBuilder.UpdateData(
                schema: "Media",
                table: "MediaAnalytics",
                keyColumn: "Id",
                keyValue: new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
                columns: new[] { "CreatedAt", "LastUpdated" },
                values: new object[] { new DateTime(2025, 12, 30, 3, 19, 39, 136, DateTimeKind.Utc).AddTicks(3084), new DateTime(2026, 1, 9, 3, 19, 39, 136, DateTimeKind.Utc).AddTicks(2314) });

            migrationBuilder.UpdateData(
                schema: "Media",
                table: "MediaAnalytics",
                keyColumn: "Id",
                keyValue: new Guid("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"),
                columns: new[] { "CreatedAt", "LastUpdated" },
                values: new object[] { new DateTime(2026, 1, 4, 3, 19, 39, 136, DateTimeKind.Utc).AddTicks(3175), new DateTime(2026, 1, 9, 3, 19, 39, 136, DateTimeKind.Utc).AddTicks(3173) });

            migrationBuilder.UpdateData(
                schema: "Media",
                table: "MediaAnalytics",
                keyColumn: "Id",
                keyValue: new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"),
                columns: new[] { "CreatedAt", "LastUpdated" },
                values: new object[] { new DateTime(2026, 1, 1, 3, 19, 39, 136, DateTimeKind.Utc).AddTicks(3224), new DateTime(2026, 1, 9, 3, 19, 39, 136, DateTimeKind.Utc).AddTicks(3197) });

            migrationBuilder.UpdateData(
                schema: "Media",
                table: "PodcastSeries",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                column: "CreatedAt",
                value: new DateTime(2025, 12, 10, 3, 19, 39, 123, DateTimeKind.Utc).AddTicks(7445));

            migrationBuilder.UpdateData(
                schema: "Media",
                table: "PodcastSeries",
                keyColumn: "Id",
                keyValue: new Guid("33333333-3333-3333-3333-333333333333"),
                column: "CreatedAt",
                value: new DateTime(2025, 12, 15, 3, 19, 39, 123, DateTimeKind.Utc).AddTicks(9594));

            migrationBuilder.UpdateData(
                schema: "Media",
                table: "Podcasts",
                keyColumn: "Id",
                keyValue: new Guid("88888888-8888-8888-8888-888888888888"),
                columns: new[] { "CreatedAt", "PublishedAt" },
                values: new object[] { new DateTime(2025, 12, 30, 3, 19, 39, 134, DateTimeKind.Utc).AddTicks(6586), new DateTime(2026, 1, 1, 3, 19, 39, 133, DateTimeKind.Utc).AddTicks(8062) });

            migrationBuilder.UpdateData(
                schema: "Media",
                table: "Podcasts",
                keyColumn: "Id",
                keyValue: new Guid("99999999-9999-9999-9999-999999999999"),
                columns: new[] { "CreatedAt", "PublishedAt" },
                values: new object[] { new DateTime(2026, 1, 1, 3, 19, 39, 134, DateTimeKind.Utc).AddTicks(6708), new DateTime(2026, 1, 3, 3, 19, 39, 134, DateTimeKind.Utc).AddTicks(6695) });

            migrationBuilder.UpdateData(
                schema: "Media",
                table: "Videos",
                keyColumn: "Id",
                keyValue: new Guid("55555555-5555-5555-5555-555555555555"),
                columns: new[] { "CreatedAt", "PublishedAt" },
                values: new object[] { new DateTime(2025, 12, 28, 3, 19, 39, 125, DateTimeKind.Utc).AddTicks(8272), new DateTime(2025, 12, 30, 3, 19, 39, 125, DateTimeKind.Utc).AddTicks(6537) });

            migrationBuilder.UpdateData(
                schema: "Media",
                table: "Videos",
                keyColumn: "Id",
                keyValue: new Guid("66666666-6666-6666-6666-666666666666"),
                columns: new[] { "CreatedAt", "PublishedAt" },
                values: new object[] { new DateTime(2026, 1, 2, 3, 19, 39, 125, DateTimeKind.Utc).AddTicks(8354), new DateTime(2026, 1, 4, 3, 19, 39, 125, DateTimeKind.Utc).AddTicks(8346) });

            migrationBuilder.UpdateData(
                schema: "Media",
                table: "Videos",
                keyColumn: "Id",
                keyValue: new Guid("77777777-7777-7777-7777-777777777777"),
                column: "CreatedAt",
                value: new DateTime(2026, 1, 7, 3, 19, 39, 125, DateTimeKind.Utc).AddTicks(8375));

            migrationBuilder.CreateIndex(
                name: "IX_PodcastSubscriptions_PodcastId",
                table: "PodcastSubscriptions",
                column: "PodcastId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PodcastSubscriptions");

            migrationBuilder.AlterColumn<decimal>(
                name: "AverageWatchTime",
                schema: "Media",
                table: "MediaAnalytics",
                type: "decimal(5,2)",
                nullable: false,
                defaultValue: 0m,
                oldClrType: typeof(decimal),
                oldType: "decimal(8,2)",
                oldDefaultValue: 0m);

            migrationBuilder.UpdateData(
                schema: "Media",
                table: "MediaAnalytics",
                keyColumn: "Id",
                keyValue: new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
                columns: new[] { "CreatedAt", "LastUpdated" },
                values: new object[] { new DateTime(2025, 12, 29, 20, 8, 35, 415, DateTimeKind.Utc).AddTicks(4502), new DateTime(2026, 1, 8, 20, 8, 35, 415, DateTimeKind.Utc).AddTicks(3830) });

            migrationBuilder.UpdateData(
                schema: "Media",
                table: "MediaAnalytics",
                keyColumn: "Id",
                keyValue: new Guid("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"),
                columns: new[] { "CreatedAt", "LastUpdated" },
                values: new object[] { new DateTime(2026, 1, 3, 20, 8, 35, 415, DateTimeKind.Utc).AddTicks(4558), new DateTime(2026, 1, 8, 20, 8, 35, 415, DateTimeKind.Utc).AddTicks(4557) });

            migrationBuilder.UpdateData(
                schema: "Media",
                table: "MediaAnalytics",
                keyColumn: "Id",
                keyValue: new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"),
                columns: new[] { "CreatedAt", "LastUpdated" },
                values: new object[] { new DateTime(2025, 12, 31, 20, 8, 35, 415, DateTimeKind.Utc).AddTicks(4592), new DateTime(2026, 1, 8, 20, 8, 35, 415, DateTimeKind.Utc).AddTicks(4579) });

            migrationBuilder.UpdateData(
                schema: "Media",
                table: "PodcastSeries",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                column: "CreatedAt",
                value: new DateTime(2025, 12, 9, 20, 8, 35, 410, DateTimeKind.Utc).AddTicks(4475));

            migrationBuilder.UpdateData(
                schema: "Media",
                table: "PodcastSeries",
                keyColumn: "Id",
                keyValue: new Guid("33333333-3333-3333-3333-333333333333"),
                column: "CreatedAt",
                value: new DateTime(2025, 12, 14, 20, 8, 35, 410, DateTimeKind.Utc).AddTicks(6077));

            migrationBuilder.UpdateData(
                schema: "Media",
                table: "Podcasts",
                keyColumn: "Id",
                keyValue: new Guid("88888888-8888-8888-8888-888888888888"),
                columns: new[] { "CreatedAt", "PublishedAt" },
                values: new object[] { new DateTime(2025, 12, 29, 20, 8, 35, 414, DateTimeKind.Utc).AddTicks(2420), new DateTime(2025, 12, 31, 20, 8, 35, 413, DateTimeKind.Utc).AddTicks(7174) });

            migrationBuilder.UpdateData(
                schema: "Media",
                table: "Podcasts",
                keyColumn: "Id",
                keyValue: new Guid("99999999-9999-9999-9999-999999999999"),
                columns: new[] { "CreatedAt", "PublishedAt" },
                values: new object[] { new DateTime(2025, 12, 31, 20, 8, 35, 414, DateTimeKind.Utc).AddTicks(2490), new DateTime(2026, 1, 2, 20, 8, 35, 414, DateTimeKind.Utc).AddTicks(2475) });

            migrationBuilder.UpdateData(
                schema: "Media",
                table: "Videos",
                keyColumn: "Id",
                keyValue: new Guid("55555555-5555-5555-5555-555555555555"),
                columns: new[] { "CreatedAt", "PublishedAt" },
                values: new object[] { new DateTime(2025, 12, 27, 20, 8, 35, 412, DateTimeKind.Utc).AddTicks(4409), new DateTime(2025, 12, 29, 20, 8, 35, 412, DateTimeKind.Utc).AddTicks(1835) });

            migrationBuilder.UpdateData(
                schema: "Media",
                table: "Videos",
                keyColumn: "Id",
                keyValue: new Guid("66666666-6666-6666-6666-666666666666"),
                columns: new[] { "CreatedAt", "PublishedAt" },
                values: new object[] { new DateTime(2026, 1, 1, 20, 8, 35, 412, DateTimeKind.Utc).AddTicks(4564), new DateTime(2026, 1, 3, 20, 8, 35, 412, DateTimeKind.Utc).AddTicks(4555) });

            migrationBuilder.UpdateData(
                schema: "Media",
                table: "Videos",
                keyColumn: "Id",
                keyValue: new Guid("77777777-7777-7777-7777-777777777777"),
                column: "CreatedAt",
                value: new DateTime(2026, 1, 6, 20, 8, 35, 412, DateTimeKind.Utc).AddTicks(4584));
        }
    }
}
