using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UrlShortener.Api.Data;
using UrlShortener.Api.DTOs;
using UrlShortener.Api.Services;

namespace UrlShortener.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UrlsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IUrlService _urlService;

    public UrlsController(AppDbContext context, IUrlService urlService)
    {
        _context = context;
        _urlService = urlService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        // 1. Вивантажуємо списки в оперативну пам'ять сервера
        var urls = await _context.ShortUrls.OrderByDescending(s => s.CreatedAt).ToListAsync();
        var users = await _context.Users.ToListAsync();

        // 2. З'єднуємо їх тут, ігноруючи глюки Entity Framework
        var result = urls.Select(s => new
        {
            s.Id,
            s.OriginalUrl,
            s.ShortCode,
            s.CreatedAt,
            s.ClickCount,
            createdBy = users.FirstOrDefault(u => u.Id == s.UserId)?.Email ?? "Невідомо"
        });

        return Ok(result);
    }

    [HttpGet("{id}")]
    [Authorize]
    public async Task<IActionResult> GetById(int id)
    {
        var url = await _context.ShortUrls.FirstOrDefaultAsync(s => s.Id == id);
        if (url == null) return NotFound();

        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == url.UserId);

        return Ok(new
        {
            url.Id,
            url.OriginalUrl,
            url.ShortCode,
            url.CreatedAt,
            url.ClickCount,
            createdBy = user?.Email ?? "Невідомо",
            url.UserId
        });
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create([FromBody] CreateUrlDto dto)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdClaim == null) return Unauthorized();

        int userId = int.Parse(userIdClaim);

        try
        {
            var result = await _urlService.CreateShortUrlAsync(dto.OriginalUrl, userId);
            var user = await _context.Users.FindAsync(userId);
            
            var userEmail = user?.Email;
            if (string.IsNullOrEmpty(userEmail)) 
            {
                userEmail = User.FindFirst(ClaimTypes.Email)?.Value ?? "Невідомо";
            }

            return Ok(new
            {
                result.Id,
                result.OriginalUrl,
                result.ShortCode,
                result.CreatedAt,
                result.ClickCount,
                createdBy = userEmail
            });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> Update(int id, [FromBody] CreateUrlDto dto)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var userRole = User.FindFirst(ClaimTypes.Role)?.Value ?? User.FindFirst("role")?.Value;

        if (userIdClaim == null || userRole == null) return Unauthorized();

        int userId = int.Parse(userIdClaim);

        try
        {
            var success = await _urlService.UpdateUrlAsync(id, dto.OriginalUrl, userId, userRole);
            if (!success) return NotFound();
            return NoContent();
        }
        catch (UnauthorizedAccessException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> Delete(int id)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var userRole = User.FindFirst(ClaimTypes.Role)?.Value ?? User.FindFirst("role")?.Value;

        if (userIdClaim == null || userRole == null) return Unauthorized();

        int userId = int.Parse(userIdClaim);

        try
        {
            var success = await _urlService.DeleteUrlAsync(id, userId, userRole);
            if (!success) return NotFound();
            return NoContent();
        }
        catch (UnauthorizedAccessException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}