namespace BookPlatform.Core.Slot.Queries;

public static class SlotQueries
{
    public const string Insert = @"
        INSERT INTO slots (facility_id, resource_id, start_time, end_time, capacity, available_spots, price, is_active, created_at)
        VALUES (@FacilityId, @ResourceId, @StartTime, @EndTime, @Capacity, @AvailableSpots, @Price, @IsActive, @CreatedAt)
        RETURNING id;";

    public const string UpdateAvailableSpots = @"
        UPDATE slots SET available_spots = available_spots - @Count WHERE id = @Id AND available_spots >= @Count;";

    public const string IncrementAvailableSpots = @"
        UPDATE slots SET available_spots = available_spots + @Count WHERE id = @Id;";

    public const string Delete = @"DELETE FROM slots WHERE id = @Id;";

    public const string GetById = @"
        SELECT s.id, s.facility_id as FacilityId, s.resource_id as ResourceId, r.name as ResourceName,
               s.start_time as StartTime, s.end_time as EndTime, s.capacity, s.available_spots as AvailableSpots, s.price
        FROM slots s LEFT JOIN resources r ON s.resource_id = r.id WHERE s.id = @Id;";

    public const string GetByFacilityId = @"
        SELECT s.id, s.facility_id as FacilityId, s.resource_id as ResourceId, r.name as ResourceName,
               s.start_time as StartTime, s.end_time as EndTime, s.capacity, s.available_spots as AvailableSpots, s.price
        FROM slots s LEFT JOIN resources r ON s.resource_id = r.id 
        WHERE s.facility_id = @FacilityId AND s.is_active = true AND s.start_time >= @FromDate
        ORDER BY s.start_time;";

    public const string GetAvailable = @"
        SELECT s.id, s.facility_id as FacilityId, s.resource_id as ResourceId, r.name as ResourceName,
               s.start_time as StartTime, s.end_time as EndTime, s.capacity, s.available_spots as AvailableSpots, s.price
        FROM slots s LEFT JOIN resources r ON s.resource_id = r.id 
        WHERE s.facility_id = @FacilityId AND s.is_active = true AND s.available_spots > 0 AND s.start_time >= @FromDate
        ORDER BY s.start_time LIMIT @Limit;";
}
