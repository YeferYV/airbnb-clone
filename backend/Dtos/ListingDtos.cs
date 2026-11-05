using System.ComponentModel.DataAnnotations;

namespace Airbnb.Api.Dtos;

public record ListingDto(
    Guid Id,
    string Title,
    string Description,
    string ImageSrc,
    DateTime CreatedAt,
    string Category,
    int RoomCount,
    int BathroomCount,
    int GuestCount,
    string LocationValue,
    Guid UserId,
    int Price);

public record ListingWithUserDto(
    Guid Id,
    string Title,
    string Description,
    string ImageSrc,
    DateTime CreatedAt,
    string Category,
    int RoomCount,
    int BathroomCount,
    int GuestCount,
    string LocationValue,
    Guid UserId,
    int Price,
    UserDto User);

public record ReservationDto(
    Guid Id,
    Guid UserId,
    Guid ListingId,
    DateTime StartDate,
    DateTime EndDate,
    int TotalPrice,
    DateTime CreatedAt,
    ListingDto Listing);

public class ListingQuery
{
    public Guid? UserId { get; set; }
    public int? GuestCount { get; set; }
    public int? RoomCount { get; set; }
    public int? BathroomCount { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public string? LocationValue { get; set; }
    public string? Category { get; set; }
}

public class CreateListingRequest
{
    [Required, MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [Required, MaxLength(4000)]
    public string Description { get; set; } = string.Empty;

    [Required, Url, MaxLength(2048)]
    public string ImageSrc { get; set; } = string.Empty;

    [Required, MaxLength(80)]
    public string Category { get; set; } = string.Empty;

    [Range(1, 100)]
    public int RoomCount { get; set; } = 1;

    [Range(1, 100)]
    public int BathroomCount { get; set; } = 1;

    [Range(1, 100)]
    public int GuestCount { get; set; } = 1;

    [Required, StringLength(2, MinimumLength = 2)]
    public string LocationValue { get; set; } = string.Empty;

    [Range(1, 1_000_000)]
    public int Price { get; set; }
}

public class CreateReservationRequest
{
    [Required]
    public Guid ListingId { get; set; }

    [Required]
    public DateTime StartDate { get; set; }

    [Required]
    public DateTime EndDate { get; set; }

    [Range(1, 100_000_000)]
    public int TotalPrice { get; set; }
}
