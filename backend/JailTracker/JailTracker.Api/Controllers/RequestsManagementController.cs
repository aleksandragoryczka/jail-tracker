using JailTracker.Api.Extensions;
using JailTracker.Attributes;
using JailTracker.Common.Dto;
using JailTracker.Common.Enums;
using JailTracker.Common.Identity;
using JailTracker.Common.Interfaces;
using JailTracker.Common.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JailTracker.Api.Controllers;

[Route("api/[controller]/[action]")]
[Authorize]
[ApiController]
public class RequestsManagementController : ControllerBase
{
    private readonly IRequestsManagementService _requestsManagementService;

    public RequestsManagementController(IRequestsManagementService requestsManagementService)
    {
        _requestsManagementService = requestsManagementService;
    }
    
    // For Create New Request tab
    /// <summary>
    /// DONE - USER'S "CREATE NEW REQUEST" PAGE
    /// </summary>
    /// <param name="skip"></param>
    /// <param name="take"></param>
    /// <returns></returns>
    [HttpGet]
    public ActionResult<PaginatedResult<RequestModelDto>> GetRequestsForUser(int skip = 0, int take = 10)
    {
        var userId = User.Identity.GetUserId();

        var res = _requestsManagementService.GetRequestsForUser(userId, skip, take);
        return res;
    }
    
    /// <summary>
    /// DONE - DASHBOARD FOR SUPERVISOR AND DASHBOARD FOR USER - two first tabs
    /// </summary>
    /// <param name="from"></param>
    /// <param name="to"></param>
    /// <param name="type"></param>
    /// <param name="skip"></param>
    /// <param name="take"></param>
    /// <returns></returns>
    [HttpGet]
    public ActionResult<PaginatedResult<RequestModelDto>> GetRequestsByDateForUser(DateTime from, DateTime to, RequestType type, int skip = 0, int take = 10)
    {
        var userId = User.Identity.GetUserId();
        var isGuard = User.Identity.IsGuard();
        
        from = DateTime.SpecifyKind(from, DateTimeKind.Utc);
        to = DateTime.SpecifyKind(to, DateTimeKind.Utc);
        
        var res = _requestsManagementService.GetRequestsByDateForUser(userId, from, to, type, isGuard, skip, take);
        return Ok(res);
    }

    
    /*
    /// <summary>
    /// DONE - DASHBOARD FOR SUPERVISOR AND DASHBOARD FOR USER
    /// </summary>
    /// <param name="skip"></param>
    /// <param name="take"></param>
    /// <returns></returns>
    [HttpGet]
    public ActionResult<PaginatedResult<RequestModelDto>> GetSupervisedPassesRequests(int skip = 0, int take = 10)
    {
        var userId = User.Identity.GetUserId();
        var isGuard = User.Identity.IsGuard();
        var res = _requestsManagementService.GetSupervisedPassesRequests(userId, isGuard, skip, take);
        return Ok(res);
    }
    
    /// <summary>
    /// DONE - DASHBOARD FOR SUPERVISOR AND DASHBOARD FOR USER
    /// </summary>
    /// <param name="skip"></param>
    /// <param name="take"></param>
    /// <returns></returns>
    [HttpGet]
    public ActionResult<PaginatedResult<RequestModelDto>> GetSupervisedVisitsRequests(int skip = 0, int take = 10)
    {
        var userId = User.Identity.GetUserId();
        var isGuard = User.Identity.IsGuard();
        var res = _requestsManagementService.GetSupervisedVisitsRequests(userId, isGuard, skip, take);
        return Ok(res);
    }*/

    
    /// <summary>
    /// DONE
    /// </summary>
    /// <returns></returns>
    [HttpGet]
    public ActionResult<int> GetYearAbsenceCountForUserInHours()
    {
        var userId = User.Identity.GetUserId();
        
        var res = _requestsManagementService.GetYearRequestsCountForUserInHours(userId);
        return res;
    }
    
    /// <summary>
    /// DONE - DASHBOARD FOR SUPERVISOR, "REQUESTS" FOR SUPERVISOR, 1st tab
    /// </summary>
    /// <param name="skip"></param>
    /// <param name="take"></param>
    /// <returns></returns>
    [HttpGet]
    [RequireClaim(IdentityData.PermissionsClaimName, PermissionType.CanSupervise)]
    public ActionResult<PaginatedResult<RequestModelDto>> GetPendingVisitsAndPassesRequestsForSupervisor(int skip = 0, int take = 10)
    {
        var supervisorId = User.Identity.GetUserId();
        var res = _requestsManagementService.GetPendingVisitsAndPassesRequestsForSupervisor(supervisorId, skip, take);
        return Ok(res);
    }
    
    /// <summary>
    /// DONE - "REQUESTS" FOR SUPERVISOR, 2nd tab
    /// </summary>
    /// <param name="skip"></param>
    /// <param name="take"></param>
    /// <returns></returns>
    [HttpGet]
    [RequireClaim(IdentityData.PermissionsClaimName, PermissionType.CanSupervise)]
    public ActionResult<PaginatedResult<RequestModelDto>> GetSupervisedVisitsAndPassesRequestsForSupervisor(int skip = 0, int take = 10)
    {
        var supervisorId = User.Identity.GetUserId();
        var res = _requestsManagementService.GetSupervisedVisitsAndPassesRequestsForSupervisor(supervisorId, skip, take);
        return Ok(res);
    }

    /// <summary>
    /// DONE - Calendar Component
    /// </summary>
    /// <returns></returns>
    [HttpGet]
    public ActionResult<List<RequestModelDto>> getAllAcceptedRequests()
    {
        return Ok(_requestsManagementService.GetAllAcceptedRequests());
    }
    
}