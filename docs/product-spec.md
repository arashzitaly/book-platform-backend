# Booking & Reservation Platform (Owner + User)

## Overview
This platform supports booking and reservation for multiple facility categories (e.g., gyms, restaurants, cafeterias) with a **sporty-club inspired** experience. It focuses on two primary roles:

- **Facility Owners**: Configure availability, capacity (available spots), and booking duration rules.
- **End Users**: Book/reserve available slots and receive in-app confirmation once the reservation is validated/accepted.

## Goals
- Provide a unified booking experience across multiple facility categories.
- Allow owners to define capacity and booking duration windows.
- Notify users when reservations are accepted and show them in a “Reserved” list.

## Personas
1. **Facility Owner**
   - Manages availability and capacity.
   - Reviews/validates reservations.
2. **End User**
   - Browses facilities.
   - Reserves available slots and receives confirmations.

## Core Requirements

### Facility Categories
Facilities are grouped into categories, initially:
- Gyms
- Restaurants
- Cafeterias

### Owner Capabilities
- Create and manage facilities under their ownership.
- Configure:
  - **Available spots** (capacity) for each time slot.
  - **Booking duration** (e.g., 30/60/90 minutes).
  - **Operating hours** per day.
- Validate/accept reservations.

### User Capabilities
- Browse facilities by category.
- View available time slots with capacity.
- Create reservations.
- Receive **in-app notification** when a reservation is accepted.
- See accepted reservations in a **“Reserved”** list.

## Reservation Lifecycle
1. **Requested**: User selects facility and time slot.
2. **Pending Validation**: Owner reviews reservation.
3. **Accepted**: User receives in-app notification; reservation appears in “Reserved”.
4. **Rejected**: User notified with reason (optional, future enhancement).

## Data Model (High-Level)

### Facility
- id
- owner_id
- category (gym | restaurant | cafeteria)
- name
- description
- operating_hours

### Slot
- id
- facility_id
- start_time
- end_time
- capacity
- available_spots

### Reservation
- id
- facility_id
- user_id
- slot_id
- status (requested | pending_validation | accepted | rejected)
- created_at

### Notification
- id
- user_id
- reservation_id
- type (reservation_accepted)
- message
- created_at
- read_at

## User Flows

### Owner Flow
1. Create facility and set operating hours.
2. Define slot durations and capacities.
3. Review reservations and accept/reject.

### User Flow
1. Browse category and choose facility.
2. Pick available time slot.
3. Submit reservation.
4. Receive acceptance notification.
5. View accepted reservation in “Reserved”.

## Non-Functional Requirements
- Ensure consistent capacity handling under concurrent bookings.
- Provide real-time or near-real-time notification delivery.
- Audit trail of reservation status changes.

## Future Enhancements
- Payments and deposits.
- Dynamic pricing.
- Cancellation rules and penalties.
- Waitlist for fully booked slots.
