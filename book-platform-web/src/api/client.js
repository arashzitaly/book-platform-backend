// API Client for Book Platform Backend

const API_BASE = '/api';

class ApiClient {
    constructor() {
        this.token = localStorage.getItem('token');
    }

    setToken(token) {
        this.token = token;
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    }

    getToken() {
        return this.token;
    }

    async request(endpoint, options = {}) {
        const url = `${API_BASE}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers
            });

            if (response.status === 401) {
                this.setToken(null);
                window.dispatchEvent(new CustomEvent('auth:logout'));
                throw new Error('Unauthorized');
            }

            const data = response.headers.get('content-type')?.includes('application/json')
                ? await response.json()
                : null;

            if (!response.ok) {
                throw new Error(data?.message || `HTTP error ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Auth
    async register(data) {
        const response = await this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(data)
        });
        if (response?.token) {
            this.setToken(response.token);
        }
        return response;
    }

    async login(data) {
        const response = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify(data)
        });
        if (response?.token) {
            this.setToken(response.token);
        }
        return response;
    }

    logout() {
        this.setToken(null);
        window.dispatchEvent(new CustomEvent('auth:logout'));
    }

    // Facilities
    async getFacilities(params = {}) {
        const query = new URLSearchParams(params).toString();
        return this.request(`/facilities${query ? `?${query}` : ''}`);
    }

    async getFacility(id) {
        return this.request(`/facilities/${id}`);
    }

    async getMyFacilities() {
        return this.request('/facilities/my');
    }

    async createFacility(data) {
        return this.request('/facilities', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async updateFacility(id, data) {
        return this.request(`/facilities/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    // Resources
    async getResources(facilityId) {
        return this.request(`/facilities/${facilityId}/resources`);
    }

    async createResource(facilityId, data) {
        return this.request(`/facilities/${facilityId}/resources`, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    // Slots
    async getSlots(facilityId, params = {}) {
        const query = new URLSearchParams(params).toString();
        return this.request(`/facilities/${facilityId}/slots${query ? `?${query}` : ''}`);
    }

    async getAvailableSlots(facilityId, limit = 50) {
        return this.request(`/facilities/${facilityId}/slots/available?limit=${limit}`);
    }

    async createSlots(facilityId, data) {
        return this.request(`/facilities/${facilityId}/slots/bulk`, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async createSlot(data) {
        const { facilityId, ...slotData } = data;
        return this.request(`/facilities/${facilityId}/slots`, {
            method: 'POST',
            body: JSON.stringify(slotData)
        });
    }

    async generateBulkSlots(data) {
        const { facilityId, ...bulkData } = data;
        return this.request(`/facilities/${facilityId}/slots/bulk`, {
            method: 'POST',
            body: JSON.stringify(bulkData)
        });
    }

    // Bookings
    async getMyBookings() {
        return this.request('/bookings');
    }

    async getBooking(id) {
        return this.request(`/bookings/${id}`);
    }

    async getFacilityBookings(facilityId) {
        return this.request(`/bookings/facility/${facilityId}`);
    }

    async getPendingBookings(facilityId) {
        return this.request(`/bookings/facility/${facilityId}/pending`);
    }

    async createBooking(data) {
        return this.request('/bookings', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async updateBookingStatus(id, status) {
        return this.request(`/bookings/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status })
        });
    }

    async rescheduleBooking(id, data) {
        return this.request(`/bookings/${id}/reschedule`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    // Notifications
    async getNotifications(limit = 50) {
        return this.request(`/notifications?limit=${limit}`);
    }

    async getUnreadNotifications() {
        return this.request('/notifications/unread');
    }

    async getUnreadCount() {
        return this.request('/notifications/unread/count');
    }

    async markNotificationRead(id) {
        return this.request(`/notifications/${id}/read`, { method: 'PUT' });
    }

    async markAllNotificationsRead() {
        return this.request('/notifications/read-all', { method: 'PUT' });
    }
}

export const api = new ApiClient();
export default api;
