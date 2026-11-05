using Airbnb.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Airbnb.Api.Data;

public class AirbnbDbContext(DbContextOptions<AirbnbDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Listing> Listings => Set<Listing>();
    public DbSet<Reservation> Reservations => Set<Reservation>();
    public DbSet<Favorite> Favorites => Set<Favorite>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasIndex(user => user.Email).IsUnique();
            entity.Property(user => user.Name).HasMaxLength(120).IsRequired();
            entity.Property(user => user.Email).HasMaxLength(255).IsRequired();
            entity.Property(user => user.PasswordHash).IsRequired();
            entity.Property(user => user.Image).HasMaxLength(2048);
        });

        modelBuilder.Entity<Listing>(entity =>
        {
            entity.Property(listing => listing.Title).HasMaxLength(200).IsRequired();
            entity.Property(listing => listing.Description).HasMaxLength(4000).IsRequired();
            entity.Property(listing => listing.ImageSrc).HasMaxLength(2048).IsRequired();
            entity.Property(listing => listing.Category).HasMaxLength(80).IsRequired();
            entity.Property(listing => listing.LocationValue).HasMaxLength(8).IsRequired();

            entity.HasOne(listing => listing.User)
                .WithMany(user => user.Listings)
                .HasForeignKey(listing => listing.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(listing => listing.Category);
            entity.HasIndex(listing => listing.LocationValue);
            entity.HasIndex(listing => listing.CreatedAt);
        });

        modelBuilder.Entity<Reservation>(entity =>
        {
            entity.HasOne(reservation => reservation.User)
                .WithMany(user => user.Reservations)
                .HasForeignKey(reservation => reservation.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(reservation => reservation.Listing)
                .WithMany(listing => listing.Reservations)
                .HasForeignKey(reservation => reservation.ListingId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(reservation => reservation.ListingId);
            entity.HasIndex(reservation => reservation.UserId);
        });

        modelBuilder.Entity<Favorite>(entity =>
        {
            entity.HasKey(favorite => new { favorite.UserId, favorite.ListingId });

            entity.HasOne(favorite => favorite.User)
                .WithMany(user => user.Favorites)
                .HasForeignKey(favorite => favorite.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(favorite => favorite.Listing)
                .WithMany(listing => listing.Favorites)
                .HasForeignKey(favorite => favorite.ListingId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
