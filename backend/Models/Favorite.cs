namespace Airbnb.Api.Models;

public class Favorite
{
    public Guid UserId { get; set; }
    public Guid ListingId { get; set; }

    public User User { get; set; } = null!;
    public Listing Listing { get; set; } = null!;
}
