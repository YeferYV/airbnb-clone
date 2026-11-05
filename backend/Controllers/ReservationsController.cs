using Airbnb.Api.Data;
using Airbnb.Api.Dtos;
using Airbnb.Api.Models;
using Airbnb.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Airbnb.Api.Controllers;

[ApiController]
[Route("api/reservations")]
public class ReservationsController(
    AirbnbDbContext dbContext,
    CurrentUserService currentUserService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<ReservationDto>>> GetAll(
        [FromQuery] Guid? listingId,
        [FromQuery] Guid? userId,
        [FromQuery] Guid? authorId)
    {
        var reservations = dbContext.Reservations
            .AsNoTracking()
            .Include(reservation => reservation.Listing)
            .AsQueryable();

        if (listingId is Guid listing)
        {
            reservations = reservations.Where(reservation => reservation.ListingId == listing);
        }
        else
        {
            if (!currentUserService.IsAuthenticated)
            {
                return Unauthorized();
            }

            var currentUserId = currentUserService.UserId!.Value;

            if (userId is not null && userId != currentUserId)
            {
                return Forbid();
            }

            if (authorId is not null && authorId != currentUserId)
            {
                return Forbid();
            }

            if (userId is null && authorId is null)
            {
                return BadRequest(new { message = "Specify listingId, userId or authorId." });
            }

            if (userId is not null)
            {
                reservations = reservations.Where(reservation => reservation.UserId == currentUserId);
            }

            if (authorId is not null)
            {
                reservations = reservations.Where(reservation => reservation.Listing.UserId == currentUserId);
            }
        }

        var entities = await reservations
            .OrderByDescending(reservation => reservation.CreatedAt)
            .ToListAsync();

        return Ok(entities.Select(reservation => reservation.ToDto()).ToList());
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<ReservationDto>> Create(CreateReservationRequest request)
    {
        var currentUser = await currentUserService.GetAsync();
        if (currentUser is null)
        {
            return Unauthorized();
        }

        var listing = await dbContext.Listings
            .Include(item => item.Reservations)
            .FirstOrDefaultAsync(item => item.Id == request.ListingId);

        if (listing is null)
        {
            return NotFound(new { message = "Listing not found." });
        }

        var startDate = request.StartDate.Date;
        var endDate = request.EndDate.Date;

        if (endDate <= startDate)
        {
            return BadRequest(new { message = "The check-out date must be after the check-in date." });
        }

        if (startDate < DateTime.UtcNow.Date)
        {
            return BadRequest(new { message = "The check-in date cannot be in the past." });
        }

        var nights = (endDate - startDate).Days;
        if (nights > 365)
        {
            return BadRequest(new { message = "Stays cannot be longer than 365 nights." });
        }

        var hasOverlap = await dbContext.Reservations.AnyAsync(reservation =>
            reservation.ListingId == listing.Id &&
            reservation.StartDate < endDate &&
            reservation.EndDate > startDate);

        if (hasOverlap)
        {
            return Conflict(new { message = "These dates are no longer available." });
        }

        var totalPrice = nights * listing.Price;

        var reservation = new Reservation
        {
            UserId = currentUser.Id,
            ListingId = listing.Id,
            StartDate = startDate,
            EndDate = endDate,
            TotalPrice = totalPrice
        };

        dbContext.Reservations.Add(reservation);
        await dbContext.SaveChangesAsync();

        reservation.Listing = listing;

        return Ok(reservation.ToDto());
    }

    [Authorize]
    [HttpDelete("{reservationId:guid}")]
    public async Task<IActionResult> Delete(Guid reservationId)
    {
        var currentUser = await currentUserService.GetAsync();
        if (currentUser is null)
        {
            return Unauthorized();
        }

        var reservation = await dbContext.Reservations
            .Include(item => item.Listing)
            .FirstOrDefaultAsync(item => item.Id == reservationId);

        if (reservation is null)
        {
            return NotFound(new { message = "Reservation not found." });
        }

        if (reservation.UserId != currentUser.Id && reservation.Listing.UserId != currentUser.Id)
        {
            return Forbid();
        }

        dbContext.Reservations.Remove(reservation);
        await dbContext.SaveChangesAsync();

        return NoContent();
    }
}
