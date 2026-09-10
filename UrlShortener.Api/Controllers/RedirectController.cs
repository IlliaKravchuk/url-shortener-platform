using Microsoft.AspNetCore.Mvc;
using UrlShortener.Api.Services;

namespace UrlShortener.Api.Controllers;

[ApiController]
[Route("")]
public class RedirectController : ControllerBase
{
    private readonly IUrlService _urlService;

    public RedirectController(IUrlService urlService)
    {
        _urlService = urlService;
    }

    [HttpGet("{shortCode}")]
    [ApiExplorerSettings(IgnoreApi = true)] // <--- Це ховає метод від Swagger і прибирає конфлікт
    public async Task<IActionResult> RedirectToOriginal(string shortCode)
    {
        if (shortCode.Equals("api", StringComparison.OrdinalIgnoreCase) || 
            shortCode.Equals("swagger", StringComparison.OrdinalIgnoreCase))
        {
            return NotFound();
        }

        var originalUrl = await _urlService.GetOriginalUrlAndTrackAsync(shortCode);
        if (originalUrl == null)
        {
            return NotFound(new { message = "Коротке посилання не знайдено." });
        }

        if (!originalUrl.StartsWith("http://") && !originalUrl.StartsWith("https://"))
        {
            originalUrl = "https://" + originalUrl;
        }

        return Redirect(originalUrl);
    }
}