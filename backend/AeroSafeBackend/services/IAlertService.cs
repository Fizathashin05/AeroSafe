using AeroSafeBackend.Models;

namespace AeroSafeBackend.Services
{
    public interface IAlertService
    {
        Task<Alert> CreateAsync(Alert alert);
        Task<List<Alert>> GetForFlightAsync(Guid flightId);
        Task<List<Alert>> ListAsync(int limit = 100);
    }
}
