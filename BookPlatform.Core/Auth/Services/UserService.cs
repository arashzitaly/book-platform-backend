using System.Data;
using Dapper;
using BookPlatform.Core.Auth.Models;
using BookPlatform.Core.Auth.Queries;

namespace BookPlatform.Core.Auth.Services;

public interface IUserService
{
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

    public async Task<Guid> CreateUserAsync(User user, CancellationToken cancellationToken = default)
    {
        var id = await _dbConnection.ExecuteScalarAsync<Guid>(new CommandDefinition(
            UserQueries.Insert,
            new { user.Username, user.Email, user.PasswordHash },
            cancellationToken: cancellationToken));
        return id;
    }

    public async Task UpdateUserAsync(User user, CancellationToken cancellationToken = default)
    {
        await _dbConnection.ExecuteAsync(new CommandDefinition(
            UserQueries.Update,
            new { user.Id, user.Username, user.Email, user.PasswordHash },
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
