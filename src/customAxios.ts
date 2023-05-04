import axios from "axios";
import { auth } from "fb";

export const customAxios = axios.create({
    baseURL: `http://localhost:4000`,
});
export const authorizedCustomAxios = axios.create({
    baseURL: `http://localhost:4000`,
});

authorizedCustomAxios.interceptors.request.use(async (config) => {
    if (!auth.currentUser) return Promise.reject("unauthorized");
    try {
        config.headers[
            "Authorization"
        ] = `Bearer ${await auth.currentUser.getIdToken()}`;
        return config;
    } catch (error) {
        return Promise.reject(error);
    }
});
