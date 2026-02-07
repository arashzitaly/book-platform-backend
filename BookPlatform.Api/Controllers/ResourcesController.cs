using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BookPlatform.Core.Resource.Models;
using BookPlatform.Core.Resource.Services;
using BookPlatform.Core.Facility.Services;

namespace BookPlatform.Api.Controllers;

[ApiController]
[Route("api/facilities/{facilityId:guid}/[controller]")]
public class ResourcesController : ControllerBase
{
    private readonly IResourceService _resourceService;
    private readonly IFacilityService _facilityService;

    public ResourcesController(IResourceService resourceService, IFacilityService facilityService)
    {
        _resourceService = resourceService;
        _facilityService = facilityService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ResourceDto>>> GetByFacility(Guid facilityId, CancellationToken ct)
    {
        return Ok(await _resourceService.GetByFacilityIdAsync(facilityId, ct));
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ResourceDto>> GetById(Guid facilityId, Guid id, CancellationToken ct)
    {
        var resource = await _resourceService.GetByIdAsync(id, ct);
        if (resource == null || resource.FacilityId != facilityId) return NotFound();
        return Ok(resource);
    }

    [HttpPost]
    [Authorize(Roles = "Owner")]
    public async Task<ActionResult<Guid>> Create(Guid facilityId, [FromBody] CreateResourceRequest request, CancellationToken ct)
    {
        var facility = await _facilityService.GetByIdAsync(facilityId, ct);
        if (facility == null) return NotFound();
        if (facility.OwnerId != GetUserId()) return Forbid();

        var id = await _resourceService.CreateAsync(facilityId, request, ct);
        return CreatedAtAction(nameof(GetById), new { facilityId, id }, new { id });
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Owner")]
    public async Task<ActionResult> Update(Guid facilityId, Guid id, [FromBody] UpdateResourceRequest request, CancellationToken ct)
    {
        var facility = await _facilityService.GetByIdAsync(facilityId, ct);
        if (facility == null) return NotFound();
        if (facility.OwnerId != GetUserId()) return Forbid();

        await _resourceService.UpdateAsync(id, request, ct);
        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Owner")]
    public async Task<ActionResult> Delete(Guid facilityId, Guid id, CancellationToken ct)
    {
        var facility = await _facilityService.GetByIdAsync(facilityId, ct);
        if (facility == null) return NotFound();
        if (facility.OwnerId != GetUserId()) return Forbid();

        await _resourceService.DeleteAsync(id, ct);
        return NoContent();
    }

    private Guid GetUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier);
        return claim != null ? Guid.Parse(claim.Value) : Guid.Empty;
    }
}
