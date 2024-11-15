using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JailTracker.Controllers;

[Route("api/[controller]")]
[ApiController]
public class PingController : ControllerBase
{
    [HttpGet]
    public ActionResult Pong()
    {
        return Ok($"pong");
    }
    /*[HttpGet("auth"), Authorize]
    public ActionResult PongAuth()
    {
        return Ok(User.Identity?.IsAuthenticated);
    }*/
}

