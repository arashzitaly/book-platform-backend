using Microsoft.AspNetCore.Mvc;
using BookPlatform.Core.Auth.Models;
using BookPlatform.Core.Auth.Services;

namespace BookPlatform.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register([FromBody] RegisterRequest request, CancellationToken ct)
    {
        var response = await _authService.RegisterAsync(request, ct);
        if (response == null)
        {
            return BadRequest(new { message = "Email already exists" });
        }
        return Ok(response);
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest request, CancellationToken ct)
    {
        var response = await _authService.LoginAsync(request, ct);
        if (response == null)
        {
            return Unauthorized(new { message = "Invalid email or password" });
        }
        return Ok(response);
    }
}
