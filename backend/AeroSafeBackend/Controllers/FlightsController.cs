using Microsoft.AspNetCore.Mvc;
using AeroSafeBackend.Services;
using AeroSafeBackend.Models;

namespace AeroSafeBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FlightsController : ControllerBase
    {
        private readonly IFlightService _fs;
        public FlightsController(IFlightService fs) => _fs = fs;

        [HttpGet]
        public async Task<IActionResult> List() => Ok(await _fs.ListAsync());

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> Get(Guid id)
        {
            var f = await _fs.GetAsync(id);
            if (f == null) return NotFound();
            return Ok(f);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Flight flight)
        {
            var created = await _fs.CreateAsync(flight);
            return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
        }
    }
}
