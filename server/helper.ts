import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/lib/constant";
import {
  ApiConfig,
  ApiResponse,
  RequestOptions,
  serverAction,
} from "@/types/server-helper.type";
import { CommonResponse } from "@/types";

const DEFAULT_CONFIG: Required<ApiConfig> = {
  baseUrl: process.env.BASE_URL || "http://localhost:3000/api",
  timeout: 10000,
  retries: 0,
  headers: {
    "Content-Type": "application/json",
  },
};

class ApiInstance {
  private config: Required<ApiConfig>;

  constructor(config: ApiConfig = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Get authorization header from cookies (server-side)
   */
  private async getAuthHeader(
    isRefresh = false
  ): Promise<Record<string, string>> {
    try {
      const cookieStore = await cookies();
      const token = cookieStore.get(
        isRefresh ? REFRESH_TOKEN : ACCESS_TOKEN
      )?.value;

      console.log(
        `[API DEBUG] Using ${isRefresh ? "refresh" : "access"} token:`,
        token
      );

      if (token) {
        return { Authorization: `Bearer ${token}` };
      }
    } catch (error) {
      // Handle cases where cookies() is not available
      console.warn("Unable to access cookies:", error);
    }

    return {};
  }

  /**
   * Make HTTP request with retry logic
   */
  private async makeRequest<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<CommonResponse<T>> {
    const { timeout, retries, skipAuth, refreshAuth, ...fetchOptions } =
      options;
    const url = `${this.config.baseUrl}${endpoint}`;

    // Build headers
    const headers = {
      ...this.config.headers,
      ...fetchOptions.headers,
    };

    // Add auth header if not skipped
    if (!skipAuth) {
      const authHeader = await this.getAuthHeader(refreshAuth);
      Object.assign(headers, authHeader);
    }

    const requestOptions: RequestInit = {
      ...fetchOptions,
      headers,
    };

    const maxRetries = retries ?? this.config.retries;
    const requestTimeout = timeout ?? this.config.timeout;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), requestTimeout);

        console.log("fetching:", url, {
          ...requestOptions,
        });

        const response = await fetch(url, {
          ...requestOptions,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        const isJsonResponse = response.headers
          .get("content-type")
          ?.includes("application/json");
        const data = isJsonResponse
          ? await response.json()
          : await response.text();

        if (!response.ok) {
          // Handle specific HTTP errors
          if (response.status === 401) {
            // Unauthorized - redirect to login with proper i18n routing
            const { redirect: i18nRedirect } = await import("@/i18n/routing");
            i18nRedirect({ href: "/login", locale: "en" as any });
          }

          return {
            error: data.message || data.error || `HTTP ${response.status}`,
            status: data.status || response.status,
            data: data,
            message: data.message || "",
          };
        }

        return {
          data,
          status: data.status || response.status,
          message: data.message || "",
        };
      } catch (error) {
        console.log("Request error:", error);
        if (attempt === maxRetries) {
          const errorMessage =
            error instanceof Error ? error.message : "Network error";
          return {
            error: errorMessage,
            message: errorMessage,
            status: 0,
          };
        }

        // Wait before retry (exponential backoff)
        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, attempt) * 1000)
        );
      }
    }

    return {
      error: "Max retries exceeded",
      message: "Max retries exceeded",
      status: 0,
    };
  }

  /**
   * GET request
   */
  async get<T>(
    endpoint: string,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { ...options, method: "GET" });
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    data?: any,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    data?: any,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PATCH request
   */
  async patch<T>(
    endpoint: string,
    data?: any,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(
    endpoint: string,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { ...options, method: "DELETE" });
  }

  /**
   * Upload file
   */
  async upload<T>(
    endpoint: string,
    file: File | FormData,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    const formData = file instanceof FormData ? file : new FormData();
    if (file instanceof File) {
      formData.append("file", file);
    }

    const authHeader = await this.getAuthHeader();

    return this.makeRequest<T>(endpoint, {
      ...options,
      method: "POST",
      body: formData,
      headers: {
        // Don't set Content-Type for FormData, let browser set it
        ...authHeader,
        ...options?.headers,
      },
    });
  }
}

// Create default instance
export const api = new ApiInstance();

// Server Fetcher (for use in Server Components)
export async function serverFetcher<T>(
  endpoint: string,
  options?: RequestOptions
): Promise<ApiResponse<T>> {
  return api.get<T>(endpoint, options);
}

// Utility functions for common patterns
export const apiUtils = {
  /**
   * Create a server action for a specific endpoint
   */
  createServerAction: <Data, T>(
    endpoint: string,
    method: "POST" | "PUT" | "PATCH" | "DELETE" = "POST",
    config?: RequestOptions
  ) => {
    return async (data?: Data): Promise<ApiResponse<T>> => {
      return serverAction<T>(endpoint, data, method, config);
    };
  },

  /**
   * Create a server fetcher for a specific endpoint
   */
  createServerFetcher: <T>(endpoint: string) => {
    return async (options?: RequestOptions): Promise<ApiResponse<T>> => {
      return serverFetcher<T>(endpoint, options);
    };
  },

  /**
   * Handle API response with error handling
   */
  handleResponse: <T>(response: ApiResponse<T>) => {
    if (response.error) {
      throw new Error(response.error);
    }
    return response.data;
  },

  /**
   * Create API instance with custom config
   */
  createInstance: (config: ApiConfig) => new ApiInstance(config),
};
