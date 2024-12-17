using Microsoft.EntityFrameworkCore;
using JailTracker.Common.Models.DatabaseModels;

namespace JailTracker.Database;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<UserModel>()
            .HasMany(x => x.SupervisedPrisoners)
            .WithOne(x => x.CurrentRequestsSupervisor)
            .HasForeignKey(x => x.CurrentRequestsSupervisorId)
            .IsRequired(false);

        modelBuilder.Entity<RequestModel>()
            .HasOne(a => a.User)
            .WithMany(g => g.Requests)
            .HasForeignKey(a => a.UserId)
            .OnDelete(DeleteBehavior.NoAction);

        modelBuilder.Entity<RequestModel>()
            .HasOne(a => a.RequestSupervisor)
            .WithMany(g => g.RequestsSupervised)
            .HasForeignKey(a => a.RequestSupervisorId)
            .OnDelete(DeleteBehavior.NoAction);
    }

    public DbSet<UserModel> Users { get; set; }
    public DbSet<PrisonModel> Prisons { get; set; }
    public DbSet<PermissionModel> Permissions { get; set; }
    public DbSet<RequestModel> Requests { get; set; }
}