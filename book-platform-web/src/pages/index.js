// Page Components

import { store } from '../utils/store.js';
import { api } from '../api/client.js';

// Icons
const icons = {
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
  bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  gym: '🏋️',
  restaurant: '🍽️',
  cafeteria: '☕',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
};

const categoryEmoji = {
  0: '🏋️',
  1: '🍽️',
  2: '☕'
};

const categoryName = {
  0: 'Gym',
  1: 'Restaurant',
  2: 'Cafeteria'
};

const statusLabel = {
  0: 'Requested',
  1: 'Pending',
  2: 'Accepted',
  3: 'Rejected',
  4: 'Cancelled',
  5: 'Completed'
};

const statusBadge = {
  0: 'badge-warning',
  1: 'badge-warning',
  2: 'badge-success',
  3: 'badge-error',
  4: 'badge-error',
  5: 'badge-primary'
};

// Header Component
export function Header() {
  const state = store.getState();
  const isAuth = state.isAuthenticated;
  const user = state.user;
  const isOwner = user?.role === 1;

  return `
    <header class="header">
      <div class="header-content">
        <a href="#/" class="logo">
          <div class="logo-icon">📅</div>
          <span>BookPlatform</span>
        </a>
        <nav class="nav">
          <a href="#/" class="nav-link">Browse</a>
          ${isAuth ? `
            <a href="#/bookings" class="nav-link">My Reservations</a>
            ${isOwner ? '<a href="#/dashboard" class="nav-link">Dashboard</a>' : ''}
            <a href="#/notifications" class="nav-link">Notifications</a>
            <button class="btn btn-ghost" onclick="window.app.logout()">Logout</button>
          ` : `
            <a href="#/login" class="btn btn-primary">Login</a>
          `}
        </nav>
      </div>
    </header>
  `;
}

// Bottom Navigation (Mobile)
export function BottomNav() {
  const state = store.getState();
  const isAuth = state.isAuthenticated;
  const unreadCount = state.unreadCount || 0;

  if (!isAuth) return '';

  return `
    <nav class="bottom-nav">
      <button class="bottom-nav-item" onclick="window.location.hash='#/'">${icons.home}<span>Home</span></button>
      <button class="bottom-nav-item" onclick="window.location.hash='#/bookings'">${icons.calendar}<span>Bookings</span></button>
      <button class="bottom-nav-item" onclick="window.location.hash='#/notifications'">
        ${icons.bell}
        <span>Alerts${unreadCount > 0 ? ` (${unreadCount})` : ''}</span>
      </button>
      <button class="bottom-nav-item" onclick="window.location.hash='#/profile'">${icons.user}<span>Profile</span></button>
    </nav>
  `;
}

// Home Page
export async function HomePage() {
  let facilities = [];
  try {
    facilities = await api.getFacilities({ limit: 20 });
  } catch (e) {
    console.error('Failed to load facilities', e);
  }

  return `
    <div class="page">
      <section class="hero">
        <h1 class="hero-title">Book Your Perfect Spot</h1>
        <p class="hero-subtitle">Reserve at gyms, restaurants, and cafeterias. Simple booking, instant confirmation.</p>
        <div class="flex justify-center gap-4">
          <button class="btn btn-primary btn-lg" onclick="document.getElementById('facilities-section').scrollIntoView({behavior:'smooth'})">
            Browse Facilities
          </button>
        </div>
      </section>
      
      <section id="facilities-section" class="mt-8">
        <div class="page-header">
          <h2 class="page-title">Featured Facilities</h2>
          <p class="page-subtitle">Discover and book your next experience</p>
        </div>
        
        <div class="flex gap-4 mb-6">
          <button class="btn btn-secondary" onclick="window.app.filterCategory(null)">All</button>
          <button class="btn btn-ghost" onclick="window.app.filterCategory(0)">🏋️ Gyms</button>
          <button class="btn btn-ghost" onclick="window.app.filterCategory(1)">🍽️ Restaurants</button>
          <button class="btn btn-ghost" onclick="window.app.filterCategory(2)">☕ Cafeterias</button>
        </div>
        
        <div class="grid grid-auto" id="facilities-grid">
          ${facilities.length > 0 ? facilities.map(f => FacilityCard(f)).join('') : `
            <div class="card" style="grid-column: 1 / -1; padding: 3rem; text-align: center;">
              <p class="text-secondary">No facilities available yet. Check back soon!</p>
            </div>
          `}
        </div>
      </section>
    </div>
  `;
}

