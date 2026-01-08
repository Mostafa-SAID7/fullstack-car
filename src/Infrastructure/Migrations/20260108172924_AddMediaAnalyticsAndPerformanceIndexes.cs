using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddMediaAnalyticsAndPerformanceIndexes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Campaigns",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    Type = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Budget = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    SpentAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    TargetAudience = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    Tags = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Impressions = table.Column<long>(type: "bigint", nullable: false),
                    Reach = table.Column<long>(type: "bigint", nullable: false),
                    Engagement = table.Column<long>(type: "bigint", nullable: false),
                    Clicks = table.Column<long>(type: "bigint", nullable: false),
                    EngagementRate = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    ClickThroughRate = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
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
                    table.PrimaryKey("PK_Campaigns", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "MarketingOverviews",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    TotalImpressions = table.Column<long>(type: "bigint", nullable: false),
                    TotalReach = table.Column<long>(type: "bigint", nullable: false),
                    TotalEngagement = table.Column<long>(type: "bigint", nullable: false),
                    TotalClicks = table.Column<long>(type: "bigint", nullable: false),
                    TotalFollowers = table.Column<long>(type: "bigint", nullable: false),
                    NewFollowers = table.Column<long>(type: "bigint", nullable: false),
                    ActiveCampaigns = table.Column<int>(type: "int", nullable: false),
                    ScheduledCampaigns = table.Column<int>(type: "int", nullable: false),
                    CompletedCampaigns = table.Column<int>(type: "int", nullable: false),
                    PublishedContent = table.Column<int>(type: "int", nullable: false),
                    ScheduledContent = table.Column<int>(type: "int", nullable: false),
                    DraftContent = table.Column<int>(type: "int", nullable: false),
                    TotalBudget = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    TotalSpent = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    AverageCostPerClick = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    AverageEngagementRate = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
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
                    table.PrimaryKey("PK_MarketingOverviews", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "MediaAnalytics",
                schema: "Media",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    MediaId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    MediaType = table.Column<int>(type: "int", nullable: false),
                    ViewsToday = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    ViewsWeek = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    ViewsMonth = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    ViewsTotal = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    LikesCount = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    DislikesCount = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    CommentsCount = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    SharesCount = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    AverageWatchTime = table.Column<decimal>(type: "decimal(5,2)", nullable: false, defaultValue: 0m),
                    CompletionRate = table.Column<decimal>(type: "decimal(5,2)", nullable: false, defaultValue: 0m),
                    TopCountries = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: true),
                    TopDevices = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: true),
                    TopReferrers = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: true),
                    LastUpdated = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
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
                    table.PrimaryKey("PK_MediaAnalytics", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SocialPlatforms",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    DisplayName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    IconUrl = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    ApiEndpoint = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    Settings = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TotalFollowers = table.Column<long>(type: "bigint", nullable: false),
                    TotalPosts = table.Column<long>(type: "bigint", nullable: false),
                    AverageEngagementRate = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
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
                    table.PrimaryKey("PK_SocialPlatforms", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CampaignAnalytics",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CampaignId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Impressions = table.Column<long>(type: "bigint", nullable: false),
                    Reach = table.Column<long>(type: "bigint", nullable: false),
                    Engagement = table.Column<long>(type: "bigint", nullable: false),
                    Clicks = table.Column<long>(type: "bigint", nullable: false),
                    Conversions = table.Column<long>(type: "bigint", nullable: false),
                    EngagementRate = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    ClickThroughRate = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    ConversionRate = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    CostPerClick = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    CostPerConversion = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    AmountSpent = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
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
                    table.PrimaryKey("PK_CampaignAnalytics", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CampaignAnalytics_Campaigns_CampaignId",
                        column: x => x.CampaignId,
                        principalTable: "Campaigns",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "CampaignContents",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CampaignId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Type = table.Column<int>(type: "int", nullable: false),
                    MediaUrl = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    ThumbnailUrl = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    ScheduledDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    PublishedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Status = table.Column<int>(type: "int", nullable: false),
                    Author = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Tags = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Views = table.Column<long>(type: "bigint", nullable: false),
                    Likes = table.Column<long>(type: "bigint", nullable: false),
                    Shares = table.Column<long>(type: "bigint", nullable: false),
                    Comments = table.Column<long>(type: "bigint", nullable: false),
                    Clicks = table.Column<long>(type: "bigint", nullable: false),
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
                    table.PrimaryKey("PK_CampaignContents", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CampaignContents_Campaigns_CampaignId",
                        column: x => x.CampaignId,
                        principalTable: "Campaigns",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "CampaignPlatforms",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CampaignId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PlatformId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    Budget = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    SpentAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Impressions = table.Column<long>(type: "bigint", nullable: false),
                    Reach = table.Column<long>(type: "bigint", nullable: false),
                    Engagement = table.Column<long>(type: "bigint", nullable: false),
                    Clicks = table.Column<long>(type: "bigint", nullable: false),
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
                    table.PrimaryKey("PK_CampaignPlatforms", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CampaignPlatforms_Campaigns_CampaignId",
                        column: x => x.CampaignId,
                        principalTable: "Campaigns",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_CampaignPlatforms_SocialPlatforms_PlatformId",
                        column: x => x.PlatformId,
                        principalTable: "SocialPlatforms",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "PlatformAnalytics",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PlatformId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Followers = table.Column<long>(type: "bigint", nullable: false),
                    NewFollowers = table.Column<long>(type: "bigint", nullable: false),
                    UnfollowersCount = table.Column<long>(type: "bigint", nullable: false),
                    PostsCount = table.Column<long>(type: "bigint", nullable: false),
                    TotalImpressions = table.Column<long>(type: "bigint", nullable: false),
                    TotalReach = table.Column<long>(type: "bigint", nullable: false),
                    TotalEngagement = table.Column<long>(type: "bigint", nullable: false),
                    TotalClicks = table.Column<long>(type: "bigint", nullable: false),
                    Likes = table.Column<long>(type: "bigint", nullable: false),
                    Comments = table.Column<long>(type: "bigint", nullable: false),
                    Shares = table.Column<long>(type: "bigint", nullable: false),
                    Saves = table.Column<long>(type: "bigint", nullable: false),
                    EngagementRate = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    ReachRate = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    GrowthRate = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
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
                    table.PrimaryKey("PK_PlatformAnalytics", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PlatformAnalytics_SocialPlatforms_PlatformId",
                        column: x => x.PlatformId,
                        principalTable: "SocialPlatforms",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "ContentPlatforms",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ContentId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PlatformId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PlatformPostId = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    PlatformUrl = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    PublishedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Status = table.Column<int>(type: "int", nullable: false),
                    Views = table.Column<long>(type: "bigint", nullable: false),
                    Likes = table.Column<long>(type: "bigint", nullable: false),
                    Shares = table.Column<long>(type: "bigint", nullable: false),
                    Comments = table.Column<long>(type: "bigint", nullable: false),
                    Clicks = table.Column<long>(type: "bigint", nullable: false),
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
                    table.PrimaryKey("PK_ContentPlatforms", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ContentPlatforms_CampaignContents_ContentId",
                        column: x => x.ContentId,
                        principalTable: "CampaignContents",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ContentPlatforms_SocialPlatforms_PlatformId",
                        column: x => x.PlatformId,
                        principalTable: "SocialPlatforms",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_CampaignAnalytics_CampaignId",
                table: "CampaignAnalytics",
                column: "CampaignId");

            migrationBuilder.CreateIndex(
                name: "IX_CampaignContents_CampaignId",
                table: "CampaignContents",
                column: "CampaignId");

            migrationBuilder.CreateIndex(
                name: "IX_CampaignPlatforms_CampaignId",
                table: "CampaignPlatforms",
                column: "CampaignId");

            migrationBuilder.CreateIndex(
                name: "IX_CampaignPlatforms_PlatformId",
                table: "CampaignPlatforms",
                column: "PlatformId");

            migrationBuilder.CreateIndex(
                name: "IX_ContentPlatforms_ContentId",
                table: "ContentPlatforms",
                column: "ContentId");

            migrationBuilder.CreateIndex(
                name: "IX_ContentPlatforms_PlatformId",
                table: "ContentPlatforms",
                column: "PlatformId");

            migrationBuilder.CreateIndex(
                name: "IX_MediaAnalytics_LastUpdated",
                schema: "Media",
                table: "MediaAnalytics",
                column: "LastUpdated");

            migrationBuilder.CreateIndex(
                name: "IX_MediaAnalytics_MediaId_MediaType",
                schema: "Media",
                table: "MediaAnalytics",
                columns: new[] { "MediaId", "MediaType" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_MediaAnalytics_MediaType",
                schema: "Media",
                table: "MediaAnalytics",
                column: "MediaType");

            migrationBuilder.CreateIndex(
                name: "IX_MediaAnalytics_ViewsTotal",
                schema: "Media",
                table: "MediaAnalytics",
                column: "ViewsTotal");

            migrationBuilder.CreateIndex(
                name: "IX_PlatformAnalytics_PlatformId",
                table: "PlatformAnalytics",
                column: "PlatformId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CampaignAnalytics");

            migrationBuilder.DropTable(
                name: "CampaignPlatforms");

            migrationBuilder.DropTable(
                name: "ContentPlatforms");

            migrationBuilder.DropTable(
                name: "MarketingOverviews");

            migrationBuilder.DropTable(
                name: "MediaAnalytics",
                schema: "Media");

            migrationBuilder.DropTable(
                name: "PlatformAnalytics");

            migrationBuilder.DropTable(
                name: "CampaignContents");

            migrationBuilder.DropTable(
                name: "SocialPlatforms");

            migrationBuilder.DropTable(
                name: "Campaigns");
        }
    }
}
