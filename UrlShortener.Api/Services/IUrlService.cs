using UrlShortener.Api.Models;

namespace UrlShortener.Api.Services;

public interface IUrlService
{
    Task<ShortUrl> CreateShortUrlAsync(string originalUrl, int userId);
    Task<string?> GetOriginalUrlAndTrackAsync(string shortCode);
    Task<bool> UpdateUrlAsync(int id, string newOriginalUrl, int userId, string userRole);
    Task<bool> DeleteUrlAsync(int id, int userId, string userRole);
    string EncodeBase62(int id);
}