// Facility Card Component
export function FacilityCard(facility) {
  return `
    <a href="#/facility/${facility.id}" class="card">
      <div class="card-image" style="background: linear-gradient(135deg, var(--primary-600), var(--accent-500)); display: flex; align-items: center; justify-content: center; font-size: 3rem;">
        ${categoryEmoji[facility.category] || '📍'}
      </div>
      <div class="card-body">
        <span class="badge badge-${categoryName[facility.category]?.toLowerCase()}">${categoryName[facility.category]}</span>
        <h3 class="card-title mt-4">${facility.name}</h3>
        <p class="card-subtitle">${facility.description?.slice(0, 80) || 'No description'}${facility.description?.length > 80 ? '...' : ''}</p>
        <div class="card-meta">
          <span>📍 ${facility.address || 'Location TBD'}</span>
        </div>
      </div>
    </a>
  `;
}

// Facility Detail Page
export async function FacilityPage(params) {
  const id = params[0];
  let facility = null;
  let slots = [];

  try {
    facility = await api.getFacility(id);
    slots = await api.getAvailableSlots(id, 30);
  } catch (e) {
    console.error('Failed to load facility', e);
    return '<div class="page"><h1>Facility not found</h1></div>';
  }

  return `
    <div class="page">
      <div class="card" style="margin-bottom: var(--space-8);">
        <div class="card-image" style="height: 250px; background: linear-gradient(135deg, var(--primary-600), var(--accent-500)); display: flex; align-items: center; justify-content: center; font-size: 5rem;">
          ${categoryEmoji[facility.category] || '📍'}
        </div>
        <div class="card-body">
          <span class="badge badge-${categoryName[facility.category]?.toLowerCase()}">${categoryName[facility.category]}</span>
          <h1 class="page-title mt-4">${facility.name}</h1>
          <p class="text-secondary">${facility.description || 'Welcome to our facility!'}</p>
          <div class="flex gap-6 mt-4 text-secondary">
            <span>📍 ${facility.address || 'Location TBD'}</span>
            ${facility.phone ? `<span>📞 ${facility.phone}</span>` : ''}
          </div>
        </div>
      </div>
      
      <section>
        <h2 class="page-title">Available Slots</h2>
        <p class="page-subtitle mb-6">Select a time slot to book</p>
        
        ${slots.length > 0 ? `
          <div class="slots-grid" id="slots-grid">
            ${slots.map(slot => SlotCard(slot, id)).join('')}
          </div>
        ` : `
          <div class="card" style="padding: 2rem; text-align: center;">
            <p class="text-secondary">No available slots at the moment.</p>
          </div>
        `}
      </section>
    </div>
  `;
}

// Slot Card Component
function SlotCard(slot, facilityId) {
  const startTime = new Date(slot.startTime);
  const timeStr = startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateStr = startTime.toLocaleDateString([], { month: 'short', day: 'numeric' });
  const available = slot.availableSpots > 0;

  return `
    <div class="slot-card ${available ? '' : 'disabled'}" 
         data-slot-id="${slot.id}" 
         data-facility-id="${facilityId}"
         onclick="${available ? `window.app.selectSlot('${slot.id}', '${facilityId}')` : ''}">
      <div class="slot-time">${timeStr}</div>
      <div class="text-secondary text-sm">${dateStr}</div>
      <div class="slot-spots ${available ? 'text-success' : 'text-error'}">
        ${available ? `${slot.availableSpots} spots left` : 'Full'}
      </div>
      ${slot.price ? `<div class="text-primary font-semibold">$${slot.price}</div>` : ''}
    </div>
  `;
}

