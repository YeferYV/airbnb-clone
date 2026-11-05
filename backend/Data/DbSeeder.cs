using Airbnb.Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Airbnb.Api.Data;

public static class DbSeeder
{
    public const string DemoEmail = "demo@airbnb.dev";
    public const string DemoPassword = "password123";

    public static async Task SeedAsync(AirbnbDbContext dbContext)
    {
        await dbContext.Database.EnsureCreatedAsync();

        if (await dbContext.Users.AnyAsync())
        {
            return;
        }

        var hasher = new PasswordHasher<User>();

        var demo = new User
        {
            Name = "Demo Guest",
            Email = DemoEmail,
            Image = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"
        };
        demo.PasswordHash = hasher.HashPassword(demo, DemoPassword);

        var host = new User
        {
            Name = "Maicon Gavazzoni",
            Email = "host@airbnb.dev",
            Image = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
        };
        host.PasswordHash = hasher.HashPassword(host, DemoPassword);

        var islandHost = new User
        {
            Name = "Ana Martins",
            Email = "ana@airbnb.dev",
            Image = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80"
        };
        islandHost.PasswordHash = hasher.HashPassword(islandHost, DemoPassword);

        var listings = new List<Listing>
        {
            CreateListing(host, "Seaside villa with infinity pool", "Wake up to ocean views and unwind in a private infinity pool surrounded by palm trees.", "photo-1613490493576-7fde63acd811", "Pools", 4, 3, 8, "PT", 289),
            CreateListing(host, "Modern glass house in the hills", "A striking architectural retreat with floor-to-ceiling windows and a peaceful garden.", "photo-1600607687939-ce8a6c25118c", "Modern", 3, 2, 6, "US", 415),
            CreateListing(host, "Cozy cabin beside the lake", "A handcrafted wooden cabin with a private dock, fireplace and forest trails.", "photo-1449158743715-0a90ebb6d2d8", "Lake", 2, 1, 4, "CA", 175),
            CreateListing(host, "Cliffside cottage with a view", "Perched above the coastline, this charming cottage offers dramatic sunsets.", "photo-1499793983690-e29da59ef1c2", "Beach", 2, 2, 4, "GR", 210),
            CreateListing(host, "Rustic barn conversion", "Original timber beams meet thoughtful modern comfort in this countryside hideaway.", "photo-1510798831971-661eb04b3739", "Barns", 3, 2, 5, "FR", 190),
            CreateListing(host, "Snowy alpine chalet", "Ski-in, ski-out chalet with a hot tub and panoramic mountain views.", "photo-1542718610-a1d656d1884c", "Skiing", 4, 3, 8, "CH", 320),
            CreateListing(islandHost, "Private island bungalow", "Your own slice of paradise with turquoise water just steps from the deck.", "photo-1470770841072-f978cf4d019e", "Islands", 1, 1, 2, "ID", 245),
            CreateListing(islandHost, "Whitewashed cave suite", "A romantic cave suite carved into the hillside with a terrace over the sea.", "photo-1505691938895-1758d7feb511", "Caves", 1, 1, 2, "ES", 225),
            CreateListing(islandHost, "Historic castle apartment", "Stay inside the walls of a restored castle, close to vineyards and old town squares.", "photo-1512917774080-9991f1c4c750", "Castles", 2, 2, 4, "IT", 260),
            CreateListing(host, "Desert adobe retreat", "Minimal desert living under wide skies, with an outdoor bath and fire pit.", "photo-1523217582562-09d0def993a6", "Desert", 2, 1, 3, "MX", 165),
            CreateListing(host, "Scandinavian arctic lodge", "A warm timber lodge for northern lights nights and snowy adventures.", "photo-1564013799919-ab600027ffc6", "Arctic", 3, 2, 6, "NO", 350),
            CreateListing(islandHost, "Tropical treehouse hideaway", "Fall asleep to the sounds of the jungle in this breezy treehouse.", "photo-1580587771525-78b9dba3b914", "Camping", 1, 1, 3, "BR", 140),
            CreateListing(host, "Windmill loft in the countryside", "A one-of-a-kind loft inside a working windmill, surrounded by green fields.", "photo-1510798831971-661eb04b3739", "Windmills", 2, 1, 3, "NL", 185),
            CreateListing(islandHost, "Palm-fringed beach house", "A relaxed beach house with wide verandas and direct access to soft white sand.", "photo-1600596542815-ffad4c1539a9", "Beach", 3, 2, 6, "AU", 275),
            CreateListing(host, "Luxury penthouse in the city", "A designer penthouse with a rooftop pool, skyline views and concierge service.", "photo-1600585154340-be6161a56a0c", "Lux", 3, 3, 6, "AE", 520)
        };

        dbContext.Users.AddRange(demo, host, islandHost);
        dbContext.Listings.AddRange(listings);
        await dbContext.SaveChangesAsync();

        dbContext.Favorites.AddRange(
            new Favorite { UserId = demo.Id, ListingId = listings[0].Id },
            new Favorite { UserId = demo.Id, ListingId = listings[6].Id });

        var today = DateTime.UtcNow.Date;
        dbContext.Reservations.AddRange(
            new Reservation
            {
                UserId = demo.Id,
                ListingId = listings[3].Id,
                StartDate = today.AddDays(21),
                EndDate = today.AddDays(25),
                TotalPrice = listings[3].Price * 4
            },
            new Reservation
            {
                UserId = host.Id,
                ListingId = listings[14].Id,
                StartDate = today.AddDays(30),
                EndDate = today.AddDays(33),
                TotalPrice = listings[14].Price * 3
            });

        await dbContext.SaveChangesAsync();
    }

    private static Listing CreateListing(
        User host,
        string title,
        string description,
        string imageId,
        string category,
        int roomCount,
        int bathroomCount,
        int guestCount,
        string locationValue,
        int price)
    {
        return new Listing
        {
            Title = title,
            Description = description,
            ImageSrc = $"https://images.unsplash.com/{imageId}?auto=format&fit=crop&w=1400&q=80",
            Category = category,
            RoomCount = roomCount,
            BathroomCount = bathroomCount,
            GuestCount = guestCount,
            LocationValue = locationValue,
            UserId = host.Id,
            Price = price,
            CreatedAt = DateTime.UtcNow.AddMinutes(-Random.Shared.Next(1, 5000))
        };
    }
}
