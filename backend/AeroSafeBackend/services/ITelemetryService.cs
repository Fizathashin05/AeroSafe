using AeroSafeBackend.Models;

namespace AeroSafeBackend.Services
{
    public interface ITelemetryService
    {
        Task<Telemetry> CreateAsync(Telemetry telemetry);
        Task<List<Telemetry>> GetRecentForFlightAsync(Guid flightId, int limit = 10);
    }
}
