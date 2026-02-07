namespace BookPlatform.Core.Resource.Models;

public enum ResourceType
{
    Table = 0,
    Room = 1,
    Equipment = 2,
    Class = 3,
    Court = 4
}

public class Resource
{
    public Guid Id { get; set; }
    public Guid FacilityId { get; set; }
    public string Name { get; set; } = string.Empty;
    public ResourceType Type { get; set; }
    public int Capacity { get; set; } = 1;
    public string Description { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

public class CreateResourceRequest
{
    public string Name { get; set; } = string.Empty;
    public ResourceType Type { get; set; }
    public int Capacity { get; set; } = 1;
    public string Description { get; set; } = string.Empty;
}

public class UpdateResourceRequest
{
    public string? Name { get; set; }
    public int? Capacity { get; set; }
    public string? Description { get; set; }
    public bool? IsActive { get; set; }
}

public class ResourceDto
{
    public Guid Id { get; set; }
    public Guid FacilityId { get; set; }
    public string Name { get; set; } = string.Empty;
    public ResourceType Type { get; set; }
    public int Capacity { get; set; }
    public string Description { get; set; } = string.Empty;
    public bool IsActive { get; set; }
}
