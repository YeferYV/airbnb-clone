using Airbnb.Api.Data;
using Airbnb.Api.Dtos;
using Airbnb.Api.Models;
using Airbnb.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Airbnb.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(
    AirbnbDbContext dbContext,
    TokenService tokenService,
    CurrentUserService currentUserService,
    IPasswordHasher<User> passwordHasher) : ControllerBase
{
    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register(RegisterRequest request)
    {
        var email = NormalizeEmail(request.Email);

        if (await dbContext.Users.AnyAsync(user => user.Email == email))
        {
            return Conflict(new { message = "An account with this email already exists." });
        }

        var user = new User
        {
            Name = request.Name.Trim(),
            Email = email
        };
        user.PasswordHash = passwordHasher.HashPassword(user, request.Password);

        dbContext.Users.Add(user);

        try
        {
            await dbContext.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {
            return Conflict(new { message = "An account with this email already exists." });
        }

        return Ok(new AuthResponse(tokenService.Create(user), user.ToDto(Array.Empty<Guid>())));
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login(LoginRequest request)
    {
        var email = NormalizeEmail(request.Email);
        var user = await dbContext.Users
            .Include(item => item.Favorites)
            .FirstOrDefaultAsync(item => item.Email == email);

        if (user is null)
        {
            return Unauthorized(new { message = "Invalid email or password." });
        }

        var result = passwordHasher.VerifyHashedPassword(user, user.PasswordHash, request.Password);
        if (result == PasswordVerificationResult.Failed)
        {
            return Unauthorized(new { message = "Invalid email or password." });
        }

        if (result == PasswordVerificationResult.SuccessRehashNeeded)
        {
            user.PasswordHash = passwordHasher.HashPassword(user, request.Password);
            await dbContext.SaveChangesAsync();
        }

        return Ok(new AuthResponse(tokenService.Create(user), user.ToDto()));
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<ActionResult<UserDto>> Me()
    {
        var user = await currentUserService.GetAsync();
        if (user is null)
        {
            return Unauthorized();
        }

        return Ok(user.ToDto());
    }

    private static string NormalizeEmail(string email) => email.Trim().ToLowerInvariant();
}
