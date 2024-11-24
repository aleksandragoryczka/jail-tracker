using JailTracker.Common.Dto;
using JailTracker.Common.Models.DatabaseModels;

namespace JailTracker.Common.Interfaces
{
    public interface IRequestsService
    {
        RequestModel SetApprovalState(RequestApprovalStateDto requestApprovalState, int supervisorId);
        RequestModel CreateRequest(int userId, CreateRequestDto requestDto);
    }
}
