using System.Data;
using Dapper;
using BookPlatform.Core.Slot.Models;
using BookPlatform.Core.Slot.Queries;

namespace BookPlatform.Core.Slot.Services;

public interface ISlotService
{
    Task<SlotDto?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<IEnumerable<SlotDto>> GetByFacilityIdAsync(Guid facilityId, DateTime? fromDate = null, CancellationToken ct = default);
    Task<IEnumerable<SlotDto>> GetAvailableAsync(Guid facilityId, int limit = 50, CancellationToken ct = default);
    Task<Guid> CreateAsync(Guid facilityId, CreateSlotRequest request, CancellationToken ct = default);
    Task<IEnumerable<Guid>> CreateBulkAsync(Guid facilityId, CreateSlotsRequest request, CancellationToken ct = default);
    Task<bool> DecrementAvailableAsync(Guid id, int count = 1, CancellationToken ct = default);
    Task IncrementAvailableAsync(Guid id, int count = 1, CancellationToken ct = default);
    Task DeleteAsync(Guid id, CancellationToken ct = default);
}

public class SlotService : ISlotService
{
    private readonly IDbConnection _db;

    public SlotService(IDbConnection db) => _db = db;

    public async Task<SlotDto?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        return await _db.QueryFirstOrDefaultAsync<SlotDto>(new CommandDefinition(
            SlotQueries.GetById, new { Id = id }, cancellationToken: ct));
    }

    public async Task<IEnumerable<SlotDto>> GetByFacilityIdAsync(Guid facilityId, DateTime? fromDate = null, CancellationToken ct = default)
    {
        return await _db.QueryAsync<SlotDto>(new CommandDefinition(
            SlotQueries.GetByFacilityId, 
            new { FacilityId = facilityId, FromDate = fromDate ?? DateTime.UtcNow }, 
            cancellationToken: ct));
    }

    public async Task<IEnumerable<SlotDto>> GetAvailableAsync(Guid facilityId, int limit = 50, CancellationToken ct = default)
    {
        return await _db.QueryAsync<SlotDto>(new CommandDefinition(
            SlotQueries.GetAvailable, 
            new { FacilityId = facilityId, FromDate = DateTime.UtcNow, Limit = limit }, 
            cancellationToken: ct));
    }

    public async Task<Guid> CreateAsync(Guid facilityId, CreateSlotRequest request, CancellationToken ct = default)
    {
        var slot = new Models.Slot
        {
            FacilityId = facilityId,
            ResourceId = request.ResourceId,
            StartTime = request.StartTime,
            EndTime = request.EndTime,
            Capacity = request.Capacity,
            AvailableSpots = request.Capacity,
            Price = request.Price,
            CreatedAt = DateTime.UtcNow
        };

        return await _db.ExecuteScalarAsync<Guid>(new CommandDefinition(
            SlotQueries.Insert,
            new
            {
                slot.FacilityId,
                slot.ResourceId,
                slot.StartTime,
                slot.EndTime,
                slot.Capacity,
                slot.AvailableSpots,
                slot.Price,
                slot.IsActive,
                slot.CreatedAt
            },
            cancellationToken: ct));
    }

    public async Task<IEnumerable<Guid>> CreateBulkAsync(Guid facilityId, CreateSlotsRequest request, CancellationToken ct = default)
    {
        var ids = new List<Guid>();
        var startParts = request.StartTime.Split(':');
        var endParts = request.EndTime.Split(':');
        
        var startMinutes = int.Parse(startParts[0]) * 60 + int.Parse(startParts[1]);
        var endMinutes = int.Parse(endParts[0]) * 60 + int.Parse(endParts[1]);
        
        for (var minutes = startMinutes; minutes + request.DurationMinutes <= endMinutes; minutes += request.DurationMinutes)
        {
            var slotStart = request.Date.Date.AddMinutes(minutes);
            var slotEnd = slotStart.AddMinutes(request.DurationMinutes);
            
            var id = await CreateAsync(facilityId, new CreateSlotRequest
            {
                ResourceId = request.ResourceId,
                StartTime = slotStart,
                EndTime = slotEnd,
                Capacity = request.Capacity,
                Price = request.Price
            }, ct);
            
            ids.Add(id);
        }
        
        return ids;
    }

    public async Task<bool> DecrementAvailableAsync(Guid id, int count = 1, CancellationToken ct = default)
    {
        var affected = await _db.ExecuteAsync(new CommandDefinition(
            SlotQueries.UpdateAvailableSpots, new { Id = id, Count = count }, cancellationToken: ct));
        return affected > 0;
    }

    public async Task IncrementAvailableAsync(Guid id, int count = 1, CancellationToken ct = default)
    {
        await _db.ExecuteAsync(new CommandDefinition(
            SlotQueries.IncrementAvailableSpots, new { Id = id, Count = count }, cancellationToken: ct));
    }

    public async Task DeleteAsync(Guid id, CancellationToken ct = default)
    {
        await _db.ExecuteAsync(new CommandDefinition(SlotQueries.Delete, new { Id = id }, cancellationToken: ct));
    }
}
