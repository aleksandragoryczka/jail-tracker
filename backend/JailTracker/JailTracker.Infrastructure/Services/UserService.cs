using System.Security.Cryptography;
using System.Text;
using JailTracker.Common.Dto;
using JailTracker.Common.Interfaces;
using JailTracker.Common.Models.DatabaseModels;
using JailTracker.Common.Enums;
using JailTracker.Database;

namespace JailTracker.Infrastructure.Services
{
    public class UserService : IUserService
    {
        private readonly ApplicationDbContext _context;

        public UserService(ApplicationDbContext context)
        {
            _context = context;
        }

        public UserModel CreateUser(RegisterDto registerDto, Role role = Role.User)
        {
            var user = new UserModel
            {
                FirstName = registerDto.FirstName,
                LastName = registerDto.LastName,
                Email = registerDto.Email,
                Password = HashPassword(registerDto.Password),
                Role = role,
                IsActive = true,
                CurrentRequestsSupervisorId = registerDto.SupervisorId,
               // PrisonId = registerDto.prisonId
            };

            _context.Users.Add(user);
            _context.SaveChanges();

            return user;
        }

        private byte[] HashPassword(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                return sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            }
        }

        public UserModel GetUser(int id)
        {
            return _context.Users.Find(id);
        }

        public bool DeleteUser(int id)
        {
            var user = _context.Users.Find(id);
            if (user == null)
            {
                return false;
            }

            _context.Users.Remove(user);
            _context.SaveChanges();

            return true;
        }

        public bool UpdateUserSupervisor(UpdateUserSupervisorDto updateUserSupervisorDto)
        {
            return false;
            // var user = _context.Users.Find(updateUserSupervisorDto.UserId);
            // if (user == null)
            // {
            //     return false;
            // }

            // user.CurrentRequestsSupervisorId = updateUserSupervisorDto.NewSupervisorId;
            // _context.SaveChanges();

            // return true;
        }

        public UserModel UpdateUser(UserModel existingUser, UpdateUserDto updateUserDto)
        {
            existingUser.FirstName = updateUserDto.FirstName;
            existingUser.LastName = updateUserDto.LastName;
            existingUser.Password = HashPassword(updateUserDto.Password);
            // Note: Update other fields as necessary

            _context.SaveChanges();

            return existingUser;
        }

        public IEnumerable<UserModel> GetAllUsers()
        {
            return _context.Users;
        }
    }
}