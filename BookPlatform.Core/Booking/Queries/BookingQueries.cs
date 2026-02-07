namespace BookPlatform.Core.Booking.Queries;

public static class BookingQueries
{
    public const string Insert = @"
        INSERT INTO bookings (facility_id, user_id, slot_id, status, notes, party_size, created_at, updated_at)
        VALUES (@FacilityId, @UserId, @SlotId, @Status, @Notes, @PartySize, @CreatedAt, @UpdatedAt)
        RETURNING id;";

    public const string UpdateStatus = @"
        UPDATE bookings SET status = @Status, updated_at = @UpdatedAt WHERE id = @Id;";

    public const string Delete = @"DELETE FROM bookings WHERE id = @Id;";

    public const string GetById = @"
        SELECT b.id, b.facility_id as FacilityId, f.name as FacilityName, b.user_id as UserId, u.username as UserName,
               b.slot_id as SlotId, s.start_time as SlotStartTime, s.end_time as SlotEndTime,
               b.status, b.notes, b.party_size as PartySize, b.created_at as CreatedAt
        FROM bookings b 
        JOIN facilities f ON b.facility_id = f.id
        JOIN users u ON b.user_id = u.id
        JOIN slots s ON b.slot_id = s.id
        WHERE b.id = @Id;";

    public const string GetByUserId = @"
        SELECT b.id, b.facility_id as FacilityId, f.name as FacilityName, b.user_id as UserId, u.username as UserName,
               b.slot_id as SlotId, s.start_time as SlotStartTime, s.end_time as SlotEndTime,
               b.status, b.notes, b.party_size as PartySize, b.created_at as CreatedAt
        FROM bookings b 
        JOIN facilities f ON b.facility_id = f.id
        JOIN users u ON b.user_id = u.id
        JOIN slots s ON b.slot_id = s.id
        WHERE b.user_id = @UserId ORDER BY b.created_at DESC;";

    public const string GetByFacilityId = @"
        SELECT b.id, b.facility_id as FacilityId, f.name as FacilityName, b.user_id as UserId, u.username as UserName,
               b.slot_id as SlotId, s.start_time as SlotStartTime, s.end_time as SlotEndTime,
               b.status, b.notes, b.party_size as PartySize, b.created_at as CreatedAt
        FROM bookings b 
        JOIN facilities f ON b.facility_id = f.id
        JOIN users u ON b.user_id = u.id
        JOIN slots s ON b.slot_id = s.id
        WHERE b.facility_id = @FacilityId ORDER BY b.created_at DESC;";

    public const string GetPendingByFacilityId = @"
        SELECT b.id, b.facility_id as FacilityId, f.name as FacilityName, b.user_id as UserId, u.username as UserName,
               b.slot_id as SlotId, s.start_time as SlotStartTime, s.end_time as SlotEndTime,
               b.status, b.notes, b.party_size as PartySize, b.created_at as CreatedAt
        FROM bookings b 
        JOIN facilities f ON b.facility_id = f.id
        JOIN users u ON b.user_id = u.id
        JOIN slots s ON b.slot_id = s.id
        WHERE b.facility_id = @FacilityId AND b.status IN (0, 1) ORDER BY b.created_at;";
}
