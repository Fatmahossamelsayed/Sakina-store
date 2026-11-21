using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Sakina.Api.Dtos;
using Sakina.Api.Models;

namespace Sakina.Api.Services;

public class TokenService(IConfiguration config)
{
    public LoginResponse Create(AdminUser user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Key"]!));
        var expires = DateTime.UtcNow.AddHours(8);
        var token = new JwtSecurityToken(
            issuer: config["Jwt:Issuer"], audience: config["Jwt:Issuer"],
            claims: new[] { new Claim(ClaimTypes.Name, user.Username), new Claim(ClaimTypes.Role, "Admin") },
            expires: expires,
            signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256));
        return new LoginResponse(new JwtSecurityTokenHandler().WriteToken(token), expires);
    }
}
