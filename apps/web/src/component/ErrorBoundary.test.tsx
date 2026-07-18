import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { ErrorBoundary, type ErrorBoundaryState } from "./ErrorBoundary";

function makeBoundary(onReset?: () => void) {
  const boundary = new ErrorBoundary({ children: "route content", onReset });
  boundary.setState = ((state: ErrorBoundaryState) => { boundary.state = state; }) as typeof boundary.setState;
  return boundary;
}

describe("ErrorBoundary", () => {
  it("normalizes an unknown render failure", () => {
    expect(ErrorBoundary.getDerivedStateFromError("broken").error?.message).toBe("Unexpected application error.");
    expect(ErrorBoundary.getDerivedStateFromError(new Error("map failed")).error?.message).toBe("map failed");
  });

  it("renders an accessible fallback while an error is active", () => {
    const boundary = makeBoundary();
    boundary.state = { error: new Error("map failed") };
    const markup = renderToStaticMarkup(boundary.render());
    expect(markup).toContain('role="alert"');
    expect(markup).toContain("This route view could not finish loading.");
    expect(markup).toContain("Try route view again");
  });

  it("clears the failure and runs the retry callback", () => {
    const onReset = vi.fn();
    const boundary = makeBoundary(onReset);
    boundary.state = { error: new Error("map failed") };
    boundary.retry();
    expect(boundary.state.error).toBeNull();
    expect(onReset).toHaveBeenCalledOnce();
  });
});
