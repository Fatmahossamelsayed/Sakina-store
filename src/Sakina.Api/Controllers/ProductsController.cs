using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Sakina.Api.Data;
using Sakina.Api.Dtos;

namespace Sakina.Api.Controllers;

[ApiController, Route("api/products")]
public class ProductsController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<ProductDto>>> List([FromQuery] string? category)
    {
        var q = db.Products.AsNoTracking().Include(p => p.Images).Where(p => p.IsActive);
        if (!string.IsNullOrWhiteSpace(category)) q = q.Where(p => p.Category == category);
        var items = await q.OrderBy(p => p.Id).ToListAsync();
        return items.Select(ProductDto.From).ToList();
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ProductDto>> Get(int id)
    {
        var p = await db.Products.AsNoTracking().Include(x => x.Images).FirstOrDefaultAsync(x => x.Id == id && x.IsActive);
        return p is null ? NotFound() : ProductDto.From(p);
    }
}
