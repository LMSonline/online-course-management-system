import { UserInsideToken } from "@/services/auth/auth.types";

/**
 * Decodes a JWT token and extracts the payload
 * @param token - JWT token string
 * @returns Decoded payload or null if invalid
 */
export function decodeJWT(token: string): UserInsideToken | null {
  try {
    // JWT format: header.payload.signature
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }

    // Decode the payload (second part)
    const payload = parts[1];
    const decoded = Buffer.from(payload, "base64").toString("utf-8");
    const parsed = JSON.parse(decoded);

    // Validate required fields in user object
    if (
      !parsed.user ||
      typeof parsed.user.accountId !== "number" ||
      typeof parsed.user.username !== "string" ||
      typeof parsed.user.email !== "string" ||
      typeof parsed.user.role !== "string"
    ) {
      return null;
    }

    return {
      accountId: parsed.user.accountId,
      username: parsed.user.username,
      email: parsed.user.email,
      role: parsed.user.role,
    };
  } catch {
    return null;
  }
}

/**
 * Checks if a JWT token is expired
 * @param token - JWT token string
 * @returns true if expired, false otherwise
 */
export function isTokenExpired(token: string): boolean {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return true;

    const payload = JSON.parse(
      Buffer.from(parts[1], "base64").toString("utf-8")
    );
    const exp = payload.exp;

    if (!exp) return true;

    // exp is in seconds, Date.now() is in milliseconds
    return Date.now() >= exp * 1000;
  } catch {
    return true;
  }
}

/**
 * Gets the user role from a JWT token
 * @param token - JWT token string
 * @returns User role or null if invalid
 */
export function getRoleFromToken(
  token: string
): "STUDENT" | "TEACHER" | "ADMIN" | null {
  const decoded = decodeJWT(token);
  return decoded?.role || null;
}
