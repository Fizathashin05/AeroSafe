using AeroSafeBackend.Models;

namespace AeroSafeBackend.Services
{
    public interface IFlightService
    {
        Task<Flight?> GetAsync(Guid id);
        Task<List<Flight>> ListAsync();
        Task<Flight> CreateAsync(Flight flight);
    }
}
