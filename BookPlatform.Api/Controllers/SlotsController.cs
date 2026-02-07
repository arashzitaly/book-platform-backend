using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BookPlatform.Core.Slot.Models;
using BookPlatform.Core.Slot.Services;
using BookPlatform.Core.Facility.Services;

namespace BookPlatform.Api.Controllers;

[ApiController]
[Route("api/facilities/{facilityId:guid}/[controller]")]
public class SlotsController : ControllerBase
{
    private readonly ISlotService _slotService;
    private readonly IFacilityService _facilityService;

    public SlotsController(ISlotService slotService, IFacilityService facilityService)
    {
        _slotService = slotService;
        _facilityService = facilityService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<SlotDto>>> GetByFacility(
        Guid facilityId, 
        [FromQuery] DateTime? from,
        CancellationToken ct)
    {
        return Ok(await _slotService.GetByFacilityIdAsync(facilityId, from, ct));
    }

    [HttpGet("available")]
    public async Task<ActionResult<IEnumerable<SlotDto>>> GetAvailable(
        Guid facilityId,
        [FromQuery] int limit = 50,
        CancellationToken ct = default)
    {
        return Ok(await _slotService.GetAvailableAsync(facilityId, limit, ct));
    }

    [HttpPost]
    [Authorize(Roles = "Owner")]
    public async Task<ActionResult<Guid>> Create(Guid facilityId, [FromBody] CreateSlotRequest request, CancellationToken ct)
    {
        var facility = await _facilityService.GetByIdAsync(facilityId, ct);
        if (facility == null) return NotFound();
        if (facility.OwnerId != GetUserId()) return Forbid();

        var id = await _slotService.CreateAsync(facilityId, request, ct);
        return Ok(new { id });
    }

    [HttpPost("bulk")]
    [Authorize(Roles = "Owner")]
    public async Task<ActionResult<IEnumerable<Guid>>> CreateBulk(Guid facilityId, [FromBody] CreateSlotsRequest request, CancellationToken ct)
    {
        var facility = await _facilityService.GetByIdAsync(facilityId, ct);
        if (facility == null) return NotFound();
        if (facility.OwnerId != GetUserId()) return Forbid();

        var ids = await _slotService.CreateBulkAsync(facilityId, request, ct);
        return Ok(new { ids, count = ids.Count() });
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Owner")]
    public async Task<ActionResult> Delete(Guid facilityId, Guid id, CancellationToken ct)
    {
        var facility = await _facilityService.GetByIdAsync(facilityId, ct);
        if (facility == null) return NotFound();
        if (facility.OwnerId != GetUserId()) return Forbid();

        await _slotService.DeleteAsync(id, ct);
        return NoContent();
    }

    private Guid GetUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier);
        return claim != null ? Guid.Parse(claim.Value) : Guid.Empty;
    }
}
