namespace BookPlatform.Core.Notification.Models;

public enum NotificationType
{
    ReservationAccepted = 0,
    ReservationRejected = 1,
    ReservationReminder = 2,
    NewReservationRequest = 3
}

public class Notification
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid? BookingId { get; set; }
    public NotificationType Type { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public bool IsRead { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ReadAt { get; set; }
}

public class NotificationDto
{
    public Guid Id { get; set; }
    public NotificationType Type { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public bool IsRead { get; set; }
    public DateTime CreatedAt { get; set; }
    public Guid? BookingId { get; set; }
}
