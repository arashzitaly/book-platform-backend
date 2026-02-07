// State management for the application

class Store {
    constructor() {
        this.state = {
            user: null,
            isAuthenticated: false,
            facilities: [],
            myBookings: [],
            notifications: [],
            unreadCount: 0,
            loading: false
        };
        this.listeners = new Set();

        // Try to restore user from localStorage
        const savedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (savedUser && token) {
            this.state.user = JSON.parse(savedUser);
            this.state.isAuthenticated = true;
        }
    }

    getState() {
        return this.state;
    }

    setState(updates) {
        this.state = { ...this.state, ...updates };
        this.notify();
    }

    subscribe(listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    notify() {
        this.listeners.forEach(listener => listener(this.state));
    }

    // Auth actions
    setUser(user) {
        this.setState({ user, isAuthenticated: !!user });
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }

    logout() {
        this.setState({ user: null, isAuthenticated: false });
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    }

    // Facility actions
    setFacilities(facilities) {
        this.setState({ facilities });
    }

    // Booking actions
    setMyBookings(myBookings) {
        this.setState({ myBookings });
    }

    // Notification actions
    setNotifications(notifications) {
        this.setState({ notifications });
    }

    setUnreadCount(unreadCount) {
        this.setState({ unreadCount });
    }

    // Loading state
    setLoading(loading) {
        this.setState({ loading });
    }
}

export const store = new Store();
export default store;
