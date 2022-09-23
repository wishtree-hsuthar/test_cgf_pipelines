export const { REACT_APP_API_ENDPOINT } = process.env;
//login
export const LOGIN_URL = `${REACT_APP_API_ENDPOINT}auth/login`;
export const LOGOUT_URL = `${REACT_APP_API_ENDPOINT}auth/logout`;
export const GET_USER = `${REACT_APP_API_ENDPOINT}auth/current`;
export const FORGET_PASSWORD = `${REACT_APP_API_ENDPOINT}auth/forgot/`;
export const FORGOT_PASSWORD = `${REACT_APP_API_ENDPOINT}auth/forgot/`;
export const FORGOT_PASSWORD_VERIFY_TOKEN = `${REACT_APP_API_ENDPOINT}auth/verify/forgot/`;
export const SET_PASSWORD_VERIFY_TOKEN = `${REACT_APP_API_ENDPOINT}auth/verify/set/`;
export const CONFIRM_PASSWORD = `${REACT_APP_API_ENDPOINT}auth/confirm/`;
export const RESET_PASSWORD = `${REACT_APP_API_ENDPOINT}auth/reset/`;
export const REGIONS = `${REACT_APP_API_ENDPOINT}master/region/list`
export const REGIONCOUNTRIES = `${REACT_APP_API_ENDPOINT}master/region`
export const COUNTRIES = `${REACT_APP_API_ENDPOINT}master/country/list`
export const MEMBER = `${REACT_APP_API_ENDPOINT}members`


//sub admin
export const FETCH_ROLES = `${REACT_APP_API_ENDPOINT}roles`;
export const ADD_SUB_ADMIN = `${REACT_APP_API_ENDPOINT}users/subadmin`;
export const FETCH_SUB_ADMIN_BY_ADMIN = `${REACT_APP_API_ENDPOINT}users/subadmin/`;
export const UPDATE_SUB_ADMIN = `${REACT_APP_API_ENDPOINT}users/subadmin/`;
export const WITHDRAW_SUB_ADMIN = `${REACT_APP_API_ENDPOINT}auth/invite/`;
export const DELETE_SUB_ADMIN = `${REACT_APP_API_ENDPOINT}users/subadmin/`;
export const REPLACE_SUB_ADMIN = `${REACT_APP_API_ENDPOINT}positions/mappings/`;
