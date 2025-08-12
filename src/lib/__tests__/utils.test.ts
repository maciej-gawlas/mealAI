import { describe, it, expect } from "vitest";
import { cn } from "../utils";

describe("cn utility function", () => {
  it("merges class names correctly", () => {
    const result = cn("class1", "class2");
    expect(result).toBe("class1 class2");
  });

  it("handles conditional classes", () => {
    const isActive = true;
    const result = cn("base", isActive && "active");
    expect(result).toBe("base active");
  });

  it("handles false conditions", () => {
    const isActive = false;
    const result = cn("base", isActive && "active");
    expect(result).toBe("base");
  });

  it("merges Tailwind classes efficiently", () => {
    const result = cn("p-4 bg-red-500", "p-8");
    // Tailwind merge should override p-4 with p-8
    expect(result).toBe("bg-red-500 p-8");
  });

  it("handles array inputs", () => {
    const result = cn(["class1", "class2"], "class3");
    expect(result).toBe("class1 class2 class3");
  });

  it("handles object inputs", () => {
    const result = cn({ "class1": true, "class2": false });
    expect(result).toBe("class1");
  });

  it("handles mixed input types", () => {
    const result = cn("class1", ["class2", "class3"], { "class4": true, "class5": false });
    expect(result).toBe("class1 class2 class3 class4");
  });
});
