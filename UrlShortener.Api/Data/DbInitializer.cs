using Microsoft.EntityFrameworkCore;
using UrlShortener.Api.Models;

namespace UrlShortener.Api.Data;

public static class DbInitializer
{
    public static async Task InitializeAsync(AppDbContext context)
    {
        await context.Database.MigrateAsync();

        if (!await context.Users.AnyAsync())
        {
            var adminUser = new User
            {
                Email = "admin@short.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"),
                Role = "Admin"
            };

            var regularUser = new User
            {
                Email = "user@short.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("User123!"),
                Role = "User"
            };

            context.Users.AddRange(adminUser, regularUser);
            
            context.AboutContents.Add(new AboutContent
            {
                Content = "Цей сервіс скорочення посилань використовує алгоритм Base62 на основі унікальних ідентифікаторів.",
                LastUpdatedBy = "admin@short.com",
                UpdatedAt = DateTime.UtcNow
            });

            await context.SaveChangesAsync();
        }
    }
}
