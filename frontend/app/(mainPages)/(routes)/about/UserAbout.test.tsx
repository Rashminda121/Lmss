// UserAbout.test.tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import UserAbout from "../about/page";

describe("UserAbout Component", () => {
  beforeEach(() => {
    render(<UserAbout />);
  });

  test("renders feature cards", () => {
    [
      "Personalized Learning",
      "Collaborative Environment",
      "Progress Tracking",
      "Flexible System",
    ].forEach((title) => expect(screen.getByText(title)).toBeInTheDocument());
  });

  test("renders the mission section", () => {
    expect(screen.getByText(/Our Vision for Education/i)).toBeInTheDocument();
  });

  test("renders inspirational quotes", () => {
    [
      /Education is the most powerful weapon/,
      /The beautiful thing about learning/,
      /Your education is a dress rehearsal/,
      /The expert in anything was once a beginner/,
    ].forEach((quote) => expect(screen.getByText(quote)).toBeInTheDocument());
  });

  test("renders call-to-action button and redirects on click", () => {
    // Mock window.location.href
    delete (window as any).location;
    (window as any).location = { href: "" };

    const ctaButton = screen.getByRole("button", {
      name: /Start Your Journey/i,
    });
    expect(ctaButton).toBeInTheDocument();
    ctaButton.click();
    expect(window.location.href).toBe("/");
  });
});
