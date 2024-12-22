using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using JailTracker.Attributes;
using JailTracker.Api.Extensions;
using JailTracker.Common.Dto;
using JailTracker.Common.Enums;
using JailTracker.Common.Identity;
using JailTracker.Common.Interfaces;
using JailTracker.Common.Models.DatabaseModels;

namespace JailTracker.Api.Controllers;

[Route("api/[controller]")]
[Authorize]
[ApiController]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;

    public UserController(IUserService userService)
    {
        _userService = userService;
    }

    /// <summary>
    /// DONE
    /// </summary>
    /// <param name="registerDto"></param>
    /// <returns></returns>
    [HttpPost]
    [RequireClaim(IdentityData.PermissionsClaimName, PermissionType.CreateUser)]
    [Authorize(Policy =  IdentityData.AdminUserClaimName)]
    public ActionResult<UserModel> CreateUser([FromBody] RegisterDto registerDto)
    {
        UserModel res = _userService.CreateUser(registerDto);

        return Ok(res);
    }

    /// <summary>
    /// DONE - DISPLAY USER'S PROFILE DETAILS
    /// </summary>
    /// <returns></returns>
    [HttpGet]
    public ActionResult<UserModel> GetCurrentUserProfile()
    {
        var userId = User.Identity.GetUserId();
        var user = _userService.GetUser(userId);

        if (user == null)
        {
            return NotFound();
        }
        
        return Ok(user);
    }

    /// <summary>
    /// DONE - Admin panel
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    [HttpDelete("{id}")]
    [Authorize(Policy = IdentityData.AdminUserPolicy)]
    public ActionResult<bool> DeleteUser(int id)
    {
        return Ok(_userService.DeleteUser(id));
    }

    /// <summary>
    /// DONE - Admin panel
    /// </summary>
    /// <param name="updateUserDto"></param>
    /// <returns></returns>
    [HttpPost("UpdateUserSupervisor")]
    [RequireClaim(IdentityData.PermissionsClaimName, PermissionType.ModifyUser)]
    public ActionResult<bool> UpdateUserSupervisor([FromBody] UpdateUserSupervisorDto updateUserSupervisor)
    {
        bool res = _userService.UpdateUserSupervisor(updateUserSupervisor);
        return Ok(res);
    }
    
    /// <summary>
    /// DONE - User's profoile - update name, surname, password
    /// </summary>
    /// <param name="updateUserDto"></param>
    /// <returns></returns>
    [HttpPut("UpdateUserForUser")]
    public ActionResult<UserModel> UpdateUserForUser([FromBody] UpdateUserDto updateUserDto)
    {
        UserModel existingUser = _userService.GetUser(User.Identity.GetUserId());

        if (existingUser == null)
        {
            return NotFound();
        }
        UserModel updatedUser = _userService.UpdateUser(existingUser, updateUserDto);
        return Ok(updatedUser);
    }
    
}