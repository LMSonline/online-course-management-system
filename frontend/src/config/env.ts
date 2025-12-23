/**
 * Environment variable validation
 * Throws friendly errors in development if required vars are missing
 */

function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key];
  
  if (!value && !defaultValue) {
    if (process.env.NODE_ENV === "development") {
      throw new Error(
        `Missing required environment variable: ${key}\n` +
        `Please add it to your .env.local file. See .env.example for reference.`
      );
    }
    return "";
  }
  
  return value || defaultValue || "";
}

export const env = {
  API_BASE_URL: getEnvVar("NEXT_PUBLIC_API_BASE_URL", "http://localhost:8080/api/v1"),
  USE_MOCK: getEnvVar("NEXT_PUBLIC_USE_MOCK", "false") === "true",
} as const;

// Validate API_BASE_URL includes /api/v1
if (process.env.NODE_ENV === "development" && !env.API_BASE_URL.includes("/api/v1")) {
  console.warn(
    "⚠️  WARNING: NEXT_PUBLIC_API_BASE_URL should include /api/v1\n" +
    `Current value: ${env.API_BASE_URL}\n` +
    "Expected format: http://localhost:8080/api/v1"
  );
}

