/**
 * Standardized API error handling
 */

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: unknown,
    public traceId?: string
  ) {
    super(message);
    this.name = "ApiError";
  }

  static fromResponse(status: number, data: any): ApiError {
    return new ApiError(
      status,
      data?.message || data?.error || "Request failed",
      data?.details,
      data?.traceId
    );
  }
}

export class AuthError extends ApiError {
  constructor(message: string = "Authentication required") {
    super(401, message);
    this.name = "AuthError";
  }
}

export class NetworkError extends Error {
  constructor(message: string = "Network request failed") {
    super(message);
    this.name = "NetworkError";
  }
}

