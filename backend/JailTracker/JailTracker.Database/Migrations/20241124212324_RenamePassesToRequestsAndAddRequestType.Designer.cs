﻿// <auto-generated />
using System;
using JailTracker.Database;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace JailTracker.Database.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20241124212324_RenamePassesToRequestsAndAddRequestType")]
    partial class RenamePassesToRequestsAndAddRequestType
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.5")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("JailTracker.Common.Models.DatabaseModels.PermissionModel", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<DateTime?>("ExpirationDate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<DateTime>("GrantDate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<int>("PermissionType")
                        .HasColumnType("integer");

                    b.Property<int>("UserId")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("Permissions");
                });

            modelBuilder.Entity("JailTracker.Common.Models.DatabaseModels.PrisonModel", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<bool>("IsActive")
                        .HasColumnType("boolean");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("UrlName")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("UrlName")
                        .IsUnique();

                    b.ToTable("Prisons");
                });

            modelBuilder.Entity("JailTracker.Common.Models.DatabaseModels.RequestModel", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<int>("ApprovalState")
                        .HasColumnType("integer");

                    b.Property<DateTime>("FromDate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<bool>("IsActive")
                        .HasColumnType("boolean");

                    b.Property<int?>("PassSupervisorId")
                        .IsRequired()
                        .HasColumnType("integer");

                    b.Property<int>("RequestType")
                        .HasColumnType("integer");

                    b.Property<DateTime>("ToDate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<int>("UserId")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("PassSupervisorId");

                    b.HasIndex("UserId");

                    b.ToTable("Requests");
                });

            modelBuilder.Entity("JailTracker.Common.Models.DatabaseModels.UserModel", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<int?>("CurrentPassesSupervisorId")
                        .IsRequired()
                        .HasColumnType("integer");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("FirstName")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<bool>("IsActive")
                        .HasColumnType("boolean");

                    b.Property<string>("LastName")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<byte[]>("Password")
                        .IsRequired()
                        .HasColumnType("bytea");

                    b.Property<int?>("PrisonId")
                        .HasColumnType("integer");

                    b.Property<int>("Role")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("CurrentPassesSupervisorId");

                    b.HasIndex("Email")
                        .IsUnique();

                    b.HasIndex("PrisonId");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("JailTracker.Common.Models.DatabaseModels.PermissionModel", b =>
                {
                    b.HasOne("JailTracker.Common.Models.DatabaseModels.UserModel", "User")
                        .WithMany("Permissions")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("JailTracker.Common.Models.DatabaseModels.RequestModel", b =>
                {
                    b.HasOne("JailTracker.Common.Models.DatabaseModels.UserModel", "PassSupervisor")
                        .WithMany("PassesSupervised")
                        .HasForeignKey("PassSupervisorId")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.HasOne("JailTracker.Common.Models.DatabaseModels.UserModel", "User")
                        .WithMany("Passes")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.Navigation("PassSupervisor");

                    b.Navigation("User");
                });

            modelBuilder.Entity("JailTracker.Common.Models.DatabaseModels.UserModel", b =>
                {
                    b.HasOne("JailTracker.Common.Models.DatabaseModels.UserModel", "CurrentPassesSupervisor")
                        .WithMany("SupervisedPrisoners")
                        .HasForeignKey("CurrentPassesSupervisorId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("JailTracker.Common.Models.DatabaseModels.PrisonModel", "Prison")
                        .WithMany("Users")
                        .HasForeignKey("PrisonId");

                    b.Navigation("CurrentPassesSupervisor");

                    b.Navigation("Prison");
                });

            modelBuilder.Entity("JailTracker.Common.Models.DatabaseModels.PrisonModel", b =>
                {
                    b.Navigation("Users");
                });

            modelBuilder.Entity("JailTracker.Common.Models.DatabaseModels.UserModel", b =>
                {
                    b.Navigation("Passes");

                    b.Navigation("PassesSupervised");

                    b.Navigation("Permissions");

                    b.Navigation("SupervisedPrisoners");
                });
#pragma warning restore 612, 618
        }
    }
}