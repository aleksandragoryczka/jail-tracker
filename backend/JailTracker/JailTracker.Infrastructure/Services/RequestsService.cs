using JailTracker.Common.Dto;
using JailTracker.Common.Enums;
using JailTracker.Common.Interfaces;
using JailTracker.Common.Models.DatabaseModels;
using JailTracker.Database;
using Microsoft.EntityFrameworkCore;

namespace JailTracker.Infrastructure.Services
{
    public class RequestsService : IRequestsService
    {
        private readonly ApplicationDbContext _context;

        public RequestsService(ApplicationDbContext context)
        {
            _context = context;
        }

        public RequestModel SetApprovalState(RequestApprovalStateDto requestApprovalState, int supervisorId)
        {
            var supervisor = _context.Users.Where(x => x.Id == supervisorId).First();
            if (supervisor == null)
            {
                throw new ArgumentException("Supervisor not found");
            }

            var request = _context.Requests
                .Where(x => x.IsActive)
                .Where(x => x.Id == requestApprovalState.RequestId)
                .Where(x => x.RequestSupervisorId == supervisorId)
                .FirstOrDefault();

            if (request == default) return default;

            request.ApprovalState = requestApprovalState.ApprovalState;
            _context.SaveChanges();

            return request;
        }

        public RequestModel CreateRequest(int userId, CreateRequestDto requestDto)
        {
            var user = _context.Users.Include(x => x.CurrentRequestsSupervisor).Where(x => x.Id == userId).First();
            if (user == null)
            {
                throw new ArgumentException("User not found");
            }
            
            if (user.CurrentRequestsSupervisor == null)
            {
                throw new ArgumentException("CurrentRequestsSupervisor is not assigned to the user");
            }

            var fromDateUtc = requestDto.FromDate.ToUniversalTime();
            var toDateUtc = requestDto.ToDate.ToUniversalTime();

            RequestModel newRequest = new RequestModel
            {
                Id = Guid.NewGuid(),
                FromDate = fromDateUtc,
                ToDate = toDateUtc,
                IsActive = true,
                UserId = userId,
                ApprovalState = ApprovalState.Pending,
                RequestSupervisorId = user.CurrentRequestsSupervisor.Id,
                RequestType = requestDto.RequestType
            };

            _context.Add(newRequest);
            _context.SaveChanges();
            return newRequest;
        }

        public RequestModelDto UpdateRequest(int userId, UpdateRequestDto updatedRequestDto)
        {
            var request = _context.Requests
                .Where(x => x.UserId == userId && x.Id == updatedRequestDto.RequestId)
                .Include(x => x.User)
                .First();

            if (updatedRequestDto.NewFromDate.HasValue && updatedRequestDto.NewFromDate.Value >= DateTime.Today)
                request.FromDate = updatedRequestDto.NewFromDate.Value;

            if (updatedRequestDto.NewToDate.HasValue && updatedRequestDto.NewToDate.Value >= request.FromDate)
                request.ToDate = updatedRequestDto.NewToDate.Value;
            
            request.RequestType = updatedRequestDto.NewRequestType;

            _context.SaveChanges();

            return new RequestModelDto(request);
        }

        public bool CancelRequestForUser(Guid requestId, int userId)
        {
            RequestModel request = _context.Requests
                .Where(x => x.UserId == userId)
                .Where(x => x.Id == requestId)
                .Where(x => x.FromDate > DateTime.Now)
                .FirstOrDefault();

            if (request != null)
            {
                request.IsActive = false;
                _context.SaveChanges();
                return true;
            }
            return false;
        }
    }
}
