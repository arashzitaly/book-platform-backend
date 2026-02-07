using System.Text.Json;

namespace BookPlatform.Core.Facility.Models;

public enum FacilityCategory
{
    Gym = 0,
    Restaurant = 1,
    Cafeteria = 2
}

public class Facility
{
    public Guid Id { get; set; }
    public Guid OwnerId { get; set; }
    public FacilityCategory Category { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public OperatingHours OperatingHours { get; set; } = new();
    public JsonDocument? Settings { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

public class OperatingHours
{
    public DayHours Monday { get; set; } = new();
    public DayHours Tuesday { get; set; } = new();
    public DayHours Wednesday { get; set; } = new();
    public DayHours Thursday { get; set; } = new();
    public DayHours Friday { get; set; } = new();
    public DayHours Saturday { get; set; } = new();
    public DayHours Sunday { get; set; } = new();
}

public class DayHours
{
    public bool IsOpen { get; set; } = true;
    public string OpenTime { get; set; } = "09:00";
    public string CloseTime { get; set; } = "18:00";
}

public class CreateFacilityRequest
{
    public FacilityCategory Category { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public OperatingHours? OperatingHours { get; set; }
}

public class UpdateFacilityRequest
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public string? Address { get; set; }
    public string? Phone { get; set; }
    public string? ImageUrl { get; set; }
    public OperatingHours? OperatingHours { get; set; }
    public bool? IsActive { get; set; }
}

public class FacilityDto
{
    public Guid Id { get; set; }
    public Guid OwnerId { get; set; }
    public FacilityCategory Category { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public OperatingHours OperatingHours { get; set; } = new();
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
}
