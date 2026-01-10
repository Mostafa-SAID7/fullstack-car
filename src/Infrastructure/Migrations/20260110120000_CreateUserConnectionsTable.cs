using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class CreateUserConnectionsTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "UserConnections",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    RequesterId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ReceiverId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ConnectionType = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Status = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    AcceptedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserConnections", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserConnections_AspNetUsers_ReceiverId",
                        column: x => x.ReceiverId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_UserConnections_AspNetUsers_RequesterId",
                        column: x => x.RequesterId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.CheckConstraint("CK_UserConnection_NoSelfConnection", "[RequesterId] != [ReceiverId]");
                });

            // Create performance indexes
            migrationBuilder.CreateIndex(
                name: "IX_UserConnections_RequesterId_ReceiverId_ConnectionType",
                table: "UserConnections",
                columns: new[] { "RequesterId", "ReceiverId", "ConnectionType" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserConnections_ReceiverId_Status",
                table: "UserConnections",
                columns: new[] { "ReceiverId", "Status" });

            migrationBuilder.CreateIndex(
                name: "IX_UserConnections_RequesterId_Status",
                table: "UserConnections",
                columns: new[] { "RequesterId", "Status" });

            migrationBuilder.CreateIndex(
                name: "IX_UserConnections_ConnectionType_Status",
                table: "UserConnections",
                columns: new[] { "ConnectionType", "Status" });

            migrationBuilder.CreateIndex(
                name: "IX_UserConnections_CreatedAt",
                table: "UserConnections",
                column: "CreatedAt");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserConnections");
        }
    }
}