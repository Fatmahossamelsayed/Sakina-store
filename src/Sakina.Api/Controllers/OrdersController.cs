using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Sakina.Api.Dtos;
using Sakina.Api.Services;

namespace Sakina.Api.Controllers;

[ApiController, Route("api/orders")]
public class OrdersController(OrderService orders) : ControllerBase
{
    [HttpPost, EnableRateLimiting("orders")]
    public async Task<ActionResult<OrderCreatedDto>> Create(CreateOrderRequest req, CancellationToken ct)
    {
        try { return Ok(await orders.CreateAsync(req, ct)); }
        catch (OrderException ex) { return BadRequest(new { error = ex.Message }); }
    }
}
