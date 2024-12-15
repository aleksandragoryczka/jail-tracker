using JailTracker.Common.Dto;
using JailTracker.Common.Enums;
using JailTracker.Common.Interfaces;
using JailTracker.Common.Models;
using JailTracker.Database;
using Microsoft.EntityFrameworkCore;

namespace JailTracker.Infrastructure.Services;

public class RequestsManagementService : IRequestsManagementService
{
    private readonly ApplicationDbContext _context;

    public RequestsManagementService(ApplicationDbContext context)
    {
        _context = context;
    }

    public PaginatedResult<RequestModelDto> GetRequestsByDateForUser(int userId, DateTime from, DateTime to, RequestType type, int skip, int take)
    {
        var requests = _context.Requests
            .Where(x => x.UserId == userId)
            .Where(x => x.IsActive)
            .Where(x => x.RequestType == type)
            .Include(x => x.User)
            .Where(x => (x.FromDate >= from && x.FromDate <= to) || x.ToDate >= from && x.ToDate <= to)
            .Select(x => new RequestModelDto(x));

        var res = new PaginatedResult<RequestModelDto>(requests.Skip(skip).Take(take), requests.Count(), take);
        return res;
    }

    public PaginatedResult<RequestModelDto> GetPendingRequestsForSupervisor(int supervisorId, int skip, int take)
    {
        var requests = _context.Requests
            .Where(x => x.RequestSupervisorId == supervisorId)
            .Where(x => x.ApprovalState == ApprovalState.Pending)
            .Where(x => x.IsActive)
            .Include(x => x.User)
            .Select(x => new RequestModelDto(x));

        var res = new PaginatedResult<RequestModelDto>(requests.Skip(skip).Take(take), requests.Count(), take);
        return res;   
    }

    public PaginatedResult<RequestModelDto> GetSupervisedRequestsForSupervisor(int supervisorId, int skip, int take)
    {
        var requests = _context.Requests
            .Where(x => x.RequestSupervisorId == supervisorId)
            .Where(x => x.IsActive)
            .Where(x => x.ApprovalState != ApprovalState.Pending)
            .Include(x => x.User)
            .Select(x => new RequestModelDto(x));

        var res = new PaginatedResult<RequestModelDto>(requests.Skip(skip).Take(take), requests.Count(), take);
        return res;
    }

    public int GetYearRequestsCountForUserInHours(int userId)
    {
        DateTime currentDate = DateTime.Now;
        DateTime currentYearStart = new DateTime(currentDate.Year, 1, 1);
        DateTime nextYearStart = currentYearStart.AddYears(1);

        var requests = _context.Requests
            .Where(x => x.IsActive  && x.ApprovalState != ApprovalState.Rejected)
            .Where(a => a.UserId == userId && a.IsActive &&
                        ((a.FromDate >= currentYearStart && a.FromDate < nextYearStart) ||
                         (a.FromDate < currentYearStart && a.ToDate >= currentYearStart)));
        
        int requestedHours = 0;
        foreach (var request in requests)
        {
            DateTime requestStartDate = (request.FromDate > currentYearStart) ? request.FromDate : currentYearStart;
            DateTime requestEndDate = (request.ToDate < nextYearStart) ? request.ToDate : nextYearStart.AddDays(-1);
            requestedHours += (requestEndDate - requestStartDate).Hours + 1;
        }

        return requestedHours;
    }

    public PaginatedResult<RequestModelDto> GetRequestsForUser(int userId, int skip, int take)
    {
        var requests = _context.Requests
            .Include(x => x.RequestSupervisor)
            .Where(x => x.IsActive)
            .Where(x => x.UserId == userId)
            .Select(x => new RequestModelDto(x));
        return new PaginatedResult<RequestModelDto>(requests.Skip(skip).Take(take), requests.Count(), take); 
    }
}