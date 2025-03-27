import axios from 'axios';
import {
    getFromSessionStorage,
    removeSessionItem,
    setSessionStorage
} from "../SessionStorage/sessionStorage.js";

class Client {
    constructor() {
        // Create Axios instance with base configuration
        this.http = axios.create({
            baseURL: "http://localhost:8080/ebk",
            withCredentials: true,
        });

        // Set instance-specific headers
        this.setInstanceHeaders();

        // CSRF Token handling
        this.setCsrfToken();

        // Set up interceptors
        this.setupInterceptors();

        // Token refresh state management
        this.isRefreshing = false;
        this.requestsQueue = [];
    }

    setInstanceHeaders() {
        this.http.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
        this.http.defaults.headers.common['Content-Type'] = 'application/json';
    }

    setCsrfToken() {
        const meta = document.head.querySelector('meta[name="csrf-token"]');
        if (meta) {
            this.http.defaults.headers.common['X-CSRF-TOKEN'] = meta.content;
        }
    }

    setupInterceptors() {
        // Request interceptor for auth header
        this.http.interceptors.request.use(config => {
            if (!config.headers.Authorization) {
                config.headers.Authorization = `Bearer ${this.getToken()}`;
            }
            return config;
        });

        // Response interceptor
        this.http.interceptors.response.use(
            response => response,
            error => this.handleErrorResponse(error)
        );
    }

    getToken() {
        return getFromSessionStorage('token');
    }

    async refreshAccessToken() {
        try {
            const response = await this.http.post('/auth/refreshToken');
            const newToken = response.data?.token;

            if (!newToken) throw new Error('No token in response');

            setSessionStorage('token', newToken);
            return newToken;
        } catch (error) {
            await this.logoutUser();
            throw error;
        }
    }

    async handleErrorResponse(error) {
        const { config, response } = error;

        if (!response) return Promise.reject(error);

        const { status } = response;

        // Handle unauthorized requests
        if (status === 401 && config && !config._retry) {
            return this.handleUnauthorizedError(config);
        }

        // Handle forbidden requests
        if (status === 403) {
            await this.logoutUser();
        }

        return Promise.reject(error);
    }

    async handleUnauthorizedError(originalRequest) {
        originalRequest._retry = true;

        if (!this.isRefreshing) {
            this.isRefreshing = true;

            try {
                await this.refreshAccessToken();
                this.processQueuedRequests(null);
            } catch (error) {
                this.processQueuedRequests(error);
                return Promise.reject(error);
            } finally {
                this.isRefreshing = false;
            }
        }

        return new Promise((resolve, reject) => {
            this.requestsQueue.push({ resolve, reject });
        }).then(() => this.http(originalRequest));
    }

    processQueuedRequests(error) {
        this.requestsQueue.forEach(promise => {
            error ? promise.reject(error) : promise.resolve();
        });
        this.requestsQueue = [];
    }

    logoutUser() {
        removeSessionItem('user');
        removeSessionItem('token');
        window.location.href = "/auth/login";
    }

    // HTTP methods
    async get(path,{rejectWithValue}, params = {}, config = {}) {
        try {
            const response = this.http.get(path, { params, ...config })
            const {data,status} = response
            if (status === 200) return data;
            else return rejectWithValue(data);

        }catch (error) {
            if (error.response) {
                return rejectWithValue(error.response);
            } else {
                const result = { message: error.message };
                return rejectWithValue(result);
            }
        }
    }

    async post(path, data = {}, config = {}) {
        return this.http.post(path, data, config);
    }

    async upload(path, data = {}, file, config = {}) {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => formData.append(key, value));
        if (file) formData.append('file', file);

        return this.post(path, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            ...config
        });
    }

    async put(path, data = {}, config = {}) {
        return this.http.put(path, data, config);
    }

    async delete(path, params = {}, config = {}) {
        return this.http.delete(path, { params, ...config });
    }

    parseResponse({ data }) {
        return data;
    }
}

export default new Client();