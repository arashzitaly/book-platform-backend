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
asdfghjk
