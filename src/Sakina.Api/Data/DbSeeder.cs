using System.Text.Json;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Sakina.Api.Models;

namespace Sakina.Api.Data;

public static class DbSeeder
{
    private record SeedProduct(string Category, string Title, string? TitleEn, decimal Price,
        List<string> Images, string? Tag, string? TagName, string? TagNameEn);

    public static async Task SeedAsync(AppDbContext db, IConfiguration config, string contentRoot)
    {
        await db.Database.EnsureCreatedAsync();

        if (!await db.Products.AnyAsync())
        {
            var json = await File.ReadAllTextAsync(Path.Combine(contentRoot, "Data", "products.json"));
            var items = JsonSerializer.Deserialize<List<SeedProduct>>(json,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true }) ?? new();
            db.Products.AddRange(items.Select(s => new Product
            {
                Category = s.Category, Title = s.Title, TitleEn = s.TitleEn, Price = s.Price,
                Tag = s.Tag, TagName = s.TagName, TagNameEn = s.TagNameEn,
                Images = s.Images.Select((u, i) => new ProductImage { Url = u, SortOrder = i }).ToList()
            }));
            await db.SaveChangesAsync();
        }

        var user = config["Admin:Username"];
        var pass = config["Admin:Password"];
        if (!string.IsNullOrWhiteSpace(user) && !string.IsNullOrWhiteSpace(pass)
            && !await db.AdminUsers.AnyAsync())
        {
            var admin = new AdminUser { Username = user };
            admin.PasswordHash = new PasswordHasher<AdminUser>().HashPassword(admin, pass);
            db.AdminUsers.Add(admin);
            await db.SaveChangesAsync();
        }
    }
}
