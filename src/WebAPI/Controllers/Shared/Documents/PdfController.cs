using Application.Features.Shared.Documents.Interfaces;
using Application.Features.Shared.Documents.Models;
using Application.Features.Shared.Documents.DTOs.Requests;
using Application.Features.Shared.Logging.Interfaces;
using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers.Shared.Documents
{
    [Authorize]
    [ApiVersion("4.0")]
    [Route("api/v{version:apiVersion}/pdf")]
    public class PdfController : BaseController
    {
        private readonly IPdfGenerationService _pdfGenerationService;
        private readonly IAdvancedLogger<PdfController> _logger;

        public PdfController(
            IPdfGenerationService pdfGenerationService,
            IAdvancedLogger<PdfController> logger)
        {
            _pdfGenerationService = pdfGenerationService;
            _logger = logger;
        }

        // This controller now serves as a legacy endpoint
        // New endpoints are available in:
        // - PdfGenerationController: /api/v4.0/pdf/generate/*
        // - PdfManipulationController: /api/v4.0/pdf/manipulate/*
        // - PdfUtilityController: /api/v4.0/pdf/utility/*

        [HttpGet("info")]
        public IActionResult GetApiInfo()
        {
            return Ok(new
            {
                message = "PDF API endpoints have been reorganized",
                endpoints = new
                {
                    generation = "/api/v4.0/pdf/generate",
                    manipulation = "/api/v4.0/pdf/manipulate", 
                    utility = "/api/v4.0/pdf/utility"
                }
            });
        }

        private string GetCurrentUserId()
        {
            return User?.FindFirst("sub")?.Value ?? User?.FindFirst("id")?.Value ?? "Anonymous";
        }
    }
}