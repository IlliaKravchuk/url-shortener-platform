using Microsoft.EntityFrameworkCore;
using UrlShortener.Api.Data;
using UrlShortener.Api.Models;

namespace UrlShortener.Api.Services;

public class UrlService : IUrlService
{
    private readonly AppDbContext _context;
    private const string Alphabet = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

    public UrlService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<ShortUrl> CreateShortUrlAsync(string originalUrl, int userId)
    {
        var existing = await _context.ShortUrls.FirstOrDefaultAsync(s => s.OriginalUrl == originalUrl);
        if (existing != null)
        {
            throw new InvalidOperationException("Такий URL вже існує в системі.");
        }

        var shortUrl = new ShortUrl
        {
            OriginalUrl = originalUrl,
            UserId = userId,
            ShortCode = "temp",
            CreatedAt = DateTime.UtcNow
        };

        _context.ShortUrls.Add(shortUrl);
        await _context.SaveChangesAsync();

        shortUrl.ShortCode = EncodeBase62(shortUrl.Id);
        await _context.SaveChangesAsync();

        // Підтягуємо дані користувача, щоб пошта була доступна після створення запису
        await _context.Entry(shortUrl).Reference(s => s.User).LoadAsync();

        return shortUrl;
    }

    public async Task<string?> GetOriginalUrlAndTrackAsync(string shortCode)
    {
        var shortUrl = await _context.ShortUrls.FirstOrDefaultAsync(s => s.ShortCode == shortCode);
        if (shortUrl == null) return null;

        shortUrl.ClickCount++;
        await _context.SaveChangesAsync();

        return shortUrl.OriginalUrl;
    }

    public async Task<bool> UpdateUrlAsync(int id, string newOriginalUrl, int userId, string userRole)
    {
        var shortUrl = await _context.ShortUrls.FindAsync(id);
        if (shortUrl == null) return false;

        if (userRole != "Admin" && shortUrl.UserId != userId)
        {
            throw new UnauthorizedAccessException("Ви не маєте прав на редагування цього посилання.");
        }

        shortUrl.OriginalUrl = newOriginalUrl;
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteUrlAsync(int id, int userId, string userRole)
    {
        var shortUrl = await _context.ShortUrls.FindAsync(id);
        if (shortUrl == null) return false;

        if (userRole != "Admin" && shortUrl.UserId != userId)
        {
            throw new UnauthorizedAccessException("Ви не маєте прав на видалення цього посилання.");
        }

        _context.ShortUrls.Remove(shortUrl);
        await _context.SaveChangesAsync();
        return true;
    }

    public string EncodeBase62(int id)
    {
        if (id == 0) return Alphabet[0].ToString();

        var result = new System.Text.StringBuilder();
        while (id > 0)
        {
            result.Insert(0, Alphabet[id % 62]);
            id /= 62;
        }
        return result.ToString();
    }
}