using JailTracker.Common.Dto;
using JailTracker.Common.Enums;
using JailTracker.Common.Models;

namespace JailTracker.Common.Interfaces;

public interface IRequestsManagementService
{
    PaginatedResult<RequestModelDto> GetSupervisedPassesRequests(int userId, bool isGuard, int skip, int take);
    PaginatedResult<RequestModelDto> GetSupervisedVisitsRequests(int userId, bool isGuard, int skip, int take);
    int GetYearRequestsCountForUserInHours(int userId);
    PaginatedResult<RequestModelDto> GetRequestsForUser(int userId, int skip, int take);
    PaginatedResult<RequestModelDto> GetPendingVisitsAndPassesRequestsForSupervisor(int supervisorId, int skip, int take);
    PaginatedResult<RequestModelDto> GetSupervisedVisitsAndPassesRequestsForSupervisor(int supervisorId, int skip, int take);
}