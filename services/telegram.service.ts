import { api } from "@/lib/apiHelpers";

export interface TelegramAuthData {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

export interface StateTokenResponse {
  stateToken: string;
  deepLink: string;
  expiresIn: number;
}

export interface ConnectionCodeResponse {
  code: string;
  deepLink: string;
  expiresIn: number;
}

export const telegramAuthService = {
  /**
   * Authenticate with Telegram and get state token
   */
  authenticateTelegram: async (
    authData: TelegramAuthData
  ): Promise<StateTokenResponse> => {
    return api.post("/auth/telegram/auth", authData).then((res) => res.data);
  },

  /**
   * Generate a one-time code for Telegram connection
   */
  generateConnectionCode: async (): Promise<ConnectionCodeResponse> => {
    return api.post("/auth/telegram/generate").then((res) => res.data);
  },
};
