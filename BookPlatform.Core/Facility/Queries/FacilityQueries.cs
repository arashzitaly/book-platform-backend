namespace BookPlatform.Core.Facility.Queries;

public static class FacilityQueries
{
    public const string Insert = @"
        INSERT INTO facilities (owner_id, category, name, description, address, phone, image_url, operating_hours, is_active, created_at, updated_at)
        VALUES (@OwnerId, @Category, @Name, @Description, @Address, @Phone, @ImageUrl, @OperatingHours::jsonb, @IsActive, @CreatedAt, @UpdatedAt)
        RETURNING id;";

    public const string Update = @"
        UPDATE facilities
        SET name = @Name, description = @Description, address = @Address, phone = @Phone, 
            image_url = @ImageUrl, operating_hours = @OperatingHours::jsonb, is_active = @IsActive, updated_at = @UpdatedAt
        WHERE id = @Id;";

    public const string Delete = @"DELETE FROM facilities WHERE id = @Id;";

    public const string GetById = @"
        SELECT id, owner_id as OwnerId, category, name, description, address, phone, 
               image_url as ImageUrl, operating_hours as OperatingHours, is_active as IsActive,
               created_at as CreatedAt, updated_at as UpdatedAt
        FROM facilities WHERE id = @Id;";

    public const string GetByOwnerId = @"
        SELECT id, owner_id as OwnerId, category, name, description, address, phone, 
               image_url as ImageUrl, operating_hours as OperatingHours, is_active as IsActive,
               created_at as CreatedAt, updated_at as UpdatedAt
        FROM facilities WHERE owner_id = @OwnerId ORDER BY created_at DESC;";

    public const string GetByCategory = @"
        SELECT id, owner_id as OwnerId, category, name, description, address, phone, 
               image_url as ImageUrl, operating_hours as OperatingHours, is_active as IsActive,
               created_at as CreatedAt, updated_at as UpdatedAt
        FROM facilities WHERE category = @Category AND is_active = true ORDER BY name;";

    public const string GetAll = @"
        SELECT id, owner_id as OwnerId, category, name, description, address, phone, 
               image_url as ImageUrl, operating_hours as OperatingHours, is_active as IsActive,
               created_at as CreatedAt, updated_at as UpdatedAt
        FROM facilities WHERE is_active = true ORDER BY created_at DESC LIMIT @Limit OFFSET @Offset;";

    public const string Search = @"
        SELECT id, owner_id as OwnerId, category, name, description, address, phone, 
               image_url as ImageUrl, operating_hours as OperatingHours, is_active as IsActive,
               created_at as CreatedAt, updated_at as UpdatedAt
        FROM facilities WHERE is_active = true AND (name ILIKE @Query OR description ILIKE @Query)
        ORDER BY name LIMIT @Limit;";
}
