export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  refreshToken: string;
  token: string;
  tokenExpires: number;
  refreshExpires: number;
}

export interface UserDataLogin {
  user_id: string;
  user_name: string;
  email: string;
  email_verified: string;
  active: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface VerifyOtpPayload {
  otpCode: string;
  email: string;
}

export interface AuthLoginSuccessParams {
  redirectTo: string;
  params: Record<string, string>;
}

export interface RefreshResponse {
  token: string;
  refreshToken: string;
  tokenExpires: number;
  refreshExpires: number;
}

export interface Profile {
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
}
