using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace OnThisDay.Api.Migrations
{
    /// <inheritdoc />
    public partial class init_schema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "location",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    slug = table.Column<string>(type: "text", nullable: false),
                    name = table.Column<string>(type: "text", nullable: true),
                    city = table.Column<string>(type: "text", nullable: true),
                    country = table.Column<string>(type: "text", nullable: true),
                    description = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("p_k_location", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "persons",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    firstname = table.Column<string>(type: "text", nullable: false),
                    slug = table.Column<string>(type: "text", nullable: false),
                    lastname = table.Column<string>(type: "text", nullable: true),
                    title = table.Column<string>(type: "text", nullable: true),
                    nationality = table.Column<string>(type: "text", nullable: true),
                    birth_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    death_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    biography = table.Column<string>(type: "text", nullable: true),
                    profile_image_url = table.Column<string>(type: "text", nullable: true),
                    gender = table.Column<int>(type: "integer", nullable: false),
                    status = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("p_k_persons", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "sports",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    slug = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: false),
                    description = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    icon_url = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    type = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("p_k_sports", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "users",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    first_name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    last_name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    is_active = table.Column<bool>(type: "boolean", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    user_name = table.Column<string>(type: "text", nullable: true),
                    normalized_user_name = table.Column<string>(type: "text", nullable: true),
                    email = table.Column<string>(type: "text", nullable: true),
                    normalized_email = table.Column<string>(type: "text", nullable: true),
                    email_confirmed = table.Column<bool>(type: "boolean", nullable: false),
                    password_hash = table.Column<string>(type: "text", nullable: true),
                    security_stamp = table.Column<string>(type: "text", nullable: true),
                    concurrency_stamp = table.Column<string>(type: "text", nullable: true),
                    phone_number = table.Column<string>(type: "text", nullable: true),
                    phone_number_confirmed = table.Column<bool>(type: "boolean", nullable: false),
                    two_factor_enabled = table.Column<bool>(type: "boolean", nullable: false),
                    lockout_end = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    lockout_enabled = table.Column<bool>(type: "boolean", nullable: false),
                    access_failed_count = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("p_k_users", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "competitions",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "text", nullable: false),
                    short_name = table.Column<string>(type: "text", nullable: true),
                    slug = table.Column<string>(type: "text", nullable: false),
                    level = table.Column<int>(type: "integer", nullable: false),
                    description = table.Column<string>(type: "text", nullable: true),
                    logo_url = table.Column<string>(type: "text", nullable: true),
                    sport_id = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("p_k_competitions", x => x.id);
                    table.ForeignKey(
                        name: "f_k_competitions__sports_sport_id",
                        column: x => x.sport_id,
                        principalTable: "sports",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "person_sport",
                columns: table => new
                {
                    athletes_id = table.Column<int>(type: "integer", nullable: false),
                    sports_id = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("p_k_person_sport", x => new { x.athletes_id, x.sports_id });
                    table.ForeignKey(
                        name: "f_k_person_sport_persons_athletes_id",
                        column: x => x.athletes_id,
                        principalTable: "persons",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "f_k_person_sport_sports_sports_id",
                        column: x => x.sports_id,
                        principalTable: "sports",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "teams",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "text", nullable: false),
                    slug = table.Column<string>(type: "text", nullable: false),
                    description = table.Column<string>(type: "text", nullable: true),
                    icon_url = table.Column<string>(type: "text", nullable: true),
                    website_url = table.Column<string>(type: "text", nullable: true),
                    founded_year = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    location_id = table.Column<int>(type: "integer", nullable: true),
                    sport_id = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("p_k_teams", x => x.id);
                    table.ForeignKey(
                        name: "f_k_teams_location_location_id",
                        column: x => x.location_id,
                        principalTable: "location",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "f_k_teams_sports_sport_id",
                        column: x => x.sport_id,
                        principalTable: "sports",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "sport_events",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    headline = table.Column<string>(type: "text", nullable: true),
                    full_description = table.Column<string>(type: "text", nullable: true),
                    slug = table.Column<string>(type: "text", nullable: false),
                    day = table.Column<int>(type: "integer", nullable: false),
                    month = table.Column<int>(type: "integer", nullable: false),
                    year = table.Column<int>(type: "integer", nullable: false),
                    type = table.Column<int>(type: "integer", nullable: false),
                    sport_id = table.Column<int>(type: "integer", nullable: false),
                    competition_id = table.Column<int>(type: "integer", nullable: true),
                    location_id = table.Column<int>(type: "integer", nullable: true),
                    media_url = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("p_k_sport_events", x => x.id);
                    table.ForeignKey(
                        name: "f_k_sport_events_competitions_competition_id",
                        column: x => x.competition_id,
                        principalTable: "competitions",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "f_k_sport_events_location_location_id",
                        column: x => x.location_id,
                        principalTable: "location",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "f_k_sport_events_sports_sport_id",
                        column: x => x.sport_id,
                        principalTable: "sports",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "person_team",
                columns: table => new
                {
                    members_id = table.Column<int>(type: "integer", nullable: false),
                    teams_id = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("p_k_person_team", x => new { x.members_id, x.teams_id });
                    table.ForeignKey(
                        name: "f_k_person_team_persons_members_id",
                        column: x => x.members_id,
                        principalTable: "persons",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "f_k_person_team_teams_teams_id",
                        column: x => x.teams_id,
                        principalTable: "teams",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "event_participants",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    sport_event_id = table.Column<int>(type: "integer", nullable: false),
                    person_id = table.Column<int>(type: "integer", nullable: true),
                    team_id = table.Column<int>(type: "integer", nullable: true),
                    role = table.Column<int>(type: "integer", nullable: false),
                    performance_note = table.Column<string>(type: "text", nullable: true),
                    is_primary = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("p_k_event_participants", x => x.id);
                    table.ForeignKey(
                        name: "f_k_event_participants__persons_person_id",
                        column: x => x.person_id,
                        principalTable: "persons",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "f_k_event_participants__sport_events_sport_event_id",
                        column: x => x.sport_event_id,
                        principalTable: "sport_events",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "f_k_event_participants__teams_team_id",
                        column: x => x.team_id,
                        principalTable: "teams",
                        principalColumn: "id");
                });

            migrationBuilder.CreateIndex(
                name: "i_x_competitions_sport_id",
                table: "competitions",
                column: "sport_id");

            migrationBuilder.CreateIndex(
                name: "i_x_event_participants_person_id",
                table: "event_participants",
                column: "person_id");

            migrationBuilder.CreateIndex(
                name: "i_x_event_participants_sport_event_id",
                table: "event_participants",
                column: "sport_event_id");

            migrationBuilder.CreateIndex(
                name: "i_x_event_participants_team_id",
                table: "event_participants",
                column: "team_id");

            migrationBuilder.CreateIndex(
                name: "i_x_person_sport_sports_id",
                table: "person_sport",
                column: "sports_id");

            migrationBuilder.CreateIndex(
                name: "i_x_person_team_teams_id",
                table: "person_team",
                column: "teams_id");

            migrationBuilder.CreateIndex(
                name: "i_x_sport_events_competition_id",
                table: "sport_events",
                column: "competition_id");

            migrationBuilder.CreateIndex(
                name: "i_x_sport_events_location_id",
                table: "sport_events",
                column: "location_id");

            migrationBuilder.CreateIndex(
                name: "i_x_sport_events_sport_id",
                table: "sport_events",
                column: "sport_id");

            migrationBuilder.CreateIndex(
                name: "IX_sports_slug",
                table: "sports",
                column: "slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "i_x_teams_location_id",
                table: "teams",
                column: "location_id");

            migrationBuilder.CreateIndex(
                name: "i_x_teams_sport_id",
                table: "teams",
                column: "sport_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "event_participants");

            migrationBuilder.DropTable(
                name: "person_sport");

            migrationBuilder.DropTable(
                name: "person_team");

            migrationBuilder.DropTable(
                name: "users");

            migrationBuilder.DropTable(
                name: "sport_events");

            migrationBuilder.DropTable(
                name: "persons");

            migrationBuilder.DropTable(
                name: "teams");

            migrationBuilder.DropTable(
                name: "competitions");

            migrationBuilder.DropTable(
                name: "location");

            migrationBuilder.DropTable(
                name: "sports");
        }
    }
}
