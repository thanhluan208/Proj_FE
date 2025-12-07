import { api } from "@/server/helper"

export interface ApiResponse<T = any> {
	data?: T
	error?: string
	message?: string
	status: number
}

export interface ApiConfig {
	baseUrl?: string
	timeout?: number
	retries?: number
	headers?: Record<string, string>
}

export interface RequestOptions extends RequestInit {
	timeout?: number
	retries?: number
	skipAuth?: boolean
	refreshAuth?: boolean
}

export async function serverAction<T>(
	endpoint: string,
	data?: any,
	method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" = "POST",
	config?: RequestOptions
): Promise<ApiResponse<T>> {
	"use server"

	switch (method) {
		case "GET":
			return api.get<T>(endpoint, config)
		case "POST":
			return api.post<T>(endpoint, data, config)
		case "PUT":
			return api.put<T>(endpoint, data, config)
		case "PATCH":
			return api.patch<T>(endpoint, data, config)
		case "DELETE":
			return api.delete<T>(endpoint, config)
		default:
			return {
				error: "Unsupported method",
				status: 400
			}
	}
}
