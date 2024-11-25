using JailTracker.Api.Extensions;
using JailTracker.Attributes;
using JailTracker.Common.Dto;
using JailTracker.Common.Enums;
using JailTracker.Common.Identity;
using JailTracker.Common.Interfaces;
using JailTracker.Common.Models.DatabaseModels;
using Microsoft.AspNetCore.Mvc;

namespace JailTracker.Api.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class RequestsController : ControllerBase
    {
        private readonly IRequestsService _requestsService;

        public RequestsController(IRequestsService requestsService)
        {
            _requestsService = requestsService;
        }

        [HttpPut]
        [RequireClaim(IdentityData.PermissionsClaimName, PermissionType.CanSupervise)]
        public ActionResult<RequestModel> SetApprovalStateForRequest([FromBody] RequestApprovalStateDto requestApprovalState)
        {
            var supervisorId = User.Identity.GetUserId();

            var res = _requestsService.SetApprovalState(requestApprovalState, supervisorId);
            return Ok(res);
        }

        [HttpPost]
        public ActionResult<RequestModel> CreateRequest([FromBody] CreateRequestDto requestDto)
        {
            try
            {
                var userId = User.Identity.GetUserId(); 

                RequestModel createdRequest = _requestsService.CreateRequest(userId, requestDto);
                return Ok(createdRequest);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while processing your request.", details = ex.Message });
            }
        }
    }
}
