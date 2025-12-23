import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { SafeImage } from "../SafeImage";

// Mock next/image
vi.mock("next/image", () => ({
  default: ({ src, alt, onError, ...props }: any) => (
    <img
      src={src}
      alt={alt}
      onError={onError}
      data-testid="next-image"
      {...props}
    />
  ),
}));

describe("SafeImage", () => {
  it("should render image with provided src", () => {
    render(<SafeImage src="/test.jpg" alt="Test image" width={100} height={100} />);
    const img = screen.getByTestId("next-image");
    expect(img).toHaveAttribute("src", "/test.jpg");
    expect(img).toHaveAttribute("alt", "Test image");
  });

  it("should fallback to default on error", () => {
    const { container } = render(
      <SafeImage src="/invalid.jpg" alt="Test" width={100} height={100} />
    );
    const img = container.querySelector("img");
    
    // Simulate error
    if (img) {
      const errorEvent = new Event("error");
      img.dispatchEvent(errorEvent);
    }

    // Should use fallback
    expect(img).toHaveAttribute("src", "/images/lesson_thum.png");
  });
});

