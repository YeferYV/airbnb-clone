using Airbnb.Api.Data;
using Airbnb.Api.Dtos;
using Airbnb.Api.Models;
using Airbnb.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Airbnb.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/favorites")]
public class FavoritesController(
    AirbnbDbContext dbContext,
    CurrentUserService currentUserService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<ListingDto>>> GetAll()
    {
        var currentUser = await currentUserService.GetAsync();
        if (currentUser is null)
        {
            return Unauthorized();
        }

        var listings = await dbContext.Favorites
            .AsNoTracking()
            .Where(favorite => favorite.UserId == currentUser.Id)
            .Select(favorite => favorite.Listing)
            .OrderByDescending(listing => listing.CreatedAt)
            .ToListAsync();

        return Ok(listings.Select(listing => listing.ToDto()).ToList());
    }

    [HttpPost("{listingId:guid}")]
    public async Task<ActionResult<UserDto>> Add(Guid listingId)
    {
        var currentUser = await currentUserService.GetAsync();
        if (currentUser is null)
        {
            return Unauthorized();
        }

        if (!await dbContext.Listings.AnyAsync(listing => listing.Id == listingId))
        {
            return NotFound(new { message = "Listing not found." });
        }

        if (!await dbContext.Favorites.AnyAsync(favorite =>
                favorite.UserId == currentUser.Id && favorite.ListingId == listingId))
        {
            dbContext.Favorites.Add(new Favorite { UserId = currentUser.Id, ListingId = listingId });
            await dbContext.SaveChangesAsync();
        }

        currentUser = await currentUserService.GetAsync();
        return Ok(currentUser!.ToDto());
    }

    [HttpDelete("{listingId:guid}")]
    public async Task<ActionResult<UserDto>> Remove(Guid listingId)
    {
        var currentUser = await currentUserService.GetAsync();
        if (currentUser is null)
        {
            return Unauthorized();
        }

        var favorite = await dbContext.Favorites.FirstOrDefaultAsync(item =>
            item.UserId == currentUser.Id && item.ListingId == listingId);

        if (favorite is not null)
        {
            dbContext.Favorites.Remove(favorite);
            await dbContext.SaveChangesAsync();
        }

        currentUser = await currentUserService.GetAsync();
        return Ok(currentUser!.ToDto());
    }
}
