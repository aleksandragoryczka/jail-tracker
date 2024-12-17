using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JailTracker.Database.Migrations
{
    /// <inheritdoc />
    public partial class updae_supervisor_id : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Users_Users_CurrentRequestsSupervisorId",
                table: "Users");

            migrationBuilder.AlterColumn<int>(
                name: "CurrentRequestsSupervisorId",
                table: "Users",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Users_CurrentRequestsSupervisorId",
                table: "Users",
                column: "CurrentRequestsSupervisorId",
                principalTable: "Users",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Users_Users_CurrentRequestsSupervisorId",
                table: "Users");

            migrationBuilder.AlterColumn<int>(
                name: "CurrentRequestsSupervisorId",
                table: "Users",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Users_CurrentRequestsSupervisorId",
                table: "Users",
                column: "CurrentRequestsSupervisorId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
