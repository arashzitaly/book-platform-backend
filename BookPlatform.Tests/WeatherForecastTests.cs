using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;

namespace BookPlatform.Tests;

public class WeatherForecastTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public WeatherForecastTests(WebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }

    private record WeatherForecastDto(DateOnly Date, int TemperatureC, string? Summary, int TemperatureF);

    [Fact]
    public async Task WeatherForecast_ReturnsFiveItems()
    {
        var forecasts = await _client.GetFromJsonAsync<WeatherForecastDto[]>("/weatherforecast");
        Assert.NotNull(forecasts);
        Assert.Equal(5, forecasts!.Length);
    }

    [Fact]
    public async Task TemperatureF_ComputedCorrectly()
    {
        var forecast = await _client.GetFromJsonAsync<WeatherForecastDto[]>("/weatherforecast");
        Assert.NotNull(forecast);
        var first = forecast![0];
        int expected = 32 + (int)(first.TemperatureC / 0.5556);
        Assert.Equal(expected, first.TemperatureF);
    }
}
