# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj files and restore dependencies
COPY ["BookPlatform.Api/BookPlatform.Api.csproj", "BookPlatform.Api/"]
COPY ["BookPlatform.Core/BookPlatform.Core.csproj", "BookPlatform.Core/"]
RUN dotnet restore "BookPlatform.Api/BookPlatform.Api.csproj"

# Copy source code and build
COPY . .
WORKDIR "/src/BookPlatform.Api"
RUN dotnet build "BookPlatform.Api.csproj" -c Release -o /app/build

# Publish stage
FROM build AS publish
RUN dotnet publish "BookPlatform.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Create non-root user for security
RUN addgroup --system --gid 1001 appgroup && \
    adduser --system --uid 1001 --ingroup appgroup appuser

# Copy published files
COPY --from=publish /app/publish .

# Set ownership
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 8080

# Set environment variables
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/health/live || exit 1

# Start the application
ENTRYPOINT ["dotnet", "BookPlatform.Api.dll"]
