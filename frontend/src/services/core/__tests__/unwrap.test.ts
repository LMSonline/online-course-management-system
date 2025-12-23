import { describe, it, expect } from "vitest";
import { unwrapApiResponse, unwrapPage } from "../unwrap";
import type { ApiResponse, PageResponse } from "../api";

describe("unwrapApiResponse", () => {
  it("should unwrap ApiResponse structure", () => {
    const response: ApiResponse<{ name: string }> = {
      success: true,
      status: 200,
      message: "OK",
      data: { name: "Test" },
    };

    const result = unwrapApiResponse(response);
    expect(result).toEqual({ name: "Test" });
  });

  it("should return data as-is if not ApiResponse structure", () => {
    const data = { name: "Test" };
    const result = unwrapApiResponse(data);
    expect(result).toEqual(data);
  });
});

describe("unwrapPage", () => {
  it("should unwrap PageResponse structure", () => {
    const response: PageResponse<{ id: number }> = {
      items: [{ id: 1 }, { id: 2 }],
      page: 0,
      size: 10,
      totalItems: 2,
      totalPages: 1,
      hasNext: false,
      hasPrevious: false,
    };

    const result = unwrapPage(response);
    expect(result.items).toHaveLength(2);
    expect(result.page).toBe(0);
    expect(result.totalItems).toBe(2);
  });

  it("should handle ApiResponse<PageResponse>", () => {
    const apiResponse: ApiResponse<PageResponse<{ id: number }>> = {
      success: true,
      status: 200,
      message: "OK",
      data: {
        items: [{ id: 1 }],
        page: 0,
        size: 10,
        totalItems: 1,
        totalPages: 1,
        hasNext: false,
        hasPrevious: false,
      },
    };

    const result = unwrapPage(apiResponse);
    expect(result.items).toHaveLength(1);
  });

  it("should return empty page for invalid structure", () => {
    const invalid = { foo: "bar" };
    const result = unwrapPage(invalid);
    expect(result.items).toEqual([]);
    expect(result.page).toBe(0);
  });
});

