using System.Security.Claims;
using Airbnb.Api.Data;
using Airbnb.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Airbnb.Api.Services;

public class CurrentUserService(AirbnbDbContext dbContext, IHttpContextAccessor httpContextAccessor)
{
    public Guid? UserId
    {
        get
        {
            var value = httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);
            return Guid.TryParse(value, out var id) ? id : null;
        }
    }

    public bool IsAuthenticated => httpContextAccessor.HttpContext?.User.Identity?.IsAuthenticated == true;

    public Task<User?> GetAsync()
    {
        if (UserId is not Guid id)
        {
            return Task.FromResult<User?>(null);
        }

        return dbContext.Users
            .Include(user => user.Favorites)
            .FirstOrDefaultAsync(user => user.Id == id);
    }
}
