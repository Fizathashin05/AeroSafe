using AeroSafeBackend.Data;
using AeroSafeBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace AeroSafeBackend.Services
{
    public class AlertService : IAlertService
    {
        private readonly AppDbContext _db;
        public AlertService(AppDbContext db) => _db = db;

        public async Task<Alert> CreateAsync(Alert alert)
        {
            _db.Alerts.Add(alert);
            await _db.SaveChangesAsync();
            return alert;
        }

        public async Task<List<Alert>> GetForFlightAsync(Guid flightId)
        {
            return await _db.Alerts
                .Where(a => a.FlightId == flightId)
                .OrderByDescending(a => a.CreatedAt)
                .ToListAsync();
        }

        public async Task<List<Alert>> ListAsync(int limit = 100)
        {
            return await _db.Alerts.OrderByDescending(a => a.CreatedAt)
                .Take(limit).ToListAsync();
        }
    }
}
