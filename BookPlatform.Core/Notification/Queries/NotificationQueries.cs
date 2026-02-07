namespace BookPlatform.Core.Notification.Queries;

public static class NotificationQueries
{
    public const string Insert = @"
        INSERT INTO notifications (user_id, booking_id, type, title, message, is_read, created_at)
        VALUES (@UserId, @BookingId, @Type, @Title, @Message, @IsRead, @CreatedAt)
        RETURNING id;";

    public const string MarkAsRead = @"
        UPDATE notifications SET is_read = true, read_at = @ReadAt WHERE id = @Id;";

    public const string MarkAllAsRead = @"
        UPDATE notifications SET is_read = true, read_at = @ReadAt WHERE user_id = @UserId AND is_read = false;";

    public const string Delete = @"DELETE FROM notifications WHERE id = @Id;";

    public const string GetByUserId = @"
        SELECT id, type, title, message, is_read as IsRead, created_at as CreatedAt, booking_id as BookingId
        FROM notifications WHERE user_id = @UserId ORDER BY created_at DESC LIMIT @Limit;";

    public const string GetUnreadByUserId = @"
        SELECT id, type, title, message, is_read as IsRead, created_at as CreatedAt, booking_id as BookingId
        FROM notifications WHERE user_id = @UserId AND is_read = false ORDER BY created_at DESC;";

    public const string GetUnreadCount = @"
        SELECT COUNT(*) FROM notifications WHERE user_id = @UserId AND is_read = false;";
}
