using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Sakina.Api.Data;
using Sakina.Api.Dtos;
using Sakina.Api.Models;

namespace Sakina.Api.Controllers;

[ApiController, Authorize(Roles = "Admin"), Route("api/admin")]
public class AdminController(AppDbContext db) : ControllerBase
{
    // ---------- Orders ----------
    [HttpGet("orders")]
    public async Task<List<OrderDto>> Orders([FromQuery] OrderStatus? status, int page = 1, int pageSize = 20)
    {
        pageSize = Math.Clamp(pageSize, 1, 100);
        var q = db.Orders.AsNoTracking().Include(o => o.Items).AsQueryable();
        if (status is not null) q = q.Where(o => o.Status == status);
        var list = await q.OrderByDescending(o => o.CreatedAt)
            .Skip((Math.Max(page, 1) - 1) * pageSize).Take(pageSize).ToListAsync();
        return list.Select(OrderDto.From).ToList();
    }

    [HttpPatch("orders/{id:int}/status")]
    public async Task<ActionResult<OrderDto>> SetStatus(int id, UpdateStatusRequest req)
    {
        var o = await db.Orders.Include(x => x.Items).FirstOrDefaultAsync(x => x.Id == id);
        if (o is null) return NotFound();
        o.Status = req.Status;
        await db.SaveChangesAsync();
        return OrderDto.From(o);
    }

    // ---------- Products ----------
    [HttpGet("products")]
    public async Task<List<ProductDto>> AllProducts()   // بيشمل المنتجات المخفية
    {
        var items = await db.Products.AsNoTracking().Include(p => p.Images).OrderByDescending(p => p.Id).ToListAsync();
        return items.Select(ProductDto.From).ToList();
    }

    [HttpPost("uploads"), RequestSizeLimit(10_000_000)]
    public async Task<IActionResult> Upload([FromForm] IFormFile file, [FromServices] IWebHostEnvironment env)
    {
        var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (file.Length == 0 || !new[] { ".jpg", ".jpeg", ".jfif", ".png", ".webp" }.Contains(ext))
            return BadRequest(new { error = "Unsupported image type" });

        var head = new byte[4];
        await using (var s = file.OpenReadStream()) await s.ReadExactlyAsync(head, 0, Math.Min(4, (int)file.Length));
        var ok = (head[0] == 0xFF && head[1] == 0xD8) || (head[0] == 0x89 && head[1] == 0x50) || (head[0] == 0x52 && head[1] == 0x49);
        if (!ok) return BadRequest(new { error = "File is not a valid image" });

        var dir = Path.Combine(env.WebRootPath, "images", "uploads");
        Directory.CreateDirectory(dir);
        var name = $"{Guid.NewGuid():N}{ext}";
        await using (var fs = System.IO.File.Create(Path.Combine(dir, name))) await file.CopyToAsync(fs);
        return Ok(new { url = $"images/uploads/{name}" });
    }

    [HttpPost("products")]
    public async Task<ActionResult<ProductDto>> CreateProduct(ProductUpsertRequest req)
    {
        var p = new Product();
        Apply(p, req);
        db.Products.Add(p);
        await db.SaveChangesAsync();
        return CreatedAtAction("Get", "Products", new { id = p.Id }, ProductDto.From(p));
    }

    [HttpPut("products/{id:int}")]
    public async Task<ActionResult<ProductDto>> UpdateProduct(int id, ProductUpsertRequest req)
    {
        var p = await db.Products.Include(x => x.Images).FirstOrDefaultAsync(x => x.Id == id);
        if (p is null) return NotFound();
        p.Images.Clear();
        Apply(p, req);
        await db.SaveChangesAsync();
        return ProductDto.From(p);
    }

    [HttpDelete("products/{id:int}")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        var p = await db.Products.FindAsync(id);
        if (p is null) return NotFound();
        p.IsActive = false; // soft delete: الطلبات القديمة تفضل مرتبطة بالمنتج
        await db.SaveChangesAsync();
        return NoContent();
    }

    private static void Apply(Product p, ProductUpsertRequest r)
    {
        p.Category = r.Category; p.Title = r.Title.Trim(); p.TitleEn = r.TitleEn?.Trim();
        p.Price = r.Price; p.Tag = string.IsNullOrEmpty(r.Tag) ? null : r.Tag;
        p.TagName = r.TagName; p.TagNameEn = r.TagNameEn; p.IsActive = r.IsActive;
        p.Images = r.Images.Select((u, i) => new ProductImage { Url = u, SortOrder = i }).ToList();
    }
}
