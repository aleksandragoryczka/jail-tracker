using JailTracker.Common.Dto;
using JailTracker.Common.Models;

namespace JailTracker.Common.Interfaces;

public interface IRequestsManagementService
{
    PaginatedResult<RequestModelDto> GetRequestsByPrisonId(int prisonId, DateTime from, DateTime to, int skip, int take);
    PaginatedResult<RequestModelDto> GetRequestsByUserId(int userId, DateTime from, DateTime to, int skip, int take);
    PaginatedResult<RequestModelDto> GetPendingRequestsForSupervisor(int supervisorId, int skip, int take);
    PaginatedResult<RequestModelDto> GetSupervisedRequestsForSupervisor(int supervisorId, int skip, int take);
    int GetYearRequestsCountForUserInHours(int userId);
    PaginatedResult<RequestModelDto> GetRequestsForUser(int userId, int skip, int take);

}