using System.Data;
using Dapper;
using BookPlatform.Core.Booking.Models;
using BookPlatform.Core.Booking.Queries;
using BookPlatform.Core.Slot.Services;
using BookPlatform.Core.Notification.Services;

namespace BookPlatform.Core.Booking.Services;

public interface IBookingService
{
    Task<BookingDto?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<IEnumerable<BookingDto>> GetByUserIdAsync(Guid userId, CancellationToken ct = default);
    Task<IEnumerable<BookingDto>> GetByFacilityIdAsync(Guid facilityId, CancellationToken ct = default);
    Task<IEnumerable<BookingDto>> GetPendingByFacilityIdAsync(Guid facilityId, CancellationToken ct = default);
    Task<Guid?> CreateAsync(Guid userId, CreateBookingRequest request, CancellationToken ct = default);
    Task<bool> UpdateStatusAsync(Guid id, Guid ownerId, UpdateBookingStatusRequest request, CancellationToken ct = default);
    Task DeleteAsync(Guid id, CancellationToken ct = default);
}

public class BookingService : IBookingService
{
    private readonly IDbConnection _db;
    private readonly ISlotService _slotService;
    private readonly INotificationService _notificationService;

    public BookingService(IDbConnection db, ISlotService slotService, INotificationService notificationService)
    {
        _db = db;
        _slotService = slotService;
        _notificationService = notificationService;
    }

    public async Task<BookingDto?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        return await _db.QueryFirstOrDefaultAsync<BookingDto>(new CommandDefinition(
            BookingQueries.GetById, new { Id = id }, cancellationToken: ct));
    }

    public async Task<IEnumerable<BookingDto>> GetByUserIdAsync(Guid userId, CancellationToken ct = default)
    {
        return await _db.QueryAsync<BookingDto>(new CommandDefinition(
            BookingQueries.GetByUserId, new { UserId = userId }, cancellationToken: ct));
    }

    public async Task<IEnumerable<BookingDto>> GetByFacilityIdAsync(Guid facilityId, CancellationToken ct = default)
    {
        return await _db.QueryAsync<BookingDto>(new CommandDefinition(
            BookingQueries.GetByFacilityId, new { FacilityId = facilityId }, cancellationToken: ct));
    }

    public async Task<IEnumerable<BookingDto>> GetPendingByFacilityIdAsync(Guid facilityId, CancellationToken ct = default)
    {
        return await _db.QueryAsync<BookingDto>(new CommandDefinition(
            BookingQueries.GetPendingByFacilityId, new { FacilityId = facilityId }, cancellationToken: ct));
    }

    public async Task<Guid?> CreateAsync(Guid userId, CreateBookingRequest request, CancellationToken ct = default)
    {
        // Try to decrement available spots atomically
        var slotUpdated = await _slotService.DecrementAvailableAsync(request.SlotId, request.PartySize, ct);
        if (!slotUpdated)
        {
            return null; // Slot not available
        }

        var booking = new Models.Booking
        {
            FacilityId = request.FacilityId,
            UserId = userId,
            SlotId = request.SlotId,
            Notes = request.Notes,
            PartySize = request.PartySize,
            Status = BookingStatus.Requested,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var id = await _db.ExecuteScalarAsync<Guid>(new CommandDefinition(
            BookingQueries.Insert,
            new
            {
                booking.FacilityId,
                booking.UserId,
                booking.SlotId,
                Status = (int)booking.Status,
                booking.Notes,
                booking.PartySize,
                booking.CreatedAt,
                booking.UpdatedAt
            },
            cancellationToken: ct));

        return id;
    }

    public async Task<bool> UpdateStatusAsync(Guid id, Guid ownerId, UpdateBookingStatusRequest request, CancellationToken ct = default)
    {
        var booking = await GetByIdAsync(id, ct);
        if (booking == null) return false;

        await _db.ExecuteAsync(new CommandDefinition(
            BookingQueries.UpdateStatus,
            new { Id = id, Status = (int)request.Status, UpdatedAt = DateTime.UtcNow },
            cancellationToken: ct));

        // If rejected or cancelled, restore available spots
        if (request.Status == BookingStatus.Rejected || request.Status == BookingStatus.Cancelled)
        {
            await _slotService.IncrementAvailableAsync(booking.SlotId, booking.PartySize, ct);
        }

        // Create notification for user
        var notificationType = request.Status == BookingStatus.Accepted 
            ? Notification.Models.NotificationType.ReservationAccepted 
            : Notification.Models.NotificationType.ReservationRejected;
        
        var title = request.Status == BookingStatus.Accepted 
            ? "Reservation Confirmed!" 
            : "Reservation Update";
        
        var message = request.Status == BookingStatus.Accepted 
            ? $"Your reservation at {booking.FacilityName} has been confirmed for {booking.SlotStartTime:MMM dd, yyyy HH:mm}."
            : $"Your reservation at {booking.FacilityName} was not confirmed. {request.Reason ?? ""}";

        await _notificationService.CreateAsync(booking.UserId, id, notificationType, title, message, ct);

        return true;
    }

    public async Task DeleteAsync(Guid id, CancellationToken ct = default)
    {
        await _db.ExecuteAsync(new CommandDefinition(BookingQueries.Delete, new { Id = id }, cancellationToken: ct));
    }
}
