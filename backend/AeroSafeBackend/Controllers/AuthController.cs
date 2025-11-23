using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using AeroSafeBackend.DTOs;
using AeroSafeBackend.Services;
using Microsoft.EntityFrameworkCore;

namespace AeroSafeBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("admin/signup")]
    public async Task<ActionResult<AuthResponse>> AdminSignup([FromBody] AdminSignupRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(new AuthResponse
            {
                Success = false,
                Message = "Invalid request data"
            });
        }

        var result = await _authService.AdminSignupAsync(request);

        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    [HttpPost("pilot/signup")]
    public async Task<ActionResult<AuthResponse>> PilotSignup([FromBody] PilotSignupRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(new AuthResponse
            {
                Success = false,
                Message = "Invalid request data"
            });
        }

        var result = await _authService.PilotSignupAsync(request);

        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(new AuthResponse
            {
                Success = false,
                Message = "Invalid request data"
            });
        }

        var result = await _authService.LoginAsync(request);

        if (!result.Success)
        {
            return Unauthorized(result);
        }

        return Ok(result);
    }

    [HttpGet("active")]
    public async Task<IActionResult> Active([FromQuery] int minutes = 30)
    {
        // Return users (admins + pilots) whose UpdatedAt is within the last `minutes` window
        var cutoff = DateTime.UtcNow.AddMinutes(-minutes);

        // Access the DbContext via the auth service is not available here; resolve via HttpContext.RequestServices
        var db = HttpContext.RequestServices.GetService(typeof(AeroSafeBackend.Data.AeroSafeDbContext)) as AeroSafeBackend.Data.AeroSafeDbContext;
        if (db == null) return StatusCode(500, new { Success = false, Message = "Database unavailable" });

        var admins = await db.Admins
            .Where(a => a.UpdatedAt >= cutoff)
            .Select(a => new { a.Id, a.AdminUid, a.FullName, a.Email, Role = "Admin", LastActive = a.UpdatedAt })
            .ToListAsync();

        var pilots = await db.Pilots
            .Where(p => p.UpdatedAt >= cutoff)
            .Select(p => new { p.Id, p.PilotUid, p.FullName, p.Email, Role = "Pilot", LastActive = p.UpdatedAt })
            .ToListAsync();

        var combined = admins.Cast<object>().Concat(pilots.Cast<object>()).ToList();

        return Ok(new { Success = true, Users = combined });
    }

    [HttpGet("verify")]
    [Authorize]
    public ActionResult<object> VerifyToken()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var email = User.FindFirstValue(ClaimTypes.Email);
        var role = User.FindFirstValue(ClaimTypes.Role);
        var uid = User.FindFirstValue("Uid");
        var name = User.FindFirstValue("Name");

        return Ok(new
        {
            Success = true,
            Message = "Token is valid",
            User = new
            {
                Id = userId,
                Email = email,
                Role = role,
                Uid = uid,
                Name = name
            },
            Claims = User.Claims.Select(c => new { c.Type, c.Value }).ToList()
        });
    }
}
