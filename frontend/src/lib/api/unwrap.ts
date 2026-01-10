import { AxiosResponse } from "axios";
import { ApiResponse } from "./api.types";
import { AppError } from "./api.error";

export function unwrapResponse<T>(
  res: AxiosResponse<ApiResponse<T>>
): T {
  const body = res.data;

  if (!body.success) {
    throw new AppError(
      body.message || "Request failed",
      body.status ?? res.status ?? 500,
      body.code ?? "UNKNOWN_ERROR"
    );
  }

  return body.data as T;
}