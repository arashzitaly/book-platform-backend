using System.Data;
using Dapper;
using BookPlatform.Core.Auth.Models;
using BookPlatform.Core.Auth.Queries;

namespace BookPlatform.Core.Auth.Services;

public interface IUserService
{
    Task<User?> GetByIdAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken = default);
    Task<bool> EmailExistsAsync(string email, CancellationToken cancellationToken = default);
    Task<Guid> CreateUserAsync(User user, CancellationToken cancellationToken = default);
    Task UpdateUserAsync(User user, CancellationToken cancellationToken = default);
    Task DeleteUserAsync(Guid userId, CancellationToken cancellationToken = default);
}

public class UserService : IUserService
{
    private readonly IDbConnection _dbConnection;

    public UserService(IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }

    public async Task<User?> GetByIdAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _dbConnection.QueryFirstOrDefaultAsync<User>(new CommandDefinition(
            UserQueries.GetById,
            new { Id = userId },
            cancellationToken: cancellationToken));
    }

    public async Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken = default)
    {
        return await _dbConnection.QueryFirstOrDefaultAsync<User>(new CommandDefinition(
            UserQueries.GetByEmail,
            new { Email = email },
            cancellationToken: cancellationToken));
    }

    public async Task<bool> EmailExistsAsync(string email, CancellationToken cancellationToken = default)
    {
        return await _dbConnection.ExecuteScalarAsync<bool>(new CommandDefinition(
            UserQueries.EmailExists,
            new { Email = email },
            cancellationToken: cancellationToken));
    }

    public async Task<Guid> CreateUserAsync(User user, CancellationToken cancellationToken = default)
    {
        var id = await _dbConnection.ExecuteScalarAsync<Guid>(new CommandDefinition(
            UserQueries.Insert,
            new { user.Username, user.Email, user.PasswordHash, Role = (int)user.Role, user.CreatedAt, user.UpdatedAt },
            cancellationToken: cancellationToken));
        return id;
    }

    public async Task UpdateUserAsync(User user, CancellationToken cancellationToken = default)
    {
        user.UpdatedAt = DateTime.UtcNow;
        await _dbConnection.ExecuteAsync(new CommandDefinition(
            UserQueries.Update,
            new { user.Id, user.Username, user.Email, user.PasswordHash, Role = (int)user.Role, user.UpdatedAt },
            cancellationToken: cancellationToken));
    }

    public async Task DeleteUserAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        await _dbConnection.ExecuteAsync(new CommandDefinition(
            UserQueries.Delete,
            new { Id = userId },
            cancellationToken: cancellationToken));
    }
}
