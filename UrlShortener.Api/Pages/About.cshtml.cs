using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using UrlShortener.Api.Data;
using UrlShortener.Api.Models;

namespace UrlShortener.Api.Pages;

public class AboutModel : PageModel
{
    private readonly AppDbContext _context;

    public AboutModel(AppDbContext context)
    {
        _context = context;
    }

    [BindProperty]
    public new string Content { get; set; } = string.Empty;
    public string LastUpdatedBy { get; set; } = string.Empty;
    public bool IsAdmin { get; set; }
    public bool IsSuccess { get; set; }

    public async Task<IActionResult> OnGetAsync()
    {
        CheckAdminRole();
        var aboutInfo = await _context.AboutContents.FirstOrDefaultAsync();
        
        if (aboutInfo != null)
        {
            Content = aboutInfo.Content;
            LastUpdatedBy = aboutInfo.LastUpdatedBy;
        }

        return Page();
    }

    public async Task<IActionResult> OnPostAsync()
    {
        CheckAdminRole();
        if (!IsAdmin)
        {
            return Forbid();
        }

        var aboutInfo = await _context.AboutContents.FirstOrDefaultAsync();
        var userEmail = User.FindFirst(ClaimTypes.Email)?.Value ?? "Admin";

        if (aboutInfo != null)
        {
            aboutInfo.Content = Content;
            aboutInfo.UpdatedAt = DateTime.UtcNow;
            aboutInfo.LastUpdatedBy = userEmail;
        }
        else
        {
            _context.AboutContents.Add(new AboutContent
            {
                Content = Content,
                UpdatedAt = DateTime.UtcNow,
                LastUpdatedBy = userEmail
            });
        }

        await _context.SaveChangesAsync();
        IsSuccess = true;
        LastUpdatedBy = userEmail;
        
        return Page();
    }

    private void CheckAdminRole()
    {
        var role = User.FindFirst(ClaimTypes.Role)?.Value;
        IsAdmin = role == "Admin";
    }
}