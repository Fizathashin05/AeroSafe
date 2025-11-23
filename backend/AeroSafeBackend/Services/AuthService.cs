using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AeroSafeBackend.Data;
using AeroSafeBackend.DTOs;
using AeroSafeBackend.Models;
using BCrypt.Net;

namespace AeroSafeBackend.Services;

public class AuthService : IAuthService
{
    private readonly AeroSafeDbContext _context;
    private readonly IConfiguration _configuration;

    public AuthService(AeroSafeDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    public async Task<AuthResponse> AdminSignupAsync(AdminSignupRequest request)
    {
        // Check if email already exists
        if (await _context.Admins.AnyAsync(a => a.Email == request.Email))
        {
            return new AuthResponse
            {
                Success = false,
                Message = "Email already registered"
            };
        }

        // Check if AdminId already exists
        if (await _context.Admins.AnyAsync(a => a.AdminUid == request.AdminId))
        {
            return new AuthResponse
            {
                Success = false,
                Message = "Admin ID already exists"
            };
        }

        // Hash password
        var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

        // Create admin
        var admin = new Admin
        {
            AdminUid = request.AdminId,
            FullName = request.Name,
            Email = request.Email,
            PasswordHash = passwordHash,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Admins.Add(admin);
        await _context.SaveChangesAsync();

        // Generate JWT token
        var token = GenerateJwtToken(admin.Id, admin.Email, "Admin", admin.AdminUid, admin.FullName);

        return new AuthResponse
        {
            Success = true,
            Token = token,
            Message = "Admin account created successfully",
            User = new UserInfo
            {
                Id = admin.Id,
                Uid = admin.AdminUid,
                Name = admin.FullName,
                Email = admin.Email,
                Role = "Admin"
            }
        };
    }

    public async Task<AuthResponse> PilotSignupAsync(PilotSignupRequest request)
    {
        // Check if email already exists
        if (await _context.Pilots.AnyAsync(p => p.Email == request.Email))
        {
            return new AuthResponse
            {
                Success = false,
                Message = "Email already registered"
            };
        }

        // Check if PilotId already exists
        if (await _context.Pilots.AnyAsync(p => p.PilotUid == request.PilotId))
        {
            return new AuthResponse
            {
                Success = false,
                Message = "Pilot ID already exists"
            };
        }

        // Hash password
        var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

        // Create pilot
        var pilot = new Pilot
        {
            PilotUid = request.PilotId,
            FullName = request.Name,
            Email = request.Email,
            PasswordHash = passwordHash,
            FatigueFlag = false,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Pilots.Add(pilot);
        await _context.SaveChangesAsync();

        // Generate JWT token
        var token = GenerateJwtToken(pilot.Id, pilot.Email, "Pilot", pilot.PilotUid, pilot.FullName);

        return new AuthResponse
        {
            Success = true,
            Token = token,
            Message = "Pilot account created successfully",
            User = new UserInfo
            {
                Id = pilot.Id,
                Uid = pilot.PilotUid,
                Name = pilot.FullName,
                Email = pilot.Email,
                Role = "Pilot"
            }
        };
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        // Try to find an admin with the provided email first
        var admin = await _context.Admins.FirstOrDefaultAsync(a => a.Email == request.Email);
        if (admin != null)
        {
            if (!BCrypt.Net.BCrypt.Verify(request.Password, admin.PasswordHash))
            {
                return new AuthResponse
                {
                    Success = false,
                    Message = "Invalid email or password"
                };
            }

            var token = GenerateJwtToken(admin.Id, admin.Email, "Admin", admin.AdminUid, admin.FullName);
            // update last active timestamp
            admin.UpdatedAt = DateTime.UtcNow;
            _context.Admins.Update(admin);
            await _context.SaveChangesAsync();

            return new AuthResponse
            {
                Success = true,
                Token = token,
                Message = "Login successful",
                User = new UserInfo
                {
                    Id = admin.Id,
                    Uid = admin.AdminUid,
                    Name = admin.FullName,
                    Email = admin.Email,
                    Role = "Admin"
                }
            };
        }

        // If not an admin, try pilot
        var pilot = await _context.Pilots.FirstOrDefaultAsync(p => p.Email == request.Email);
        if (pilot != null)
        {
            if (!BCrypt.Net.BCrypt.Verify(request.Password, pilot.PasswordHash))
            {
                return new AuthResponse
                {
                    Success = false,
                    Message = "Invalid email or password"
                };
            }

            var token = GenerateJwtToken(pilot.Id, pilot.Email, "Pilot", pilot.PilotUid, pilot.FullName);
            // update last active timestamp
            pilot.UpdatedAt = DateTime.UtcNow;
            _context.Pilots.Update(pilot);
            await _context.SaveChangesAsync();

            return new AuthResponse
            {
                Success = true,
                Token = token,
                Message = "Login successful",
                User = new UserInfo
                {
                    Id = pilot.Id,
                    Uid = pilot.PilotUid,
                    Name = pilot.FullName,
                    Email = pilot.Email,
                    Role = "Pilot"
                }
            };
        }

        // No matching user found
        return new AuthResponse
        {
            Success = false,
            Message = "Invalid email or password"
        };
    }

    private string GenerateJwtToken(int userId, string email, string role, string uid, string name)
    {
        var jwtKey = _configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key not configured");
        var jwtIssuer = _configuration["Jwt:Issuer"] ?? "AeroSafe";
        var jwtAudience = _configuration["Jwt:Audience"] ?? "AeroSafe";
        var jwtExpiryMinutes = int.Parse(_configuration["Jwt:ExpiryMinutes"] ?? "1440"); // 24 hours default

        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
            new Claim(ClaimTypes.Email, email),
            new Claim(ClaimTypes.Role, role),
            new Claim("Uid", uid),
            new Claim("Name", name),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var token = new JwtSecurityToken(
            issuer: jwtIssuer,
            audience: jwtAudience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(jwtExpiryMinutes),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}



