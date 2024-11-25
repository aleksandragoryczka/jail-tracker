using JailTracker.Attributes;
using JailTracker.Common.Dto;
using JailTracker.Common.Enums;
using JailTracker.Common.Identity;
using JailTracker.Common.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JailTracker.Api.Controllers;

[Route("api/[controller]")]
//[Authorize]
[ApiController]
public class PermissionsController: ControllerBase
{
    private readonly IPermissionsService _permissionsService;

    public PermissionsController(IPermissionsService permissionsService)
    {
        _permissionsService = permissionsService;
    }

    [HttpPost("UpdatePermissions")]
    [RequireClaim(IdentityData.PermissionsClaimName, PermissionType.GrantPermissions)]
    //[Authorize(Policy = IdentityData.MatchOrganizationIdBodyPolicy)]
    public ActionResult<bool> UpdatePermissions([FromBody] UpdatePermissionsDto updatePermissionsDto)
    {
        bool res = _permissionsService.UpdatePermissions(updatePermissionsDto);

        return Ok(res);
    }
}