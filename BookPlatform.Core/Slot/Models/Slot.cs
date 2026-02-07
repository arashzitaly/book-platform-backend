namespace BookPlatform.Core.Slot.Models;

public class Slot
{
    public Guid Id { get; set; }
    public Guid FacilityId { get; set; }
    public Guid? ResourceId { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public int Capacity { get; set; } = 1;
    public int AvailableSpots { get; set; } = 1;
    public decimal? Price { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class CreateSlotRequest
{
    public Guid? ResourceId { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public int Capacity { get; set; } = 1;
    public decimal? Price { get; set; }
}

public class CreateSlotsRequest
{
    public Guid? ResourceId { get; set; }
    public DateTime Date { get; set; }
    public string StartTime { get; set; } = "09:00";
    public string EndTime { get; set; } = "18:00";
    public int DurationMinutes { get; set; } = 60;
    public int Capacity { get; set; } = 1;
    public decimal? Price { get; set; }
}

public class SlotDto
{
    public Guid Id { get; set; }
    public Guid FacilityId { get; set; }
    public Guid? ResourceId { get; set; }
    public string? ResourceName { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public int Capacity { get; set; }
    public int AvailableSpots { get; set; }
    public decimal? Price { get; set; }
    public bool IsAvailable => AvailableSpots > 0;
}
