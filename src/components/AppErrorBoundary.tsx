import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
};

export class AppErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
  };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Unhandled UI error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <section className="status-card status-card-error" role="alert">
          <h2 className="status-title">Something went wrong</h2>
          <p className="status-message">
            The page failed to render. Refresh the page or go back to the home screen.
          </p>
        </section>
      );
    }

    return this.props.children;
  }
}