using Microsoft.EntityFrameworkCore;
using Sakina.Api.Data;
using Sakina.Api.Dtos;
using Sakina.Api.Models;

namespace Sakina.Api.Services;

public class OrderException(string message) : Exception(message);

public class OrderService(AppDbContext db)
{
    /// السعر والعنوان بيتاخدوا من الداتابيز — مش من العميل — عشان محدش يتلاعب بالأسعار.
    public async Task<OrderCreatedDto> CreateAsync(CreateOrderRequest req, CancellationToken ct = default)
    {
        var lines = req.Items.GroupBy(i => i.ProductId)
            .Select(g => (ProductId: g.Key, Qty: Math.Min(g.Sum(x => x.Quantity), 20))).ToList();
        var ids = lines.Select(l => l.ProductId).ToList();
        var products = await db.Products.Where(p => ids.Contains(p.Id) && p.IsActive).ToDictionaryAsync(p => p.Id, ct);

        if (products.Count != lines.Count)
            throw new OrderException("One or more products are unavailable.");

        var order = new Order
        {
            OrderNumber = $"SK-{DateTime.UtcNow:yyMMdd}-{Random.Shared.Next(1000, 9999)}",
            CustomerName = req.CustomerName.Trim(),
            Phone = req.Phone.Trim(),
            Address = req.Address.Trim(),
            Notes = req.Notes?.Trim(),
            Items = lines.Select(l => new OrderItem
            {
                ProductId = l.ProductId,
                ProductTitle = products[l.ProductId].Title,
                UnitPrice = products[l.ProductId].Price,
                Quantity = l.Qty
            }).ToList()
        };
        order.Total = order.Items.Sum(i => i.UnitPrice * i.Quantity);

        db.Orders.Add(order);
        await db.SaveChangesAsync(ct);
        return new OrderCreatedDto(order.OrderNumber, order.Total);
    }
}
