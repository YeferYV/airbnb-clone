namespace Airbnb.Api.Models;

public class Listing
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string ImageSrc { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public string Category { get; set; } = string.Empty;
    public int RoomCount { get; set; }
    public int BathroomCount { get; set; }
    public int GuestCount { get; set; }
    public string LocationValue { get; set; } = string.Empty;
    public Guid UserId { get; set; }
    public int Price { get; set; }

    public User User { get; set; } = null!;
    public ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
    public ICollection<Favorite> Favorites { get; set; } = new List<Favorite>();
}