// Login Page
export function LoginPage() {
  return `
    <div class="page" style="max-width: 400px; margin: 0 auto;">
      <div class="card">
        <div class="card-body">
          <h1 class="page-title text-center">Welcome Back</h1>
          <p class="text-secondary text-center mb-6">Sign in to your account</p>
          
          <form id="login-form" onsubmit="window.app.handleLogin(event)">
            <div class="form-group">
              <label class="form-label">Email</label>
              <input type="email" name="email" class="form-input" placeholder="you@example.com" required>
            </div>
            <div class="form-group">
              <label class="form-label">Password</label>
              <input type="password" name="password" class="form-input" placeholder="••••••••" required>
            </div>
            <div id="login-error" class="form-error hidden"></div>
            <button type="submit" class="btn btn-primary btn-lg" style="width: 100%; margin-top: var(--space-4);">
              Sign In
            </button>
          </form>
          
          <p class="text-center text-secondary mt-6">
            Don't have an account? <a href="#/register">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  `;
}

// Register Page
export function RegisterPage() {
  return `
    <div class="page" style="max-width: 400px; margin: 0 auto;">
      <div class="card">
        <div class="card-body">
          <h1 class="page-title text-center">Create Account</h1>
          <p class="text-secondary text-center mb-6">Join Book Platform today</p>
          
          <form id="register-form" onsubmit="window.app.handleRegister(event)">
            <div class="form-group">
              <label class="form-label">Username</label>
              <input type="text" name="username" class="form-input" placeholder="johndoe" required>
            </div>
            <div class="form-group">
              <label class="form-label">Email</label>
              <input type="email" name="email" class="form-input" placeholder="you@example.com" required>
            </div>
            <div class="form-group">
              <label class="form-label">Password</label>
              <input type="password" name="password" class="form-input" placeholder="••••••••" minlength="6" required>
            </div>
            <div class="form-group">
              <label class="form-label">I am a</label>
              <select name="role" class="form-input">
                <option value="0">Customer</option>
                <option value="1">Facility Owner</option>
              </select>
            </div>
            <div id="register-error" class="form-error hidden"></div>
            <button type="submit" class="btn btn-primary btn-lg" style="width: 100%; margin-top: var(--space-4);">
              Create Account
            </button>
          </form>
          
          <p class="text-center text-secondary mt-6">
            Already have an account? <a href="#/login">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  `;
}

// My Bookings Page
export async function BookingsPage() {
  const state = store.getState();
  if (!state.isAuthenticated) {
    window.location.hash = '#/login';
    return '';
  }

  let bookings = [];
  try {
    bookings = await api.getMyBookings();
    store.setMyBookings(bookings);
  } catch (e) {
    console.error('Failed to load bookings', e);
  }

  const upcoming = bookings.filter(b => [0, 1, 2].includes(b.status) && new Date(b.slotStartTime) > new Date());
  const past = bookings.filter(b => ![0, 1, 2].includes(b.status) || new Date(b.slotStartTime) <= new Date());

  return `
    <div class="page">
      <div class="page-header">
        <h1 class="page-title">My Reservations</h1>
        <p class="page-subtitle">Manage your bookings</p>
      </div>
      
      <h2 class="font-semibold mb-4">Upcoming</h2>
      <div class="grid gap-4 mb-8">
        ${upcoming.length > 0 ? upcoming.map(b => BookingCard(b)).join('') : `
          <div class="card" style="padding: 2rem; text-align: center;">
            <p class="text-secondary">No upcoming reservations</p>
            <a href="#/" class="btn btn-primary mt-4">Browse Facilities</a>
          </div>
        `}
      </div>
      
      <h2 class="font-semibold mb-4">Past</h2>
      <div class="grid gap-4">
        ${past.length > 0 ? past.map(b => BookingCard(b)).join('') : `
          <div class="card" style="padding: 1rem; text-align: center;">
            <p class="text-muted">No past reservations</p>
          </div>
        `}
      </div>
    </div>
  `;
}

