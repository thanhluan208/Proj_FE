export const languages = ["en", "vi"];

export const ACCESS_TOKEN = "access_token";
export const REFRESH_TOKEN = "refresh_token";
export const VERIFY_OTP_KEY = "verify_otp";
export const VERIFY_OTP_COOLDOWN = 300; // In seconds
export const BASE_URL = process.env.BASE_URL || "http://backend-default";
export const NEXT_LOCALE = "NEXT_LOCALE";
export const DEFAULT_INIT_PAGE = "1";

export const IGNORE_FILTERS_LIST = ["page", "pageSize", "sortBy", "sortOrder"];

export const Routes = {
  ROOT: "/",

  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  VERIFY_OTP: "/verify-otp",

  DASHBOARD: "/dashboard",
  CONTRACTS: "/contracts",
  SCHEDULER: "/scheduler",
  BILLS: "/bills",
  HISTORY: "/history",
  PROFILE: "/profile",

  house: (houseId = "houseId") => `/house/${houseId}`,
  room: (roomId = "roomId") => `/room/${roomId}`,

  GOOGLE_LOGIN: "http://localhost:8000/auth/google",
  GITHUB_LOGIN: "http://localhost:8000/auth/github",
  SOCIAL_LOGIN_ORIGIN: "http://localhost:8000",
};

export const QueryKeys = {
  HOUSE_LIST: "HOUSE_LIST",

  ROOM_LIST: "ROOM_LIST",
  ROOM_DETAIL: "ROOM_DETAIL",
  ROOM_EXPENSE_LIST: "room-expense-list",
  ROOM_EXPENSE_PAGING: "room-expense-paging",

  BILLING_LIST: "BILLING_LIST",
  BILLING_PAGING: "BILLING_PAGING",

  TENANT_LIST: "TENANT_LIST",
  TENANT_PAGING: "TENANT_PAGING",
  TENANT_DETAIL: "TENANT_DETAIL",

  CONTRACT_LIST: "CONTRACT_LIST",
  CONTRACT_PAGING: "CONTRACT_PAGING",
};

export const TIME_IN_SECONDS = {
  ONE_MINUTE: 60,
  ONE_HOUR: 60 * 60,
  ONE_DAY: 60 * 60 * 24,
};

export const COUNT_DOWN_OTP = 60; //In seconds

//! USER API
export const logout = BASE_URL + "/user/log_out";
export const refreshToken =
  BASE_URL + "/user/generate_access_token_from_refresh_token";
export const signInApi = BASE_URL + "/user/log_in";
export const signUpApi = BASE_URL + "/user/sign_up";
export const verifyEmail = BASE_URL + "/user/resend_verification_code";
export const submitOTP = BASE_URL + "/user/verify_verification_code";
export const changePasswordApi = BASE_URL + "/user/change_password_user";
export const getUserData = BASE_URL + "/user/show_user_data";
export const searchUser = BASE_URL + "/user/search_user";
export const updateUser = BASE_URL + "/user/update_user";
export const voteStarAgent = BASE_URL + "/user/vote_star_agent";
export const forgotPass = BASE_URL + "/user/forget_password";
export const changePassword =
  BASE_URL + "/user/change_password_with_reset_code";
export const getAvatar = BASE_URL + "/user/get_avatar";
export const uploadAvatar = BASE_URL + "/user/upload_avatar";

export const LOCAL_STORAGE_KEY = {
  ACCESS_TOKEN: "ACCESS_TOKEN",
  REFRESH_TOKEN: "REFRESH_TOKEN",
  USER_ID: "USER_ID",
  USER_DATA: "USER_DATA",
};

export const BOOLEAN_OPTION = [
  {
    label: "all",
    value: "all",
  },
  {
    label: "yes",
    value: "true",
  },
  {
    label: "no",
    value: "false",
  },
];
