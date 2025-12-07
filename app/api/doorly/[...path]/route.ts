import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { ACCESS_TOKEN } from "@/lib/constant";

// Type definitions
interface ProxyParams {
  params: Promise<{
    path: string[];
  }>;
}

interface ProxyHeaders {
  [key: string]: string;
}

interface ErrorResponse {
  error: string;
  details?: string;
}

// Configuration constants
const BACKEND_API_URL = process.env.BASE_URL as string;
const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0";
const NODE_ENV = process.env.NODE_ENV as "development" | "production" | "test";

// Headers to exclude when forwarding requests
const EXCLUDE_REQUEST_HEADERS: readonly string[] = [
  "host",
  "connection",
  "content-length",
] as const;

// Headers to exclude when returning responses
const EXCLUDE_RESPONSE_HEADERS: readonly string[] = [
  "connection",
  "transfer-encoding",
  "content-encoding",
] as const;

// HTTP methods that don't have request bodies
const METHODS_WITHOUT_BODY: readonly string[] = ["GET", "HEAD"] as const;

// Validate required environment variables
if (!BACKEND_API_URL) {
  throw new Error("BACKEND_API_URL environment variable is required");
}

async function handleProxyRequest(
  request: NextRequest,
  { params }: ProxyParams
): Promise<NextResponse> {
  const { path } = await params;
  const url = new URL(request.url);

  // Validate path parameter
  if (!path || path.length === 0) {
    return NextResponse.json(
      { error: "Invalid proxy path" } satisfies ErrorResponse,
      { status: 400 }
    );
  }

  // Reconstruct the original backend URL
  const backendPath = Array.isArray(path) ? path.join("/") : path;
  const backendUrl = `${BACKEND_API_URL}/${backendPath}${url.search}`;

  console.log("backendUrl", backendUrl);
  // Validate backend URL
  if (!isValidUrl(backendUrl)) {
    return NextResponse.json(
      { error: "Invalid backend URL" } satisfies ErrorResponse,
      { status: 400 }
    );
  }

  // Get request body for non-GET requests
  let body: string | null = null;
  if (!METHODS_WITHOUT_BODY.includes(request.method as any)) {
    try {
      body = await request.text();
    } catch (error) {
      console.error("Failed to read request body:", error);
      return NextResponse.json(
        {
          error: "Invalid request body",
          details: error instanceof Error ? error.message : "Unknown error",
        } satisfies ErrorResponse,
        { status: 400 }
      );
    }
  }

  try {
    // Forward request to backend with additional headers
    const backendResponse = await fetch(backendUrl, {
      method: request.method,
      headers: await buildProxyHeaders(request),
      body,
    });

    // Get response data
    const responseData = await backendResponse.arrayBuffer();

    // Create response with original status and headers
    return new NextResponse(responseData, {
      status: backendResponse.status,
      statusText: backendResponse.statusText,
      headers: filterResponseHeaders(backendResponse.headers),
    });
  } catch (error) {
    console.error("Proxy request failed:", {
      url: backendUrl,
      method: request.method,
      error: error instanceof Error ? error.message : "Unknown error",
    });

    return NextResponse.json(
      {
        error: "Backend service unavailable",
        details: error instanceof Error ? error.message : "Unknown error",
      } satisfies ErrorResponse,
      { status: 503 }
    );
  }
}

async function buildProxyHeaders(request: NextRequest): Promise<ProxyHeaders> {
  const headers: ProxyHeaders = {};

  // Copy original headers (excluding some that shouldn't be forwarded)
  request.headers.forEach((value, key) => {
    if (!EXCLUDE_REQUEST_HEADERS.includes(key.toLowerCase() as any)) {
      headers[key] = value;
    }
  });

  // Add authentication header
  const authToken = await getAuthToken(request);
  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  // Add custom headers for ALL requests
  headers["X-Forwarded-By"] = "NextJS-Proxy";
  headers["X-Request-ID"] = generateRequestId();
  headers["X-Client-IP"] = getClientIP(request);

  // Add custom business headers
  headers["X-App-Version"] = APP_VERSION;
  headers["X-Environment"] = NODE_ENV;

  return headers;
}

async function getAuthToken(request: NextRequest): Promise<string | null> {
  try {
    const cookieStore = await cookies();

    // Try multiple sources for auth token
    let token = cookieStore.get(ACCESS_TOKEN)?.value;

    if (!token) {
      const authHeader = request.headers.get("authorization");
      if (authHeader?.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      }
    }

    return token || null;
  } catch (error) {
    console.error("Error getting auth token:", error);
    return null;
  }
}

function getClientIP(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  const realIP = request.headers.get("x-real-ip");
  if (realIP) {
    return realIP.trim();
  }

  return "unknown";
}

function generateRequestId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2);
  return `${timestamp}${random}`;
}

function filterResponseHeaders(headers: Headers): ProxyHeaders {
  const allowedHeaders: ProxyHeaders = {};

  headers.forEach((value, key) => {
    if (!EXCLUDE_RESPONSE_HEADERS.includes(key.toLowerCase() as any)) {
      allowedHeaders[key] = value;
    }
  });

  return allowedHeaders;
}

function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Export handlers for all HTTP methods
export const GET = handleProxyRequest;
export const POST = handleProxyRequest;
export const PUT = handleProxyRequest;
export const DELETE = handleProxyRequest;
export const PATCH = handleProxyRequest;
export const HEAD = handleProxyRequest;
export const OPTIONS = handleProxyRequest;
