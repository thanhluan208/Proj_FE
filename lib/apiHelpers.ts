import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";

// Type definitions
interface ErrorResponse {
  error: string;
  details?: string;
  requestId?: string;
  timestamp?: string;
}

interface ProxyErrorResponse extends AxiosError {
  response?: AxiosResponse<ErrorResponse>;
}

class HttpServices {
  private axios: AxiosInstance;

  constructor() {
    this.axios = axios.create({
      baseURL: "/api/valetum", // Route all requests through Next.js proxy
    });

    this.setupDefaultHeaders();
    this.setupRequestInterceptor();
    this.setupResponseInterceptor();
  }

  /**
   * Setup default headers that will be added to all requests
   */
  private setupDefaultHeaders(): void {
    this.axios.defaults.headers["ngrok-skip-browser-warning"] = "true";
    this.axios.defaults.headers["X-Client-Type"] = "web";
    this.axios.defaults.headers["X-Client-Version"] =
      process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0";
  }

  /**
   * Setup request interceptor for client-side headers
   */
  private setupRequestInterceptor(): void {
    this.axios.interceptors.request.use(
      (config) => {
        // Add timezone information for all requests
        config.headers["X-Timezone"] =
          Intl.DateTimeFormat().resolvedOptions().timeZone;

        // Add timestamp for request tracking
        config.headers["X-Client-Timestamp"] = new Date().toISOString();

        console.log("config", config);

        return config;
      },
      (error: AxiosError) => {
        console.error("Request interceptor error:", error);
        return Promise.reject(error);
      }
    );
  }

  /**
   * Setup response interceptor for handling errors and responses
   */
  private setupResponseInterceptor(): void {
    this.axios.interceptors.response.use(
      (response: AxiosResponse) => {
        // Log successful responses in development
        if (process.env.NODE_ENV === "development") {
          console.log(
            `✅ ${response.config.method?.toUpperCase()} ${
              response.config.url
            } - ${response.status}`
          );
        }
        return response;
      },
      (error: ProxyErrorResponse) => {
        const { response, config } = error;

        // Log errors
        console.error(
          `❌ ${config?.method?.toUpperCase()} ${config?.url} - ${
            response?.status || "Network Error"
          }`,
          {
            error: response?.data || error.message,
            requestId: response?.data?.requestId,
          }
        );

        // Handle specific error cases
        if (response?.status === 401) {
          this.handleUnauthorizedError();
        } else if (response?.status === 503) {
          this.handleServiceUnavailableError(response.data);
        } else if (
          response?.status === 400 &&
          response.data?.error === "Invalid proxy path"
        ) {
          console.error("Invalid API path used:", config?.url);
        }

        return Promise.reject(error);
      }
    );
  }

  /**
   * Handle 401 Unauthorized errors
   */
  private handleUnauthorizedError(): void {
    console.warn("Authentication failed - redirecting to login");

    // Redirect to login page
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }

  /**
   * Handle 503 Service Unavailable errors
   */
  private handleServiceUnavailableError(errorData: ErrorResponse): void {
    console.error("Backend service unavailable:", errorData);

    // You could show a toast notification or error banner here
    // Example: toast.error("Service temporarily unavailable. Please try again later.")
  }

  // HTTP method wrappers with improved typing
  async get<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.axios.get<T>(url, config);
  }

  async post<T = any, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.axios.post<T>(url, data, config);
  }

  async delete<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.axios.delete<T>(url, config);
  }

  async put<T = any, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.axios.put<T>(url, data, config);
  }

  async patch<T = any, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.axios.patch<T>(url, data, config);
  }

  /**
   * Get the axios instance for advanced usage
   */
  getAxiosInstance(): AxiosInstance {
    return this.axios;
  }

  /**
   * Create a request with custom configuration
   */
  async request<T = any>(
    config: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.axios.request<T>(config);
  }
}

// Export singleton instance
export const api = new HttpServices();

// Export types for use in other files
export type { ErrorResponse, ProxyErrorResponse };

// Export the class for testing or advanced usage
export { HttpServices };
