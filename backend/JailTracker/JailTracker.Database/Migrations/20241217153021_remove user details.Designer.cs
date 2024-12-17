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
    [Migration("20241217153021_remove user details")]
    partial class removeuserdetails
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

                    b.Property<int?>("RequestSupervisorId")
                        .IsRequired()
                        .HasColumnType("integer");

                    b.Property<int>("RequestType")
                        .HasColumnType("integer");

                    b.Property<DateTime>("ToDate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<int>("UserId")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("RequestSupervisorId");

                    b.HasIndex("UserId");

                    b.ToTable("Requests");
                });

            modelBuilder.Entity("JailTracker.Common.Models.DatabaseModels.UserModel", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<int?>("CurrentRequestsSupervisorId")
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

                    b.Property<int>("Role")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("CurrentRequestsSupervisorId");

                    b.HasIndex("Email")
                        .IsUnique();

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
                    b.HasOne("JailTracker.Common.Models.DatabaseModels.UserModel", "RequestSupervisor")
                        .WithMany("RequestsSupervised")
                        .HasForeignKey("RequestSupervisorId")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.HasOne("JailTracker.Common.Models.DatabaseModels.UserModel", "User")
                        .WithMany("Requests")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.Navigation("RequestSupervisor");

                    b.Navigation("User");
                });

            modelBuilder.Entity("JailTracker.Common.Models.DatabaseModels.UserModel", b =>
                {
                    b.HasOne("JailTracker.Common.Models.DatabaseModels.UserModel", "CurrentRequestsSupervisor")
                        .WithMany("SupervisedPrisoners")
                        .HasForeignKey("CurrentRequestsSupervisorId");

                    b.Navigation("CurrentRequestsSupervisor");
                });

            modelBuilder.Entity("JailTracker.Common.Models.DatabaseModels.UserModel", b =>
                {
                    b.Navigation("Permissions");

                    b.Navigation("Requests");

                    b.Navigation("RequestsSupervised");

                    b.Navigation("SupervisedPrisoners");
                });
#pragma warning restore 612, 618
        }
    }
}
