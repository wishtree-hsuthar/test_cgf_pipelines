const { REACT_APP_API_ENDPOINT } = process.env;
//login
export const LOGIN_URL = `${REACT_APP_API_ENDPOINT}auth/login`;
export const GET_USER = `${REACT_APP_API_ENDPOINT}auth/current`;
export const FORGET_PASSWORD = `${REACT_APP_API_ENDPOINT}auth/forgot/`;
export const FORGOT_PASSWORD = `${REACT_APP_API_ENDPOINT}auth/forgot/`;
export const FORGOT_PASSWORD_VERIFY_TOKEN = `${REACT_APP_API_ENDPOINT}auth/verify/forgot/`;
export const CONFIRM_PASSWORD = `${REACT_APP_API_ENDPOINT}auth/confirm/`;
export const RESET_PASSWORD = `${REACT_APP_API_ENDPOINT}auth/reset/`;
export const REGIONS = `${REACT_APP_API_ENDPOINT}countries/regions`
export const COUNTRIES = `${REACT_APP_API_ENDPOINT}countries`
export const MEMBER = `${REACT_APP_API_ENDPOINT}members`

