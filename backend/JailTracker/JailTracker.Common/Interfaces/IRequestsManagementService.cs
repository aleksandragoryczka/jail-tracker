using JailTracker.Common.Dto;
using JailTracker.Common.Enums;
using JailTracker.Common.Models;

namespace JailTracker.Common.Interfaces;

public interface IRequestsManagementService
{
    PaginatedResult<RequestModelDto> GetRequestsByDateForUser(int userId, DateTime from, DateTime to, RequestType type, int skip, int take);
    PaginatedResult<RequestModelDto> GetPendingRequestsForSupervisor(int supervisorId, int skip, int take);
    PaginatedResult<RequestModelDto> GetSupervisedRequestsForSupervisor(int supervisorId, int skip, int take);
    int GetYearRequestsCountForUserInHours(int userId);
    PaginatedResult<RequestModelDto> GetRequestsForUser(int userId, int skip, int take);
}