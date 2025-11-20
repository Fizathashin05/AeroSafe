using Microsoft.AspNetCore.Mvc;
using AeroSafeBackend.Services;

namespace AeroSafeBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AlertsController : ControllerBase
    {
        private readonly IAlertService _asvc;
        public AlertsController(IAlertService asvc) => _asvc = asvc;

        [HttpGet]
        public async Task<IActionResult> List([FromQuery] int limit = 100) => Ok(await _asvc.ListAsync(limit));

        [HttpGet("flight/{flightId:guid}")]
        public async Task<IActionResult> ForFlight(Guid flightId) => Ok(await _asvc.GetForFlightAsync(flightId));
    }
}
