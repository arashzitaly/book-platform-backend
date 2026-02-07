using System.Data;
using System.Text.Json;
using Dapper;
using BookPlatform.Core.Facility.Models;
using BookPlatform.Core.Facility.Queries;

namespace BookPlatform.Core.Facility.Services;

public interface IFacilityService
{
    Task<FacilityDto?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<IEnumerable<FacilityDto>> GetByOwnerIdAsync(Guid ownerId, CancellationToken ct = default);
    Task<IEnumerable<FacilityDto>> GetByCategoryAsync(FacilityCategory category, CancellationToken ct = default);
    Task<IEnumerable<FacilityDto>> GetAllAsync(int limit = 50, int offset = 0, CancellationToken ct = default);
    Task<IEnumerable<FacilityDto>> SearchAsync(string query, int limit = 20, CancellationToken ct = default);
    Task<Guid> CreateAsync(Guid ownerId, CreateFacilityRequest request, CancellationToken ct = default);
    Task UpdateAsync(Guid id, UpdateFacilityRequest request, CancellationToken ct = default);
    Task DeleteAsync(Guid id, CancellationToken ct = default);
}

public class FacilityService : IFacilityService
{
    private readonly IDbConnection _db;

    public FacilityService(IDbConnection db) => _db = db;

    public async Task<FacilityDto?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        var result = await _db.QueryFirstOrDefaultAsync<FacilityRaw>(new CommandDefinition(
            FacilityQueries.GetById, new { Id = id }, cancellationToken: ct));
        return result != null ? MapToDto(result) : null;
    }

    public async Task<IEnumerable<FacilityDto>> GetByOwnerIdAsync(Guid ownerId, CancellationToken ct = default)
    {
        var results = await _db.QueryAsync<FacilityRaw>(new CommandDefinition(
            FacilityQueries.GetByOwnerId, new { OwnerId = ownerId }, cancellationToken: ct));
        return results.Select(MapToDto);
    }

    public async Task<IEnumerable<FacilityDto>> GetByCategoryAsync(FacilityCategory category, CancellationToken ct = default)
    {
        var results = await _db.QueryAsync<FacilityRaw>(new CommandDefinition(
            FacilityQueries.GetByCategory, new { Category = (int)category }, cancellationToken: ct));
        return results.Select(MapToDto);
    }

    public async Task<IEnumerable<FacilityDto>> GetAllAsync(int limit = 50, int offset = 0, CancellationToken ct = default)
    {
        var results = await _db.QueryAsync<FacilityRaw>(new CommandDefinition(
            FacilityQueries.GetAll, new { Limit = limit, Offset = offset }, cancellationToken: ct));
        return results.Select(MapToDto);
    }

    public async Task<IEnumerable<FacilityDto>> SearchAsync(string query, int limit = 20, CancellationToken ct = default)
    {
        var results = await _db.QueryAsync<FacilityRaw>(new CommandDefinition(
            FacilityQueries.Search, new { Query = $"%{query}%", Limit = limit }, cancellationToken: ct));
        return results.Select(MapToDto);
    }

    public async Task<Guid> CreateAsync(Guid ownerId, CreateFacilityRequest request, CancellationToken ct = default)
    {
        var facility = new Models.Facility
        {
            OwnerId = ownerId,
            Category = request.Category,
            Name = request.Name,
            Description = request.Description,
            Address = request.Address,
            Phone = request.Phone,
            ImageUrl = request.ImageUrl,
            OperatingHours = request.OperatingHours ?? new OperatingHours(),
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        return await _db.ExecuteScalarAsync<Guid>(new CommandDefinition(
            FacilityQueries.Insert,
            new
            {
                facility.OwnerId,
                Category = (int)facility.Category,
                facility.Name,
                facility.Description,
                facility.Address,
                facility.Phone,
                facility.ImageUrl,
                OperatingHours = JsonSerializer.Serialize(facility.OperatingHours),
                facility.IsActive,
                facility.CreatedAt,
                facility.UpdatedAt
            },
            cancellationToken: ct));
    }

    public async Task UpdateAsync(Guid id, UpdateFacilityRequest request, CancellationToken ct = default)
    {
        var existing = await GetByIdAsync(id, ct);
        if (existing == null) return;

        await _db.ExecuteAsync(new CommandDefinition(
            FacilityQueries.Update,
            new
            {
                Id = id,
                Name = request.Name ?? existing.Name,
                Description = request.Description ?? existing.Description,
                Address = request.Address ?? existing.Address,
                Phone = request.Phone ?? existing.Phone,
                ImageUrl = request.ImageUrl ?? existing.ImageUrl,
                OperatingHours = JsonSerializer.Serialize(request.OperatingHours ?? existing.OperatingHours),
                IsActive = request.IsActive ?? existing.IsActive,
                UpdatedAt = DateTime.UtcNow
            },
            cancellationToken: ct));
    }

    public async Task DeleteAsync(Guid id, CancellationToken ct = default)
    {
        await _db.ExecuteAsync(new CommandDefinition(FacilityQueries.Delete, new { Id = id }, cancellationToken: ct));
    }

    private static FacilityDto MapToDto(FacilityRaw raw)
    {
        return new FacilityDto
        {
            Id = raw.Id,
            OwnerId = raw.OwnerId,
            Category = (FacilityCategory)raw.Category,
            Name = raw.Name,
            Description = raw.Description,
            Address = raw.Address,
            Phone = raw.Phone,
            ImageUrl = raw.ImageUrl,
            OperatingHours = string.IsNullOrEmpty(raw.OperatingHours) 
                ? new OperatingHours() 
                : JsonSerializer.Deserialize<OperatingHours>(raw.OperatingHours) ?? new OperatingHours(),
            IsActive = raw.IsActive,
            CreatedAt = raw.CreatedAt
        };
    }

    private class FacilityRaw
    {
        public Guid Id { get; set; }
        public Guid OwnerId { get; set; }
        public int Category { get; set; }
        public string Name { get; set; } = "";
        public string Description { get; set; } = "";
        public string Address { get; set; } = "";
        public string Phone { get; set; } = "";
        public string ImageUrl { get; set; } = "";
        public string OperatingHours { get; set; } = "";
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
