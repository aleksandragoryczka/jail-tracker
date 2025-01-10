using JailTracker.Api.Extensions;
using JailTracker.Attributes;
using JailTracker.Common.Dto;
using JailTracker.Common.Enums;
using JailTracker.Common.Identity;
using JailTracker.Common.Interfaces;
using JailTracker.Common.Models.DatabaseModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JailTracker.Api.Controllers
{
    [Route("api/[controller]/[action]")]
    [Authorize]
    [ApiController]
    public class RequestsController : ControllerBase
    {
        private readonly IRequestsService _requestsService;

        public RequestsController(IRequestsService requestsService)
        {
            _requestsService = requestsService;
        }
        
        /// <summary>
        /// DONE
        /// </summary>
        /// <param name="requestApprovalState"></param>
        /// <returns></returns>
        [HttpPut]
        [RequireClaim(IdentityData.PermissionsClaimName, PermissionType.CanSupervise)]
        public ActionResult<RequestModel> SetApprovalStateForRequest([FromBody] RequestApprovalStateDto requestApprovalState)
        {
            var supervisorId = User.Identity.GetUserId();

            var res = _requestsService.SetApprovalState(requestApprovalState, supervisorId);
            return Ok(res);
        }

        /// <summary>
        /// DONE
        /// </summary>
        /// <param name="requestDto"></param>
        /// <returns></returns>
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
        
        /// <summary>
        /// DONE
        /// </summary>
        /// <param name="updateRequestDto"></param>
        /// <returns></returns>
        [HttpPut]
        public ActionResult<RequestModelDto> UpdateRequestForUser([FromBody] UpdateRequestDto updateRequestDto)
        {
            var userId = User.Identity.GetUserId();
            var absence = _requestsService.UpdateRequest(userId, updateRequestDto);

            return Ok(absence);
        }
        
        /// <summary>
        /// DONE
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete("{id}")]
        public ActionResult<bool> CancelRequestForUser(Guid id)
        {
            var userId = User.Identity.GetUserId();

            bool isCancelled = _requestsService.CancelRequestForUser(id, userId);

            if (isCancelled)
                return Ok(true);
            else
                return NotFound();
        }
        
    }
    
}
