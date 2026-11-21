using System.ComponentModel.DataAnnotations;
using Sakina.Api.Models;

namespace Sakina.Api.Dtos;

public record ProductDto(int Id, string Category, string Title, string? TitleEn, decimal Price,
    string? Tag, string? TagName, string? TagNameEn, List<string> Images, bool IsActive = true)
{
    public static ProductDto From(Product p) => new(p.Id, p.Category, p.Title, p.TitleEn, p.Price,
        p.Tag, p.TagName, p.TagNameEn, p.Images.OrderBy(i => i.SortOrder).Select(i => i.Url).ToList(), p.IsActive);
}

public class ProductUpsertRequest
{
    [Required, RegularExpression("^(isdal|pajamas|abayas|dresses)$")] public string Category { get; set; } = "";
    [Required, StringLength(200)] public string Title { get; set; } = "";
    [StringLength(200)] public string? TitleEn { get; set; }
    [Range(1, 1000000)] public decimal Price { get; set; }
    [RegularExpression("^(bestseller|new|limited)?$")] public string? Tag { get; set; }
    [StringLength(60)] public string? TagName { get; set; }
    [StringLength(60)] public string? TagNameEn { get; set; }
    [Required, MinLength(1)] public List<string> Images { get; set; } = new();
    public bool IsActive { get; set; } = true;
}

public class OrderItemRequest
{
    [Range(1, int.MaxValue)] public int ProductId { get; set; }
    [Range(1, 20)] public int Quantity { get; set; }
}

public class CreateOrderRequest
{
    [Required, StringLength(120, MinimumLength = 2)] public string CustomerName { get; set; } = "";
    [Required, RegularExpression(@"^(\+?20|0)?1[0125]\d{8}$", ErrorMessage = "Invalid Egyptian mobile number")]
    public string Phone { get; set; } = "";
    [Required, StringLength(400, MinimumLength = 5)] public string Address { get; set; } = "";
    [StringLength(1000)] public string? Notes { get; set; }
    [Required, MinLength(1), MaxLength(50)] public List<OrderItemRequest> Items { get; set; } = new();
}

public record OrderCreatedDto(string OrderNumber, decimal Total);
public record OrderItemDto(int ProductId, string ProductTitle, decimal UnitPrice, int Quantity);
public record OrderDto(int Id, string OrderNumber, string CustomerName, string Phone, string Address,
    string? Notes, decimal Total, string Status, DateTime CreatedAt, List<OrderItemDto> Items)
{
    public static OrderDto From(Order o) => new(o.Id, o.OrderNumber, o.CustomerName, o.Phone, o.Address,
        o.Notes, o.Total, o.Status.ToString(), o.CreatedAt,
        o.Items.Select(i => new OrderItemDto(i.ProductId, i.ProductTitle, i.UnitPrice, i.Quantity)).ToList());
}

public record UpdateStatusRequest(OrderStatus Status);
public record LoginRequest([Required] string Username, [Required] string Password);
public record LoginResponse(string Token, DateTime ExpiresAt);
