import axios from "axios";

const API = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api`,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: false,
});

API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("sudoku_auth_token");

        if (token){
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401){
            localStorage.removeItem("sudoku_auth_token");
        }

        return Promise.reject(error);
    }
);

export default API;