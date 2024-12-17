using JailTracker.Common.Dto;
using JailTracker.Common.Enums;
using JailTracker.Common.Models.DatabaseModels;

namespace JailTracker.Common.Interfaces;

public interface IPrisonService
{
    PrisonModel CreatePrison(CreatePrisonDto createPrisonDto);
    PrisonModel GetPrison(int Id);
    IEnumerable<PrisonModel> GetAllPrisons();
    // bool DeleteUser(int Id);
    // UserModel UpdateUser(UserModel existingUser, UpdateUserDto updateUserDto);
    // bool UpdateUserSupervisor(UpdateUserSupervisorDto updateUserSupervisor);

}