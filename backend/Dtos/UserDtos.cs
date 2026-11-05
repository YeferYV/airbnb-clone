using System.ComponentModel.DataAnnotations;

namespace Airbnb.Api.Dtos;

public record UserDto(
    Guid Id,
    string Name,
    string Email,
    string? Image,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    IReadOnlyList<Guid> FavoriteIds);

public record AuthResponse(string Token, UserDto User);

public class RegisterRequest
{
    [Required, MaxLength(120)]
    public string Name { get; set; } = string.Empty;

    [Required, EmailAddress, MaxLength(255)]
    public string Email { get; set; } = string.Empty;

    [Required, MinLength(6), MaxLength(128)]
    public string Password { get; set; } = string.Empty;
}

public class LoginRequest
{
    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;
}
