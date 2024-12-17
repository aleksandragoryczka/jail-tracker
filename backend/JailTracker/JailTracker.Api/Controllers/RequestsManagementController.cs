using JailTracker.Api.Extensions;
using JailTracker.Common.Dto;
using JailTracker.Common.Interfaces;
using JailTracker.Common.Models;
using JailTracker.Common.Models.DatabaseModels;
using Microsoft.AspNetCore.Mvc;

namespace JailTracker.Api.Controllers;

[Route("api/[controller]/[action]")]
//[Authorize]
[ApiController]
public class RequestsManagementController : ControllerBase
{
    private readonly IRequestsManagementService _requestsManagementService;

    public RequestsManagementController(IRequestsManagementService requestsManagementService)
    {
        _requestsManagementService = requestsManagementService;
    }
    
    [HttpGet]
    //[Authorize(Policy = IdentityData.MatchOrganizationIdQueryPolicy)]
    public ActionResult<PaginatedResult<RequestModelDto>> GetRequestsByPrisonId(int prisonId, DateTime from, DateTime to, int skip = 0, int take = 10)
    {
        var res = _requestsManagementService.GetRequestsByPrisonId(prisonId, from, to, skip, take);
        return Ok(res);
    }
    
    [HttpGet]
    public ActionResult<PaginatedResult<RequestModel>> GetRequestsByDateForUser(DateTime from, DateTime to, int skip = 0, int take = 10)
    {
        var userId = User.Identity.GetUserId();
        var res = _requestsManagementService.GetRequestsByUserId(userId, from, to, skip, take);
        return Ok(res);
    }
    
    [HttpGet]
    public ActionResult<PaginatedResult<RequestModelDto>> GetRequestsForUser(int skip = 0, int take = 10)
    {
        var userId = User.Identity.GetUserId();

        var res = _requestsManagementService.GetRequestsForUser(userId, skip, take);
        return res;
    }
    
    [HttpGet]
    //[RequireClaim(IdentityData.PermissionsClaimName, PermissionType.CanSupervise)]
    public ActionResult<PaginatedResult<RequestModelDto>> GetPendingRequestsForSupervisor(int skip = 0, int take = 10)
    {
        var supervisorId = User.Identity.GetUserId();
        var res = _requestsManagementService.GetPendingRequestsForSupervisor(supervisorId, skip, take);
        return Ok(res);
    }

    [HttpGet]
    //[RequireClaim(IdentityData.PermissionsClaimName, PermissionType.CanSupervise)]
    public ActionResult<PaginatedResult<RequestModelDto>> GetSupervisedAbsencesRequestsForSupervisor(int skip = 0, int take = 10)
    {
        var supervisorId = User.Identity.GetUserId();
        var res = _requestsManagementService.GetSupervisedRequestsForSupervisor(supervisorId, skip, take);
        return Ok(res);
    }
    
    [HttpGet]
    public ActionResult<int> GetYearAbsenceCountForUserInHours()
    {
        var userId = User.Identity.GetUserId();
        
        var res = _requestsManagementService.GetYearRequestsCountForUserInHours(userId);
        return res;
    }


}