using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using AeroSafeBackend.Models;
using AeroSafeBackend.Data;
using Microsoft.EntityFrameworkCore;

namespace AeroSafeBackend.Services
{
    public class RuleEngineOptions
    {
        public int PollIntervalSeconds { get; set; } = 5;
        public double LowFuelThresholdPercent { get; set; } = 15;
        public double EngineTempThresholdC { get; set; } = 100;
    }

    public class RuleEngineService : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly RuleEngineOptions _opts;

        public RuleEngineService(IServiceScopeFactory scopeFactory, IConfiguration config)
        {
            _scopeFactory = scopeFactory;
            _opts = config.GetSection("RuleEngine").Get<RuleEngineOptions>() ?? new RuleEngineOptions();
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    using var scope = _scopeFactory.CreateScope();
                    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                    // Evaluate latest telemetry per flight
                    var latestByFlight = await db.Telemetries
                        .GroupBy(t => t.FlightId)
                        .Select(g => g.OrderByDescending(t => t.Timestamp).FirstOrDefault())
                        .Where(t => t != null)
                        .ToListAsync(stoppingToken);

                    foreach (var t in latestByFlight.Where(x => x != null))
                    {
                        if (t == null) continue;

                        // Low fuel
                        if (t.FuelPercent <= _opts.LowFuelThresholdPercent)
                        {
                            await CreateAlertIfNotExists(db, t.FlightId, "LowFuel",
                                $"Fuel at {t.FuelPercent}% (threshold {_opts.LowFuelThresholdPercent}%)",
                                "High");
                        }

                        // Engine overheat
                        if (t.EngineTempC >= _opts.EngineTempThresholdC)
                        {
                            await CreateAlertIfNotExists(db, t.FlightId, "EngineOverheat",
                                $"Engine temp {t.EngineTempC}°C (threshold {_opts.EngineTempThresholdC}°C)",
                                "Critical");
                        }

                        // Example: sudden drop in altitude (very simple check: previous - current > threshold)
                        var prev = await db.Telemetries
                            .Where(x => x.FlightId == t.FlightId && x.Timestamp < t.Timestamp)
                            .OrderByDescending(x => x.Timestamp)
                            .FirstOrDefaultAsync(stoppingToken);

                        if (prev != null)
                        {
                            var drop = prev.Altitude - t.Altitude;
                            if (drop > 1000) // meters, adjust threshold as needed
                            {
                                await CreateAlertIfNotExists(db, t.FlightId, "AltitudeDrop",
                                    $"Altitude dropped {drop} meters", "Critical");
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    // log - simple console log for dev
                    Console.WriteLine($"RuleEngine error: {ex.Message}");
                }

                await Task.Delay(TimeSpan.FromSeconds(_opts.PollIntervalSeconds), stoppingToken);
            }
        }

        private async Task CreateAlertIfNotExists(AppDbContext db, Guid flightId, string type, string message, string severity)
        {
            // Avoid duplicate alerts in short window: check recent same alert in last 2 minutes
            var recent = await db.Alerts
                .Where(a => a.FlightId == flightId && a.Type == type && a.CreatedAt > DateTime.UtcNow.AddMinutes(-2))
                .FirstOrDefaultAsync();

            if (recent == null)
            {
                db.Alerts.Add(new Alert
                {
                    FlightId = flightId,
                    Type = type,
                    Message = message,
                    Severity = severity,
                    CreatedAt = DateTime.UtcNow
                });
                await db.SaveChangesAsync();
            }
        }
    }
}
