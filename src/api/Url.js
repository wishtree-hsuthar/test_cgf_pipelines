export const { REACT_APP_API_ENDPOINT, REACT_APP_FILE_ENCRYPT_SECRET } = process.env;
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
export const CHANGE_PASSWORD = `${REACT_APP_API_ENDPOINT}auth/reset`;

//master
export const REGIONS = `${REACT_APP_API_ENDPOINT}master/region/list`;
export const REGIONCOUNTRIES = `${REACT_APP_API_ENDPOINT}master/region`;
// export const PARENT_COMPINES = `${REACT_APP_API_ENDPOINT}master/compnies`;
export const COUNTRIES = `${REACT_APP_API_ENDPOINT}master/country/list`;
export const STATES = `${REACT_APP_API_ENDPOINT}master/country`;
// export const CITES = `${REACT_APP_API_ENDPOINT}master/cities`;

//Member
export const MEMBER = `${REACT_APP_API_ENDPOINT}members`;
export const MEMBER_DROPDOWN = `${REACT_APP_API_ENDPOINT}members/master`;
export const PARENT_COMPINES = `${REACT_APP_API_ENDPOINT}members/parentCompanies/master`;
export const CITES = `${REACT_APP_API_ENDPOINT}members/cities/master`;

//Operation member
export const MEMBER_OPERATION_MEMBERS = `${REACT_APP_API_ENDPOINT}operation-member/member`;

//sub admin
export const FETCH_ROLES = `${REACT_APP_API_ENDPOINT}roles/master`;
export const ADD_SUB_ADMIN = `${REACT_APP_API_ENDPOINT}users/cgfadmin`;
export const FETCH_SUB_ADMIN_BY_ADMIN = `${REACT_APP_API_ENDPOINT}users/cgfadmin/`;
export const UPDATE_SUB_ADMIN = `${REACT_APP_API_ENDPOINT}users/cgfadmin/`;
export const WITHDRAW_SUB_ADMIN = `${REACT_APP_API_ENDPOINT}auth/invite/`;
export const DELETE_SUB_ADMIN = `${REACT_APP_API_ENDPOINT}users/cgfadmin/`;
export const REPLACE_SUB_ADMIN = `${REACT_APP_API_ENDPOINT}positions/mappings/`;

// add operationn member
export const ADD_OPERATION_MEMBER = `${REACT_APP_API_ENDPOINT}operation-member`;
export const FETCH_OPERATION_MEMBER = `${REACT_APP_API_ENDPOINT}operation-member/member/`;
export const WITHDRAW_OPERATION_MEMBER = `${REACT_APP_API_ENDPOINT}auth/invite/`;
export const DELETE_OPERATION_MEMBER = `${REACT_APP_API_ENDPOINT}operation-member/`;
export const GET_OPERATION_MEMBER_BY_ID = `${REACT_APP_API_ENDPOINT}operation-member/`;
export const UPDATE_OPERATION_MEMBER = `${REACT_APP_API_ENDPOINT}operation-member/`;
export const FETCH_REPORTING_MANAGER = `${REACT_APP_API_ENDPOINT}operation-member/member/`;
export const REPLACE_OPERATION_MEMBER = `${REACT_APP_API_ENDPOINT}positions/mappings/`;

// add questionnaire
export const ADD_QUESTIONNAIRE = `${REACT_APP_API_ENDPOINT}questionnaires`;

// assessments
export const FETCH_ASSESSMENT_BY_ID = `${REACT_APP_API_ENDPOINT}assessments/`;
export const UPDATE_ASSESSMENT_BY_ID = `${REACT_APP_API_ENDPOINT}assessments/`;
export const SUBMIT_ASSESSMENT_AS_DRAFT = `${REACT_APP_API_ENDPOINT}assessments/`;
export const ASSESSMENTS = `${REACT_APP_API_ENDPOINT}assessments/list/`;
export const ADD_ASSESSMENTS = `${REACT_APP_API_ENDPOINT}assessments/`;
export const REASSIGN_ASSESSMENTS = `${REACT_APP_API_ENDPOINT}assessments/`;
export const ACCEPT_ASSESSMENT = `${REACT_APP_API_ENDPOINT}assessments/`;
export const DECLINE_ASSESSMENT = `${REACT_APP_API_ENDPOINT}assessments/`;

// download
export const DOWNLOAD_CGF_ADMIN = `${REACT_APP_API_ENDPOINT}users/cgfadmin/list/download`;
export const DOWNLOAD_MEMBERS = `${REACT_APP_API_ENDPOINT}members/list/download`;
export const DOWNLOAD_OPERATION_MEMBER = `${REACT_APP_API_ENDPOINT}operation-member/list/download`;
export const DOWNLOAD_ASSESSMENT = `${REACT_APP_API_ENDPOINT}assessments/list/download`;
export const DOWNLOAD_ASSESSMENT_BY_ID = `${REACT_APP_API_ENDPOINT}assessments/`;
export const DOWNLOAD_QUESTIONNAIRES = `${REACT_APP_API_ENDPOINT}questionnaires/list/download`;
export const DOWNLOAD_QUESTIONNAIRES_BY_ID = `${REACT_APP_API_ENDPOINT}questionnaires/`;
//roles
export const VIEW_ROLE = `${REACT_APP_API_ENDPOINT}roles/`;
// roles
export const ROLE_BY_ID = `${REACT_APP_API_ENDPOINT}roles/`;
export const GET_ROLE_BY_ID = `${REACT_APP_API_ENDPOINT}roles/`;
export const GET_USER_BY_ROLE = `${REACT_APP_API_ENDPOINT}roles/`;
