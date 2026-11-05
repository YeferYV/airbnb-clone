using Airbnb.Api.Dtos;
using Airbnb.Api.Models;

namespace Airbnb.Api.Services;

public static class MappingExtensions
{
    public static UserDto ToDto(this User user, IEnumerable<Guid>? favoriteIds = null)
    {
        return new UserDto(
            user.Id,
            user.Name,
            user.Email,
            user.Image,
            user.CreatedAt,
            user.UpdatedAt,
            favoriteIds?.ToList() ?? user.Favorites.Select(favorite => favorite.ListingId).ToList());
    }

    public static ListingDto ToDto(this Listing listing)
    {
        return new ListingDto(
            listing.Id,
            listing.Title,
            listing.Description,
            listing.ImageSrc,
            listing.CreatedAt,
            listing.Category,
            listing.RoomCount,
            listing.BathroomCount,
            listing.GuestCount,
            listing.LocationValue,
            listing.UserId,
            listing.Price);
    }

    public static ListingWithUserDto ToDtoWithUser(this Listing listing)
    {
        return new ListingWithUserDto(
            listing.Id,
            listing.Title,
            listing.Description,
            listing.ImageSrc,
            listing.CreatedAt,
            listing.Category,
            listing.RoomCount,
            listing.BathroomCount,
            listing.GuestCount,
            listing.LocationValue,
            listing.UserId,
            listing.Price,
            listing.User.ToDto());
    }

    public static ReservationDto ToDto(this Reservation reservation)
    {
        return new ReservationDto(
            reservation.Id,
            reservation.UserId,
            reservation.ListingId,
            reservation.StartDate,
            reservation.EndDate,
            reservation.TotalPrice,
            reservation.CreatedAt,
            reservation.Listing.ToDto());
    }
}
