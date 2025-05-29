import axios from 'axios';

const instance = axios.create({
    baseURL: process.env.NODE_ENV === 'production' 
        ? ''  // Production base URL
        : 'http://127.0.0.1:8000',  // Development base URL
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true,
});

// Track if we're currently refreshing the CSRF token
let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;
let failedQueue: Array<{
    resolve: (value?: any) => void;
    reject: (reason?: any) => void;
}> = [];

// Process failed queue
const processQueue = (error: any = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve();
        }
    });
    failedQueue = [];
};

// Function to refresh CSRF token
const refreshCsrfToken = async () => {
    if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = axios.get('/sanctum/csrf-cookie', {
            baseURL: process.env.NODE_ENV === 'production' ? '' : 'http://127.0.0.1:8000',
            withCredentials: true
        })
        .then(() => {
            isRefreshing = false;
            processQueue();
            refreshPromise = null;
        })
        .catch((error) => {
            isRefreshing = false;
            processQueue(error);
            refreshPromise = null;
            throw error;
        });
    }
    return refreshPromise;
};

// Add request interceptor to ensure CSRF token is set
instance.interceptors.request.use(async (config) => {
    try {
        // Check if we need to refresh the CSRF token
        const token = document.cookie
            .split('; ')
            .find(row => row.startsWith('XSRF-TOKEN='))
            ?.split('=')[1];

        if (!token) {
            // Add request to queue if we're already refreshing
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(() => config);
            }

            await refreshCsrfToken();
            // Get the new token
            const newToken = document.cookie
                .split('; ')
                .find(row => row.startsWith('XSRF-TOKEN='))
                ?.split('=')[1];

            if (newToken) {
                config.headers['X-XSRF-TOKEN'] = decodeURIComponent(newToken);
            }
        } else {
            config.headers['X-XSRF-TOKEN'] = decodeURIComponent(token);
        }

        return config;
    } catch (error) {
        console.error('Error handling CSRF token:', error);
        return Promise.reject(error);
    }
}, (error) => {
    return Promise.reject(error);
});

// Keep track of auth state
let isAuthenticating = false;
let authRetryCount = 0;
const MAX_AUTH_RETRIES = 2;

// Add response interceptor for handling auth errors
instance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Handle 401 errors
        if (error.response?.status === 401 && !isAuthenticating) {
            if (authRetryCount >= MAX_AUTH_RETRIES) {
                // Reset counter and redirect to login if we've tried too many times
                authRetryCount = 0;
                if (!window.location.pathname.includes('login')) {
                    window.location.href = '/login';
                }
                return Promise.reject(error);
            }

            isAuthenticating = true;
            authRetryCount++;

            try {
                // Try to refresh the CSRF token
                await refreshCsrfToken();
                
                // Don't retry if this was already a CSRF cookie request
                if (originalRequest.url?.includes('/sanctum/csrf-cookie')) {
                    isAuthenticating = false;
                    return Promise.reject(error);
                }

                // Retry the original request
                const response = await instance(originalRequest);
                isAuthenticating = false;
                return response;
            } catch (retryError) {
                isAuthenticating = false;
                // Only redirect if we're not already on the login page
                if (!window.location.pathname.includes('login')) {
                    window.location.href = '/login';
                }
                return Promise.reject(retryError);
            }
        }

        return Promise.reject(error);
    }
);

export default instance; 