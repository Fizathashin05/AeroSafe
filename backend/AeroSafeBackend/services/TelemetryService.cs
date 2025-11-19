using AeroSafeBackend.Data;
using AeroSafeBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace AeroSafeBackend.Services
{
    public class TelemetryService : ITelemetryService
    {
        private readonly AppDbContext _db;
        public TelemetryService(AppDbContext db) => _db = db;

        public async Task<Telemetry> CreateAsync(Telemetry telemetry)
        {
            _db.Telemetries.Add(telemetry);
            await _db.SaveChangesAsync();
            return telemetry;
        }

        public async Task<List<Telemetry>> GetRecentForFlightAsync(Guid flightId, int limit = 10)
        {
            return await _db.Telemetries
                .Where(t => t.FlightId == flightId)
                .OrderByDescending(t => t.Timestamp)
                .Take(limit)
                .ToListAsync();
        }
    }
}
