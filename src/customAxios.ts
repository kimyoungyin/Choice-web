import axios from "axios";
import { auth } from "fb";

const baseURL = process.env.REACT_APP_TEST_URL;

export const customAxios = axios.create({
    baseURL,
});
export const authorizedCustomAxios = axios.create({
    baseURL,
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
