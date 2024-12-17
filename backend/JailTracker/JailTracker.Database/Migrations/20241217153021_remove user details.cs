using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JailTracker.Database.Migrations
{
    /// <inheritdoc />
    public partial class removeuserdetails : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Users_Prisons_PrisonId",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Users_PrisonId",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "PrisonId",
                table: "Users");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "PrisonId",
                table: "Users",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_PrisonId",
                table: "Users",
                column: "PrisonId");

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Prisons_PrisonId",
                table: "Users",
                column: "PrisonId",
                principalTable: "Prisons",
                principalColumn: "Id");
        }
    }
}
