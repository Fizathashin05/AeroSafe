using Microsoft.EntityFrameworkCore;
using AeroSafeBackend.Models;

namespace AeroSafeBackend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> opts) : base(opts) { }

        public DbSet<Flight> Flights { get; set; }
        public DbSet<Telemetry> Telemetries { get; set; }
        public DbSet<Alert> Alerts { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Flight>().HasKey(f => f.Id);
            modelBuilder.Entity<Telemetry>().HasKey(t => t.Id);
            modelBuilder.Entity<Alert>().HasKey(a => a.Id);

            modelBuilder.Entity<Flight>()
                .HasMany<Telemetry>()
                .WithOne()
                .HasForeignKey(t => t.FlightId)
                .OnDelete(DeleteBehavior.Cascade);

            base.OnModelCreating(modelBuilder);
        }
    }
}
