using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddPostReportResolutionFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserFriends_Users_FriendId",
                table: "UserFriends");

            migrationBuilder.DropForeignKey(
                name: "FK_UserFriends_Users_UserId",
                table: "UserFriends");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserFriends",
                table: "UserFriends");

            migrationBuilder.RenameTable(
                name: "UserFriends",
                newName: "UserFriend");

            migrationBuilder.RenameIndex(
                name: "IX_UserFriends_UserId_FriendId",
                table: "UserFriend",
                newName: "IX_UserFriend_UserId_FriendId");

            migrationBuilder.RenameIndex(
                name: "IX_UserFriends_FriendId",
                table: "UserFriend",
                newName: "IX_UserFriend_FriendId");

            migrationBuilder.AddColumn<bool>(
                name: "IsResolved",
                table: "PostReports",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "Resolution",
                table: "PostReports",
                type: "nvarchar(1000)",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ResolvedAt",
                table: "PostReports",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "ResolvedBy",
                table: "PostReports",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserFriend",
                table: "UserFriend",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "SecurityLogs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    EventType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IpAddress = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UserAgent = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Timestamp = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsSuccessful = table.Column<bool>(type: "bit", nullable: false),
                    AdditionalData = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SecurityLogs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SecurityLogs_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PostReports_IsResolved",
                table: "PostReports",
                column: "IsResolved");

            migrationBuilder.CreateIndex(
                name: "IX_PostReports_ResolvedBy",
                table: "PostReports",
                column: "ResolvedBy");

            migrationBuilder.CreateIndex(
                name: "IX_SecurityLogs_UserId",
                table: "SecurityLogs",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_PostReports_Users_ResolvedBy",
                table: "PostReports",
                column: "ResolvedBy",
                principalTable: "Users",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_UserFriend_Users_FriendId",
                table: "UserFriend",
                column: "FriendId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_UserFriend_Users_UserId",
                table: "UserFriend",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PostReports_Users_ResolvedBy",
                table: "PostReports");

            migrationBuilder.DropForeignKey(
                name: "FK_UserFriend_Users_FriendId",
                table: "UserFriend");

            migrationBuilder.DropForeignKey(
                name: "FK_UserFriend_Users_UserId",
                table: "UserFriend");

            migrationBuilder.DropTable(
                name: "SecurityLogs");

            migrationBuilder.DropIndex(
                name: "IX_PostReports_IsResolved",
                table: "PostReports");

            migrationBuilder.DropIndex(
                name: "IX_PostReports_ResolvedBy",
                table: "PostReports");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserFriend",
                table: "UserFriend");

            migrationBuilder.DropColumn(
                name: "IsResolved",
                table: "PostReports");

            migrationBuilder.DropColumn(
                name: "Resolution",
                table: "PostReports");

            migrationBuilder.DropColumn(
                name: "ResolvedAt",
                table: "PostReports");

            migrationBuilder.DropColumn(
                name: "ResolvedBy",
                table: "PostReports");

            migrationBuilder.RenameTable(
                name: "UserFriend",
                newName: "UserFriends");

            migrationBuilder.RenameIndex(
                name: "IX_UserFriend_UserId_FriendId",
                table: "UserFriends",
                newName: "IX_UserFriends_UserId_FriendId");

            migrationBuilder.RenameIndex(
                name: "IX_UserFriend_FriendId",
                table: "UserFriends",
                newName: "IX_UserFriends_FriendId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserFriends",
                table: "UserFriends",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_UserFriends_Users_FriendId",
                table: "UserFriends",
                column: "FriendId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_UserFriends_Users_UserId",
                table: "UserFriends",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
