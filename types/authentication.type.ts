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
  fullName: string;
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
  fullName: string;
  phoneNumber?: string;
  bankAccountName?: string;
  bankAccountNumber?: string;
  bankName?: string;
  telegramId?: string;
  telegramUsername?: string;
  botAccessEnabled?: boolean;
  createdAt: string;
  updatedAt: string;
}
