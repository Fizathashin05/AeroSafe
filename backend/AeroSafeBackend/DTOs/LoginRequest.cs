using System.ComponentModel.DataAnnotations;

namespace AeroSafeBackend.DTOs;

public class LoginRequest
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;

    // Role removed: login will attempt to match user by email across admin and pilot accounts
}



