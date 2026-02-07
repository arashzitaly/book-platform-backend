namespace BookPlatform.Core.Booking.Models;

public enum BookingStatus
{
    Requested = 0,
    PendingValidation = 1,
    Accepted = 2,
    Rejected = 3,
    Cancelled = 4,
    Completed = 5
}

public class Booking
{
    public Guid Id { get; set; }
    public Guid FacilityId { get; set; }
    public Guid UserId { get; set; }
    public Guid SlotId { get; set; }
    public BookingStatus Status { get; set; } = BookingStatus.Requested;
    public string? Notes { get; set; }
    public int PartySize { get; set; } = 1;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

public class CreateBookingRequest
{
    public Guid FacilityId { get; set; }
    public Guid SlotId { get; set; }
    public string? Notes { get; set; }
    public int PartySize { get; set; } = 1;
}

public class UpdateBookingStatusRequest
{
    public BookingStatus Status { get; set; }
    public string? Reason { get; set; }
}

public class BookingDto
{
    public Guid Id { get; set; }
    public Guid FacilityId { get; set; }
    public string FacilityName { get; set; } = string.Empty;
    public Guid UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public Guid SlotId { get; set; }
    public DateTime SlotStartTime { get; set; }
    public DateTime SlotEndTime { get; set; }
    public BookingStatus Status { get; set; }
    public string? Notes { get; set; }
    public int PartySize { get; set; }
    public DateTime CreatedAt { get; set; }
}
