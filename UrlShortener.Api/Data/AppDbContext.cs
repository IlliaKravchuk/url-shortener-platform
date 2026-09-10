using Microsoft.EntityFrameworkCore;
using UrlShortener.Api.Models;

namespace UrlShortener.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<ShortUrl> ShortUrls => Set<ShortUrl>();
    public DbSet<AboutContent> AboutContents => Set<AboutContent>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<ShortUrl>()
            .HasIndex(s => s.ShortCode)
            .IsUnique();

        modelBuilder.Entity<ShortUrl>()
            .HasIndex(s => s.OriginalUrl);
    }
}
