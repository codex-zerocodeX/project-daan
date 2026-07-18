import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";

export interface ErrorBoundaryState {
  error: Error | null;
}

interface ErrorBoundaryProp {
  children: ReactNode;
  resetKey?: string;
  onReset?: () => void;
}

export class ErrorBoundary extends Component<ErrorBoundaryProp, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    return {
      error: error instanceof Error ? error : new Error("Unexpected application error."),
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Daan render failure", error, info.componentStack);
  }

  componentDidUpdate(previousProp: ErrorBoundaryProp) {
    if (this.state.error && previousProp.resetKey !== this.props.resetKey) {
      this.setState({ error: null });
    }
  }

  retry = () => {
    this.setState({ error: null });
    this.props.onReset?.();
  };

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <main className="grid min-h-screen place-items-center bg-paper p-6 text-ink">
        <section role="alert" className="w-full max-w-lg rounded-card border border-line bg-surface p-6 shadow-soft">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-ink-soft">Daan needs a reset</p>
          <h1 className="mt-2 text-2xl font-extrabold tracking-[-0.04em]">This route view could not finish loading.</h1>
          <p className="mt-2 text-sm font-medium leading-relaxed text-ink-soft">
            Your receipt stays in the address bar. Try the view again without losing the route you opened.
          </p>
          <button
            type="button"
            onClick={this.retry}
            className="mt-5 min-h-11 rounded-chip bg-brand-teal px-4 text-sm font-extrabold text-surface"
          >
            Try route view again
          </button>
        </section>
      </main>
    );
  }
}
