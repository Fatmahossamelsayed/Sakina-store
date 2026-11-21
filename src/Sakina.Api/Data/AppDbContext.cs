using Microsoft.EntityFrameworkCore;
using Sakina.Api.Models;

namespace Sakina.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Product> Products => Set<Product>();
    public DbSet<ProductImage> ProductImages => Set<ProductImage>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();
    public DbSet<AdminUser> AdminUsers => Set<AdminUser>();

    protected override void OnModelCreating(ModelBuilder b)
    {
        b.Entity<Product>(e =>
        {
            e.Property(x => x.Category).HasMaxLength(30);
            e.Property(x => x.Title).HasMaxLength(200);
            e.Property(x => x.TitleEn).HasMaxLength(200);
            e.Property(x => x.Price).HasPrecision(10, 2);
            e.HasIndex(x => new { x.Category, x.IsActive });
            e.HasMany(x => x.Images).WithOne().HasForeignKey(i => i.ProductId).OnDelete(DeleteBehavior.Cascade);
        });
        b.Entity<ProductImage>().Property(x => x.Url).HasMaxLength(500);
        b.Entity<Order>(e =>
        {
            e.HasIndex(x => x.OrderNumber).IsUnique();
            e.HasIndex(x => x.CreatedAt);
            e.Property(x => x.OrderNumber).HasMaxLength(30);
            e.Property(x => x.CustomerName).HasMaxLength(120);
            e.Property(x => x.Phone).HasMaxLength(20);
            e.Property(x => x.Address).HasMaxLength(400);
            e.Property(x => x.Notes).HasMaxLength(1000);
            e.Property(x => x.Total).HasPrecision(10, 2);
            e.Property(x => x.Status).HasConversion<string>().HasMaxLength(20);
            e.HasMany(x => x.Items).WithOne().HasForeignKey(i => i.OrderId).OnDelete(DeleteBehavior.Cascade);
        });
        b.Entity<OrderItem>(e =>
        {
            e.Property(x => x.UnitPrice).HasPrecision(10, 2);
            e.Property(x => x.ProductTitle).HasMaxLength(200);
            // المنتج ما بيتمسحش فعلياً (soft delete) فمفيش FK عليه عشان الطلبات القديمة تفضل سليمة
        });
        b.Entity<AdminUser>().HasIndex(x => x.Username).IsUnique();
    }
}
