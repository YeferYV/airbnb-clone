using Airbnb.Api.Data;
using Airbnb.Api.Dtos;
using Airbnb.Api.Models;
using Airbnb.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Airbnb.Api.Controllers;

[ApiController]
[Route("api/listings")]
public class ListingsController(
    AirbnbDbContext dbContext,
    CurrentUserService currentUserService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<ListingDto>>> GetAll([FromQuery] ListingQuery query)
    {
        var listings = dbContext.Listings.AsNoTracking().AsQueryable();

        if (query.UserId is Guid userId)
        {
            listings = listings.Where(listing => listing.UserId == userId);
        }

        if (!string.IsNullOrWhiteSpace(query.Category))
        {
            listings = listings.Where(listing => listing.Category == query.Category);
        }

        if (!string.IsNullOrWhiteSpace(query.LocationValue))
        {
            listings = listings.Where(listing => listing.LocationValue == query.LocationValue.ToUpperInvariant());
        }

        if (query.RoomCount is > 0)
        {
            listings = listings.Where(listing => listing.RoomCount >= query.RoomCount);
        }

        if (query.GuestCount is > 0)
        {
            listings = listings.Where(listing => listing.GuestCount >= query.GuestCount);
        }

        if (query.BathroomCount is > 0)
        {
            listings = listings.Where(listing => listing.BathroomCount >= query.BathroomCount);
        }

        if (query.StartDate is DateTime startDate && query.EndDate is DateTime endDate && endDate > startDate)
        {
            listings = listings.Where(listing =>
                !listing.Reservations.Any(reservation =>
                    reservation.StartDate < endDate && reservation.EndDate > startDate));
        }

        var entities = await listings
            .OrderByDescending(listing => listing.CreatedAt)
            .ToListAsync();

        return Ok(entities.Select(listing => listing.ToDto()).ToList());
    }

    [HttpGet("{listingId:guid}")]
    public async Task<ActionResult<ListingWithUserDto>> GetById(Guid listingId)
    {
        var listing = await dbContext.Listings
            .AsNoTracking()
            .Include(item => item.User)
            .FirstOrDefaultAsync(item => item.Id == listingId);

        return listing is null ? NotFound() : Ok(listing.ToDtoWithUser());
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<ListingDto>> Create(CreateListingRequest request)
    {
        var currentUser = await currentUserService.GetAsync();
        if (currentUser is null)
        {
            return Unauthorized();
        }

        var listing = new Listing
        {
            Title = request.Title.Trim(),
            Description = request.Description.Trim(),
            ImageSrc = request.ImageSrc.Trim(),
            Category = request.Category.Trim(),
            RoomCount = request.RoomCount,
            BathroomCount = request.BathroomCount,
            GuestCount = request.GuestCount,
            LocationValue = request.LocationValue.Trim().ToUpperInvariant(),
            Price = request.Price,
            UserId = currentUser.Id
        };

        dbContext.Listings.Add(listing);
        await dbContext.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { listingId = listing.Id }, listing.ToDto());
    }

    [Authorize]
    [HttpDelete("{listingId:guid}")]
    public async Task<IActionResult> Delete(Guid listingId)
    {
        var currentUser = await currentUserService.GetAsync();
        if (currentUser is null)
        {
            return Unauthorized();
        }

        var listing = await dbContext.Listings
            .FirstOrDefaultAsync(item => item.Id == listingId && item.UserId == currentUser.Id);

        if (listing is null)
        {
            return NotFound(new { message = "Listing not found." });
        }

        dbContext.Listings.Remove(listing);
        await dbContext.SaveChangesAsync();

        return NoContent();
    }
}
