import axios from 'axios';

const BASE_URL = '';

export const  publicAxios=axios.create({
    baseURL:BASE_URL
});
export const privateAxios=axios.create({
    baseURL:BASE_URL,
    headers:{"Content-type":"application/json"},
    withCredentials:true
})