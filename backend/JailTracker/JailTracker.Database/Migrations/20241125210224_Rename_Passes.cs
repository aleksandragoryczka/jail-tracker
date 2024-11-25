using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JailTracker.Database.Migrations
{
    /// <inheritdoc />
    public partial class Rename_Passes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Requests_Users_PassSupervisorId",
                table: "Requests");

            migrationBuilder.DropForeignKey(
                name: "FK_Users_Users_CurrentPassesSupervisorId",
                table: "Users");

            migrationBuilder.RenameColumn(
                name: "CurrentPassesSupervisorId",
                table: "Users",
                newName: "CurrentRequestsSupervisorId");

            migrationBuilder.RenameIndex(
                name: "IX_Users_CurrentPassesSupervisorId",
                table: "Users",
                newName: "IX_Users_CurrentRequestsSupervisorId");

            migrationBuilder.RenameColumn(
                name: "PassSupervisorId",
                table: "Requests",
                newName: "RequestSupervisorId");

            migrationBuilder.RenameIndex(
                name: "IX_Requests_PassSupervisorId",
                table: "Requests",
                newName: "IX_Requests_RequestSupervisorId");

            migrationBuilder.AddForeignKey(
                name: "FK_Requests_Users_RequestSupervisorId",
                table: "Requests",
                column: "RequestSupervisorId",
                principalTable: "Users",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Users_CurrentRequestsSupervisorId",
                table: "Users",
                column: "CurrentRequestsSupervisorId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Requests_Users_RequestSupervisorId",
                table: "Requests");

            migrationBuilder.DropForeignKey(
                name: "FK_Users_Users_CurrentRequestsSupervisorId",
                table: "Users");

            migrationBuilder.RenameColumn(
                name: "CurrentRequestsSupervisorId",
                table: "Users",
                newName: "CurrentPassesSupervisorId");

            migrationBuilder.RenameIndex(
                name: "IX_Users_CurrentRequestsSupervisorId",
                table: "Users",
                newName: "IX_Users_CurrentPassesSupervisorId");

            migrationBuilder.RenameColumn(
                name: "RequestSupervisorId",
                table: "Requests",
                newName: "PassSupervisorId");

            migrationBuilder.RenameIndex(
                name: "IX_Requests_RequestSupervisorId",
                table: "Requests",
                newName: "IX_Requests_PassSupervisorId");

            migrationBuilder.AddForeignKey(
                name: "FK_Requests_Users_PassSupervisorId",
                table: "Requests",
                column: "PassSupervisorId",
                principalTable: "Users",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Users_CurrentPassesSupervisorId",
                table: "Users",
                column: "CurrentPassesSupervisorId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
