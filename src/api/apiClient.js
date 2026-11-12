import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
    timeout: import.meta.env.VITE_API_TIMEOUT || 5000,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const isLoginRequest = error.config?.url?.includes("/login");

        if (error.response?.status === 401 && !isLoginRequest) {
            window.location.href = "/login";
        }
        return Promise.reject(error);
    },
);

export default axiosInstance;
