# 📅 Book Platform Backend

A microservice-based booking platform backend built with **C# and ASP.NET Core**, designed to support multiple types of facilities including **restaurants, gyms, clinics, and agencies**. This backend powers reservations, memberships, and resource management for both customers and owners.

---

## 🚀 Features

- 🔒 **JWT Authentication** with role-based access (`Owner`, `Customer`)
- 🏢 **Facility Management** (create, update, categorize facilities)
- 📍 **Resource Scheduling** (tables, classes, rooms, etc.)
- 📆 **Slot and Booking System**
- 📧 **Email/SMS Notification Support** (for reminders and renewals)
- 📊 **Audit Fields** (`created_at`, `updated_at`)
- 🧾 **Customizable Settings** with JSONB
- 🧪 Built-in validation and business logic enforcement via database triggers

---

## 🧱 Architecture

This project follows a **microservices architecture**:

- **Auth Service** – Manages users and authentication
- **Facility Service** – Handles facility and category logic
- **Resource Service** – Manages physical resources (e.g., tables, classes)
- **Slot Service** – Manages available times for bookings
- **Booking Service** – Handles reservations
- **Notification Service** – (Planned) for sending notifications

All services are independently scalable, containerized, and follow clean API principles.

---

## 🗃️ Tech Stack

- **Backend**: C# with ASP.NET Core Web API
- **Database**: PostgreSQL (hosted via Supabase)
- **ORM**: Entity Framework Core
- **Auth**: JWT (JSON Web Tokens)
- **Containerization**: Docker-ready
- **CI/CD**: GitHub Actions (planned)
- **Observability**: Logging, metrics, and tracing support (planned)

---

## 📦 Setup Instructions

1. **Clone the repo**
   ```bash
   git clone https://github.com/arashzitaly/book-platform-backend.git
   cd book-platform-backend
   ```

2. **Build and run**
   ```bash
   dotnet build
   dotnet run --project BookPlatform.Api
   ```

## 👤 User Roles & Business Logic

Planner supports **Owners** and **Customers**. Owners manage facilities, resources, slots, and can create guest bookings. Customers browse available resources and book their own time slots.

### Facility Types

- **Restaurant** – Reserve specific tables
- **Clinic** – Book appointments with doctors (optional visit reason)
- **Gym** – Reserve class spots (active membership required)
- **Agency** – Schedule consultations or services

### Booking Features

- Registered customers can make, view, and cancel their bookings
- Owners and staff can create guest bookings for walk-ins or phone requests
- Bookings cannot be transferred between accounts

### Gym Membership Requirement

For gym facilities, users must have an **active membership** covering the booking date in order to reserve a slot. Owners may still register guest bookings for non-members.

### Owner Dashboard

Owners can view bookings by resource, filter by date or customer, and optionally view utilization statistics.
