// Book Platform - Main Application Entry Point

import { router } from './utils/router.js';
import { store } from './utils/store.js';
import { api } from './api/client.js';
import * as Pages from './pages/index.js';

class BookPlatformApp {
    constructor() {
        this.init();
    }

    async init() {
        // Register service worker for PWA
        if ('serviceWorker' in navigator) {
            try {
                await navigator.serviceWorker.register('/sw.js');
                console.log('Service Worker registered');
            } catch (e) {
                console.log('Service Worker registration failed:', e);
            }
        }

        // Setup router
        this.setupRoutes();

        // Listen for auth events
        window.addEventListener('auth:logout', () => {
            store.logout();
            this.render();
            router.navigate('/');
        });

        // Listen for route changes
        window.addEventListener('route:loaded', () => {
            this.updateBottomNav();
        });

        // Initial render
        this.render();

        // Hide loading screen
        setTimeout(() => {
            document.getElementById('loading-screen')?.classList.add('hidden');
        }, 500);

        // Load initial data if authenticated
        if (store.getState().isAuthenticated) {
            this.loadUserData();
        }
    }

    setupRoutes() {
        router.register('/', () => Pages.HomePage());
        router.register('/login', () => Pages.LoginPage());
        router.register('/register', () => Pages.RegisterPage());
        router.register('/facility/:id', (params) => Pages.FacilityPage(params));
        router.register('/bookings', () => Pages.BookingsPage());
        router.register('/notifications', () => Pages.NotificationsPage());
        router.register('/profile', () => Pages.ProfilePage());
        router.register('/dashboard', () => Pages.DashboardPage());
        router.register('/dashboard/facility/:id', (params) => Pages.FacilityManagePage(params));
        router.register('/dashboard/facility/:id/bookings', (params) => Pages.FacilityBookingsPage(params));
    }

    render() {
        const app = document.getElementById('app');
        const state = store.getState();

        app.innerHTML = `
      ${Pages.Header()}
      <main class="app-container" id="main-content"></main>
      ${state.isAuthenticated ? Pages.BottomNav() : ''}
      <div id="modal-container"></div>
      <div id="toast-container" class="toast-container"></div>
    `;

        // Set body class for bottom nav padding
        document.body.classList.toggle('has-bottom-nav', state.isAuthenticated);

        // Set router container
        router.setContainer(document.getElementById('main-content'));
        router.handleRoute();
    }

    updateBottomNav() {
        // Update active state based on current route
        const path = router.getCurrentPath();
        document.querySelectorAll('.bottom-nav-item').forEach(btn => {
            btn.classList.remove('active');
        });
    }

    async loadUserData() {
        try {
            const count = await api.getUnreadCount();
            store.setUnreadCount(count?.count || 0);
        } catch (e) {
            console.error('Failed to load user data', e);
        }
    }

    // Auth handlers
    async handleLogin(event) {
        event.preventDefault();
        const form = event.target;
        const email = form.email.value;
        const password = form.password.value;
        const errorEl = document.getElementById('login-error');

        try {
            const response = await api.login({ email, password });
            store.setUser(response.user);
            this.showToast('Welcome back!', 'success');
            this.render();
            router.navigate('/');
        } catch (e) {
            errorEl.textContent = e.message || 'Login failed';
            errorEl.classList.remove('hidden');
        }
    }

    async handleRegister(event) {
        event.preventDefault();
        const form = event.target;
        const data = {
            username: form.username.value,
            email: form.email.value,
            password: form.password.value,
            role: parseInt(form.role.value)
        };
        const errorEl = document.getElementById('register-error');

        try {
            const response = await api.register(data);
            store.setUser(response.user);
            this.showToast('Account created successfully!', 'success');
            this.render();
            router.navigate('/');
        } catch (e) {
            errorEl.textContent = e.message || 'Registration failed';
            errorEl.classList.remove('hidden');
        }
    }

    logout() {
        api.logout();
        store.logout();
        this.showToast('Logged out successfully', 'success');
        this.render();
        router.navigate('/');
    }

    // Slot selection and booking
    selectSlot(slotId, facilityId) {
        const state = store.getState();
        if (!state.isAuthenticated) {
            router.navigate('/login');
            return;
        }

        // Show booking modal
        document.getElementById('modal-container').innerHTML = Pages.BookingModal(slotId, facilityId);
    }

    closeModal() {
        document.getElementById('modal-container').innerHTML = '';
    }

