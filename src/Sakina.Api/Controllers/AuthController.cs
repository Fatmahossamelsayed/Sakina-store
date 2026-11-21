using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Sakina.Api.Data;
using Sakina.Api.Dtos;
using Sakina.Api.Models;
using Sakina.Api.Services;

namespace Sakina.Api.Controllers;

[ApiController, Route("api/auth")]
public class AuthController(AppDbContext db, TokenService tokens) : ControllerBase
{
    [HttpPost("login")]
    public async Task<ActionResult<LoginResponse>> Login(LoginRequest req)
    {
        var user = await db.AdminUsers.FirstOrDefaultAsync(u => u.Username == req.Username);
        if (user is null) return Unauthorized();
        var ok = new PasswordHasher<AdminUser>().VerifyHashedPassword(user, user.PasswordHash, req.Password);
        return ok == PasswordVerificationResult.Failed ? Unauthorized() : tokens.Create(user);
    }
}
