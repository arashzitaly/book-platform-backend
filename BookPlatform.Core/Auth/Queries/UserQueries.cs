namespace BookPlatform.Core.Auth.Queries;

public static class UserQueries
{
    public const string Insert = @"INSERT INTO users (username, email, password_hash)
                                     VALUES (@Username, @Email, @PasswordHash)
                                     RETURNING id;";

    public const string Update = @"UPDATE users
                                     SET username = @Username,
                                         email = @Email,
                                         password_hash = @PasswordHash
                                     WHERE id = @Id;";

    public const string Delete = @"DELETE FROM users WHERE id = @Id;";
}
