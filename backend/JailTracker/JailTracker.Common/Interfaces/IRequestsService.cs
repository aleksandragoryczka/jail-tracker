using JailTracker.Common.Dto;
using JailTracker.Common.Models.DatabaseModels;

namespace JailTracker.Common.Interfaces
{
    public interface IRequestsService
    {
        RequestModel SetApprovalState(RequestApprovalStateDto requestApprovalState, int supervisorId);
        RequestModel CreateRequest(int userId, CreateRequestDto requestDto);
        RequestModelDto UpdateRequest(int userId, UpdateRequestDto requestDto);
        bool CancelRequestForUser(Guid requestId, int userId);
    }
}
