using Microsoft.AspNetCore.Mvc;
using AeroSafeBackend.Services;
using AeroSafeBackend.Models;

namespace AeroSafeBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TelemetryController : ControllerBase
    {
        private readonly ITelemetryService _ts;
        public TelemetryController(ITelemetryService ts) => _ts = ts;

        [HttpPost]
        public async Task<IActionResult> Ingest([FromBody] Telemetry telemetry)
        {
            var created = await _ts.CreateAsync(telemetry);
            return Ok(created);
        }

        [HttpGet("recent/{flightId:guid}")]
        public async Task<IActionResult> Recent(Guid flightId)
        {
            var list = await _ts.GetRecentForFlightAsync(flightId, 50);
            return Ok(list);
        }
    }
}
