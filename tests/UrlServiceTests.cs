using Microsoft.EntityFrameworkCore;
using UrlShortener.Api.Data;
using UrlShortener.Api.Models;
using UrlShortener.Api.Services;
using Xunit;

namespace UrlShortener.Tests
{
    public class UrlServiceTests
    {
        // Допоміжний метод для створення чистої бази даних у пам'яті для кожного тесту
        private async Task<AppDbContext> GetDbContextAsync()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
                
            var context = new AppDbContext(options);
            await context.Database.EnsureCreatedAsync();
            return context;
        }

        [Fact]
        public async Task ShortenUrlAsync_ShouldCreateUniqueShortCode()
        {
            // Arrange (Підготовка)
            var context = await GetDbContextAsync();
            var service = new UrlService(context);
            var originalUrl = "https://google.com";
            var userEmail = "admin@ukr.net";

            // Act (Дія)
            var result = await service.ShortenUrlAsync(originalUrl, userEmail);

            // Assert (Перевірка)
            Assert.NotNull(result);
            Assert.NotEmpty(result.ShortCode);
            Assert.Equal(originalUrl, result.OriginalUrl);
            Assert.Equal(userEmail, result.CreatedBy);
            
            // Перевіряємо, чи зберігся запис у базу
            var savedUrl = await context.Urls.FirstOrDefaultAsync(u => u.ShortCode == result.ShortCode);
            Assert.NotNull(savedUrl);
        }

        [Fact]
        public async Task GetOriginalUrlAndTrackAsync_ShouldIncrementClickCount()
        {
            // Arrange (Підготовка)
            var context = await GetDbContextAsync();
            var service = new UrlService(context);
            
            var url = new Url 
            { 
                OriginalUrl = "https://test.com", 
                ShortCode = "abc12",
                CreatedBy = "user@test.com",
                ClickCount = 0 // Початкове значення
            };
            
            context.Urls.Add(url);
            await context.SaveChangesAsync();

            // Act (Дія) - імітуємо перехід за коротким посиланням
            var resultUrl = await service.GetOriginalUrlAndTrackAsync("abc12");
            var updatedUrlInDb = await context.Urls.FindAsync(url.Id);

            // Assert (Перевірка)
            Assert.Equal("https://test.com", resultUrl);
            Assert.Equal(1, updatedUrlInDb.ClickCount); // Кліки мають збільшитися на 1
        }
    }
}