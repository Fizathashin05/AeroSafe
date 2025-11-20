using AeroSafeBackend.Data;
using AeroSafeBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace AeroSafeBackend.Services
{
    public class FlightService : IFlightService
    {
        private readonly AppDbContext _db;
        public FlightService(AppDbContext db) => _db = db;

        public async Task<Flight> CreateAsync(Flight flight)
        {
            _db.Flights.Add(flight);
            await _db.SaveChangesAsync();
            return flight;
        }

        public async Task<Flight?> GetAsync(Guid id)
            => await _db.Flights.FindAsync(id);

        public async Task<List<Flight>> ListAsync()
            => await _db.Flights.OrderBy(f => f.ScheduledDeparture).ToListAsync();
    }
}
