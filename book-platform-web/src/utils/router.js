// Router - Simple hash-based routing

class Router {
    constructor() {
        this.routes = new Map();
        this.currentRoute = null;
        this.container = null;

        window.addEventListener('hashchange', () => this.handleRoute());
        window.addEventListener('load', () => this.handleRoute());
    }

    setContainer(container) {
        this.container = container;
    }

    register(path, handler) {
        this.routes.set(path, handler);
    }

    navigate(path) {
        window.location.hash = path;
    }

    getCurrentPath() {
        return window.location.hash.slice(1) || '/';
    }

    async handleRoute() {
        const path = this.getCurrentPath();

        // Try exact match first
        let handler = this.routes.get(path);
        let params = [];

        // Try dynamic routes like /facility/:id or /dashboard/facility/:id
        if (!handler) {
            const pathParts = path.split('/').filter(Boolean);

            for (const [route, h] of this.routes) {
                if (route.includes(':')) {
                    const routeParts = route.split('/').filter(Boolean);

                    if (routeParts.length === pathParts.length) {
                        let match = true;
                        const extractedParams = [];

                        for (let i = 0; i < routeParts.length; i++) {
                            if (routeParts[i].startsWith(':')) {
                                // This is a dynamic param, extract its value
                                extractedParams.push(pathParts[i]);
                            } else if (routeParts[i] !== pathParts[i]) {
                                match = false;
                                break;
                            }
                        }

                        if (match) {
                            handler = h;
                            params = extractedParams;
                            break;
                        }
                    }
                }
            }
        }

        if (handler && this.container) {
            this.currentRoute = path;
            const content = await handler(params);
            this.container.innerHTML = content;

            // Execute any initialization scripts
            window.dispatchEvent(new CustomEvent('route:loaded', { detail: { path, params } }));
        } else if (!handler) {
            this.navigate('/');
        }
    }
}

export const router = new Router();
export default router;
