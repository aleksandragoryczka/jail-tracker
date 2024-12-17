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
[ApiController]
public class PrisonController : ControllerBase
{
    private readonly IPrisonService _prisonService;

    public PrisonController(IPrisonService prisonService)
    {
        _prisonService = prisonService;
    }

    [HttpGet("{id}")]
    public ActionResult<PrisonModel> GetPrison(int id)
    {
        var res = _prisonService.GetPrison(id);

        if (res == null)
        {
            return NotFound();
        }

        return Ok(res);
    }

    [HttpGet]
    public ActionResult<IEnumerable<PrisonModel>> GetAllPrisons()
    {
        var res = _prisonService.GetAllPrisons();

        return Ok(res);
    }

    [HttpPost]
    public ActionResult<PrisonModel> CreatePrison([FromBody] CreatePrisonDto createPrisonDto)
    {
        PrisonModel res = _prisonService.CreatePrison(createPrisonDto);

        return Ok(res);
    }
}