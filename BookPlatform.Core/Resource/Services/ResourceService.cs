using System.Data;
using Dapper;
using BookPlatform.Core.Resource.Models;
using BookPlatform.Core.Resource.Queries;

namespace BookPlatform.Core.Resource.Services;

public interface IResourceService
{
    Task<ResourceDto?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<IEnumerable<ResourceDto>> GetByFacilityIdAsync(Guid facilityId, CancellationToken ct = default);
    Task<Guid> CreateAsync(Guid facilityId, CreateResourceRequest request, CancellationToken ct = default);
    Task UpdateAsync(Guid id, UpdateResourceRequest request, CancellationToken ct = default);
    Task DeleteAsync(Guid id, CancellationToken ct = default);
}

public class ResourceService : IResourceService
{
    private readonly IDbConnection _db;

    public ResourceService(IDbConnection db) => _db = db;

    public async Task<ResourceDto?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        return await _db.QueryFirstOrDefaultAsync<ResourceDto>(new CommandDefinition(
            ResourceQueries.GetById, new { Id = id }, cancellationToken: ct));
    }

    public async Task<IEnumerable<ResourceDto>> GetByFacilityIdAsync(Guid facilityId, CancellationToken ct = default)
    {
        return await _db.QueryAsync<ResourceDto>(new CommandDefinition(
            ResourceQueries.GetByFacilityId, new { FacilityId = facilityId }, cancellationToken: ct));
    }

    public async Task<Guid> CreateAsync(Guid facilityId, CreateResourceRequest request, CancellationToken ct = default)
    {
        var resource = new Models.Resource
        {
            FacilityId = facilityId,
            Name = request.Name,
            Type = request.Type,
            Capacity = request.Capacity,
            Description = request.Description,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        return await _db.ExecuteScalarAsync<Guid>(new CommandDefinition(
            ResourceQueries.Insert,
            new
            {
                resource.FacilityId,
                resource.Name,
                Type = (int)resource.Type,
                resource.Capacity,
                resource.Description,
                resource.IsActive,
                resource.CreatedAt,
                resource.UpdatedAt
            },
            cancellationToken: ct));
    }

    public async Task UpdateAsync(Guid id, UpdateResourceRequest request, CancellationToken ct = default)
    {
        var existing = await GetByIdAsync(id, ct);
        if (existing == null) return;

        await _db.ExecuteAsync(new CommandDefinition(
            ResourceQueries.Update,
            new
            {
                Id = id,
                Name = request.Name ?? existing.Name,
                Capacity = request.Capacity ?? existing.Capacity,
                Description = request.Description ?? existing.Description,
                IsActive = request.IsActive ?? existing.IsActive,
                UpdatedAt = DateTime.UtcNow
            },
            cancellationToken: ct));
    }

    public async Task DeleteAsync(Guid id, CancellationToken ct = default)
    {
        await _db.ExecuteAsync(new CommandDefinition(ResourceQueries.Delete, new { Id = id }, cancellationToken: ct));
    }
}
