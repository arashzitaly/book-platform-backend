using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BookPlatform.Core.Notification.Models;
using BookPlatform.Core.Notification.Services;

namespace BookPlatform.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class NotificationsController : ControllerBase
{
    private readonly INotificationService _notificationService;

    public NotificationsController(INotificationService notificationService)
    {
        _notificationService = notificationService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<NotificationDto>>> GetAll([FromQuery] int limit = 50, CancellationToken ct = default)
    {
        var userId = GetUserId();
        return Ok(await _notificationService.GetByUserIdAsync(userId, limit, ct));
    }

    [HttpGet("unread")]
    public async Task<ActionResult<IEnumerable<NotificationDto>>> GetUnread(CancellationToken ct)
    {
        var userId = GetUserId();
        return Ok(await _notificationService.GetUnreadByUserIdAsync(userId, ct));
    }

    [HttpGet("unread/count")]
    public async Task<ActionResult<int>> GetUnreadCount(CancellationToken ct)
    {
        var userId = GetUserId();
        var count = await _notificationService.GetUnreadCountAsync(userId, ct);
        return Ok(new { count });
    }

    [HttpPut("{id:guid}/read")]
    public async Task<ActionResult> MarkAsRead(Guid id, CancellationToken ct)
    {
        await _notificationService.MarkAsReadAsync(id, ct);
        return NoContent();
    }

    [HttpPut("read-all")]
    public async Task<ActionResult> MarkAllAsRead(CancellationToken ct)
    {
        var userId = GetUserId();
        await _notificationService.MarkAllAsReadAsync(userId, ct);
        return NoContent();
    }

    private Guid GetUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier);
        return claim != null ? Guid.Parse(claim.Value) : Guid.Empty;
    }
}
