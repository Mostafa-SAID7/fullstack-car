using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class QASystemTablesCreated : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // QA System tables were created manually via SQL script
            // This migration just updates the model snapshot to reflect the changes
            // No database changes are needed as tables already exist
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Drop QA System tables if needed
            migrationBuilder.DropTable(name: "QAAnalytics");
            migrationBuilder.DropTable(name: "QACategories");
            migrationBuilder.DropTable(name: "QAExperts");
            migrationBuilder.DropTable(name: "QATags");
            migrationBuilder.DropTable(name: "QAUserActivities");
            migrationBuilder.DropTable(name: "QAVotes");
            migrationBuilder.DropTable(name: "UserReputations");
        }
    }
}