import createMiddleware from "next-intl/middleware";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { routing } from "./i18n/routing";
import { refreshTokenAction } from "./server/auth";
import { STATUS_CODE } from "./types";
import { RefreshResponse } from "./types/authentication.type";
import { ACCESS_TOKEN, REFRESH_TOKEN, Routes } from "./lib/constant";

// Define route arrays
const AUTHEN_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];
const PRIVATE_ROUTES = [
  "/dashboard",
  "/room",
  "/house",
  "/profile",
  "/scheduler",
];

// Token names

// Helper function to check if token is about to expire
function isTokenAboutToExpire(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Math.floor(Date.now());
    console.log(
      `[MIDDLEWARE DEBUG] Token expiration check: ${payload.exp * 1000} vs ${
        currentTime + 60000
      }`
    );
    return payload.exp * 1000 < currentTime + 60000; // Consider token about to expire if it expires in less than 60 seconds
  } catch (error) {
    return true; // Consider invalid tokens as expired
  }
}

// Helper function to get cookie value
async function getCookie(name: string): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(name)?.value;
}

// Helper function to remove auth cookies
async function removeAuthCookie(response: NextResponse<unknown>) {
  response.cookies.delete(ACCESS_TOKEN);
  response.cookies.delete(REFRESH_TOKEN);
}

// Server action placeholder for refreshing tokens
async function refreshTokens(): Promise<RefreshResponse | null> {
  try {
    // This should call your backend API to refresh the tokens
    const response = await refreshTokenAction();
    console.log(
      `[MIDDLEWARE DEBUG] Refresh token action response: ${JSON.stringify(
        response
      )}`
    );

    if (response.status !== STATUS_CODE.SUCCESS) {
      return null;
    }

    const data = response.data;

    if (!data) return null;

    return data;
  } catch (error) {
    console.error("Error refreshing tokens:", error);
    return null;
  }
}

