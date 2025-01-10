using JailTracker.Common.Dto;
using JailTracker.Common.Enums;
using JailTracker.Common.Interfaces;
using JailTracker.Common.Models;
using JailTracker.Database;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query.Internal;

namespace JailTracker.Infrastructure.Services;

public class RequestsManagementService : IRequestsManagementService
{
    private readonly ApplicationDbContext _context;

    public RequestsManagementService(ApplicationDbContext context)
    {
        _context = context;
    }
    
    /*public PaginatedResult<RequestModelDto> GetSupervisedPassesRequests(int userId, bool isGuard, int skip, int take)
    {
        IQueryable<RequestModelDto> requests;
        if (isGuard)
        {
            requests = _context.Requests
                .Where(x => x.RequestSupervisorId == userId)
                .Where(x => x.IsActive)
                .Where(x => x.RequestType == RequestType.Pass)
                .Where(x => x.ApprovalState != ApprovalState.Pending)
                .Include(x => x.User)
                .Select(x => new RequestModelDto(x));
        }
        else
        {
            requests = _context.Requests
                .Where(x => x.UserId == userId)
                .Where(x => x.IsActive)
                .Where(x => x.RequestType == RequestType.Pass)
                .Where(x => x.ApprovalState != ApprovalState.Pending)
                .Include(x => x.User)
                .Select(x => new RequestModelDto(x));
        }

        var res = new PaginatedResult<RequestModelDto>(requests.Skip(skip).Take(take), requests.Count(), take);
        return res;
    }

    public PaginatedResult<RequestModelDto> GetSupervisedVisitsRequests(int userId, bool isGuard, int skip, int take)
    {
        IQueryable<RequestModelDto> requests;
        if (isGuard)
        {
            requests = _context.Requests
                .Where(x => x.RequestSupervisorId == userId)
                .Where(x => x.IsActive)
                .Where(x => x.RequestType == RequestType.Visit)
                .Where(x => x.ApprovalState != ApprovalState.Pending)
                .Include(x => x.User)
                .Select(x => new RequestModelDto(x));
        }
        else
        {
            requests = _context.Requests
                .Where(x => x.UserId == userId)
                .Where(x => x.IsActive)
                .Where(x => x.RequestType == RequestType.Visit)
                .Where(x => x.ApprovalState != ApprovalState.Pending)
                .Include(x => x.User)
                .Select(x => new RequestModelDto(x));
        }
        
        var res = new PaginatedResult<RequestModelDto>(requests.Skip(skip).Take(take), requests.Count(), take);
        return res;
    }*/

    public int GetYearRequestsCountForUserInHoursByRequestType(int userId, RequestType requestType)
    {
        DateTime currentDate = DateTime.Now;
        DateTime currentYearStart = new DateTime(currentDate.Year, 1, 1);
        DateTime nextYearStart = currentYearStart.AddYears(1);

        var requests = _context.Requests
            .Where(x => x.IsActive  && x.ApprovalState != ApprovalState.Rejected)
            .Where(x => x.RequestType == requestType)
            .Where(a => a.UserId == userId && a.IsActive &&
                        ((a.FromDate >= currentYearStart && a.FromDate < nextYearStart) ||
                         (a.FromDate < currentYearStart && a.ToDate >= currentYearStart)));
        
        int requestedHours = 0;
        foreach (var request in requests)
        {
            DateTime requestStartDate = (request.FromDate > currentYearStart) ? request.FromDate : currentYearStart;
            DateTime requestEndDate = (request.ToDate < nextYearStart) ? request.ToDate : nextYearStart.AddDays(-1);

            requestedHours += (int)(requestEndDate - requestStartDate).TotalHours;
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

    public PaginatedResult<RequestModelDto> GetPendingVisitsAndPassesRequestsForSupervisor(int supervisorId, int skip, int take)
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

    public PaginatedResult<RequestModelDto> GetSupervisedVisitsAndPassesRequestsForSupervisor(int supervisorId, int skip, int take)
    {
        var requests = _context.Requests
            .Where(x => x.RequestSupervisorId == supervisorId)
            .Where(x => x.ApprovalState != ApprovalState.Pending)
            .Where(x => x.IsActive)
            .Include(x => x.User)
            .Select(x => new RequestModelDto(x));

        var res = new PaginatedResult<RequestModelDto>(requests.Skip(skip).Take(take), requests.Count(), take);
        return res;    
    }

    public PaginatedResult<RequestModelDto> GetRequestsByDateForUser(int userId, DateTime from, DateTime to, RequestType type, bool isGuard, int skip, int take)
    {
        IQueryable<RequestModelDto> requests;
        if (isGuard)
        {
            requests = _context.Requests
                .Where(x => x.RequestSupervisorId == userId)
                .Where(x => x.IsActive)
                .Where(x => x.RequestType == type)
                .Where(x => x.ApprovalState != ApprovalState.Pending)
                .Include(x => x.User)
                .Where(x => (x.FromDate >= from && x.FromDate <= to))// || x.ToDate >= from && x.ToDate <= to)
                .Select(x => new RequestModelDto(x));
        }
        else
        {
            requests = _context.Requests
                .Where(x => x.UserId == userId)
                .Where(x => x.IsActive)
                .Where(x => x.RequestType == type)
                .Where(x => x.ApprovalState != ApprovalState.Pending)
                .Include(x => x.User)
                .Where(x => (x.FromDate >= from && x.FromDate <= to))// || x.ToDate >= from && x.ToDate <= to)
                .Select(x => new RequestModelDto(x));
        }
        
        var res = new PaginatedResult<RequestModelDto>(requests.Skip(skip).Take(take), requests.Count(), take);
        return res;
    }

    public List<RequestModelDto> GetAllAcceptedRequestsMonthly(DateTime from, DateTime to)
    {
        var requsts = _context.Requests
            .Where(x => x.IsActive)
            .Where(x => x.ApprovalState == ApprovalState.Approved)
            .Include(x => x.User)
            .Where(x => (x.FromDate >= from && x.FromDate <= to))
            .Select(x => new RequestModelDto(x));
        
        return requsts.ToList();

    }
}