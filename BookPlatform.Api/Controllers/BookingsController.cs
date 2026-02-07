using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BookPlatform.Core.Booking.Models;
using BookPlatform.Core.Booking.Services;
using BookPlatform.Core.Facility.Services;

namespace BookPlatform.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BookingsController : ControllerBase
{
    private readonly IBookingService _bookingService;
    private readonly IFacilityService _facilityService;

    public BookingsController(IBookingService bookingService, IFacilityService facilityService)
    {
        _bookingService = bookingService;
        _facilityService = facilityService;
    }

    [HttpGet]
    [Authorize]
    public async Task<ActionResult<IEnumerable<BookingDto>>> GetMyBookings(CancellationToken ct)
    {
        var userId = GetUserId();
        return Ok(await _bookingService.GetByUserIdAsync(userId, ct));
    }

    [HttpGet("{id:guid}")]
    [Authorize]
    public async Task<ActionResult<BookingDto>> GetById(Guid id, CancellationToken ct)
    {
        var booking = await _bookingService.GetByIdAsync(id, ct);
        if (booking == null) return NotFound();
        
        var userId = GetUserId();
        if (booking.UserId != userId)
        {
            var facility = await _facilityService.GetByIdAsync(booking.FacilityId, ct);
            if (facility?.OwnerId != userId) return Forbid();
        }
        
        return Ok(booking);
    }

    [HttpGet("facility/{facilityId:guid}")]
    [Authorize(Roles = "Owner")]
    public async Task<ActionResult<IEnumerable<BookingDto>>> GetByFacility(Guid facilityId, CancellationToken ct)
    {
        var facility = await _facilityService.GetByIdAsync(facilityId, ct);
        if (facility == null) return NotFound();
        if (facility.OwnerId != GetUserId()) return Forbid();

        return Ok(await _bookingService.GetByFacilityIdAsync(facilityId, ct));
    }

    [HttpGet("facility/{facilityId:guid}/pending")]
    [Authorize(Roles = "Owner")]
    public async Task<ActionResult<IEnumerable<BookingDto>>> GetPendingByFacility(Guid facilityId, CancellationToken ct)
    {
        var facility = await _facilityService.GetByIdAsync(facilityId, ct);
        if (facility == null) return NotFound();
        if (facility.OwnerId != GetUserId()) return Forbid();

        return Ok(await _bookingService.GetPendingByFacilityIdAsync(facilityId, ct));
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<Guid>> Create([FromBody] CreateBookingRequest request, CancellationToken ct)
    {
        var userId = GetUserId();
        var id = await _bookingService.CreateAsync(userId, request, ct);
        
        if (id == null)
        {
            return BadRequest(new { message = "Slot not available or insufficient capacity" });
        }
        
        return CreatedAtAction(nameof(GetById), new { id }, new { id });
    }

    [HttpPut("{id:guid}/status")]
    [Authorize(Roles = "Owner")]
    public async Task<ActionResult> UpdateStatus(Guid id, [FromBody] UpdateBookingStatusRequest request, CancellationToken ct)
    {
        var booking = await _bookingService.GetByIdAsync(id, ct);
        if (booking == null) return NotFound();

        var facility = await _facilityService.GetByIdAsync(booking.FacilityId, ct);
        if (facility?.OwnerId != GetUserId()) return Forbid();

        var success = await _bookingService.UpdateStatusAsync(id, GetUserId(), request, ct);
        if (!success) return BadRequest();

        return NoContent();
    }

    private Guid GetUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier);
        return claim != null ? Guid.Parse(claim.Value) : Guid.Empty;
    }
}