export default async function middleware(request: NextRequest) {
  // DEBUG: Extract locale and clean path from URL segments
  const [, locale, ...segments] = request.nextUrl.pathname.split("/");
  const path = `/${segments.join("/")}`;
  console.log(
    `[MIDDLEWARE DEBUG] Processing request - Path: ${path}, Locale: ${locale}, Full URL: ${request.nextUrl.pathname}`
  );

  // DEBUG: Retrieve authentication tokens from secure HTTP-only cookies
  const accessToken = await getCookie(ACCESS_TOKEN);
  const refreshToken = await getCookie(REFRESH_TOKEN);
  console.log(
    `[MIDDLEWARE DEBUG] Token retrieval - Access token: ${
      accessToken ? "present" : "missing"
    }, Refresh token: ${refreshToken ? "present" : "missing"}`
  );

  // DEBUG: Classify current route type for authentication flow decisions
  const isAuthRoute =
    path !== Routes.ROOT &&
    AUTHEN_ROUTES.some((route) => path.startsWith(route));
  const isPrivateRoute =
    path === Routes.ROOT ||
    PRIVATE_ROUTES.some((route) => path.startsWith(route));
  console.log(
    `[MIDDLEWARE DEBUG] Route classification - Auth route: ${isAuthRoute}, Private route: ${isPrivateRoute}, Public route: ${
      !isAuthRoute && !isPrivateRoute
    }`
  );

  // MAIN AUTHENTICATION LOGIC: Handle different token states and user access scenarios
  if (accessToken && refreshToken) {
    console.log(
      `[MIDDLEWARE DEBUG] Both tokens present - checking expiration status with 60-second buffer`
    );

    // DEBUG: Check if tokens are expired or about to expire (60-second buffer for proactive refresh)
    const isAccessExpired = isTokenAboutToExpire(accessToken);
    const isRefreshExpired = isTokenAboutToExpire(refreshToken);
    console.log(
      `[MIDDLEWARE DEBUG] Token expiration check - Access token about to expire: ${isAccessExpired}, Refresh token about to expire: ${isRefreshExpired}`
    );

    // SCENARIO 1: Both tokens are valid and not expiring soon - user is fully authenticated
    if (!isAccessExpired && !isRefreshExpired) {
      console.log(
        `[MIDDLEWARE DEBUG] Both tokens valid - user has active authentication session`
      );

      // LOGIC: Prevent authenticated users from accessing login/register pages (avoid auth loops)
      if (isAuthRoute) {
        console.log(
          `[MIDDLEWARE DEBUG] Authenticated user trying to access auth route - redirecting to home page`
        );
        return NextResponse.redirect(
          new URL(`/${locale || "en"}`, request.url)
        );
      }
      // Allow access to all other routes and continue to i18n processing
      console.log(
        `[MIDDLEWARE DEBUG] Allowing authenticated user to access requested route`
      );
    }
    // SCENARIO 2: Access token expired/expiring but refresh token still valid - attempt proactive token refresh
    else if (isAccessExpired && !isRefreshExpired) {
      console.log(
        `[MIDDLEWARE DEBUG] Access token expired/expiring but refresh token valid - attempting token refresh`
      );

      try {
        // LOGIC: Use valid refresh token to obtain new access and refresh tokens
        const newTokens = await refreshTokens();

        if (newTokens) {
          console.log(
            `[MIDDLEWARE DEBUG] Token refresh successful - updating cookies with new tokens`
          );
          console.log(
            `[MIDDLEWARE DEBUG] New token expiration times - Access: at ${new Date(
              Date.now() + newTokens.tokenExpires
            )}, Refresh: at ${new Date(Date.now() + newTokens.refreshExpires)}`
          );

          const handleI18nRouting = createMiddleware(routing);
          let response = handleI18nRouting(request);
          if (isAuthRoute) {
            console.log(
              `[MIDDLEWARE DEBUG] Authenticated user accessing auth route after refresh - redirecting to home`
            );
            response = NextResponse.redirect(
              new URL(`/${locale || "en"}`, request.url)
            );
          }

          // Set new access token with dynamic expiration from server response
          response.cookies.set(ACCESS_TOKEN, newTokens.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: newTokens.tokenExpires,
            expires: new Date(Date.now() + newTokens.tokenExpires),
          });

          // Set new refresh token with dynamic expiration from server response
          response.cookies.set(REFRESH_TOKEN, newTokens.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            expires: new Date(Date.now() + newTokens.refreshExpires),
          });

          // LOGIC: Redirect freshly authenticated users away from auth routes
          if (isAuthRoute) {
            console.log(
              `[MIDDLEWARE DEBUG] Token refreshed successfully - redirecting from auth route to home`
            );
            return response;
          }

          // Continue processing with fresh tokens
          console.log(
            `[MIDDLEWARE DEBUG] Token refresh complete - continuing to i18n routing with fresh authentication`
          );
          return response;
        } else {
          console.log(
            `[MIDDLEWARE DEBUG] Token refresh failed - server returned null/invalid response - clearing authentication state`
          );

          // LOGIC: Refresh failed, clear invalid tokens and treat user as unauthenticated
          if (isPrivateRoute) {
            console.log(
              `[MIDDLEWARE DEBUG] Refresh failed on private route - clearing tokens and redirecting to login`
            );
            // Check if already on login page to prevent /login/login redirect
            if (!isAuthRoute) {
              const response = NextResponse.redirect(
                new URL(`/${locale || "en"}/login`, request.url)
              );
              removeAuthCookie(response);
              return response;
            } else {
              // Already on auth route, just clear cookies and continue
              const handleI18nRouting = createMiddleware(routing);
              const response = handleI18nRouting(request);
              removeAuthCookie(response);
              return response;
            }
          }

          // For non-private routes, clear tokens but allow access to public content
          console.log(
            `[MIDDLEWARE DEBUG] Refresh failed on public route - clearing tokens but allowing access`
          );
          const handleI18nRouting = createMiddleware(routing);
          const response = handleI18nRouting(request);
          removeAuthCookie(response);
          return response;
        }
      } catch (error) {
        console.log(
          `[MIDDLEWARE DEBUG] Token refresh threw exception: ${error} - treating as authentication failure`
        );

        // LOGIC: Handle refresh errors by clearing authentication state
        // Redirect private routes to login when refresh fails
        if (isPrivateRoute) {
          console.log(
            `[MIDDLEWARE DEBUG] Refresh error on private route - redirecting to login`
          );
          // Check if already on login page to prevent /login/login redirect
          if (!isAuthRoute) {
            const redirectResponse = NextResponse.redirect(
              new URL(`/${locale || "en"}/login`, request.url)
            );
            removeAuthCookie(redirectResponse);
            return redirectResponse;
          } else {
            // Already on auth route, just clear cookies and continue
            const handleI18nRouting = createMiddleware(routing);
            const response = handleI18nRouting(request);
            removeAuthCookie(response);
            return response;
          }
        }
        // Allow continued access to public routes even after refresh error
        console.log(
          `[MIDDLEWARE DEBUG] Refresh error on public route - allowing access without authentication`
        );
      }
    } else {
      console.log(
        `[MIDDLEWARE DEBUG] Both tokens expired or refresh token invalid - authentication session completely invalid`
      );

      // SCENARIO 3: Both tokens expired/invalid OR refresh token expired - complete authentication failure
      // LOGIC: Force re-authentication for private routes when no valid tokens exist
      if (isPrivateRoute) {
        console.log(
          `[MIDDLEWARE DEBUG] Both tokens invalid on private route - forcing re-authentication`
        );
        // Check if already on login page to prevent /login/login redirect
        if (!isAuthRoute) {
          const redirectResponse = NextResponse.redirect(
            new URL(`/${locale || "en"}/login`, request.url)
          );
          removeAuthCookie(redirectResponse);
          return redirectResponse;
        } else {
          // Already on auth route, just clear cookies and continue
          const handleI18nRouting = createMiddleware(routing);
          const response = handleI18nRouting(request);
          removeAuthCookie(response);
          return response;
        }
      }
      // Allow access to public content even without valid authentication
      console.log(
        `[MIDDLEWARE DEBUG] Both tokens invalid but public route - allowing access`
      );
    }
  } else {
    console.log(
      `[MIDDLEWARE DEBUG] No authentication tokens found - user is completely unauthenticated`
    );

    // SCENARIO 4: No tokens present - handle completely unauthenticated user
    if (isPrivateRoute) {
      console.log(
        `[MIDDLEWARE DEBUG] Unauthenticated user attempting private route access - redirecting to login`
      );
      // Check if already on login page to prevent /login/login redirect
      if (!isAuthRoute) {
        return NextResponse.redirect(
          new URL(`/${locale || "en"}/login`, request.url)
        );
      } else {
        // Already on auth route, allow access
        console.log(
          `[MIDDLEWARE DEBUG] Already on auth route, allowing access`
        );
      }
    }
    // Allow unauthenticated access to public and auth routes
    console.log(
      `[MIDDLEWARE DEBUG] Unauthenticated user accessing public/auth route - allowing access`
    );
  }

  // FINAL PROCESSING: Handle internationalization routing for all requests that pass authentication
  console.log(
    `[MIDDLEWARE DEBUG] Authentication checks complete - processing internationalization routing`
  );
  const handleI18nRouting = createMiddleware(routing);
  const response = handleI18nRouting(request);

  return response;
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