    async handleBooking(event, slotId, facilityId) {
        event.preventDefault();
        const form = event.target;
        const data = {
            facilityId,
            slotId,
            partySize: parseInt(form.partySize.value),
            notes: form.notes.value || null
        };
        const errorEl = document.getElementById('booking-error');

        try {
            await api.createBooking(data);
            this.closeModal();
            this.showToast('Booking confirmed!', 'success');
            router.navigate('/bookings');
        } catch (e) {
            errorEl.textContent = e.message || 'Booking failed';
            errorEl.classList.remove('hidden');
        }
    }

    // Notifications
    async markNotificationRead(id) {
        try {
            await api.markNotificationRead(id);
            const count = await api.getUnreadCount();
            store.setUnreadCount(count?.count || 0);
            // Refresh notifications page
            if (router.getCurrentPath() === '/notifications') {
                router.handleRoute();
            }
        } catch (e) {
            console.error('Failed to mark notification read', e);
        }
    }

    async markAllRead() {
        try {
            await api.markAllNotificationsRead();
            store.setUnreadCount(0);
            router.handleRoute();
            this.showToast('All notifications marked as read', 'success');
        } catch (e) {
            console.error('Failed to mark all read', e);
        }
    }

    // Facility filtering
    async filterCategory(category) {
        try {
            const params = category !== null ? { category } : {};
            const facilities = await api.getFacilities(params);
            store.setFacilities(facilities);

            const grid = document.getElementById('facilities-grid');
            if (grid) {
                grid.innerHTML = facilities.length > 0
                    ? facilities.map(f => Pages.FacilityCard(f)).join('')
                    : '<div class="card" style="grid-column: 1 / -1; padding: 2rem; text-align: center;"><p class="text-secondary">No facilities found</p></div>';
            }
        } catch (e) {
            console.error('Failed to filter', e);
        }
    }

    // Owner actions
    showCreateFacility() {
        document.getElementById('modal-container').innerHTML = Pages.CreateFacilityModal();
    }

    async handleCreateFacility(event) {
        event.preventDefault();
        const form = event.target;
        const data = {
            name: form.name.value,
            category: parseInt(form.category.value),
            description: form.description.value || '',
            address: form.address.value,
            phone: form.phone.value || '',
            imageUrl: form.imageUrl.value || ''
        };
        const errorEl = document.getElementById('create-facility-error');

        try {
            await api.createFacility(data);
            this.closeModal();
            this.showToast('Facility created successfully!', 'success');
            router.navigate('/dashboard');
        } catch (e) {
            errorEl.textContent = e.message || 'Failed to create facility';
            errorEl.classList.remove('hidden');
        }
    }

    async handleAddSlot(event, facilityId) {
        event.preventDefault();
        const form = event.target;
        const date = form.date.value;
        const startTime = form.startTime.value;
        const endTime = form.endTime.value;

        const data = {
            facilityId,
            startTime: `${date}T${startTime}:00`,
            endTime: `${date}T${endTime}:00`,
            capacity: parseInt(form.capacity.value),
            price: parseFloat(form.price.value) || 0
        };

        try {
            await api.createSlot(data);
            this.showToast('Slot added successfully!', 'success');
            form.reset();
        } catch (e) {
            this.showToast(e.message || 'Failed to add slot', 'error');
        }
    }

    async handleBulkSlots(event, facilityId) {
        event.preventDefault();
        const form = event.target;
        const data = {
            facilityId,
            startDate: form.startDate.value,
            endDate: form.endDate.value,
            openTime: form.openTime.value,
            closeTime: form.closeTime.value,
            slotDurationMinutes: parseInt(form.duration.value),
            capacity: parseInt(form.capacity.value)
        };

        try {
            const result = await api.generateBulkSlots(data);
            this.showToast(`Created ${result.slotsCreated || 'multiple'} slots!`, 'success');
            form.reset();
        } catch (e) {
            this.showToast(e.message || 'Failed to generate slots', 'error');
        }
    }

    async updateBooking(bookingId, status) {
        try {
            await api.updateBookingStatus(bookingId, status);
            this.showToast(status === 2 ? 'Booking accepted!' : 'Booking rejected', 'success');
            router.handleRoute(); // Refresh the page
        } catch (e) {
            this.showToast(e.message || 'Failed to update booking', 'error');
        }
    }

    // Toast notifications
    showToast(message, type = 'success') {
        const container = document.getElementById('toast-container');
        const id = Date.now();

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.id = `toast-${id}`;
        toast.innerHTML = message;

        container.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 4000);
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new BookPlatformApp();
});

export default BookPlatformApp;
