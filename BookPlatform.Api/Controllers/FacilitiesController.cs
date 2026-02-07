using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BookPlatform.Core.Auth.Models;
using BookPlatform.Core.Facility.Models;
using BookPlatform.Core.Facility.Services;

namespace BookPlatform.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FacilitiesController : ControllerBase
{
    private readonly IFacilityService _facilityService;

    public FacilitiesController(IFacilityService facilityService)
    {
        _facilityService = facilityService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<FacilityDto>>> GetAll(
        [FromQuery] FacilityCategory? category,
        [FromQuery] string? search,
        [FromQuery] int limit = 50,
        [FromQuery] int offset = 0,
        CancellationToken ct = default)
    {
        if (!string.IsNullOrEmpty(search))
        {
            return Ok(await _facilityService.SearchAsync(search, limit, ct));
        }
        if (category.HasValue)
        {
            return Ok(await _facilityService.GetByCategoryAsync(category.Value, ct));
        }
        return Ok(await _facilityService.GetAllAsync(limit, offset, ct));
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<FacilityDto>> GetById(Guid id, CancellationToken ct)
    {
        var facility = await _facilityService.GetByIdAsync(id, ct);
        if (facility == null) return NotFound();
        return Ok(facility);
    }

    [HttpGet("my")]
    [Authorize(Roles = "Owner")]
    public async Task<ActionResult<IEnumerable<FacilityDto>>> GetMyFacilities(CancellationToken ct)
    {
        var ownerId = GetUserId();
        return Ok(await _facilityService.GetByOwnerIdAsync(ownerId, ct));
    }

    [HttpPost]
    [Authorize(Roles = "Owner")]
    public async Task<ActionResult<Guid>> Create([FromBody] CreateFacilityRequest request, CancellationToken ct)
    {
        var ownerId = GetUserId();
        var id = await _facilityService.CreateAsync(ownerId, request, ct);
        return CreatedAtAction(nameof(GetById), new { id }, new { id });
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Owner")]
    public async Task<ActionResult> Update(Guid id, [FromBody] UpdateFacilityRequest request, CancellationToken ct)
    {
        var facility = await _facilityService.GetByIdAsync(id, ct);
        if (facility == null) return NotFound();
        if (facility.OwnerId != GetUserId()) return Forbid();

        await _facilityService.UpdateAsync(id, request, ct);
        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Owner")]
    public async Task<ActionResult> Delete(Guid id, CancellationToken ct)
    {
        var facility = await _facilityService.GetByIdAsync(id, ct);
        if (facility == null) return NotFound();
        if (facility.OwnerId != GetUserId()) return Forbid();

        await _facilityService.DeleteAsync(id, ct);
        return NoContent();
    }

    private Guid GetUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier);
        return claim != null ? Guid.Parse(claim.Value) : Guid.Empty;
    }
}