// Booking Card
function BookingCard(booking) {
  const slotTime = new Date(booking.slotStartTime);
  const endTime = new Date(booking.slotEndTime);

  return `
    <div class="card" style="cursor: default;">
      <div class="card-body">
        <div class="flex justify-between items-center">
          <div>
            <h3 class="card-title">${booking.facilityName}</h3>
            <p class="text-secondary">
              ${slotTime.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })} 
              at ${slotTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
            <p class="text-muted text-sm">Party of ${booking.partySize}</p>
          </div>
          <span class="badge ${statusBadge[booking.status]}">${statusLabel[booking.status]}</span>
        </div>
      </div>
    </div>
  `;
}

// Notifications Page
export async function NotificationsPage() {
  const state = store.getState();
  if (!state.isAuthenticated) {
    window.location.hash = '#/login';
    return '';
  }

  let notifications = [];
  try {
    notifications = await api.getNotifications(50);
    store.setNotifications(notifications);
  } catch (e) {
    console.error('Failed to load notifications', e);
  }

  return `
    <div class="page">
      <div class="page-header flex justify-between items-center">
        <div>
          <h1 class="page-title">Notifications</h1>
          <p class="page-subtitle">Stay updated on your reservations</p>
        </div>
        ${notifications.some(n => !n.isRead) ? `
          <button class="btn btn-secondary" onclick="window.app.markAllRead()">Mark all read</button>
        ` : ''}
      </div>
      
      <div class="grid gap-4">
        ${notifications.length > 0 ? notifications.map(n => NotificationCard(n)).join('') : `
          <div class="card" style="padding: 2rem; text-align: center;">
            <p class="text-secondary">No notifications yet</p>
          </div>
        `}
      </div>
    </div>
  `;
}

// Notification Card
function NotificationCard(notification) {
  const time = new Date(notification.createdAt);
  const typeIcons = {
    0: '✅',
    1: '❌',
    2: '⏰',
    3: '📬'
  };

  return `
    <div class="card ${notification.isRead ? 'opacity-60' : ''}" 
         style="cursor: pointer;" 
         onclick="window.app.markNotificationRead('${notification.id}')">
      <div class="card-body">
        <div class="flex gap-4">
          <div style="font-size: 1.5rem;">${typeIcons[notification.type] || '📢'}</div>
          <div class="flex-1">
            <h3 class="font-semibold">${notification.title}</h3>
            <p class="text-secondary">${notification.message}</p>
            <p class="text-muted text-sm mt-2">${time.toLocaleString()}</p>
          </div>
          ${!notification.isRead ? '<div class="badge badge-primary">New</div>' : ''}
        </div>
      </div>
    </div>
  `;
}

// Owner Dashboard Page
export async function DashboardPage() {
  const state = store.getState();
  if (!state.isAuthenticated || state.user?.role !== 1) {
    window.location.hash = '#/';
    return '';
  }

  let facilities = [];
  try {
    facilities = await api.getMyFacilities();
  } catch (e) {
    console.error('Failed to load facilities', e);
  }

  return `
    <div class="page">
      <div class="page-header flex justify-between items-center">
        <div>
          <h1 class="page-title">Owner Dashboard</h1>
          <p class="page-subtitle">Manage your facilities</p>
        </div>
        <button class="btn btn-primary" onclick="window.app.showCreateFacility()">+ Add Facility</button>
      </div>
      
      <div class="grid grid-auto">
        ${facilities.length > 0 ? facilities.map(f => DashboardFacilityCard(f)).join('') : `
          <div class="card" style="grid-column: 1 / -1; padding: 3rem; text-align: center;">
            <p class="text-secondary mb-4">You haven't created any facilities yet</p>
            <button class="btn btn-primary" onclick="window.app.showCreateFacility()">Create Your First Facility</button>
          </div>
        `}
      </div>
    </div>
  `;
}

