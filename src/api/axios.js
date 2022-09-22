import axios from "axios";

const BASE_URL = "";

export const publicAxios = axios.create({
    baseURL: BASE_URL,
});
export const privateAxios = axios.create({
    headers: { "Content-type": "application/json" },
    withCredentials: true,
});
