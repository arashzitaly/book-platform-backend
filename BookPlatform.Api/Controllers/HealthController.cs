using Microsoft.AspNetCore.Mvc;
using Npgsql;

namespace BookPlatform.Api.Controllers;

/// <summary>
/// Health check endpoints for monitoring and load balancer probes
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Route("health")]
public class HealthController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<HealthController> _logger;

    public HealthController(IConfiguration configuration, ILogger<HealthController> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    /// <summary>
    /// Basic liveness probe - indicates the service is running
    /// </summary>
    [HttpGet]
    [HttpGet("live")]
    public IActionResult Live()
    {
        return Ok(new
        {
            status = "healthy",
            timestamp = DateTime.UtcNow,
            service = "BookPlatform.Api",
            version = GetType().Assembly.GetName().Version?.ToString() ?? "1.0.0"
        });
    }

    /// <summary>
    /// Readiness probe - indicates the service is ready to accept traffic
    /// Checks database connectivity
    /// </summary>
    [HttpGet("ready")]
    public async Task<IActionResult> Ready()
    {
        var checks = new List<HealthCheckResult>();

        // Database check
        var dbCheck = await CheckDatabaseAsync();
        checks.Add(dbCheck);

        var allHealthy = checks.All(c => c.IsHealthy);

        var result = new
        {
            status = allHealthy ? "healthy" : "unhealthy",
            timestamp = DateTime.UtcNow,
            checks = checks.Select(c => new
            {
                name = c.Name,
                status = c.IsHealthy ? "healthy" : "unhealthy",
                duration_ms = c.DurationMs,
                message = c.Message
            })
        };

        return allHealthy ? Ok(result) : StatusCode(503, result);
    }

    /// <summary>
    /// Detailed health check with all dependencies
    /// </summary>
    [HttpGet("detailed")]
    public async Task<IActionResult> Detailed()
    {
        var checks = new List<HealthCheckResult>();

        // Database check
        checks.Add(await CheckDatabaseAsync());

        // Memory check
        checks.Add(CheckMemory());

        var allHealthy = checks.All(c => c.IsHealthy);

        var result = new
        {
            status = allHealthy ? "healthy" : "degraded",
            timestamp = DateTime.UtcNow,
            uptime = GetUptime(),
            environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Production",
            checks = checks.Select(c => new
            {
                name = c.Name,
                status = c.IsHealthy ? "healthy" : "unhealthy",
                duration_ms = c.DurationMs,
                message = c.Message
            })
        };

        return allHealthy ? Ok(result) : StatusCode(503, result);
    }

    private async Task<HealthCheckResult> CheckDatabaseAsync()
    {
        var sw = System.Diagnostics.Stopwatch.StartNew();
        try
        {
            var connectionString = _configuration.GetConnectionString("DefaultConnection");
            await using var connection = new NpgsqlConnection(connectionString);
            await connection.OpenAsync();
            await using var cmd = new NpgsqlCommand("SELECT 1", connection);
            await cmd.ExecuteScalarAsync();
            sw.Stop();

            return new HealthCheckResult
            {
                Name = "database",
                IsHealthy = true,
                DurationMs = sw.ElapsedMilliseconds,
                Message = "PostgreSQL connection successful"
            };
        }
        catch (Exception ex)
        {
            sw.Stop();
            _logger.LogError(ex, "Database health check failed");
            return new HealthCheckResult
            {
                Name = "database",
                IsHealthy = false,
                DurationMs = sw.ElapsedMilliseconds,
                Message = $"Connection failed: {ex.Message}"
            };
        }
    }

    private HealthCheckResult CheckMemory()
    {
        var sw = System.Diagnostics.Stopwatch.StartNew();
        var workingSet = Environment.WorkingSet;
        var memoryMb = workingSet / 1024 / 1024;
        var threshold = 512; // MB
        sw.Stop();

        return new HealthCheckResult
        {
            Name = "memory",
            IsHealthy = memoryMb < threshold,
            DurationMs = sw.ElapsedMilliseconds,
            Message = $"Working set: {memoryMb}MB (threshold: {threshold}MB)"
        };
    }

    private string GetUptime()
    {
        var uptime = DateTime.UtcNow - System.Diagnostics.Process.GetCurrentProcess().StartTime.ToUniversalTime();
        return $"{uptime.Days}d {uptime.Hours}h {uptime.Minutes}m {uptime.Seconds}s";
    }

    private class HealthCheckResult
    {
        public string Name { get; set; } = "";
        public bool IsHealthy { get; set; }
        public long DurationMs { get; set; }
        public string Message { get; set; } = "";
    }
}
