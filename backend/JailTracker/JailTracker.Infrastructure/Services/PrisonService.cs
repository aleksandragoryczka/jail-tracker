using System.Security.Cryptography;
using System.Text;
using JailTracker.Common.Dto;
using JailTracker.Common.Interfaces;
using JailTracker.Common.Models.DatabaseModels;
using JailTracker.Common.Enums;
using JailTracker.Database;

namespace JailTracker.Infrastructure.Services
{
    public class PrisonService : IPrisonService
    {
        private readonly ApplicationDbContext _context;

        public PrisonService(ApplicationDbContext context)
        {
            _context = context;
        }

        public PrisonModel CreatePrison(CreatePrisonDto createPrisonDto)
        {
            var prison = new PrisonModel
            {
                Name = createPrisonDto.Name,
                IsActive = createPrisonDto.IsActive,
                UrlName = createPrisonDto.UrlName
            };

            _context.Prisons.Add(prison);
            _context.SaveChanges();

            return prison;
        }

        public PrisonModel GetPrison(int id)
        {
            return _context.Prisons.Find(id);
        }

        public IEnumerable<PrisonModel> GetAllPrisons()
        {
            return _context.Prisons;
        }

        // public bool DeleteUser(int id)
        // {
        //     var user = _context.Users.Find(id);
        //     if (user == null)
        //     {
        //         return false;
        //     }

        //     _context.Users.Remove(user);
        //     _context.SaveChanges();

        //     return true;
        // }

        // public UserModel UpdateUser(UserModel existingUser, UpdateUserDto updateUserDto)
        // {
        //     existingUser.FirstName = updateUserDto.FirstName;
        //     existingUser.LastName = updateUserDto.LastName;
        //     existingUser.Password = HashPassword(updateUserDto.Password);
        //     // Note: Update other fields as necessary

        //     _context.SaveChanges();

        //     return existingUser;
        // }


    }
}