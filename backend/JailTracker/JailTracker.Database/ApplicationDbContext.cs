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
            .WithOne(x => x.CurrentPassesSupervisor)
            .HasForeignKey(x => x.CurrentPassesSupervisorId);

        modelBuilder.Entity<RequestModel>()
            .HasOne(a => a.User)
            .WithMany(g => g.Passes)
            .HasForeignKey(a => a.UserId)
            .OnDelete(DeleteBehavior.NoAction);

        modelBuilder.Entity<RequestModel>()
            .HasOne(a => a.PassSupervisor)
            .WithMany(g => g.PassesSupervised)
            .HasForeignKey(a => a.PassSupervisorId)
            .OnDelete(DeleteBehavior.NoAction);
    }

    public DbSet<UserModel> Users { get; set; }
    public DbSet<PrisonModel> Prisons { get; set; }
    public DbSet<PermissionModel> Permissions { get; set; }
    public DbSet<RequestModel> Requests { get; set; }
}