function DashboardFacilityCard(facility) {
  return `
    <div class="card">
      <div class="card-body">
        <span class="badge badge-${categoryName[facility.category]?.toLowerCase()}">${categoryName[facility.category]}</span>
        <h3 class="card-title mt-4">${facility.name}</h3>
        <p class="card-subtitle">${facility.address || 'No address'}</p>
        <div class="flex gap-2 mt-4">
          <a href="#/dashboard/facility/${facility.id}" class="btn btn-secondary btn-sm">Manage</a>
          <a href="#/dashboard/facility/${facility.id}/bookings" class="btn btn-ghost btn-sm">Bookings</a>
        </div>
      </div>
    </div>
  `;
}

// Profile Page
export function ProfilePage() {
  const state = store.getState();
  const user = state.user;

  if (!state.isAuthenticated) {
    window.location.hash = '#/login';
    return '';
  }

  return `
    <div class="page" style="max-width: 500px; margin: 0 auto;">
      <div class="card">
        <div class="card-body text-center">
          <div style="width: 80px; height: 80px; background: var(--gradient-primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto var(--space-4); font-size: 2rem;">
            ${user?.username?.[0]?.toUpperCase() || '?'}
          </div>
          <h1 class="page-title">${user?.username || 'User'}</h1>
          <p class="text-secondary">${user?.email || ''}</p>
          <span class="badge ${user?.role === 1 ? 'badge-primary' : 'badge-success'} mt-2">
            ${user?.role === 1 ? 'Facility Owner' : 'Customer'}
          </span>
          
          <div class="mt-8">
            <button class="btn btn-secondary" style="width: 100%;" onclick="window.app.logout()">
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Booking Modal
export function BookingModal(slotId, facilityId) {
  return `
    <div class="modal-overlay" onclick="window.app.closeModal()">
      <div class="modal" onclick="event.stopPropagation()">
        <div class="modal-header">
          <h2 class="modal-title">Confirm Booking</h2>
        </div>
        <form id="booking-form" onsubmit="window.app.handleBooking(event, '${slotId}', '${facilityId}')">
          <div class="modal-body">
            <div class="form-group">
              <label class="form-label">Party Size</label>
              <input type="number" name="partySize" class="form-input" value="1" min="1" max="10" required>
            </div>
            <div class="form-group">
              <label class="form-label">Notes (optional)</label>
              <textarea name="notes" class="form-input" rows="3" placeholder="Any special requests..."></textarea>
            </div>
            <div id="booking-error" class="form-error hidden"></div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-ghost" onclick="window.app.closeModal()">Cancel</button>
            <button type="submit" class="btn btn-primary">Confirm Booking</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

// Create Facility Modal
export function CreateFacilityModal() {
  return `
    <div class="modal-overlay" onclick="window.app.closeModal()">
      <div class="modal" style="max-width: 500px;" onclick="event.stopPropagation()">
        <div class="modal-header">
          <h2 class="modal-title">Create New Facility</h2>
          <p class="text-secondary">Set up your business on Book Platform</p>
        </div>
        <form id="create-facility-form" onsubmit="window.app.handleCreateFacility(event)">
          <div class="modal-body" style="max-height: 60vh; overflow-y: auto;">
            <div class="form-group">
              <label class="form-label">Facility Name *</label>
              <input type="text" name="name" class="form-input" placeholder="e.g. Downtown Fitness" required>
            </div>
            
            <div class="form-group">
              <label class="form-label">Category *</label>
              <select name="category" class="form-input" required>
                <option value="0">🏋️ Gym / Fitness</option>
                <option value="1">🍽️ Restaurant</option>
                <option value="2">☕ Cafeteria / Café</option>
              </select>
            </div>
            
            <div class="form-group">
              <label class="form-label">Description</label>
              <textarea name="description" class="form-input" rows="3" placeholder="Tell customers about your facility..."></textarea>
            </div>
            
            <div class="form-group">
              <label class="form-label">Address *</label>
              <input type="text" name="address" class="form-input" placeholder="123 Main Street, City" required>
            </div>
            
            <div class="form-group">
              <label class="form-label">Phone Number</label>
              <input type="tel" name="phone" class="form-input" placeholder="(555) 123-4567">
            </div>
            
            <div class="form-group">
              <label class="form-label">Image URL (optional)</label>
              <input type="url" name="imageUrl" class="form-input" placeholder="https://...">
            </div>
            
            <div id="create-facility-error" class="form-error hidden"></div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-ghost" onclick="window.app.closeModal()">Cancel</button>
            <button type="submit" class="btn btn-primary">Create Facility</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

// Facility Management Page
export async function FacilityManagePage(params) {
  const id = params[0];
  const state = store.getState();
  if (!state.isAuthenticated || state.user?.role !== 1) {
    window.location.hash = '#/';
    return '';
  }

  let facility = null;
  try {
    facility = await api.getFacility(id);
  } catch (e) {
    console.error('Failed to load facility', e);
    return '<div class="page"><h1>Facility not found</h1></div>';
  }

  return `
    <div class="page">
      <div class="page-header">
        <a href="#/dashboard" class="btn btn-ghost">&larr; Back to Dashboard</a>
        <h1 class="page-title mt-4">${facility.name}</h1>
        <p class="page-subtitle">Manage your facility settings and slots</p>
      </div>
      
      <div class="grid gap-6" style="grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));">
        <!-- Facility Info Card -->
        <div class="card">
          <div class="card-body">
            <h3 class="font-semibold mb-4">Facility Information</h3>
            <div class="grid gap-2">
              <p><strong>Category:</strong> ${categoryEmoji[facility.category]} ${categoryName[facility.category]}</p>
              <p><strong>Address:</strong> ${facility.address || 'Not set'}</p>
              <p><strong>Phone:</strong> ${facility.phone || 'Not set'}</p>
              <p><strong>Status:</strong> <span class="badge ${facility.isActive ? 'badge-success' : 'badge-error'}">${facility.isActive ? 'Active' : 'Inactive'}</span></p>
            </div>
          </div>
        </div>
        
        <!-- Add Slots Card -->
        <div class="card">
          <div class="card-body">
            <h3 class="font-semibold mb-4">Quick Add Slots</h3>
            <form id="add-slot-form" onsubmit="window.app.handleAddSlot(event, '${facility.id}')">
              <div class="form-group">
                <label class="form-label">Date</label>
                <input type="date" name="date" class="form-input" required min="${new Date().toISOString().split('T')[0]}">
              </div>
              <div class="grid gap-4" style="grid-template-columns: 1fr 1fr;">
                <div class="form-group">
                  <label class="form-label">Start Time</label>
                  <input type="time" name="startTime" class="form-input" required value="09:00">
                </div>
                <div class="form-group">
                  <label class="form-label">End Time</label>
                  <input type="time" name="endTime" class="form-input" required value="10:00">
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Capacity (spots available)</label>
                <input type="number" name="capacity" class="form-input" value="10" min="1" required>
              </div>
              <div class="form-group">
                <label class="form-label">Price ($) - optional</label>
                <input type="number" name="price" class="form-input" value="0" min="0" step="0.01">
              </div>
              <button type="submit" class="btn btn-primary" style="width: 100%;">Add Slot</button>
            </form>
          </div>
        </div>
      </div>
      
      <!-- Bulk Slots -->
      <div class="card mt-6">
        <div class="card-body">
          <h3 class="font-semibold mb-4">Generate Bulk Slots</h3>
          <p class="text-secondary mb-4">Automatically create multiple time slots for a date range</p>
          <form id="bulk-slots-form" onsubmit="window.app.handleBulkSlots(event, '${facility.id}')">
            <div class="grid gap-4" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));">
              <div class="form-group">
                <label class="form-label">Start Date</label>
                <input type="date" name="startDate" class="form-input" required min="${new Date().toISOString().split('T')[0]}">
              </div>
              <div class="form-group">
                <label class="form-label">End Date</label>
                <input type="date" name="endDate" class="form-input" required min="${new Date().toISOString().split('T')[0]}">
              </div>
              <div class="form-group">
                <label class="form-label">Opening Time</label>
                <input type="time" name="openTime" class="form-input" required value="09:00">
              </div>
              <div class="form-group">
                <label class="form-label">Closing Time</label>
                <input type="time" name="closeTime" class="form-input" required value="18:00">
              </div>
              <div class="form-group">
                <label class="form-label">Slot Duration (minutes)</label>
                <input type="number" name="duration" class="form-input" value="60" min="15" step="15" required>
              </div>
              <div class="form-group">
                <label class="form-label">Capacity per slot</label>
                <input type="number" name="capacity" class="form-input" value="10" min="1" required>
              </div>
            </div>
            <button type="submit" class="btn btn-primary mt-4">Generate Slots</button>
          </form>
        </div>
      </div>
    </div>
  `;
}

// Facility Bookings Management Page
export async function FacilityBookingsPage(params) {
  const facilityId = params[0];
  const state = store.getState();
  if (!state.isAuthenticated || state.user?.role !== 1) {
    window.location.hash = '#/';
    return '';
  }

  let bookings = [];
  let facility = null;
  try {
    facility = await api.getFacility(facilityId);
    bookings = await api.getFacilityBookings(facilityId);
  } catch (e) {
    console.error('Failed to load bookings', e);
  }

  const pending = bookings.filter(b => b.status === 0);
  const confirmed = bookings.filter(b => b.status === 2);
  const other = bookings.filter(b => ![0, 2].includes(b.status));

  return `
    <div class="page">
      <div class="page-header">
        <a href="#/dashboard" class="btn btn-ghost">&larr; Back to Dashboard</a>
        <h1 class="page-title mt-4">${facility?.name || 'Facility'} - Bookings</h1>
        <p class="page-subtitle">Manage customer reservations</p>
      </div>
      
      <h2 class="font-semibold mb-4">⏳ Pending Approval (${pending.length})</h2>
      <div class="grid gap-4 mb-8">
        ${pending.length > 0 ? pending.map(b => OwnerBookingCard(b)).join('') : `
          <div class="card" style="padding: 1rem; text-align: center;">
            <p class="text-secondary">No pending bookings</p>
          </div>
        `}
      </div>
      
      <h2 class="font-semibold mb-4">✅ Confirmed (${confirmed.length})</h2>
      <div class="grid gap-4 mb-8">
        ${confirmed.length > 0 ? confirmed.map(b => OwnerBookingCard(b, false)).join('') : `
          <div class="card" style="padding: 1rem; text-align: center;">
            <p class="text-secondary">No confirmed bookings</p>
          </div>
        `}
      </div>
      
      ${other.length > 0 ? `
        <h2 class="font-semibold mb-4">Other (${other.length})</h2>
        <div class="grid gap-4">
          ${other.map(b => OwnerBookingCard(b, false)).join('')}
        </div>
      ` : ''}
    </div>
  `;
}

function OwnerBookingCard(booking, showActions = true) {
  const slotTime = new Date(booking.slotStartTime);

  return `
    <div class="card">
      <div class="card-body">
        <div class="flex justify-between items-start">
          <div>
            <h3 class="font-semibold">${booking.userName || 'Customer'}</h3>
            <p class="text-secondary">
              ${slotTime.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })} 
              at ${slotTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
            <p class="text-muted text-sm">Party of ${booking.partySize}</p>
            ${booking.notes ? `<p class="text-muted text-sm mt-2">Note: ${booking.notes}</p>` : ''}
          </div>
          <div class="text-right">
            <span class="badge ${statusBadge[booking.status]}">${statusLabel[booking.status]}</span>
            ${showActions && booking.status === 0 ? `
              <div class="flex gap-2 mt-4">
                <button class="btn btn-primary btn-sm" onclick="window.app.updateBooking('${booking.id}', 2)">Accept</button>
                <button class="btn btn-ghost btn-sm" onclick="window.app.updateBooking('${booking.id}', 3)">Reject</button>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    </div>
  `;
}

