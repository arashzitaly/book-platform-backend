namespace BookPlatform.Core.Resource.Queries;

public static class ResourceQueries
{
    public const string Insert = @"
        INSERT INTO resources (facility_id, name, type, capacity, description, is_active, created_at, updated_at)
        VALUES (@FacilityId, @Name, @Type, @Capacity, @Description, @IsActive, @CreatedAt, @UpdatedAt)
        RETURNING id;";

    public const string Update = @"
        UPDATE resources
        SET name = @Name, capacity = @Capacity, description = @Description, 
            is_active = @IsActive, updated_at = @UpdatedAt
        WHERE id = @Id;";

    public const string Delete = @"DELETE FROM resources WHERE id = @Id;";

    public const string GetById = @"
        SELECT id, facility_id as FacilityId, name, type, capacity, description, 
               is_active as IsActive, created_at as CreatedAt, updated_at as UpdatedAt
        FROM resources WHERE id = @Id;";

    public const string GetByFacilityId = @"
        SELECT id, facility_id as FacilityId, name, type, capacity, description, 
               is_active as IsActive, created_at as CreatedAt, updated_at as UpdatedAt
        FROM resources WHERE facility_id = @FacilityId AND is_active = true ORDER BY name;";
}
