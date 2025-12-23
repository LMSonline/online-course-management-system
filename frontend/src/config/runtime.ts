/**
 * Runtime configuration flags
 */

export const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

