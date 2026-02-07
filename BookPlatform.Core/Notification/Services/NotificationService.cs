using System.Data;
using Dapper;
using BookPlatform.Core.Notification.Models;
using BookPlatform.Core.Notification.Queries;

namespace BookPlatform.Core.Notification.Services;

public interface INotificationService
{
    Task<IEnumerable<NotificationDto>> GetByUserIdAsync(Guid userId, int limit = 50, CancellationToken ct = default);
    Task<IEnumerable<NotificationDto>> GetUnreadByUserIdAsync(Guid userId, CancellationToken ct = default);
    Task<int> GetUnreadCountAsync(Guid userId, CancellationToken ct = default);
    Task<Guid> CreateAsync(Guid userId, Guid? bookingId, NotificationType type, string title, string message, CancellationToken ct = default);
    Task MarkAsReadAsync(Guid id, CancellationToken ct = default);
    Task MarkAllAsReadAsync(Guid userId, CancellationToken ct = default);
}

public class NotificationService : INotificationService
{
    private readonly IDbConnection _db;

    public NotificationService(IDbConnection db) => _db = db;

    public async Task<IEnumerable<NotificationDto>> GetByUserIdAsync(Guid userId, int limit = 50, CancellationToken ct = default)
    {
        return await _db.QueryAsync<NotificationDto>(new CommandDefinition(
            NotificationQueries.GetByUserId, new { UserId = userId, Limit = limit }, cancellationToken: ct));
    }

    public async Task<IEnumerable<NotificationDto>> GetUnreadByUserIdAsync(Guid userId, CancellationToken ct = default)
    {
        return await _db.QueryAsync<NotificationDto>(new CommandDefinition(
            NotificationQueries.GetUnreadByUserId, new { UserId = userId }, cancellationToken: ct));
    }

    public async Task<int> GetUnreadCountAsync(Guid userId, CancellationToken ct = default)
    {
        return await _db.ExecuteScalarAsync<int>(new CommandDefinition(
            NotificationQueries.GetUnreadCount, new { UserId = userId }, cancellationToken: ct));
    }

    public async Task<Guid> CreateAsync(Guid userId, Guid? bookingId, NotificationType type, string title, string message, CancellationToken ct = default)
    {
        var notification = new Models.Notification
        {
            UserId = userId,
            BookingId = bookingId,
            Type = type,
            Title = title,
            Message = message,
            CreatedAt = DateTime.UtcNow
        };

        return await _db.ExecuteScalarAsync<Guid>(new CommandDefinition(
            NotificationQueries.Insert,
            new
            {
                notification.UserId,
                notification.BookingId,
                Type = (int)notification.Type,
                notification.Title,
                notification.Message,
                notification.IsRead,
                notification.CreatedAt
            },
            cancellationToken: ct));
    }

    public async Task MarkAsReadAsync(Guid id, CancellationToken ct = default)
    {
        await _db.ExecuteAsync(new CommandDefinition(
            NotificationQueries.MarkAsRead, new { Id = id, ReadAt = DateTime.UtcNow }, cancellationToken: ct));
    }

    public async Task MarkAllAsReadAsync(Guid userId, CancellationToken ct = default)
    {
        await _db.ExecuteAsync(new CommandDefinition(
            NotificationQueries.MarkAllAsRead, new { UserId = userId, ReadAt = DateTime.UtcNow }, cancellationToken: ct));
    }
}
