namespace BookPlatform.Core.Auth.Queries;

public static class UserQueries
{
    public const string Insert = @"
        INSERT INTO users (username, email, password_hash, role, created_at, updated_at)
        VALUES (@Username, @Email, @PasswordHash, @Role, @CreatedAt, @UpdatedAt)
        RETURNING id;";

    public const string Update = @"
        UPDATE users
        SET username = @Username, email = @Email, password_hash = @PasswordHash, 
            role = @Role, updated_at = @UpdatedAt
        WHERE id = @Id;";

    public const string Delete = @"DELETE FROM users WHERE id = @Id;";

    public const string GetById = @"
        SELECT id, username, email, password_hash as PasswordHash, role, 
               created_at as CreatedAt, updated_at as UpdatedAt
        FROM users WHERE id = @Id;";

    public const string GetByEmail = @"
        SELECT id, username, email, password_hash as PasswordHash, role, 
               created_at as CreatedAt, updated_at as UpdatedAt
        FROM users WHERE email = @Email;";

    public const string EmailExists = @"SELECT EXISTS(SELECT 1 FROM users WHERE email = @Email);";
}
