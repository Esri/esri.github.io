import { describe, it, expect } from "vitest";

// Simple smoke tests to verify Vitest + jsdom are configured

describe("environment", () => {
  it("runs tests", () => {
    expect(1 + 1).toBe(2);
  });

  it("provides a DOM via jsdom", () => {
    const el = document.createElement("div");
    el.id = "root";
    document.body.appendChild(el);
    const found = document.getElementById("root");
    expect(found).not.toBeNull();
  });
});
