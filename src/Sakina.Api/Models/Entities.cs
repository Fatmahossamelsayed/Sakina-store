namespace Sakina.Api.Models;

public enum OrderStatus { Pending, Confirmed, Shipped, Delivered, Cancelled }

public class Product
{
    public int Id { get; set; }
    public string Category { get; set; } = "";   // isdal | pajamas | abayas | dresses
    public string Title { get; set; } = "";
    public string? TitleEn { get; set; }
    public decimal Price { get; set; }
    public string? Tag { get; set; }              // bestseller | new | limited
    public string? TagName { get; set; }
    public string? TagNameEn { get; set; }
    public bool IsActive { get; set; } = true;
    public List<ProductImage> Images { get; set; } = new();
}

public class ProductImage
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public string Url { get; set; } = "";
    public int SortOrder { get; set; }
}

public class Order
{
    public int Id { get; set; }
    public string OrderNumber { get; set; } = "";
    public string CustomerName { get; set; } = "";
    public string Phone { get; set; } = "";
    public string Address { get; set; } = "";
    public string? Notes { get; set; }
    public decimal Total { get; set; }
    public OrderStatus Status { get; set; } = OrderStatus.Pending;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public List<OrderItem> Items { get; set; } = new();
}

public class OrderItem
{
    public int Id { get; set; }
    public int OrderId { get; set; }
    public int ProductId { get; set; }
    public string ProductTitle { get; set; } = "";  // snapshot وقت الطلب
    public decimal UnitPrice { get; set; }          // snapshot وقت الطلب
    public int Quantity { get; set; }
}

public class AdminUser
{
    public int Id { get; set; }
    public string Username { get; set; } = "";
    public string PasswordHash { get; set; } = "";
}
